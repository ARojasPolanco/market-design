import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, Menu, X, User, Bell } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';
import { useNotifications } from '../hooks/useNotifications.js';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const notifRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalogo?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const getPanelLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'seller') return '/vendedor/panel';
    return '/comprador/panel';
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/logoSolo.png" alt="Market Design" className="h-9" />
            <span className="text-lg font-bold text-dark hidden sm:block">Market Design</span>
          </Link>

          {/* Search bar - desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar diseños..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
          </form>

          {/* Nav links - desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/catalogo" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Catálogo
            </Link>
            <Link to="/favoritos" className="relative text-gray-600 hover:text-gray-900">
              <Heart size={20} />
              {favorites.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>
            {user && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative text-gray-600 hover:text-gray-900"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-brand-teal text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b">
                      <h3 className="font-semibold text-gray-900">Notificaciones</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-brand-teal hover:underline"
                        >
                          Marcar todas como leídas
                        </button>
                      )}
                    </div>
                    <div className="overflow-y-auto max-h-72">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => !notif.isRead && markAsRead(notif.id)}
                            className={`px-4 py-3 border-b last:border-0 cursor-pointer hover:bg-gray-50 transition-colors ${
                              !notif.isRead ? 'bg-blue-50' : ''
                            }`}
                          >
                            <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notif.message}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(notif.createdAt).toLocaleDateString('es-AR')}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-8">No tenés notificaciones</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  to={getPanelLink()}
                  className="text-gray-600 hover:text-gray-900"
                  title="Mi panel"
                >
                  <User size={20} />
                </Link>
                <button onClick={logout} className="text-sm text-gray-600 hover:text-gray-900">
                  Salir
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-dark text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-dark-light"
              >
                Ingresar
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden text-gray-600" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="mb-4">
              <form onSubmit={handleSearch} className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar diseños..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal"
                />
              </form>
            </div>
            <div className="flex flex-col gap-3">
              <Link to="/catalogo" className="text-gray-600 hover:text-gray-900 font-medium">
                Catálogo
              </Link>
              <Link to="/favoritos" className="text-gray-600 hover:text-gray-900">
                Favoritos ({favorites.length})
              </Link>
              {user ? (
                <>
                  <Link to={getPanelLink()} className="text-gray-600 hover:text-gray-900">
                    Mi Panel
                  </Link>
                  <button onClick={logout} className="text-left text-gray-600 hover:text-gray-900">
                    Salir
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="bg-dark text-white px-4 py-2 rounded-lg text-sm font-medium text-center hover:bg-dark-light"
                >
                  Ingresar
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
