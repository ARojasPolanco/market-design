import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block mb-3">
              <img src="/logoSolo.png" alt="Market Design" className="h-8" />
            </Link>
            <p className="text-xs text-gray-400 max-w-[200px]">
              Diseños digitales que hacen crecer tus ideas.
            </p>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2 italic">¿Sos diseñador?</h2>
            <p className="text-gray-400 text-xs mb-4 max-w-xs mx-auto">
              Subí tus diseños y empezá a vender. Cobramos una comisión solo cuando vendés.
            </p>
            <Link
              to="/registro"
              className="bg-brand-orange text-dark px-6 py-2 rounded-lg font-semibold hover:bg-brand-orange-light transition-colors inline-flex items-center gap-2 text-sm"
            >
              Comenzar a vender <ArrowRight size={16} />
            </Link>
          </div>

          {/* Links */}
          <div className="flex gap-8 justify-end text-xs">
            <div>
              <h4 className="text-white font-semibold mb-2">Explorar</h4>
              <ul className="space-y-1 text-gray-400">
                <li><Link to="/catalogo" className="hover:text-brand-teal transition-colors">Catálogo</Link></li>
                <li><Link to="/catalogo?sort=popular" className="hover:text-brand-teal transition-colors">Más vendidos</Link></li>
                <li><Link to="/catalogo?sort=trending" className="hover:text-brand-teal transition-colors">Tendencia</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Legal</h4>
              <ul className="space-y-1 text-gray-400">
                <li><Link to="/terminos" className="hover:text-brand-violet transition-colors">Términos</Link></li>
                <li><Link to="/privacidad" className="hover:text-brand-violet transition-colors">Privacidad</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 pt-4 text-[10px] text-center text-gray-600">
          © {new Date().getFullYear()} Market Design
        </div>
      </div>
    </footer>
  );
}
