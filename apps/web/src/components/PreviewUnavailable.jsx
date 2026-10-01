export default function PreviewUnavailable({ className = '' }) {
  return (
    <div
      className={`w-full h-full flex items-center justify-center text-center bg-gray-100 px-3 py-4 ${className}`}
    >
      <p className="w-full text-xs font-semibold text-gray-500 text-center break-words">
        La vista previa no está disponible, pero podés seguir descargando tu archivo cuando quieras.
      </p>
    </div>
  );
}
