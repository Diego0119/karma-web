import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SubscriptionBanner from './SubscriptionBanner';
import {
  Menu,
  X,
  LogOut,
  Home,
  Store,
  Gift,
  Tag,
  Users,
  BarChart3,
  Settings,
  CreditCard,
  Award,
  ShoppingCart,
  Bell,
  ChevronUp,
  User,
  FileText,
  Receipt
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const businessNavigation = [
    {
      section: 'General',
      items: [
        { name: 'Inicio', href: '/dashboard', icon: Home }
      ]
    },
    {
      section: 'Operaciones',
      items: [
        { name: 'Registrar Venta', href: '/dashboard/register-sale', icon: ShoppingCart },
        { name: 'QR de Inscripción', href: '/dashboard/business-qr', icon: CreditCard }
      ]
    },
    {
      section: 'Programa de Lealtad',
      items: [
        { name: 'Programas', href: '/dashboard/programs', icon: Award },
        { name: 'Recompensas', href: '/dashboard/rewards', icon: Gift },
        { name: 'Promociones', href: '/dashboard/promotions', icon: Tag },
        { name: 'Personalización', href: '/dashboard/card-customization', icon: CreditCard }
      ]
    },
    {
      section: 'Análisis',
      items: [
        { name: 'Clientes', href: '/dashboard/customers', icon: Users },
        { name: 'Transacciones', href: '/dashboard/transactions', icon: Receipt }
      ]
    },
    {
      section: 'Comunicación',
      items: [
        { name: 'Notificaciones', href: '/dashboard/notifications', icon: Bell }
      ]
    }
  ];

  const customerNavigation = [
    {
      section: 'General',
      items: [
        { name: 'Inicio', href: '/customer', icon: Home }
      ]
    },
    {
      section: 'Mi Programa',
      items: [
        { name: 'Mis Tarjetas', href: '/customer/cards', icon: CreditCard },
        { name: 'Mis Puntos', href: '/customer/points', icon: Award },
        { name: 'Recompensas', href: '/customer/my-rewards', icon: Gift },
        { name: 'Promociones', href: '/customer/promotions', icon: Tag }
      ]
    },
    {
      section: 'Descubrir',
      items: [
        { name: 'Negocios', href: '/customer/businesses', icon: Store }
      ]
    }
  ];

  const navigation = user?.role === 'BUSINESS' ? businessNavigation : customerNavigation;

  const isActive = (href) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 fixed w-full z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="mr-4 text-gray-500 hover:text-gray-700 lg:hidden"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <Link to="/dashboard" className="flex items-center">
                <span className="text-2xl font-bold text-gradient">Karma</span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                <p className="text-xs text-gray-500">
                  {user?.role === 'BUSINESS' ? 'Negocio' : 'Cliente'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors"
              >
                <LogOut size={20} />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div className="flex pt-16">
        {/* Sidebar móvil */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={`fixed inset-y-0 left-0 z-20 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 pt-16 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="h-full flex flex-col">
            {/* Navigation Menu */}
            <nav className="flex-1 overflow-y-auto px-4 py-6">
              <div className="space-y-6">
                {navigation.map((section, sectionIdx) => (
                  <div key={section.section}>
                    {/* Título de la sección */}
                    <h3 className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {section.section}
                    </h3>

                    {/* Items de la sección */}
                    <ul className="space-y-1">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        return (
                          <li key={item.name}>
                            <Link
                              to={item.href}
                              onClick={() => setSidebarOpen(false)}
                              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                                active
                                  ? 'bg-gradient-to-r from-primary-50 to-accent-50 text-primary-700 font-semibold'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <Icon size={20} />
                              {item.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </nav>

            {/* Account Menu */}
            <div className="border-t border-gray-200 p-4">
              <div className="relative">
                <button
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-white font-semibold text-sm">
                    {user?.email?.[0].toUpperCase()}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user?.email}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.role === 'BUSINESS' ? 'Negocio' : 'Cliente'}
                    </p>
                  </div>
                  <ChevronUp
                    size={20}
                    className={`text-gray-400 transition-transform ${
                      accountMenuOpen ? '' : 'rotate-180'
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {accountMenuOpen && (
                  <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                    {user?.role === 'BUSINESS' && (
                      <Link
                        to="/dashboard/business"
                        onClick={() => {
                          setAccountMenuOpen(false);
                          setSidebarOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <Settings size={18} className="text-gray-600" />
                        <span className="text-sm text-gray-700">Configuración de cuenta</span>
                      </Link>
                    )}
                                        {user?.role === 'BUSINESS' && (
                      <Link
                        to="/dashboard/billing"
                        onClick={() => {
                          setAccountMenuOpen(false);
                          setSidebarOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <FileText size={18} className="text-gray-600" />
                        <span className="text-sm text-gray-700">Facturación</span>
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setAccountMenuOpen(false);
                        setSidebarOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors border-t border-gray-100"
                    >
                      <LogOut size={18} className="text-red-600" />
                      <span className="text-sm text-red-600 font-medium">Cerrar sesión</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Banner de subscripción - solo para BUSINESS */}
            {user?.role === 'BUSINESS' && <SubscriptionBanner />}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
