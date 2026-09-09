import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-dark text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <img src="/logoSolo.png" alt="Market Design" className="h-12" />
            </Link>
            <p className="text-sm">
              Diseños digitales que hacen crecer tus ideas.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Explorar</h4>
            <ul className="space-y-2 text-sm">
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
            <h4 className="text-white font-semibold mb-4">Vendedores</h4>
            <ul className="space-y-2 text-sm">
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
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
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

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          © {new Date().getFullYear()} Market Design — Diseños digitales que hacen crecer tus ideas.
        </div>
      </div>
    </footer>
  );
}
