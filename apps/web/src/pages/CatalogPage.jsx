import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown, Search } from 'lucide-react';
import { useDesigns } from '../hooks/useDesigns.js';
import { useCategoryCounts } from '../hooks/useCategories.js';
import DesignCard from '../components/DesignCard.jsx';
import { DesignGridSkeleton } from '../components/Skeletons.jsx';
import { EmptyCatalog } from '../components/EmptyStates.jsx';

const SORT_OPTIONS = [
  { value: 'recent', label: 'Más recientes' },
  { value: 'popular', label: 'Más vendidos' },
  { value: 'trending', label: 'Tendencia' },
  { value: 'rating', label: 'Mejor valorados' },
  { value: 'price_asc', label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
];

function CatalogFilters({
  filters,
  categoryCounts,
  techniques,
  onUpdate,
  onClear,
  onCommitPrice,
  hasActiveFilters,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Filtros</h3>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="text-sm text-brand-teal hover:text-brand-teal-dark"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Category */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Categoría</h4>
        <div className="space-y-2">
          {categoryCounts.length === 0 && (
            <p className="text-sm text-gray-400">Sin categorías</p>
          )}
          {categoryCounts.map((cat) => (
            <label key={cat.name} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="category"
                checked={filters.category === cat.name}
                onChange={() =>
                  onUpdate('category', filters.category === cat.name ? '' : cat.name)
                }
                className="text-brand-teal focus:ring-brand-teal"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900">{cat.name}</span>
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
                  onUpdate('technique', filters.technique === tech.id ? '' : tech.id)
                }
                className="text-brand-teal focus:ring-brand-teal"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900">{tech.name}</span>
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
            min="0"
            placeholder="Mín"
            defaultValue={filters.priceMin || ''}
            onBlur={(e) => onCommitPrice('priceMin', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
          />
          <input
            type="number"
            min="0"
            placeholder="Máx"
            defaultValue={filters.priceMax || ''}
            onBlur={(e) => onCommitPrice('priceMax', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
          />
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const { categories: categoryCounts } = useCategoryCounts();

  const filters = {
    category: searchParams.get('category') || '',
    technique: searchParams.get('technique') || '',
    sort: searchParams.get('sort') || 'recent',
    search: searchParams.get('search') || '',
    priceMin: searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : null,
    priceMax: searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : null,
  };

  const [searchInput, setSearchInput] = useState(filters.search);

  const { designs, techniques, total, isLoading } = useDesigns(filters);

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
    setSearchInput('');
    setSearchParams({});
  };

  // Keep the input in sync when the URL changes (e.g. from the navbar search).
  useEffect(() => {
    setSearchInput(filters.search);
  }, [filters.search]);

  // Debounced search.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        updateFilter('search', searchInput);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const hasActiveFilters = Boolean(
    filters.category || filters.technique || filters.priceMin || filters.priceMax || filters.search
  );

  const activeFilterCount = [
    filters.category,
    filters.technique,
    filters.priceMin,
    filters.priceMax,
    filters.search,
  ].filter(Boolean).length;

  const filterProps = {
    filters,
    categoryCounts,
    techniques,
    onUpdate: updateFilter,
    onClear: clearFilters,
    onCommitPrice: updateFilter,
    hasActiveFilters,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Catálogo</h1>
          <p className="text-sm text-gray-500">
            {total} {total === 1 ? 'diseño encontrado' : 'diseños encontrados'}
            {filters.search && (
              <>
                {' '}para <span className="font-medium text-gray-700">“{filters.search}”</span>
              </>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={filters.sort}
              onChange={(e) => updateFilter('sort', e.target.value)}
              aria-label="Ordenar por"
              className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
          <button
            onClick={() => setShowFilters(true)}
            className="lg:hidden flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
          >
            <SlidersHorizontal size={16} />
            Filtros
            {activeFilterCount > 0 && (
              <span className="bg-dark text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Buscar diseños por título o descripción..."
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-teal"
        />
        {searchInput && (
          <button
            onClick={() => setSearchInput('')}
            aria-label="Limpiar búsqueda"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Active filters pills */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {filters.category && (
            <span className="inline-flex items-center gap-1 bg-brand-teal/10 text-brand-teal-dark text-sm px-3 py-1 rounded-full">
              {filters.category}
              <button onClick={() => updateFilter('category', '')} aria-label="Quitar categoría">
                <X size={14} />
              </button>
            </span>
          )}
          {filters.technique && (
            <span className="inline-flex items-center gap-1 bg-brand-teal/10 text-brand-teal-dark text-sm px-3 py-1 rounded-full">
              {techniques.find((t) => t.id === filters.technique)?.name || filters.technique}
              <button onClick={() => updateFilter('technique', '')} aria-label="Quitar técnica">
                <X size={14} />
              </button>
            </span>
          )}
          {(filters.priceMin || filters.priceMax) && (
            <span className="inline-flex items-center gap-1 bg-brand-teal/10 text-brand-teal-dark text-sm px-3 py-1 rounded-full">
              ${filters.priceMin || 0} - ${filters.priceMax || '∞'}
              <button
                onClick={() => {
                  updateFilter('priceMin', '');
                  updateFilter('priceMax', '');
                }}
                aria-label="Quitar precio"
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
        {/* Desktop filters */}
        <aside className="w-64 shrink-0 hidden lg:block">
          <div className="sticky top-24">
            <CatalogFilters {...filterProps} />
          </div>
        </aside>

        {/* Mobile filters drawer */}
        {showFilters && (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setShowFilters(false)}
            />
            <div className="absolute right-0 top-0 h-full w-80 max-w-[85%] bg-white shadow-xl overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filtros</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  aria-label="Cerrar filtros"
                  className="p-1 text-gray-500 hover:text-gray-900"
                >
                  <X size={20} />
                </button>
              </div>
              <CatalogFilters {...filterProps} />
              <button
                onClick={() => setShowFilters(false)}
                className="w-full mt-6 bg-dark text-white py-3 rounded-lg font-medium hover:bg-dark-light transition-colors"
              >
                Ver {total} {total === 1 ? 'resultado' : 'resultados'}
              </button>
            </div>
          </div>
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
            <EmptyCatalog onClear={clearFilters} />
          )}
        </div>
      </div>
    </div>
  );
}
