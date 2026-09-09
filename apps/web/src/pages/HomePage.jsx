import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  TrendingUp,
  Star,
  Search,
  Shield,
  DollarSign,
  Users,
  Monitor,
} from 'lucide-react';
import { useDesigns, useTrending, useFeatured } from '../hooks/useDesigns.js';
import DesignCard from '../components/DesignCard.jsx';
import { DesignGridSkeleton } from '../components/Skeletons.jsx';

const FEATURES = [
  {
    icon: Monitor,
    title: 'Diseños digitales de calidad',
    color: 'text-brand-violet',
    bg: 'bg-brand-violet/10',
  },
  {
    icon: Shield,
    title: 'Compra segura y confiable',
    color: 'text-brand-teal',
    bg: 'bg-brand-teal/10',
  },
  {
    icon: DollarSign,
    title: 'Comisiones en descenso',
    color: 'text-brand-rose',
    bg: 'bg-brand-rose/10',
  },
  {
    icon: Users,
    title: 'Para diseñadores y emprendedores',
    color: 'text-brand-orange',
    bg: 'bg-brand-orange/10',
  },
];

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
      <section className="bg-[#1a3a5c] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block bg-white/10 rounded-2xl p-6 mb-8">
              <img
                src="/marketDesignLogo.png"
                alt="Market Design"
                className="h-20 md:h-28 mx-auto"
              />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              Diseños digitales listos para imprimir
            </h1>
            <p className="text-lg text-gray-200 mb-8">
              Compra diseños originales de artistas independientes. Archivos en alta calidad para
              sublimación, estampado y papelería.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/catalogo"
                className="bg-brand-teal text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-teal-dark transition-colors inline-flex items-center gap-2"
              >
                <Search size={18} />
                Explorar diseños
              </Link>
              <Link
                to="/registro"
                className="border-2 border-brand-orange text-brand-orange px-6 py-3 rounded-lg font-semibold hover:bg-brand-orange/10 transition-colors"
              >
                Vender diseños
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${feature.bg}`}>
                  <feature.icon size={20} className={feature.color} />
                </div>
                <span className="text-sm font-medium text-gray-700">{feature.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Slogan */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-dark italic">
          Tu talento también se vende
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-brand-rose to-brand-teal mx-auto mt-4 rounded-full" />
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-dark mb-6">Categorías</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/catalogo?category=${cat.id}`}
              className="bg-gray-50 hover:bg-brand-teal/5 border border-gray-100 hover:border-brand-teal/30 rounded-xl p-4 text-center transition-all group"
            >
              <span className="text-sm font-medium text-gray-900 group-hover:text-brand-teal">
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
            <TrendingUp className="text-brand-orange" size={24} />
            <h2 className="text-2xl font-bold text-dark">Tendencia</h2>
          </div>
          <Link
            to="/catalogo?sort=trending"
            className="text-brand-teal hover:text-brand-teal-dark flex items-center gap-1 text-sm font-medium"
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
              <Star className="text-brand-orange" size={24} />
              <h2 className="text-2xl font-bold text-dark">Mejor valorados</h2>
            </div>
            <Link
              to="/catalogo?sort=rating"
              className="text-brand-teal hover:text-brand-teal-dark flex items-center gap-1 text-sm font-medium"
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
      <section className="bg-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-64 h-64 bg-brand-rose rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-20 w-80 h-80 bg-brand-teal rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center relative">
          <h2 className="text-3xl font-bold mb-4">¿Sos diseñador?</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Subí tus diseños y empezá a vender. Cobramos una comisión solo cuando vendés. Sin
            suscripciones, sin costos fijos.
          </p>
          <Link
            to="/registro"
            className="bg-brand-orange text-dark px-8 py-3 rounded-lg font-semibold hover:bg-brand-orange-light transition-colors inline-flex items-center gap-2"
          >
            Comenzar a vender <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
