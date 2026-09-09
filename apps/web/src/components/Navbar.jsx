import { Link } from 'react-router-dom';
import { Search, Heart, Menu, X, User } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();

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
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Buscar diseños..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent"
              />
            </div>
          </div>

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
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  to={user.role === 'admin' ? '/admin' : '/vendedor/panel'}
                  className="text-gray-600 hover:text-gray-900"
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
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Buscar diseños..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500"
                />
              </div>
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
                  <Link to="/vendedor/panel" className="text-gray-600 hover:text-gray-900">
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
