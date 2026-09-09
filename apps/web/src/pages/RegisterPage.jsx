import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    storeName: '',
  });
  const [wantToSell, setWantToSell] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({ ...formData, role: wantToSell ? 'seller' : 'buyer' });
      showToast('Cuenta creada correctamente', { type: 'success' });
    } catch {
      showToast('Error al crear la cuenta', { type: 'error' });
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
                placeholder="Tu nombre real (no se muestra públicamente)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500"
                required
                minLength={8}
              />
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Este es el nombre que van a ver los compradores. Podés cambiarlo después.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-dark text-white py-3 rounded-lg font-semibold hover:bg-dark-light transition-colors disabled:opacity-50"
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
