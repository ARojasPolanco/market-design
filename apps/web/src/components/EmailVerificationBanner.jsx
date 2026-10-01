import { useState } from 'react';
import { MailWarning, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import api from '../config/api.js';
import logger from '../utils/logger.js';

export default function EmailVerificationBanner() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [dismissed, setDismissed] = useState(false);
  const [sending, setSending] = useState(false);

  if (!user || user.emailVerified || dismissed) return null;

  const handleResend = async () => {
    setSending(true);
    try {
      await api.post('/v1/auth/resend-verification');
      showToast('Te reenviamos el email de verificación.', { type: 'success' });
    } catch (err) {
      logger.error('Error resending verification:', err);
      showToast('No pudimos reenviar el email. Intentá más tarde.', { type: 'error' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-yellow-50 border-b border-yellow-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-3 text-sm">
        <MailWarning size={18} className="text-yellow-600 shrink-0" />
        <p className="flex-1 text-yellow-800">
          Verificá tu email para poder comprar y vender.{' '}
          <button
            onClick={handleResend}
            disabled={sending}
            className="font-semibold underline hover:no-underline disabled:opacity-60"
          >
            {sending ? 'Reenviando...' : 'Reenviar email'}
          </button>
        </p>
        <button
          onClick={() => setDismissed(true)}
          className="text-yellow-600 hover:text-yellow-800 shrink-0"
          aria-label="Cerrar"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
