import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { useDesigns } from '../hooks/useDesigns.js';
import DesignCard from '../components/DesignCard.jsx';
import { DesignGridSkeleton } from '../components/Skeletons.jsx';
import { EmptyCatalog } from '../components/EmptyStates.jsx';

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const filters = {
    category: searchParams.get('category') || '',
    technique: searchParams.get('technique') || '',
    sort: searchParams.get('sort') || 'recent',
    search: searchParams.get('search') || '',
    priceMin: searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : null,
    priceMax: searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : null,
  };

  const { designs, categories, techniques, total } = useDesigns(filters);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters =
    filters.category || filters.technique || filters.priceMin || filters.priceMax;

  const activeFilterCount = [
    filters.category,
    filters.technique,
    filters.priceMin,
    filters.priceMax,
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Catálogo</h1>
          <p className="text-sm text-gray-500">
            {total} {total === 1 ? 'diseño encontrado' : 'diseños encontrados'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={filters.sort}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-coral-500 cursor-pointer"
            >
              <option value="recent">Más recientes</option>
              <option value="popular">Más vendidos</option>
              <option value="trending">Tendencia</option>
              <option value="rating">Mejor valorados</option>
              <option value="price_asc">Precio: menor a mayor</option>
              <option value="price_desc">Precio: mayor a menor</option>
            </select>
            <ChevronDown
              size={16}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 border rounded-lg px-3 py-2 text-sm transition-colors ${
              showFilters
                ? 'bg-coral-50 border-coral-300 text-coral-500'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <SlidersHorizontal size={16} />
            <span className="hidden sm:inline">Filtros</span>
            {activeFilterCount > 0 && (
              <span className="bg-coral-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Active filters pills */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.category && (
            <span className="inline-flex items-center gap-1 bg-coral-50 text-coral-500 text-sm px-3 py-1 rounded-full">
              {categories.find((c) => c.id === filters.category)?.name}
              <button
                onClick={() => updateFilter('category', '')}
                className="hover:text-coral-700"
              >
                <X size={14} />
              </button>
            </span>
          )}
          {filters.technique && (
            <span className="inline-flex items-center gap-1 bg-coral-50 text-coral-500 text-sm px-3 py-1 rounded-full">
              {techniques.find((t) => t.id === filters.technique)?.name}
              <button
                onClick={() => updateFilter('technique', '')}
                className="hover:text-coral-700"
              >
                <X size={14} />
              </button>
            </span>
          )}
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Limpiar todo
          </button>
        </div>
      )}

      <div className="flex gap-8">
        {/* Filters sidebar */}
        {showFilters && (
          <aside className="w-64 shrink-0 hidden lg:block">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filtros</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-coral-400 hover:text-coral-500"
                  >
                    Limpiar
                  </button>
                )}
              </div>

              {/* Category */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Categoría</h4>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === cat.id}
                        onChange={() =>
                          updateFilter('category', filters.category === cat.id ? '' : cat.id)
                        }
                        className="text-coral-400 focus:ring-coral-500"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900">
                        {cat.name}
                      </span>
                      <span className="text-xs text-gray-400 ml-auto">{cat.count}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Technique */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Técnica</h4>
                <div className="space-y-2">
                  {techniques.map((tech) => (
                    <label key={tech.id} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="technique"
                        checked={filters.technique === tech.id}
                        onChange={() =>
                          updateFilter('technique', filters.technique === tech.id ? '' : tech.id)
                        }
                        className="text-coral-400 focus:ring-coral-500"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900">
                        {tech.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Precio</h4>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Mín"
                    value={filters.priceMin || ''}
                    onChange={(e) =>
                      updateFilter('priceMin', e.target.value ? Number(e.target.value) : '')
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-coral-500"
                  />
                  <input
                    type="number"
                    placeholder="Máx"
                    value={filters.priceMax || ''}
                    onChange={(e) =>
                      updateFilter('priceMax', e.target.value ? Number(e.target.value) : '')
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-coral-500"
                  />
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Grid */}
        <div className="flex-1">
          {isLoading ? (
            <DesignGridSkeleton />
          ) : designs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {designs.map((design) => (
                <DesignCard key={design.id} design={design} />
              ))}
            </div>
          ) : (
            <EmptyCatalog />
          )}
        </div>
      </div>
    </div>
  );
}
