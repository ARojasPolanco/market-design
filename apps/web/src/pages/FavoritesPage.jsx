import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import DesignCard from '../components/DesignCard.jsx';
import api from '../config/api.js';
import logger from '../utils/logger.js';

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const { user } = useAuth();
  const [designs, setDesigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFavoriteDesigns();
  }, [favorites]);

  const fetchFavoriteDesigns = async () => {
    if (favorites.length === 0) {
      setDesigns([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const results = await Promise.all(
        favorites.map(async (id) => {
          try {
            const res = await api.get(`/v1/designs/${id}`);
            return res.data.design;
          } catch {
            return null;
          }
        })
      );
      setDesigns(results.filter(Boolean));
    } catch (err) {
      logger.error('Error fetching favorite designs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm"
      >
        <ArrowLeft size={16} /> Volver al inicio
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <Heart size={24} className="text-red-500" />
        <h1 className="text-2xl font-bold text-gray-900">Mis favoritos</h1>
        <span className="text-sm text-gray-500">({favorites.length})</span>
      </div>

      {!user && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-700">
            Estás viendo favoritos guardados en este navegador.{' '}
            <Link to="/login" className="font-medium underline">Iniciá sesión</Link> para sincronizarlos con tu cuenta.
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-xl mb-3" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : designs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {designs.map((design) => (
            <DesignCard key={design.id} design={design} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Heart size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">No tenés favoritos</h2>
          <p className="text-gray-500 mb-6">Explorá el catálogo y guardá los diseños que te gusten.</p>
          <Link
            to="/catalogo"
            className="inline-flex items-center gap-2 bg-dark text-white px-6 py-3 rounded-lg font-medium hover:bg-dark-light transition-colors"
          >
            Explorar catálogo
          </Link>
        </div>
      )}
    </div>
  );
}
