import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Star, Search } from 'lucide-react';
import { useDesigns, useTrending, useFeatured } from '../hooks/useDesigns.js';
import DesignCard from '../components/DesignCard.jsx';
import { DesignGridSkeleton } from '../components/Skeletons.jsx';

export default function HomePage() {
  const { categories } = useDesigns();
  const { designs: trending } = useTrending();
  const { designs: featured } = useFeatured();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              Diseños digitales listos para imprimir
            </h1>
            <p className="text-lg text-indigo-100 mb-8">
              Compra diseños originales de artistas independientes. Archivos en alta calidad para
              sublimación, estampado y papelería.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/catalogo"
                className="bg-white text-indigo-700 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors inline-flex items-center gap-2"
              >
                <Search size={18} />
                Explorar diseños
              </Link>
              <Link
                to="/registro"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Vender diseños
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Categorías</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/catalogo?category=${cat.id}`}
              className="bg-gray-50 hover:bg-indigo-50 rounded-xl p-4 text-center transition-colors group"
            >
              <span className="text-sm font-medium text-gray-900 group-hover:text-indigo-700">
                {cat.name}
              </span>
              <span className="block text-xs text-gray-500 mt-1">{cat.count} diseños</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-orange-500" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">Tendencia</h2>
          </div>
          <Link
            to="/catalogo?sort=trending"
            className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 text-sm font-medium"
          >
            Ver todo <ArrowRight size={16} />
          </Link>
        </div>
        {isLoading ? (
          <DesignGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trending.map((design) => (
              <DesignCard key={design.id} design={design} />
            ))}
          </div>
        )}
      </section>

      {/* Featured */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Star className="text-yellow-500" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">Mejor valorados</h2>
            </div>
            <Link
              to="/catalogo?sort=rating"
              className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 text-sm font-medium"
            >
              Ver todo <ArrowRight size={16} />
            </Link>
          </div>
          {isLoading ? (
            <DesignGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((design) => (
                <DesignCard key={design.id} design={design} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Sos diseñador?</h2>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
          Subí tus diseños y empezá a vender. Cobramos una comisión solo cuando vendés. Sin
          suscripciones, sin costos fijos.
        </p>
        <Link
          to="/registro"
          className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
        >
          Comenzar a vender <ArrowRight size={18} />
        </Link>
      </section>
    </div>
  );
}
