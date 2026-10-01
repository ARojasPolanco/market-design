import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import api from '../config/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import logger from '../utils/logger.js';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { token: authToken, refreshUser } = useAuth();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Falta el token de verificación.');
      return;
    }
    const verify = async () => {
      try {
        const res = await api.get(`/v1/auth/verify-email/${token}`);
        setStatus('success');
        setMessage(res.data.message || 'Email verificado correctamente.');
        if (authToken) await refreshUser();
      } catch (err) {
        logger.error('Error verifying email:', err);
        setStatus('error');
        setMessage(err.response?.data?.message || 'El token de verificación es inválido o expiró.');
      }
    };
    verify();
  }, [token]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8 text-center">
        {status === 'loading' && (
          <>
            <Loader2 size={40} className="mx-auto text-brand-teal animate-spin mb-4" />
            <h1 className="text-lg font-semibold text-gray-900">Verificando tu email...</h1>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h1 className="text-lg font-semibold text-gray-900 mb-2">¡Email verificado!</h1>
            <p className="text-sm text-gray-500 mb-6">{message}</p>
            <Link
              to={authToken ? '/comprador/panel' : '/login'}
              className="inline-flex items-center justify-center w-full bg-dark text-white px-6 py-3 rounded-lg font-medium hover:bg-dark-light transition-colors"
            >
              {authToken ? 'Ir a mi panel' : 'Iniciar sesión'}
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
              <AlertCircle size={32} className="text-red-500" />
            </div>
            <h1 className="text-lg font-semibold text-gray-900 mb-2">No pudimos verificar tu email</h1>
            <p className="text-sm text-gray-500 mb-6">{message}</p>
            <Link
              to="/"
              className="inline-flex items-center justify-center w-full bg-dark text-white px-6 py-3 rounded-lg font-medium hover:bg-dark-light transition-colors"
            >
              Ir al inicio
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
