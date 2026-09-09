import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-dark text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-wrap items-start justify-between gap-6">
          {/* Brand */}
          <div className="shrink-0">
            <Link to="/" className="inline-block mb-2">
              <img src="/logoSolo.png" alt="Market Design" className="h-7" />
            </Link>
            <p className="text-[11px] text-gray-500 max-w-[200px]">
              Diseños digitales que hacen crecer tus ideas.
            </p>
          </div>

          {/* Links row */}
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-xs">
            <div>
              <h4 className="text-white text-xs font-semibold mb-2">Explorar</h4>
              <ul className="space-y-1">
                <li><Link to="/catalogo" className="hover:text-brand-teal transition-colors">Catálogo</Link></li>
                <li><Link to="/catalogo?sort=popular" className="hover:text-brand-teal transition-colors">Más vendidos</Link></li>
                <li><Link to="/catalogo?sort=trending" className="hover:text-brand-teal transition-colors">Tendencia</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-xs font-semibold mb-2">Vendedores</h4>
              <ul className="space-y-1">
                <li><Link to="/registro" className="hover:text-brand-orange transition-colors">Vender diseños</Link></li>
                <li><Link to="/vendedor/panel" className="hover:text-brand-orange transition-colors">Mi panel</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-xs font-semibold mb-2">Legal</h4>
              <ul className="space-y-1">
                <li><Link to="/terminos" className="hover:text-brand-violet transition-colors">Términos</Link></li>
                <li><Link to="/privacidad" className="hover:text-brand-violet transition-colors">Privacidad</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-4 pt-3 text-[10px] text-center text-gray-600">
          © {new Date().getFullYear()} Market Design
        </div>
      </div>
    </footer>
  );
}
