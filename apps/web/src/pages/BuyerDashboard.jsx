import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, ChevronRight } from 'lucide-react';
import { usePurchases } from '../hooks/useDesigns.js';
import { useFavorites } from '../context/FavoritesContext.jsx';
import { useDesigns } from '../hooks/useDesigns.js';
import DesignCard from '../components/DesignCard.jsx';
import { EmptyPurchases, EmptyFavorites } from '../components/EmptyStates.jsx';

export default function BuyerDashboard() {
  const [activeTab, setActiveTab] = useState('purchases');
  const { purchases } = usePurchases();
  const { favorites } = useFavorites();
  const { designs: allDesigns } = useDesigns();
  const favoriteDesigns = allDesigns.filter((d) => favorites.includes(d.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Mi cuenta</h1>

      {/* Tabs */}
      <div className="flex gap-1 border-b mb-6">
        <button
          onClick={() => setActiveTab('purchases')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'purchases'
              ? 'border-coral-400 text-coral-400'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Mis compras ({purchases.length})
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'favorites'
              ? 'border-coral-400 text-coral-400'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Favoritos ({favorites.length})
        </button>
      </div>

      {/* Purchases tab */}
      {activeTab === 'purchases' && (
        <>
          {purchases.length > 0 ? (
            <div className="space-y-4">
              {purchases.map((purchase) => (
                <div key={purchase.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
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
                              className="font-semibold text-gray-900 hover:text-coral-400"
                            >
                              {purchase.design.title}
                            </Link>
                            <p className="text-sm text-gray-500">{purchase.design.seller.name}</p>
                          </div>
                          <span className="text-lg font-bold text-gray-900">
                            ${purchase.price.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>
                            Comprado el {new Date(purchase.createdAt).toLocaleDateString('es-AR')}
                          </span>
                          <span>·</span>
                          <span>{purchase.downloadCount} descargas</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-4">
                        <button className="flex items-center gap-2 bg-coral-400 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-coral-500 transition-colors">
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
    </div>
  );
}
