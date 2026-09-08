import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Shield, CreditCard } from 'lucide-react';
import { useDesign } from '../hooks/useDesigns.js';

export default function CheckoutPage() {
  const { id } = useParams();
  const { design } = useDesign(id);

  if (!design) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Diseño no encontrado</h2>
        <Link to="/catalogo" className="text-indigo-600 hover:text-indigo-700">
          Volver al catálogo
        </Link>
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
            <CreditCard size={24} className="text-indigo-600" />
            <div>
              <p className="font-medium text-gray-900">Mercado Pago</p>
              <p className="text-sm text-gray-500">Tarjeta, débito, efectivo</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Shield size={16} />
            <span>Pago seguro con encriptación SSL</span>
          </div>
          <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
            Pagar con Mercado Pago
          </button>
        </div>
      </div>
    </div>
  );
}
