import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { useDesigns } from '../hooks/useDesigns.js';
import DesignCard from '../components/DesignCard.jsx';

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const filters = {
    category: searchParams.get('category') || '',
    technique: searchParams.get('technique') || '',
    sort: searchParams.get('sort') || 'recent',
    search: searchParams.get('search') || '',
  };

  const { designs, categories, techniques } = useDesigns(filters);

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

  const hasActiveFilters = filters.category || filters.technique;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Catálogo</h1>
          <p className="text-sm text-gray-500">{designs.length} diseños encontrados</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filters.sort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="recent">Más recientes</option>
            <option value="popular">Más vendidos</option>
            <option value="trending">Tendencia</option>
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 text-sm hover:bg-gray-50"
          >
            <SlidersHorizontal size={16} />
            Filtros
            {hasActiveFilters && (
              <span className="bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                !
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filters sidebar */}
        {showFilters && (
          <aside className="w-64 shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filtros</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-indigo-600 hover:text-indigo-700"
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
                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === cat.id}
                        onChange={() =>
                          updateFilter('category', filters.category === cat.id ? '' : cat.id)
                        }
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-600">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Technique */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Técnica</h4>
                <div className="space-y-2">
                  {techniques.map((tech) => (
                    <label key={tech.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="technique"
                        checked={filters.technique === tech.id}
                        onChange={() =>
                          updateFilter('technique', filters.technique === tech.id ? '' : tech.id)
                        }
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-600">{tech.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Grid */}
        <div className="flex-1">
          {designs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {designs.map((design) => (
                <DesignCard key={design.id} design={design} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg mb-4">No se encontraron diseños</p>
              <button
                onClick={clearFilters}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
