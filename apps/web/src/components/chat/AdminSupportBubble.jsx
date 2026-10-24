import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LifeBuoy } from 'lucide-react';
import api from '../../config/api.js';

export default function AdminSupportBubble() {
  const navigate = useNavigate();
  const location = useLocation();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem('token')) return undefined;

    const load = async () => {
      try {
        const res = await api.get('/v1/admin/chat/unread');
        setTotal(res.data.total || 0);
      } catch (_err) {
        // best-effort
      }
    };

    load();
    const interval = setInterval(load, 20000);
    return () => clearInterval(interval);
  }, []);

  if (location.pathname.startsWith('/admin') || location.pathname === '/beta-vendedores') {
    return null;
  }

  return (
    <button
      onClick={() => navigate('/admin?tab=chat')}
      aria-label="Soporte"
      title="Mensajes de soporte"
      className="fixed bottom-6 right-6 z-[96] w-14 h-14 rounded-full bg-dark text-white shadow-xl hover:bg-dark-light transition-colors flex items-center justify-center"
    >
      <LifeBuoy size={22} />
      {total > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-brand-teal text-dark text-[11px] font-bold flex items-center justify-center">
          {total > 9 ? '9+' : total}
        </span>
      )}
    </button>
  );
}
