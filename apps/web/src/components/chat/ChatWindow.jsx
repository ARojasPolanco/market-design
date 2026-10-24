import { useEffect, useRef, useState } from 'react';
import { Ban, CheckCircle, Download, Flag, Loader2, Package, Send, Upload } from 'lucide-react';
import { useConversation, reportMessage, blockUser } from '../../hooks/useChat.js';
import {
  useMyOrders,
  quoteOrder,
  payOrder,
  deliverOrder,
  getOrderDownload,
} from '../../hooks/useCustomOrders.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { otherParty } from '../../utils/chat.js';
import ConfirmDialog from '../ConfirmDialog.jsx';

export default function ChatWindow({ conversationId, onChanged }) {
  const { conversation, messages, isLoading, error, send, markRead, refetch } =
    useConversation(conversationId);
  const { orders, refetch: refetchOrders } = useMyOrders();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [quotePrice, setQuotePrice] = useState('');
  const [deliveryFile, setDeliveryFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);
  const bottomRef = useRef(null);

  const order = orders.find(
    (item) => item.conversationId === conversationId && item.status !== 'cancelled'
  );
  const other = otherParty(conversation, user?.id);
  const isBuyer = conversation?.buyerId === user?.id;
  const isSupport = conversation?.type === 'support';
  const canModerate = other?.id && !isSupport && user?.role !== 'admin';

  useEffect(() => {
    if (messages.length) markRead();
  }, [messages.length, markRead]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = async (event) => {
    event.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      await send(text.trim());
      setText('');
      onChanged?.();
    } catch (err) {
      showToast(err.response?.data?.message || 'No se pudo enviar.', { type: 'error' });
    } finally {
      setSending(false);
    }
  };

  const handleConfirmReport = async (reason) => {
    if (!reportTarget) return;
    try {
      await reportMessage(reportTarget, reason);
      showToast('Reporte enviado. Gracias.', { type: 'success' });
      setReportTarget(null);
    } catch (err) {
      showToast(err.response?.data?.message || 'No se pudo reportar.', { type: 'error' });
    }
  };

  const handleConfirmBlock = async () => {
    if (!other?.id) return;
    try {
      await blockUser(other.id);
      showToast('Usuario bloqueado.', { type: 'success' });
      setBlockOpen(false);
    } catch (err) {
      showToast(err.response?.data?.message || 'No se pudo bloquear.', { type: 'error' });
    }
  };

  const handleQuote = async () => {
    const price = Number(quotePrice);
    if (!price || price <= 0) {
      showToast('Ingresá un precio válido.', { type: 'error' });
      return;
    }
    setBusy(true);
    try {
      await quoteOrder(order.id, { price });
      await refetchOrders();
      setQuotePrice('');
      onChanged?.();
      showToast('Presupuesto enviado.', { type: 'success' });
    } catch (err) {
      showToast(err.response?.data?.message || 'No se pudo cotizar.', { type: 'error' });
    } finally {
      setBusy(false);
    }
  };

  const handlePay = async () => {
    setBusy(true);
    try {
      const res = await payOrder(order.id);
      if (res.initPoint) window.location.href = res.initPoint;
    } catch (err) {
      showToast(err.response?.data?.message || 'No se pudo iniciar el pago.', { type: 'error' });
    } finally {
      setBusy(false);
    }
  };

  const handleDeliver = async () => {
    if (!deliveryFile) {
      showToast('Elegí el archivo final.', { type: 'error' });
      return;
    }
    setBusy(true);
    try {
      await deliverOrder(order.id, deliveryFile);
      await refetchOrders();
      setDeliveryFile(null);
      onChanged?.();
      showToast('Archivo entregado al comprador.', { type: 'success' });
    } catch (err) {
      showToast(err.response?.data?.message || 'No se pudo entregar.', { type: 'error' });
    } finally {
      setBusy(false);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await getOrderDownload(order.id);
      window.open(res.downloadUrl, '_blank');
    } catch (err) {
      showToast(err.response?.data?.message || 'No se pudo descargar.', { type: 'error' });
    }
  };

  if (isLoading && !conversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (error && !conversation) {
    return (
      <div className="p-6 text-center text-sm text-red-500">
        <p>{error}</p>
        <button
          onClick={refetch}
          className="mt-3 text-xs font-semibold text-brand-teal hover:underline"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {error && (
        <div className="shrink-0 px-3 py-1.5 text-[11px] text-amber-700 bg-amber-50 border-b border-amber-100">
          No pudimos actualizar los mensajes. Reintentando…
        </div>
      )}
      {canModerate && (
        <div className="flex justify-end px-4 py-1.5 border-b border-gray-100">
          <button
            onClick={() => setBlockOpen(true)}
            className="inline-flex items-center gap-1 text-[11px] text-gray-400 hover:text-red-600 transition-colors"
          >
            <Ban size={12} /> Bloquear
          </button>
        </div>
      )}

      {order && (
        <div className="mx-3 mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm">
          <div className="flex items-center gap-2 mb-2">
            <Package size={16} className="text-brand-teal" />
            <span className="font-semibold text-gray-900">
              Pedido #{order.id.substring(0, 8).toUpperCase()}
            </span>
            <span className="ml-auto text-[11px] px-2 py-0.5 rounded-full bg-white border text-gray-600">
              {order.status === 'requested' && 'Solicitado'}
              {order.status === 'quoted' &&
                `Presupuesto: $${Number(order.price || 0).toLocaleString('es-AR')}`}
              {order.status === 'paid' && 'Pagado'}
              {order.status === 'delivered' && 'Entregado'}
            </span>
          </div>

          {order.status === 'requested' && !isBuyer && (
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                value={quotePrice}
                onChange={(event) => setQuotePrice(event.target.value)}
                placeholder="Precio"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
              />
              <button
                onClick={handleQuote}
                disabled={busy}
                className="bg-brand-teal text-dark font-semibold px-4 py-2 rounded-lg text-sm disabled:opacity-60"
              >
                Cotizar
              </button>
            </div>
          )}

          {order.status === 'quoted' && !isBuyer && (
            <p className="text-gray-600">Esperando el pago del comprador.</p>
          )}
          {order.status === 'quoted' && isBuyer && (
            <button
              onClick={handlePay}
              disabled={busy}
              className="w-full bg-brand-teal text-dark font-semibold px-4 py-2 rounded-lg text-sm disabled:opacity-60"
            >
              Pagar ${Number(order.price || 0).toLocaleString('es-AR')}
            </button>
          )}
          {order.status === 'paid' && !isBuyer && (
            <div className="space-y-2">
              <label className="flex items-center justify-center gap-2 w-full cursor-pointer border border-dashed border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-600 hover:border-brand-teal hover:text-brand-teal transition-colors">
                <Upload size={14} />
                <span className="truncate">
                  {deliveryFile ? deliveryFile.name : 'Elegir archivo final'}
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(event) => setDeliveryFile(event.target.files?.[0] || null)}
                />
              </label>
              <button
                onClick={handleDeliver}
                disabled={busy || !deliveryFile}
                className="w-full bg-dark text-white font-semibold px-3 py-2 rounded-lg text-sm disabled:opacity-50 inline-flex items-center justify-center gap-1"
              >
                <Upload size={14} /> Entregar al comprador
              </button>
            </div>
          )}
          {order.status === 'paid' && isBuyer && (
            <p className="text-gray-600">Pago confirmado. Esperando que el vendedor entregue.</p>
          )}
          {order.status === 'delivered' && isBuyer && (
            <button
              onClick={handleDownload}
              className="w-full bg-brand-teal text-dark font-semibold px-4 py-2 rounded-lg text-sm inline-flex items-center justify-center gap-1"
            >
              <Download size={14} /> Descargar diseño
            </button>
          )}
          {order.status === 'delivered' && !isBuyer && (
            <p className="text-green-700 inline-flex items-center gap-1">
              <CheckCircle size={14} /> Entregado al comprador.
            </p>
          )}
        </div>
      )}

      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-3 space-y-2">
        {messages.map((message) => {
          const mine = message.senderId === user?.id;

          if (message.isSystem) {
            return (
              <div key={message.id} className="text-center">
                <span className="inline-block text-[11px] text-gray-500 bg-gray-100 rounded-full px-3 py-1">
                  {message.body}
                </span>
              </div>
            );
          }

          return (
            <div key={message.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[82%] rounded-2xl px-3.5 py-2 text-sm ${
                  mine
                    ? 'bg-brand-teal text-dark rounded-br-md'
                    : 'bg-gray-100 text-gray-900 rounded-bl-md'
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{message.body}</p>
                {!mine && !isSupport && user?.role !== 'admin' && (
                  <button
                    onClick={() => setReportTarget(message.id)}
                    className="mt-1 text-[10px] text-gray-400 hover:text-red-500 inline-flex items-center gap-1"
                  >
                    <Flag size={10} /> Reportar
                  </button>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-gray-100 p-3">
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Escribí un mensaje..."
          maxLength={2000}
          className="flex-1 px-3.5 py-2.5 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          aria-label="Enviar"
          className="w-10 h-10 shrink-0 rounded-full bg-dark text-white flex items-center justify-center disabled:opacity-40 transition-colors hover:bg-dark-light"
        >
          <Send size={16} />
        </button>
      </form>

      <ConfirmDialog
        open={blockOpen}
        title="Bloquear usuario"
        description={`¿Seguro que querés bloquear a ${
          other?.storeName || other?.username || 'este usuario'
        }? No van a poder intercambiar mensajes.`}
        confirmLabel="Bloquear"
        danger
        onConfirm={handleConfirmBlock}
        onCancel={() => setBlockOpen(false)}
      />

      <ConfirmDialog
        open={Boolean(reportTarget)}
        title="Reportar mensaje"
        description="Contanos qué pasó. El equipo de Market Design va a revisarlo."
        confirmLabel="Reportar"
        requireReason
        minReasonLength={5}
        reasonPlaceholder="¿Por qué reportás este mensaje?"
        onConfirm={handleConfirmReport}
        onCancel={() => setReportTarget(null)}
      />
    </div>
  );
}
