import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Mail,
  Palette,
  ShoppingBag,
  Zap,
  CreditCard,
  Download,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Palette,
    title: 'Para diseñadores',
    text: 'Subís tus diseños (estampados, sublimados, papelería) y cobrás por cada venta, sin costos fijos.',
  },
  {
    icon: ShoppingBag,
    title: 'Para compradores',
    text: 'Encontrás diseños digitales en alta calidad, listos para imprimir y usar en tus productos.',
  },
  {
    icon: CreditCard,
    title: 'Pago con Mercado Pago',
    text: 'El comprador paga de forma segura y el vendedor cobra directo a su cuenta.',
  },
  {
    icon: Download,
    title: 'Entrega automática',
    text: 'Al instante de la compra, el comprador recibe el archivo por email. Sin esperas ni envíos.',
  },
];

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-dark text-white flex items-center justify-center px-4 py-16">
      <div className="max-w-3xl text-center">
        <div className="inline-block bg-white rounded-2xl px-5 py-3 mb-8">
          <img src="/marketDesignLogo.png" alt="Market Design" className="h-10 sm:h-12 block" />
        </div>

        <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
          <Sparkles size={15} className="text-brand-teal" /> Estamos muy cerca de arrancar
        </span>

        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-5">
          Pronto vas a poder comprar y vender diseños en{' '}
          <span className="text-brand-teal">Market Design</span>
        </h1>

        <p className="text-lg text-gray-300 leading-relaxed mb-4">
          Market Design es el marketplace argentino de <strong>diseños digitales</strong>: un
          espacio donde los creadores publican sus diseños y los vendedores de productos los
          adquieren para estampar, sublimar o imprimir.
        </p>
        <p className="text-base text-gray-400 leading-relaxed mb-10">
          Estamos cargando el catálogo junto a los primeros vendedores para que, apenas abramos,
          tengas diseños de calidad listos para usar. Falta poco.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 text-left mb-10">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="bg-white/5 border border-white/10 rounded-xl p-5">
              <div className="w-10 h-10 rounded-lg bg-brand-teal flex items-center justify-center mb-3">
                <feature.icon size={20} className="text-dark" />
              </div>
              <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{feature.text}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4">
          <Link
            to="/beta-vendedores"
            className="inline-flex items-center justify-center gap-2 bg-brand-teal text-dark font-bold px-8 py-3.5 rounded-xl hover:bg-brand-teal-dark transition-colors"
          >
            Quiero vender mis diseños <ArrowRight size={18} />
          </Link>
          <span className="inline-flex items-center gap-2 text-sm text-gray-400">
            <Zap size={15} className="text-brand-teal" /> Sumate a la beta y publicá tu primer
            diseño
          </span>
        </div>

        <p className="mt-10 text-sm text-gray-400 flex items-center justify-center gap-2">
          <Mail size={15} className="text-brand-teal" />
          ¿Consultas?{' '}
          <a href="mailto:soporte@marketdesign.shop" className="text-brand-teal hover:underline">
            soporte@marketdesign.shop
          </a>
        </p>
      </div>
    </div>
  );
}
