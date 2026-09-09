import { useState, useEffect } from 'react';
import { FileCheck, ShieldX, DollarSign, Clock, ArrowRight, Check } from 'lucide-react';

const ONBOARDING_KEY = 'marketplace_onboarding_done';

const cards = [
  {
    icon: FileCheck,
    title: 'Specs técnicas',
    color: 'bg-blue-100 text-blue-600',
    items: [
      'Resolución mínima: 150 DPI (recomendado 300 DPI)',
      'Formatos aceptados: PDF, PNG, ZIP, AI, PSD, EPS',
      'Peso mínimo: detectamos archivos vacíos o corruptos',
      'Subí el archivo original en alta calidad',
    ],
  },
  {
    icon: ShieldX,
    title: 'Qué NO se acepta',
    color: 'bg-red-100 text-red-600',
    items: [
      'Diseños con copyright de terceros (marcas, personajes)',
      'Imágenes borrosas o de baja resolución',
      'Capturas de pantalla como archivo final',
      'Spam en título o descripción',
    ],
  },
  {
    icon: DollarSign,
    title: 'Tu ganancia',
    color: 'bg-green-100 text-green-600',
    items: [
      'La comisión base es del 20% por venta',
      'Ejemplo: si vendés a $2.000, ganás $1.600',
      'La comisión baja automáticamente con más ventas',
      'Cobrás directo en tu cuenta de Mercado Pago',
    ],
  },
  {
    icon: Clock,
    title: 'Tiempo de moderación',
    color: 'bg-teal-100 text-teal-600',
    items: [
      'Revisión en 24-48 horas hábiles',
      'Te notificamos por email si es aprobado o rechazado',
      'Si rechazamos, te damos el motivo para que corrijas',
      'Podés editar y reenviar cuantas veces necesites',
    ],
  },
];

export default function OnboardingCards({ onComplete }) {
  const [current, setCurrent] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, [current]);

  const handleNext = () => {
    if (current < cards.length - 1) {
      setAnimate(false);
      setTimeout(() => setCurrent(current + 1), 150);
    } else {
      localStorage.setItem(ONBOARDING_KEY, 'true');
      onComplete();
    }
  };

  const card = cards[current];
  const Icon = card.icon;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        {/* Progress */}
        <div className="flex justify-center gap-2 mb-8">
          {cards.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-8 bg-coral-400'
                  : i < current
                    ? 'w-4 bg-coral-300'
                    : 'w-4 bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Card */}
        <div
          className={`bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 ${
            animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className={`inline-flex p-3 rounded-xl ${card.color} mb-6`}>
            <Icon size={28} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{card.title}</h2>
          <ul className="space-y-3 mb-8">
            {card.items.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <Check size={18} className="text-green-500 mt-0.5 shrink-0" />
                <span className="text-gray-600">{item}</span>
              </li>
            ))}
          </ul>

          {/* Next button */}
          <button
            onClick={handleNext}
            className="w-full bg-dark text-white py-3 rounded-lg font-semibold hover:bg-dark-light transition-colors flex items-center justify-center gap-2"
          >
            {current < cards.length - 1 ? (
              <>
                Siguiente <ArrowRight size={18} />
              </>
            ) : (
              'Entendido, subir diseño'
            )}
          </button>

          {/* Skip */}
          {current < cards.length - 1 && (
            <button
              onClick={() => {
                localStorage.setItem(ONBOARDING_KEY, 'true');
                onComplete();
              }}
              className="w-full text-gray-500 hover:text-gray-700 text-sm mt-3"
            >
              Saltar introducción
            </button>
          )}
        </div>

        {/* Counter */}
        <p className="text-center text-sm text-gray-400 mt-4">
          {current + 1} de {cards.length}
        </p>
      </div>
    </div>
  );
}

export function shouldShowOnboarding() {
  return !localStorage.getItem(ONBOARDING_KEY);
}
