import { Link } from 'react-router-dom';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const TYPES = {
  success: {
    icon: CheckCircle,
    iconColor: 'text-green-600',
    bg: 'bg-green-100',
    title: '¡Pago aprobado!',
    text: 'Tu compra se confirmó correctamente. Te enviamos el archivo por mail y ya está disponible en "Mis compras".',
  },
  failure: {
    icon: XCircle,
    iconColor: 'text-red-500',
    bg: 'bg-red-100',
    title: 'El pago no se completó',
    text: 'No pudimos procesar el pago. Podés intentar de nuevo desde el diseño.',
  },
  pending: {
    icon: Clock,
    iconColor: 'text-yellow-500',
    bg: 'bg-yellow-100',
    title: 'Pago pendiente',
    text: 'Tu pago quedó pendiente de acreditación. Cuando se confirme, vas a recibir el archivo por mail.',
  },
};

export default function CheckoutResultPage({ status = 'pending' }) {
  const cfg = TYPES[status] || TYPES.pending;
  const Icon = cfg.icon;

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8 text-center">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${cfg.bg}`}>
          <Icon size={32} className={cfg.iconColor} />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">{cfg.title}</h1>
        <p className="text-sm text-gray-500 mb-8">{cfg.text}</p>
        <div className="flex flex-col gap-3">
          <Link
            to="/comprador/panel"
            className="inline-flex items-center justify-center w-full bg-dark text-white px-6 py-3 rounded-lg font-medium hover:bg-dark-light transition-colors"
          >
            Ir a Mis compras
          </Link>
          <Link to="/catalogo" className="text-sm text-brand-teal hover:underline">
            Seguir explorando
          </Link>
        </div>
      </div>
    </div>
  );
}
