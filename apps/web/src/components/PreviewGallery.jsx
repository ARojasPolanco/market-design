import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

export default function PreviewGallery({ images = [], columns = 3, size = 'md' }) {
  const list = (images || []).filter(Boolean);
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
      } else if (e.key === 'ArrowLeft' && list.length > 1) {
        setCurrent((prev) => (prev === 0 ? list.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight' && list.length > 1) {
        setCurrent((prev) => (prev === list.length - 1 ? 0 : prev + 1));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, list.length]);

  if (list.length === 0) {
    return (
      <div className="text-xs text-gray-400 border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
        Sin imágenes
      </div>
    );
  }

  const sizeClasses =
    size === 'sm' ? 'w-full aspect-square' : 'w-full aspect-square';

  const gotoPrev = (e) => {
    e?.stopPropagation();
    setCurrent((prev) => (prev === 0 ? list.length - 1 : prev - 1));
  };
  const gotoNext = (e) => {
    e?.stopPropagation();
    setCurrent((prev) => (prev === list.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div
        className={`grid gap-2 ${columns === 2 ? 'grid-cols-2' : columns === 4 ? 'grid-cols-4' : 'grid-cols-3'}`}
      >
        {list.map((url, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setCurrent(i);
              setOpen(true);
            }}
            className="relative group rounded-lg overflow-hidden border border-gray-200 hover:border-brand-teal transition-colors"
          >
            <img src={url} alt={`Preview ${i + 1}`} className={`${sizeClasses} object-cover`} />
            <span className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
              <ZoomIn size={18} className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" />
            </span>
          </button>
        ))}
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/90 z-[110] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Vista ampliada"
          onClick={() => setOpen(false)}
        >
          <button
            onClick={() => setOpen(false)}
            aria-label="Cerrar"
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <X size={32} />
          </button>

          {list.length > 1 && (
            <>
              <button
                onClick={gotoPrev}
                aria-label="Anterior"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full z-10"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={gotoNext}
                aria-label="Siguiente"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full z-10"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <img
            src={list[current]}
            alt={`Preview ${current + 1}`}
            className="max-w-[90vw] max-h-[85vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {list.length > 1 && (
            <div className="absolute bottom-4 flex gap-2">
              {list.map((url, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrent(i);
                  }}
                  aria-label={`Ver imagen ${i + 1}`}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-colors ${
                    current === i ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
