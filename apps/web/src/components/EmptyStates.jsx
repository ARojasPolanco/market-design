import { Package, Search, Heart, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function EmptyState({
  icon: Icon = Package,
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
}) {
  return (
    <div className="text-center py-16 px-4">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
        <Icon size={32} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">{description}</p>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function EmptyCatalog() {
  return (
    <EmptyState
      icon={Search}
      title="No se encontraron diseños"
      description="No hay diseños que coincidan con tus filtros. Probá con otros criterios de búsqueda."
      actionLabel="Limpiar filtros"
      onAction={() => window.location.reload()}
    />
  );
}

export function EmptyPurchases() {
  return (
    <EmptyState
      icon={Package}
      title="No tenés compras todavía"
      description="Explorá nuestro catálogo y encontrá el diseño perfecto para tu próximo proyecto."
      actionLabel="Explorar diseños"
      actionTo="/catalogo"
    />
  );
}

export function EmptyFavorites() {
  return (
    <EmptyState
      icon={Heart}
      title="No tenés favoritos"
      description="Guardá los diseños que te gusten para comprarlos después."
      actionLabel="Explorar diseños"
      actionTo="/catalogo"
    />
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="text-center py-16 px-4">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
        <AlertCircle size={32} className="text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Algo salió mal</h3>
      <p className="text-gray-500 mb-6">{message || 'Ocurrió un error inesperado.'}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
