import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Heart,
  Download,
  ChevronRight,
  Camera,
  Save,
  CheckCircle,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  User,
  Upload,
} from 'lucide-react';
import { usePurchases, useDesigns } from '../hooks/useDesigns.js';
import { useFavorites } from '../context/FavoritesContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import DesignCard from '../components/DesignCard.jsx';
import { EmptyPurchases, EmptyFavorites } from '../components/EmptyStates.jsx';

const INTEREST_OPTIONS = [
  { id: 'sublimado', name: 'Sublimado' },
  { id: 'estampado', name: 'Estampado' },
  { id: 'papeleria', name: 'Papelería' },
  { id: 'infantil', name: 'Infantil' },
  { id: 'deportivo', name: 'Deportivo' },
  { id: 'religioso', name: 'Religioso' },
];

export default function BuyerDashboard() {
  const [activeTab, setActiveTab] = useState('purchases');
  const { purchases } = usePurchases();
  const { favorites } = useFavorites();
  const { designs: allDesigns } = useDesigns();
  const { user } = useAuth();
  const favoriteDesigns = allDesigns.filter((d) => favorites.includes(d.id));

  const displayName = user?.username || user?.fullname || 'Usuario';
  const avatarLetter = displayName.charAt(0).toUpperCase();
  const avatarUrl = user?.avatarUrl || `https://placehold.co/200x200/0F2A44/ffffff?text=${avatarLetter}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile header */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative">
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className="absolute -bottom-1 -right-1 p-1 bg-brand-teal text-white rounded-full">
              <CheckCircle size={14} />
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
            <p className="text-sm text-gray-500">@{user?.username || 'usuario'}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <ShoppingBag size={14} /> {purchases.length} {purchases.length === 1 ? 'compra' : 'compras'}
              </span>
            </div>
          </div>
          <Link
            to="/comprador/perfil"
            className="text-sm text-brand-teal hover:text-brand-teal-dark font-medium"
          >
            Editar perfil
          </Link>
        </div>
      </div>

      {/* Upgrade to seller banner */}
      {user?.role !== 'seller' && (
        <div className="bg-gradient-to-r from-brand-teal/10 to-brand-violet/10 border border-brand-teal/20 rounded-2xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="p-3 bg-brand-teal/20 rounded-xl">
              <Upload size={24} className="text-brand-teal" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-semibold text-gray-900">¿Querés vender diseños?</h3>
              <p className="text-sm text-gray-600">
                Activá tu cuenta de vendedor para empezar a vender tus diseños y ganar dinero.
              </p>
            </div>
            <Link
              to="/vendedor/activar"
              className="bg-brand-teal text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-teal-dark transition-colors"
            >
              Activar vendedor
            </Link>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b mb-6 overflow-x-auto">
        {[
          { id: 'purchases', label: `Mis compras (${purchases.length})`, icon: Package },
          { id: 'favorites', label: `Favoritos (${favorites.length})`, icon: Heart },
          { id: 'suggestions', label: 'Para vos', icon: Sparkles },
          { id: 'profile', label: 'Mi perfil', icon: User },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-brand-teal text-brand-teal'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Purchases tab */}
      {activeTab === 'purchases' && (
        <>
          {purchases.length > 0 ? (
            <div className="space-y-4">
              {purchases.map((purchase) => (
                <div
                  key={purchase.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-32 sm:h-32 h-48 shrink-0">
                      <img
                        src={purchase.design?.previewUrl || '/designs/lobo-geometrico.png'}
                        alt={purchase.design?.title || 'Diseño'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <Link
                              to={`/diseno/${purchase.designId}`}
                              className="font-semibold text-gray-900 hover:text-brand-teal"
                            >
                              {purchase.design?.title || 'Diseño'}
                            </Link>
                            <p className="text-sm text-gray-500">
                              {purchase.design?.seller?.storeName || 'Vendedor'}
                            </p>
                          </div>
                          <span className="text-lg font-bold text-gray-900">
                            ${Number(purchase.price).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>
                            Comprado el{' '}
                            {new Date(purchase.createdAt).toLocaleDateString('es-AR')}
                          </span>
                          <span>·</span>
                          <span>{purchase.downloadCount || 0} descargas</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-4">
                        <button className="flex items-center gap-2 bg-brand-teal text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-teal-dark transition-colors">
                          <Download size={16} />
                          Descargar
                        </button>
                        <Link
                          to={`/diseno/${purchase.designId}`}
                          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm"
                        >
                          Ver diseño <ChevronRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyPurchases />
          )}
        </>
      )}

      {/* Favorites tab */}
      {activeTab === 'favorites' && (
        <>
          {favoriteDesigns.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {favoriteDesigns.map((design) => (
                <DesignCard key={design.id} design={design} />
              ))}
            </div>
          ) : (
            <EmptyFavorites />
          )}
        </>
      )}

      {/* Suggestions tab */}
      {activeTab === 'suggestions' && <SuggestionsSection />}

      {/* Profile tab */}
      {activeTab === 'profile' && <ProfileSection user={user} />}
    </div>
  );
}

function SuggestionsSection() {
  const { designs } = useDesigns();
  const [selectedCategory, setSelectedCategory] = useState('sublimado');

  const suggestedDesigns = designs
    .filter((d) => d.category === selectedCategory)
    .slice(0, 8);

  const trending = [...designs]
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Interest selector */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Sparkles size={18} className="text-brand-violet" />
          Basado en tus intereses
        </h2>
        <div className="flex flex-wrap gap-2 mb-6">
          {INTEREST_OPTIONS.map((interest) => (
            <button
              key={interest.id}
              onClick={() => setSelectedCategory(interest.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === interest.id
                  ? 'bg-brand-teal text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {interest.name}
            </button>
          ))}
        </div>
        {suggestedDesigns.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {suggestedDesigns.map((design) => (
              <DesignCard key={design.id} design={design} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No hay diseños en esta categoría todavía.
          </p>
        )}
      </div>

      {/* Trending */}
      {trending.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-brand-orange" />
            Los más vendidos esta semana
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trending.map((design) => (
              <DesignCard key={design.id} design={design} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileSection({ user }) {
  const [username, setUsername] = useState(user?.username || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-6">Editar perfil</h2>

        {/* Avatar */}
        <div className="flex items-center gap-6 mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-500">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <label className="absolute bottom-0 right-0 p-1.5 bg-brand-teal text-white rounded-full cursor-pointer hover:bg-brand-teal-dark transition-colors">
              <Camera size={14} />
              <input type="file" accept="image/*" className="hidden" />
            </label>
          </div>
          <div>
            <p className="font-medium text-gray-900">{user?.fullname || 'Usuario'}</p>
            <p className="text-sm text-gray-500">@{user?.username || 'usuario'}</p>
          </div>
        </div>

        {/* Username */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de usuario
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal"
          />
          <p className="text-xs text-gray-500 mt-1">
            Este nombre se muestra en reviews y compras.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-xs text-gray-500">Compras</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-xs text-gray-500">Favoritos</p>
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="bg-brand-teal text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-teal-dark transition-colors flex items-center gap-2"
          >
            <Save size={16} />
            Guardar cambios
          </button>
          {saved && (
            <span className="text-sm text-brand-teal flex items-center gap-1">
              <CheckCircle size={16} /> Guardado
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
