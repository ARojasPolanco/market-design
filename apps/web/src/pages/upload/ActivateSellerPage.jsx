import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext.jsx';
import { Store, CreditCard, ArrowRight, CheckCircle } from 'lucide-react';
import BackButton from '../../components/BackButton.jsx';

export default function ActivateSellerPage() {
  const [storeName, setStoreName] = useState('');
  const [description, setDescription] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleActivate = async () => {
    if (!storeName.trim()) {
      showToast('El nombre de la tienda es requerido', { type: 'error' });
      return;
    }
    setLoading(true);
    // TODO: Call API to activate seller role
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    setStep(2);
  };

  const handleConnectMP = () => {
    // TODO: Redirect to MP OAuth
    showToast('Función de Mercado Pago próximamente', { type: 'info' });
  };

  if (step === 2) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">¡Tienda activada!</h1>
        <p className="text-gray-600 mb-8">
          Tu tienda <span className="font-semibold">{storeName}</span> fue creada correctamente.
          Ahora podés empezar a subir diseños.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/vendedor/panel/subir"
            className="bg-dark text-white px-6 py-3 rounded-lg font-semibold hover:bg-dark-light transition-colors"
          >
            Subir mi primer diseño
          </Link>
          <Link
            to="/vendedor/panel"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Ir al panel
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <BackButton label="Volver" />
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Activar cuenta de vendedor</h1>
      <p className="text-gray-500 mb-8">
        Completá los datos de tu tienda para empezar a vender diseños.
      </p>

      <div className="space-y-6">
        {/* Step 1: Store info */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-brand-teal/10 rounded-lg">
              <Store size={20} className="text-brand-teal" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Datos de tu tienda</h2>
              <p className="text-sm text-gray-500">Así te ven los compradores</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la tienda <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Ej: Roxin Diseños, Arte Digital Juan..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Este nombre aparece en tus diseños y en tu perfil público.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción de la tienda
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Contale a los compradores qué tipo de diseños hacés..."
                maxLength={300}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                {description.length}/300 caracteres
              </p>
            </div>
          </div>
        </div>

        {/* Step 2: MP Connection */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-brand-violet/10 rounded-lg">
              <CreditCard size={20} className="text-brand-violet" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Cobro con Mercado Pago</h2>
              <p className="text-sm text-gray-500">Necesario para recibir tus ventas</p>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Conectá tu cuenta de Mercado Pago para recibir el dinero de tus ventas directamente.
            La comisión de la plataforma se descuenta automáticamente.
          </p>

          <button
            onClick={handleConnectMP}
            className="w-full border-2 border-brand-violet text-brand-violet px-6 py-3 rounded-lg font-semibold hover:bg-brand-violet/5 transition-colors flex items-center justify-center gap-2"
          >
            <CreditCard size={18} />
            Conectar Mercado Pago
          </button>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Podés hacerlo después, pero necesitás conectarlo para recibir pagos.
          </p>
        </div>

        {/* Activate button */}
        <button
          onClick={handleActivate}
          disabled={loading || !storeName.trim()}
          className="w-full bg-dark text-white py-3 rounded-lg font-semibold hover:bg-dark-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? 'Activando...' : 'Activar mi tienda'}
          {!loading && <ArrowRight size={18} />}
        </button>
      </div>
    </div>
  );
}
