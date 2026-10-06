import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MailCheck } from 'lucide-react';
import api from '../config/api.js';
import { useToast } from '../context/ToastContext.jsx';
import logger from '../utils/logger.js';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/v1/auth/forgot-password', { email: email.trim() });
      setSent(true);
      showToast(res.data.message || 'Revisá tu email.', { type: 'success' });
    } catch (err) {
      const message = err.response?.data?.message || 'No pudimos procesar tu solicitud.';
      setError(message);
      logger.error('Error en forgot-password:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8">
        {sent ? (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <MailCheck size={32} className="text-green-600" />
            </div>
            <h1 className="text-lg font-semibold text-gray-900 mb-2">Revisá tu email</h1>
            <p className="text-sm text-gray-500 mb-6">
              Si <span className="font-medium">{email}</span> está registrado, te enviamos un enlace
              para restablecer tu contraseña. Revisá también la carpeta de spam.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center w-full bg-dark text-white px-6 py-3 rounded-lg font-medium hover:bg-dark-light transition-colors"
            >
              Volver a iniciar sesión
            </Link>
          </div>
        ) : (
          <>
            <Link
              to="/login"
              className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
            >
              <ArrowLeft size={16} /> Volver
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Recuperar contraseña</h1>
            <p className="text-sm text-gray-500 mb-6">
              Ingresá tu email y te enviaremos un enlace para elegir una nueva contraseña.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-dark text-white py-3 rounded-lg font-medium hover:bg-dark-light transition-colors disabled:opacity-60"
              >
                {loading ? 'Enviando...' : 'Enviar enlace'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
