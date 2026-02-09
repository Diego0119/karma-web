import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';
import DashboardLayout from './components/dashboard/DashboardLayout';
import AdminLayout from './components/admin/AdminLayout';

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
  </div>
);

// Lazy loaded pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const VerifyEmailPending = lazy(() => import('./pages/auth/VerifyEmailPending'));
const VerifyEmail = lazy(() => import('./pages/auth/VerifyEmail'));
const Onboarding = lazy(() => import('./pages/onboarding/Onboarding'));
const JoinBusiness = lazy(() => import('./pages/public/JoinBusiness'));
const JoinSuccess = lazy(() => import('./pages/public/JoinSuccess'));
const MyPass = lazy(() => import('./pages/public/MyPass'));
const About = lazy(() => import('./pages/About'));
const Privacy = lazy(() => import('./pages/legal/Privacy'));
const Terms = lazy(() => import('./pages/legal/Terms'));
const Cookies = lazy(() => import('./pages/legal/Cookies'));

// Business pages
const BusinessDashboard = lazy(() => import('./pages/business/BusinessDashboard'));
const BusinessProfile = lazy(() => import('./pages/business/BusinessProfile'));
const CardCustomization = lazy(() => import('./pages/business/CardCustomization'));
const Programs = lazy(() => import('./pages/business/Programs'));
const Rewards = lazy(() => import('./pages/business/Rewards'));
const Notifications = lazy(() => import('./pages/business/Notifications'));
const RegisterSale = lazy(() => import('./pages/business/RegisterSale'));
const Customers = lazy(() => import('./pages/business/Customers'));
const CustomerDetails = lazy(() => import('./pages/business/CustomerDetails'));
const Transactions = lazy(() => import('./pages/business/Transactions'));
const BusinessQR = lazy(() => import('./pages/business/BusinessQR'));
const Billing = lazy(() => import('./pages/business/Billing'));

// Customer pages
const CustomerDashboard = lazy(() => import('./pages/customer/CustomerDashboard'));
const SetupPin = lazy(() => import('./pages/customer/SetupPin'));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminBusinesses = lazy(() => import('./pages/admin/AdminBusinesses'));
const AdminBusinessDetail = lazy(() => import('./pages/admin/AdminBusinessDetail'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers'));
const AdminExpiring = lazy(() => import('./pages/admin/AdminExpiring'));
const AdminTransactions = lazy(() => import('./pages/admin/AdminTransactions'));

// Payment pages
const PaymentReturn = lazy(() => import('./pages/payment/PaymentReturn'));

// Placeholder component para páginas en desarrollo
function ComingSoon({ title }) {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600">Esta sección está en desarrollo</p>
    </div>
  );
}

// Dashboard router - Para BUSINESS
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
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/customers/:customerId" element={<CustomerDetails />} />
        <Route path="/billing" element={<Billing />} />
      </Routes>
    </DashboardLayout>
  );
}

// Customer Dashboard router - Para CUSTOMER
function CustomerRouter() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<CustomerDashboard />} />
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
        <Route path="/expiring" element={<AdminExpiring />} />
        <Route path="/transactions" element={<AdminTransactions />} />
      </Routes>
    </AdminLayout>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email-pending" element={<VerifyEmailPending />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/join/:businessQrCode" element={<JoinBusiness />} />
          <Route path="/join-success" element={<JoinSuccess />} />
          <Route path="/mi-pase" element={<MyPass />} />
          <Route path="/mi-pase/:businessQrCode" element={<MyPass />} />

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

          {/* Customer Dashboard - Solo para CUSTOMER */}
          <Route
            path="/customer/*"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <CustomerRouter />
              </ProtectedRoute>
            }
          />

          {/* Setup PIN - Página bloqueante para CUSTOMER */}
          <Route
            path="/setup-pin"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <SetupPin />
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
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default App;
