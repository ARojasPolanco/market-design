import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Shield, CreditCard, CheckCircle, Mail, Star, ArrowRight } from 'lucide-react';
import { useDesign } from '../hooks/useDesigns.js';

export default function CheckoutPage() {
  const { id } = useParams();
  const { design } = useDesign(id);
  const [isPaid, setIsPaid] = useState(false);

  if (!design) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Diseño no encontrado</h2>
        <Link to="/catalogo" className="text-brand-teal hover:text-brand-teal-dark">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  if (isPaid) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-teal/10 rounded-full mb-6">
          <CheckCircle size={32} className="text-brand-teal" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Compra exitosa!</h1>
        <p className="text-gray-500 mb-8">
          Tu diseño <span className="font-medium text-gray-900">{design.title}</span> fue adquirido correctamente.
        </p>

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-brand-teal/5 border border-brand-teal/20 rounded-xl p-5 text-left">
            <div className="flex items-center gap-3 mb-3">
              <Mail size={20} className="text-brand-teal" />
              <h3 className="font-semibold text-gray-900">Revisá tu correo</h3>
            </div>
            <p className="text-sm text-gray-600">
              Te enviamos un email con el link de descarga del archivo en alta calidad. El link es válido por 24 horas.
            </p>
          </div>
          <div className="bg-brand-violet/5 border border-brand-violet/20 rounded-xl p-5 text-left">
            <div className="flex items-center gap-3 mb-3">
              <Star size={20} className="text-brand-violet" />
              <h3 className="font-semibold text-gray-900">¿Te gustó el diseño?</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Dejá tu review para ayudar a otros compradores y al vendedor.
            </p>
            <Link
              to={`/diseno/${design.id}`}
              className="text-sm font-medium text-brand-violet hover:underline inline-flex items-center gap-1"
            >
              Dejar mi review <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Download from panel */}
        <div className="bg-gray-50 rounded-xl p-5 mb-8">
          <p className="text-sm text-gray-600">
            También podés descargar tu diseño desde{' '}
            <Link to="/comprador/panel" className="text-brand-teal font-medium hover:underline">
              Mis compras
            </Link>{' '}
            en tu panel de comprador.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/comprador/panel"
            className="bg-dark text-white px-6 py-3 rounded-lg font-semibold hover:bg-dark-light transition-colors"
          >
            Ir a Mis compras
          </Link>
          <Link
            to="/catalogo"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Seguir explorando
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to={`/diseno/${design.id}`}
        className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm mb-6"
      >
        <ArrowLeft size={16} /> Volver al diseño
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order summary */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Resumen de compra</h2>
          <div className="flex gap-4 mb-4">
            <img
              src={design.previewUrl}
              alt={design.title}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-medium text-gray-900">{design.title}</h3>
              <p className="text-sm text-gray-500">{design.seller.name}</p>
              <p className="text-lg font-bold text-gray-900 mt-1">
                ${design.price.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Subtotal</span>
              <span>${design.price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900">
              <span>Total</span>
              <span>${design.price.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Método de pago</h2>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg mb-4">
            <CreditCard size={24} className="text-brand-teal" />
            <div>
              <p className="font-medium text-gray-900">Mercado Pago</p>
              <p className="text-sm text-gray-500">Tarjeta, débito, efectivo</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Shield size={16} />
            <span>Pago seguro con encriptación SSL</span>
          </div>
          <button
            onClick={() => setIsPaid(true)}
            className="w-full bg-dark text-white py-3 rounded-lg font-semibold hover:bg-dark-light transition-colors"
          >
            Pagar con Mercado Pago
          </button>
          <p className="text-xs text-gray-400 text-center mt-3">
            Recibirás el archivo por email inmediatamente después del pago.
          </p>
        </div>
      </div>
    </div>
  );
}
