import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    password: '',
    storeName: '',
  });
  const [wantToSell, setWantToSell] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = { ...formData };
      if (!wantToSell) {
        delete data.storeName;
      }
      await register(data);
      showToast('Cuenta creada correctamente', { type: 'success' });
      navigate('/');
    } catch (err) {
      const message = err.response?.data?.message || 'Error al crear la cuenta';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Crear cuenta</h1>
          <p className="text-sm text-gray-500 text-center mb-6">
            Comprá y vendé diseños desde la misma cuenta.
          </p>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                placeholder="Tu nombre real (para facturación)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de usuario
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Ej: Roxana, JuanArte, MariaDiseños..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Este nombre se muestra en reviews y compras.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">Mínimo 8 caracteres</p>
            </div>

            {/* Want to sell */}
            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={wantToSell}
                onChange={(e) => setWantToSell(e.target.checked)}
                className="text-brand-teal focus:ring-brand-teal rounded"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Quiero vender diseños</span>
                <p className="text-xs text-gray-500">Podés activar esto después si preferís</p>
              </div>
            </label>

            {/* Store name - only if want to sell */}
            {wantToSell && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de tu tienda
                </label>
                <input
                  type="text"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  placeholder="Ej: Roxin Diseños, Arte Digital Juan..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Este es el nombre de tu tienda. Los compradores te ven así.
                </p>
              </div>
            )}

            {/* Accept terms */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 text-brand-teal focus:ring-brand-teal rounded"
              />
              <span className="text-sm text-gray-600">
                Acepto los{' '}
                <Link to="/terminos" target="_blank" className="text-brand-teal hover:underline">
                  Términos y Condiciones
                </Link>{' '}
                y la{' '}
                <Link to="/privacidad" target="_blank" className="text-brand-teal hover:underline">
                  Política de Privacidad
                </Link>{' '}
                de Market Design.
              </span>
            </label>

            <button
              type="submit"
              disabled={loading || !acceptTerms}
              className="w-full bg-dark text-white py-3 rounded-lg font-semibold hover:bg-dark-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            ¿Ya tenés cuenta?{' '}
            <Link to="/login" className="text-brand-teal hover:text-brand-teal-dark font-medium">
              Iniciá sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
