import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  Send,
  ArrowLeft,
  LifeBuoy,
  Flag,
  Ban,
  Loader2,
  Package,
  Upload,
  Download,
  CheckCircle,
} from 'lucide-react';
import {
  useConversations,
  useConversation,
  createConversation,
  reportMessage,
  blockUser,
} from '../hooks/useChat.js';
import {
  useMyOrders,
  createOrder,
  quoteOrder,
  payOrder,
  deliverOrder,
  getOrderDownload,
} from '../hooks/useCustomOrders.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

function otherParty(conversation, userId) {
  if (!conversation) return null;
  if (conversation.type === 'support') return { name: 'Soporte Market Design', id: null };
  return conversation.buyerId === userId ? conversation.seller : conversation.buyer;
}

export default function MessagesPage() {
  const { id } = useParams();
  return id ? <ConversationView id={id} /> : <ConversationList />;
}

function ConversationList() {
  const { conversations, isLoading, error } = useConversations();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const openSupport = async () => {
    try {
      const conversation = await createConversation({ type: 'support' });
      navigate(`/mensajes/${conversation.id}`);
    } catch (err) {
      showToast(err.response?.data?.message || 'No pudimos abrir soporte.', { type: 'error' });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mensajes</h1>
        <button
          onClick={openSupport}
          className="flex items-center gap-2 text-sm bg-dark text-white px-4 py-2 rounded-lg hover:bg-dark-light transition-colors"
        >
          <LifeBuoy size={16} /> Soporte
        </button>
      </div>

      {isLoading && <p className="text-gray-500">Cargando conversaciones...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!isLoading && conversations.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p>Todavía no tenés conversaciones.</p>
          <p className="text-sm mt-1">Podés escribirle a un vendedor desde un diseño.</p>
        </div>
      )}

      <div className="space-y-2">
        {conversations.map((conversation) => {
          const other = otherParty(conversation, user?.id);
          return (
            <Link
              key={conversation.id}
              to={`/mensajes/${conversation.id}`}
              className="flex items-center justify-between gap-3 bg-white rounded-xl shadow-sm p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {other?.storeName || other?.username || other?.name || 'Conversación'}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {conversation.lastMessage?.body || 'Sin mensajes todavía'}
                </p>
              </div>
              {conversation.unreadCount > 0 && (
                <span className="shrink-0 bg-brand-teal text-dark text-xs font-bold px-2 py-1 rounded-full">
                  {conversation.unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function ConversationView({ id }) {
  const { conversation, messages, isLoading, error, send, markRead } = useConversation(id);
  const { orders, refetch: refetchOrders } = useMyOrders();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [quotePrice, setQuotePrice] = useState('');
  const [deliveryFile, setDeliveryFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const bottomRef = useRef(null);

  const order = orders.find((o) => o.conversationId === id && o.status !== 'cancelled');
  const other = otherParty(conversation, user?.id);
  const isBuyer = conversation?.buyerId === user?.id;

  useEffect(() => {
    if (messages.length) markRead();
  }, [messages.length, markRead]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      await send(text.trim());
      setText('');
    } catch (err) {
      showToast(err.response?.data?.message || 'No se pudo enviar.', { type: 'error' });
    } finally {
      setSending(false);
    }
  };

  const handleReport = async (messageId) => {
    const reason = window.prompt('¿Por qué reportás este mensaje?');
    if (!reason) return;
    try {
      await reportMessage(messageId, reason);
      showToast('Reporte enviado. Gracias.', { type: 'success' });
    } catch (err) {
      showToast(err.response?.data?.message || 'No se pudo reportar.', { type: 'error' });
    }
  };

  const handleBlock = async () => {
    if (!other?.id) return;
    if (!window.confirm(`¿Bloquear a ${other.storeName || other.username || 'este usuario'}?`))
      return;
    try {
      await blockUser(other.id);
      showToast('Usuario bloqueado.', { type: 'success' });
    } catch (err) {
      showToast(err.response?.data?.message || 'No se pudo bloquear.', { type: 'error' });
    }
  };

  const handleRequestOrder = async () => {
    setBusy(true);
    try {
      await createOrder({
        sellerId: conversation.sellerId,
        baseDesignId: conversation.designId || undefined,
        conversationId: conversation.id,
        title: 'Servicio personalizado',
      });
      await refetchOrders();
      showToast('Pedido creado. El vendedor puede enviarte un presupuesto.', { type: 'success' });
    } catch (err) {
      showToast(err.response?.data?.message || 'No se pudo crear el pedido.', { type: 'error' });
    } finally {
      setBusy(false);
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

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-500">
        <Loader2 className="animate-spin mx-auto" />
      </div>
    );
  }
  if (error) {
    return <div className="max-w-3xl mx-auto px-4 py-16 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between gap-3 border-b pb-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/mensajes" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft size={20} />
          </Link>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">
              {other?.storeName || other?.username || other?.name || 'Conversación'}
            </p>
            {conversation?.type === 'support' && (
              <p className="text-xs text-gray-500">Soporte de Market Design</p>
            )}
          </div>
        </div>
        {other?.id && (
          <button
            onClick={handleBlock}
            className="text-xs text-gray-500 hover:text-red-600 flex items-center gap-1"
          >
            <Ban size={14} /> Bloquear
          </button>
        )}
      </div>

      {order && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-3 text-sm">
          <div className="flex items-center gap-2 mb-2">
            <Package size={16} className="text-brand-teal" />
            <span className="font-medium text-gray-900">
              Pedido #{order.id.substring(0, 8).toUpperCase()}
            </span>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-white border text-gray-600">
              {order.status === 'requested' && 'Solicitado'}
              {order.status === 'quoted' &&
                `Presupuestado: $${Number(order.price || 0).toLocaleString('es-AR')}`}
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
                onChange={(e) => setQuotePrice(e.target.value)}
                placeholder="Precio"
                className="flex-1 px-3 py-2 border rounded-lg text-sm"
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
              className="bg-brand-teal text-dark font-semibold px-4 py-2 rounded-lg text-sm disabled:opacity-60"
            >
              Pagar ${Number(order.price || 0).toLocaleString('es-AR')}
            </button>
          )}
          {order.status === 'paid' && !isBuyer && (
            <div className="flex items-center gap-2">
              <input
                type="file"
                onChange={(e) => setDeliveryFile(e.target.files?.[0] || null)}
                className="text-xs"
              />
              <button
                onClick={handleDeliver}
                disabled={busy}
                className="bg-dark text-white font-semibold px-3 py-2 rounded-lg text-sm disabled:opacity-60 flex items-center gap-1"
              >
                <Upload size={14} /> Entregar
              </button>
            </div>
          )}
          {order.status === 'paid' && isBuyer && (
            <p className="text-gray-600">
              Pago confirmado. Esperando que el vendedor entregue el archivo.
            </p>
          )}
          {order.status === 'delivered' && isBuyer && (
            <button
              onClick={handleDownload}
              className="bg-brand-teal text-dark font-semibold px-4 py-2 rounded-lg text-sm flex items-center gap-1"
            >
              <Download size={14} /> Descargar diseño
            </button>
          )}
          {order.status === 'delivered' && !isBuyer && (
            <p className="text-green-700 flex items-center gap-1">
              <CheckCircle size={14} /> Entregado al comprador.
            </p>
          )}
        </div>
      )}

      {!order && isBuyer && conversation?.type === 'buyer_seller' && (
        <button
          onClick={handleRequestOrder}
          disabled={busy}
          className="mb-3 inline-flex items-center justify-center gap-2 bg-dark text-white font-semibold px-4 py-2 rounded-lg text-sm disabled:opacity-60"
        >
          <Package size={16} /> Solicitar presupuesto
        </button>
      )}

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {messages.map((message) => {
          const mine = message.senderId === user?.id;
          if (message.isSystem) {
            return (
              <div key={message.id} className="text-center">
                <span className="inline-block text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-1">
                  {message.body}
                </span>
              </div>
            );
          }
          return (
            <div key={message.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                  mine ? 'bg-brand-teal text-dark' : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{message.body}</p>
                {!mine && (
                  <button
                    onClick={() => handleReport(message.id)}
                    className="mt-1 text-[10px] text-gray-400 hover:text-red-500 flex items-center gap-1"
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

      <form onSubmit={handleSend} className="flex gap-2 border-t pt-3 mt-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribí un mensaje..."
          maxLength={2000}
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal"
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          className="bg-dark text-white px-4 rounded-lg disabled:opacity-50 flex items-center gap-1"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
