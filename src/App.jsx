import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/dashboard/DashboardLayout';
import AdminLayout from './components/admin/AdminLayout';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Onboarding from './pages/onboarding/Onboarding';
import JoinBusiness from './pages/public/JoinBusiness';
import JoinSuccess from './pages/public/JoinSuccess';
import About from './pages/About';
import Privacy from './pages/legal/Privacy';
import Terms from './pages/legal/Terms';
import Cookies from './pages/legal/Cookies';
import BusinessDashboard from './pages/business/BusinessDashboard';
import BusinessProfile from './pages/business/BusinessProfile';
import CardCustomization from './pages/business/CardCustomization';
import Programs from './pages/business/Programs';
import Rewards from './pages/business/Rewards';
import Promotions from './pages/business/Promotions';
import Notifications from './pages/business/Notifications';
import RegisterSale from './pages/business/RegisterSale';
import Customers from './pages/business/Customers';
import CustomerDetails from './pages/business/CustomerDetails';
import Transactions from './pages/business/Transactions';
import BusinessQR from './pages/business/BusinessQR';
import Billing from './pages/business/Billing';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBusinesses from './pages/admin/AdminBusinesses';
import AdminBusinessDetail from './pages/admin/AdminBusinessDetail';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCustomers from './pages/admin/AdminCustomers';

// Payment Pages
import PaymentReturn from './pages/payment/PaymentReturn';

// Placeholder component para páginas en desarrollo
function ComingSoon({ title }) {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600">Esta sección está en desarrollo</p>
    </div>
  );
}

// Dashboard router - Solo para BUSINESS
function DashboardRouter() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<BusinessDashboard />} />
        <Route path="/business" element={<BusinessProfile />} />
        <Route path="/business-qr" element={<BusinessQR />} />
        <Route path="/card-customization" element={<CardCustomization />} />
        <Route path="/register-sale" element={<RegisterSale />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/promotions" element={<Promotions />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/customers/:customerId" element={<CustomerDetails />} />
        <Route path="/billing" element={<Billing />} />
      </Routes>
    </DashboardLayout>
  );
}

// Admin router - Solo para SUPERADMIN
function AdminRouter() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/businesses" element={<AdminBusinesses />} />
        <Route path="/businesses/:id" element={<AdminBusinessDetail />} />
        <Route path="/users" element={<AdminUsers />} />
        <Route path="/customers" element={<AdminCustomers />} />
      </Routes>
    </AdminLayout>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/join/:businessQrCode" element={<JoinBusiness />} />
          <Route path="/join-success" element={<JoinSuccess />} />

          {/* Payment Return - público (viene de Flow) */}
          <Route path="/payment/return" element={<PaymentReturn />} />

          {/* Onboarding - protegida */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            }
          />

          {/* Dashboard - Solo para BUSINESS */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute allowedRoles={['BUSINESS']}>
                <DashboardRouter />
              </ProtectedRoute>
            }
          />

          {/* Admin - Solo para SUPERADMIN */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['SUPERADMIN']}>
                <AdminRouter />
              </ProtectedRoute>
            }
          />

          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
