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
  Clock,
  User,
} from 'lucide-react';
import { usePurchases, useDesigns } from '../hooks/useDesigns.js';
import { useFavorites } from '../context/FavoritesContext.jsx';
import DesignCard from '../components/DesignCard.jsx';
import { EmptyPurchases, EmptyFavorites } from '../components/EmptyStates.jsx';

const MOCK_BUYER = {
  name: 'Carlos López',
  username: 'CarlosL',
  email: 'carlos@email.com',
  avatar: 'https://placehold.co/200x200/1a1a2e/ffffff?text=CL',
  interests: ['sublimado', 'infantil'],
  joinedAt: '2024-08-15',
  totalPurchases: 5,
  totalSpent: 12200,
};

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
  const favoriteDesigns = allDesigns.filter((d) => favorites.includes(d.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile header */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative">
            <img
              src={MOCK_BUYER.avatar}
              alt={MOCK_BUYER.name}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className="absolute -bottom-1 -right-1 p-1 bg-brand-teal text-white rounded-full">
              <CheckCircle size={14} />
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{MOCK_BUYER.name}</h1>
            <p className="text-sm text-gray-500">@{MOCK_BUYER.username}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <ShoppingBag size={14} /> {MOCK_BUYER.totalPurchases} compras
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} /> Miembro desde {new Date(MOCK_BUYER.joinedAt).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('profile')}
            className="text-sm text-brand-teal hover:text-brand-teal-dark font-medium"
          >
            Editar perfil
          </button>
        </div>
      </div>

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
                        src={purchase.design.previewUrl}
                        alt={purchase.design.title}
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
                              {purchase.design.title}
                            </Link>
                            <p className="text-sm text-gray-500">
                              {purchase.design.seller.name}
                            </p>
                          </div>
                          <span className="text-lg font-bold text-gray-900">
                            ${purchase.price.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>
                            Comprado el{' '}
                            {new Date(purchase.createdAt).toLocaleDateString('es-AR')}
                          </span>
                          <span>·</span>
                          <span>{purchase.downloadCount} descargas</span>
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
      {activeTab === 'suggestions' && <SuggestionsSection interests={MOCK_BUYER.interests} />}

      {/* Profile tab */}
      {activeTab === 'profile' && <ProfileSection buyer={MOCK_BUYER} />}
    </div>
  );
}

function SuggestionsSection({ interests }) {
  const { designs } = useDesigns();
  const [selectedInterest, setSelectedInterest] = useState(interests[0] || '');

  const suggestedDesigns = designs
    .filter((d) => d.category === selectedInterest || d.technique === selectedInterest)
    .sort((a, b) => b.salesCount - a.salesCount)
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
              onClick={() => setSelectedInterest(interest.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedInterest === interest.id
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

      {/* Recently viewed (decorative) */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock size={18} className="text-gray-400" />
          Vistos recientemente
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {designs.slice(0, 4).map((design) => (
            <DesignCard key={design.id} design={design} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfileSection({ buyer }) {
  const [fullname, setFullname] = useState(buyer.name);
  const [username, setUsername] = useState(buyer.username);
  const [avatarPreview, setAvatarPreview] = useState(buyer.avatar);
  const [interests, setInterests] = useState(buyer.interests);
  const [saved, setSaved] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  const toggleInterest = (id) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

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
            <img
              src={avatarPreview}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover"
            />
            <label className="absolute bottom-0 right-0 p-1.5 bg-brand-teal text-white rounded-full cursor-pointer hover:bg-brand-teal-dark transition-colors">
              <Camera size={14} />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>
          <div>
            <p className="font-medium text-gray-900">{buyer.name}</p>
            <p className="text-sm text-gray-500">@{buyer.username}</p>
          </div>
        </div>

        {/* Fullname */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre completo
          </label>
          <input
            type="text"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal"
          />
          <p className="text-xs text-gray-500 mt-1">
            Este nombre se usa para facturación y datos internos.
          </p>
        </div>

        {/* Username */}
        <div className="mb-4">
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

        {/* Interests */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tus intereses
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Seleccioná las categorías que te interesan para recibir sugerencias personalizadas.
          </p>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((interest) => (
              <button
                key={interest.id}
                onClick={() => toggleInterest(interest.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  interests.includes(interest.id)
                    ? 'bg-brand-teal text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {interest.name}
              </button>
            ))}
          </div>
        </div>

        {/* Stats (decorative) */}
        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{buyer.totalPurchases}</p>
            <p className="text-xs text-gray-500">Compras</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              ${buyer.totalSpent.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">Gastado</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{interests.length}</p>
            <p className="text-xs text-gray-500">Intereses</p>
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

function Calendar({ size = 16, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}
