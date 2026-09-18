import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import HomePage from './pages/HomePage.jsx';
import CatalogPage from './pages/CatalogPage.jsx';
import DesignDetailPage from './pages/DesignDetailPage.jsx';
import SellerPage from './pages/SellerPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import SellerDashboard from './pages/SellerDashboard.jsx';
import BuyerDashboard from './pages/BuyerDashboard.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import UploadDesignPage from './pages/upload/UploadDesignPage.jsx';
import ActivateSellerPage from './pages/upload/ActivateSellerPage.jsx';
import RankDemoPage from './pages/RankDemoPage.jsx';
import TermsPage from './pages/TermsPage.jsx';
import PrivacyPage from './pages/PrivacyPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogo" element={<CatalogPage />} />
          <Route path="/diseno/:id" element={<DesignDetailPage />} />
          <Route path="/vendedor/:id" element={<SellerPage />} />
          <Route path="/checkout/:id" element={<CheckoutPage />} />
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
          <Route path="/demo/rangos" element={<RankDemoPage />} />
          <Route path="/terminos" element={<TermsPage />} />
          <Route path="/privacidad" element={<PrivacyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
