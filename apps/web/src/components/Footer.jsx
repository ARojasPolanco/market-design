import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Marketplace</h3>
            <p className="text-sm">
              El marketplace de diseños digitales para estampadores, sublimadores y papelería.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Explorar</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/catalogo" className="hover:text-white transition-colors">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link to="/catalogo?sort=popular" className="hover:text-white transition-colors">
                  Más vendidos
                </Link>
              </li>
              <li>
                <Link to="/catalogo?sort=trending" className="hover:text-white transition-colors">
                  Tendencia
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Vendedores</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/registro" className="hover:text-white transition-colors">
                  Vender diseños
                </Link>
              </li>
              <li>
                <Link to="/vendedor/panel" className="hover:text-white transition-colors">
                  Mi panel
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terminos" className="hover:text-white transition-colors">
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link to="/privacidad" className="hover:text-white transition-colors">
                  Política de privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          © {new Date().getFullYear()} Marketplace de Diseños. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
