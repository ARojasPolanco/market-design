import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Mail } from 'lucide-react';

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-dark text-white flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl text-center">
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

        <p className="text-lg text-gray-300 leading-relaxed mb-8">
          Market Design es el marketplace argentino donde los diseñadores venden sus diseños
          digitales (estampados, sublimados y papelería) y los compradores los reciben al instante
          por email.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/beta-vendedores"
            className="inline-flex items-center justify-center gap-2 bg-brand-teal text-dark font-bold px-7 py-3.5 rounded-xl hover:bg-brand-teal-dark transition-colors"
          >
            Quiero vender mis diseños <ArrowRight size={18} />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 border border-white/30 px-7 py-3.5 rounded-xl font-medium hover:bg-white/10 transition-colors"
          >
            Iniciar sesión
          </Link>
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
