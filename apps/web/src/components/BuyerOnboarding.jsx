import { Link } from 'react-router-dom';
import { Search, CreditCard, Mail, RefreshCw, Sparkles, X } from 'lucide-react';

const STEPS = [
  {
    icon: Search,
    iconClass: 'bg-brand-teal/10 text-brand-teal',
    title: 'Encontrá tu diseño',
    text: 'Explorá el catálogo y filtrá por categoría, técnica o precio.',
  },
  {
    icon: CreditCard,
    iconClass: 'bg-brand-violet/10 text-brand-violet',
    title: 'Comprá en un clic',
    text: 'Pagás una sola vez con Mercado Pago. Sin suscripciones.',
  },
  {
    icon: Mail,
    iconClass: 'bg-brand-orange/10 text-brand-orange',
    title: 'Recibí tu archivo',
    text: 'Te llega al mail un link de descarga del archivo en alta calidad.',
  },
  {
    icon: RefreshCw,
    iconClass: 'bg-brand-rose/10 text-brand-rose',
    title: 'Descargá cuando quieras',
    text: 'Volvé a bajarlo desde “Mis compras” las veces que necesites.',
  },
];

const storageKey = (userId) => `buyer_onboarding_done_${userId}`;

export function isBuyerOnboardingDone(userId) {
  return localStorage.getItem(storageKey(userId)) === 'true';
}

export default function BuyerOnboarding({ userId, onDismiss }) {
  const handleDismiss = () => {
    if (userId) localStorage.setItem(storageKey(userId), 'true');
    onDismiss();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-brand-teal/20 p-6 mb-8">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Sparkles size={18} className="text-brand-violet" />
            ¿Cómo funciona Market Design?
          </h3>
          <p className="text-sm text-gray-500 mt-1">Comprar un diseño es simple y rápido.</p>
        </div>
        <button
          onClick={handleDismiss}
          aria-label="Cerrar"
          className="text-gray-400 hover:text-gray-600 shrink-0"
        >
          <X size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={i} className="flex items-start gap-3">
              <div className={`p-2 rounded-lg shrink-0 ${step.iconClass}`}>
                <Icon size={18} />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  {i + 1}. {step.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1">{step.text}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        <Link
          to="/catalogo"
          onClick={handleDismiss}
          className="bg-dark text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-dark-light transition-colors"
        >
          Explorar diseños
        </Link>
        <button onClick={handleDismiss} className="text-sm text-gray-500 hover:text-gray-700">
          Ya lo entendí
        </button>
      </div>
    </div>
  );
}
