import { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle, XCircle, Clock, AlertTriangle, X, MessageSquare } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications.js';

export default function NotificationBell() {
  const { notifications, unreadCount, markAllAsRead, deleteNotification } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggle = () => {
    setOpen((prev) => !prev);
    if (!open && unreadCount > 0) {
      markAllAsRead();
    }
  };

  return (
    <div className="relative flex items-center" ref={ref}>
      <button
        onClick={toggle}
        aria-label="Notificaciones"
        className="relative text-gray-600 hover:text-gray-900 p-0 border-0 bg-transparent cursor-pointer"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-brand-teal text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-[22rem] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 text-base">Notificaciones</h3>
          </div>
          <div className="overflow-y-auto max-h-80 p-2">
            {notifications.length > 0 ? (
              notifications.map((notif) => {
                const Icon =
                  notif.type === 'approved'
                    ? CheckCircle
                    : notif.type === 'rejected'
                      ? XCircle
                      : notif.type === 'paused'
                        ? AlertTriangle
                        : notif.type === 'review_reply'
                          ? MessageSquare
                          : Clock;
                const iconColor =
                  notif.type === 'approved'
                    ? 'text-green-500'
                    : notif.type === 'rejected'
                      ? 'text-red-500'
                      : notif.type === 'paused'
                        ? 'text-yellow-500'
                        : notif.type === 'review_reply'
                          ? 'text-brand-teal'
                          : 'text-gray-400';

                return (
                  <div
                    key={notif.id}
                    className={`group relative flex items-start gap-3 p-3 rounded-xl mb-1 transition-all hover:bg-gray-50 ${
                      !notif.isRead ? 'bg-blue-50/50' : 'bg-white'
                    }`}
                  >
                    <div className={`shrink-0 mt-0.5 ${iconColor}`}>
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {!notif.isRead && (
                          <span className="shrink-0 w-2 h-2 rounded-full bg-brand-teal" />
                        )}
                        <p className="text-sm font-semibold text-gray-900 break-words">
                          {notif.title}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 whitespace-normal break-words">
                        {notif.message}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-1.5">
                        {new Date(notif.createdAt).toLocaleDateString('es-AR', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notif.id);
                      }}
                      className="shrink-0 opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Eliminar notificación"
                    >
                      <X size={14} />
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <Bell size={32} className="mx-auto text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">No tenés notificaciones</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
