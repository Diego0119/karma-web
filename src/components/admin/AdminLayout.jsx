import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Menu,
  X,
  LogOut,
  Home,
  Users,
  Building2,
  UserCircle,
  AlertCircle,
  ShieldCheck,
  CreditCard
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigation = [
    {
      section: 'General',
      items: [
        { name: 'Dashboard', href: '/admin', icon: Home }
      ]
    },
    {
      section: 'Gestión',
      items: [
        { name: 'Negocios', href: '/admin/businesses', icon: Building2 },
        { name: 'Usuarios', href: '/admin/users', icon: Users },
        { name: 'Clientes', href: '/admin/customers', icon: UserCircle }
      ]
    },
    {
      section: 'Monitoreo',
      items: [
        { name: 'Transacciones', href: '/admin/transactions', icon: CreditCard },
        { name: 'Por Vencer', href: '/admin/expiring', icon: AlertCircle }
      ]
    }
  ];

  const isActive = (href) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-purple-700 to-indigo-800 border-b border-purple-900 fixed w-full z-30 shadow-lg">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="mr-4 text-white hover:text-purple-200 lg:hidden"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <Link to="/admin" className="flex items-center gap-2">
                <ShieldCheck className="w-8 h-8 text-white" />
                <div>
                  <span className="text-xl font-bold text-white">Karma Admin</span>
                  <p className="text-xs text-purple-200">Panel de Administración</p>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white">{user?.email}</p>
                <p className="text-xs text-purple-200">SUPERADMIN</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
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
        {/* Sidebar móvil overlay */}
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
                {navigation.map((section) => (
                  <div key={section.section}>
                    <h3 className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {section.section}
                    </h3>
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
                                  ? 'bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 font-semibold'
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

            {/* Admin Badge */}
            <div className="border-t border-gray-200 p-4">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Acceso Total</p>
                    <p className="text-xs text-gray-600">Panel de Superadmin</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
