import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Benefits from '../components/Benefits';
import Pricing from '../components/Pricing';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import { Menu, X, LogIn, UserPlus, LogOut } from 'lucide-react';
import { useState } from 'react';

function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/">
              <span className="text-2xl font-bold text-gradient">Karma</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-primary-600 transition-colors">
                Características
              </a>
              <a href="#how-it-works" className="text-gray-700 hover:text-primary-600 transition-colors">
                Cómo funciona
              </a>
              <a href="#benefits" className="text-gray-700 hover:text-primary-600 transition-colors">
                Beneficios
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-primary-600 transition-colors">
                Precio
              </a>
              {isAuthenticated ? (
                user?.role === 'BUSINESS' ? (
                  <Link
                    to="/dashboard"
                    className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-2 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
                  >
                    Dashboard
                  </Link>
                ) : user?.role === 'SUPERADMIN' ? (
                  <Link
                    to="/admin"
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
                  >
                    Admin Panel
                  </Link>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-2 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar sesión
                  </button>
                )
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    Iniciar sesión
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-2 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
                  >
                    <UserPlus className="w-4 h-4" />
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#features" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
              Características
            </a>
            <a href="#how-it-works" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
              Cómo funciona
            </a>
            <a href="#benefits" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
              Beneficios
            </a>
            <a href="#pricing" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
              Precio
            </a>
            {isAuthenticated ? (
              user?.role === 'BUSINESS' ? (
                <Link
                  to="/dashboard"
                  className="block w-full text-left bg-gradient-to-r from-primary-600 to-accent-600 text-white px-3 py-2 rounded-md"
                >
                  Dashboard
                </Link>
              ) : user?.role === 'SUPERADMIN' ? (
                <Link
                  to="/admin"
                  className="block w-full text-left bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-2 rounded-md"
                >
                  Admin Panel
                </Link>
              ) : (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full text-left bg-gradient-to-r from-primary-600 to-accent-600 text-white px-3 py-2 rounded-md"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </button>
              )
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  className="block w-full text-left bg-gradient-to-r from-primary-600 to-accent-600 text-white px-3 py-2 rounded-md"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Benefits />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}
