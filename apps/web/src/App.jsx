import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import EmailVerificationBanner from './components/EmailVerificationBanner.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import HomePage from './pages/HomePage.jsx';
import CatalogPage from './pages/CatalogPage.jsx';
import DesignDetailPage from './pages/DesignDetailPage.jsx';
import SellerPage from './pages/SellerPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import CheckoutResultPage from './pages/CheckoutResultPage.jsx';
import PurchaseDownloadPage from './pages/PurchaseDownloadPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import SellerDashboard from './pages/SellerDashboard.jsx';
import BuyerDashboard from './pages/BuyerDashboard.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import UploadDesignPage from './pages/upload/UploadDesignPage.jsx';
import EditDesignPage from './pages/upload/EditDesignPage.jsx';
import ActivateSellerPage from './pages/upload/ActivateSellerPage.jsx';
import TermsPage from './pages/TermsPage.jsx';
import PrivacyPage from './pages/PrivacyPage.jsx';
import FavoritesPage from './pages/FavoritesPage.jsx';
import VerifyEmailPage from './pages/VerifyEmailPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:bg-dark focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
      >
        Saltar al contenido
      </a>
      <Navbar />
      <EmailVerificationBanner />
      <main id="main-content" className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogo" element={<CatalogPage />} />
          <Route path="/diseno/:id" element={<DesignDetailPage />} />
          <Route path="/vendedor/:id" element={<SellerPage />} />
          <Route path="/checkout/success" element={<CheckoutResultPage status="success" />} />
          <Route path="/checkout/failure" element={<CheckoutResultPage status="failure" />} />
          <Route path="/checkout/pending" element={<CheckoutResultPage status="pending" />} />
          <Route path="/checkout/:id" element={<CheckoutPage />} />
          <Route path="/compra/:token" element={<PurchaseDownloadPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route
            path="/vendedor/panel"
            element={
              <ProtectedRoute>
                <SellerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendedor/panel/subir"
            element={
              <ProtectedRoute>
                <UploadDesignPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendedor/panel/editar/:id"
            element={
              <ProtectedRoute>
                <EditDesignPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendedor/activar"
            element={
              <ProtectedRoute>
                <ActivateSellerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/comprador/panel"
            element={
              <ProtectedRoute>
                <BuyerDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/terminos" element={<TermsPage />} />
          <Route path="/privacidad" element={<PrivacyPage />} />
          <Route path="/favoritos" element={<FavoritesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
