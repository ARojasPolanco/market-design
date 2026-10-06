import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, KeyRound, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../config/api.js';
import { useToast } from '../context/ToastContext.jsx';
import logger from '../utils/logger.js';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/v1/auth/reset-password', { token, password });
      setDone(true);
      showToast(res.data.message || 'Contraseña restablecida.', { type: 'success' });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        'No pudimos restablecer tu contraseña. Pedí un nuevo enlace.';
      setError(message);
      logger.error('Error en reset-password:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h1 className="text-lg font-semibold text-gray-900 mb-2">Enlace inválido</h1>
          <p className="text-sm text-gray-500 mb-6">
            El enlace está incompleto o ya fue usado. Pedí uno nuevo.
          </p>
          <Link
            to="/recuperar"
            className="inline-flex items-center justify-center w-full bg-dark text-white px-6 py-3 rounded-lg font-medium hover:bg-dark-light transition-colors"
          >
            Pedir un nuevo enlace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8">
        {done ? (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h1 className="text-lg font-semibold text-gray-900 mb-2">¡Contraseña actualizada!</h1>
            <p className="text-sm text-gray-500 mb-6">
              Ya podés iniciar sesión con tu nueva contraseña.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center justify-center w-full bg-dark text-white px-6 py-3 rounded-lg font-medium hover:bg-dark-light transition-colors"
            >
              Iniciar sesión
            </button>
          </div>
        ) : (
          <>
            <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-teal/10 rounded-full mb-4">
              <KeyRound size={22} className="text-brand-teal" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Nueva contraseña</h1>
            <p className="text-sm text-gray-500 mb-6">
              Elegí una contraseña nueva para tu cuenta. Mínimo 8 caracteres.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nueva contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Repetí la contraseña
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-dark text-white py-3 rounded-lg font-medium hover:bg-dark-light transition-colors disabled:opacity-60"
              >
                {loading ? 'Guardando...' : 'Restablecer contraseña'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
