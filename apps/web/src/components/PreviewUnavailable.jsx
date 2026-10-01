import { FileText } from 'lucide-react';

export default function PreviewUnavailable({ title, className = '' }) {
  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-center text-center bg-gray-100 px-4 py-6 ${className}`}
    >
      <div className="p-3 bg-white rounded-full shadow-sm mb-3">
        <FileText size={22} className="text-gray-400" />
      </div>
      <p className="text-sm font-medium text-gray-700 line-clamp-2">{title || 'Diseño'}</p>
      <p className="text-xs text-gray-500 mt-2 max-w-[220px]">
        La vista previa no está disponible, pero podés seguir descargando tu archivo cuando quieras.
      </p>
    </div>
  );
}
