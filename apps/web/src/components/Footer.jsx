import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-dark text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-3">
              <img src="/logoSolo.png" alt="Market Design" className="h-8" />
            </Link>
            <p className="text-xs text-gray-500">
              Diseños digitales que hacen crecer tus ideas.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Explorar</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link to="/catalogo" className="hover:text-brand-teal transition-colors">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link to="/catalogo?sort=popular" className="hover:text-brand-teal transition-colors">
                  Más vendidos
                </Link>
              </li>
              <li>
                <Link to="/catalogo?sort=trending" className="hover:text-brand-teal transition-colors">
                  Tendencia
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Vendedores</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link to="/registro" className="hover:text-brand-orange transition-colors">
                  Vender diseños
                </Link>
              </li>
              <li>
                <Link to="/vendedor/panel" className="hover:text-brand-orange transition-colors">
                  Mi panel
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Legal</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link to="/terminos" className="hover:text-brand-violet transition-colors">
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link to="/privacidad" className="hover:text-brand-violet transition-colors">
                  Política de privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 pt-4 text-xs text-center text-gray-500">
          © {new Date().getFullYear()} Market Design
        </div>
      </div>
    </footer>
  );
}
