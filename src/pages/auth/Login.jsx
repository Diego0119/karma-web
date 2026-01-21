import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, AlertCircle, ArrowLeft, TrendingUp, BarChart3, Users, CheckCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-3">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
              <span className="text-2xl font-bold text-gradient">Karma</span>
            </Link>
            <Link to="/register" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
              ¿Primera vez aquí? <span className="font-semibold">Prueba gratis</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Welcome back message */}
          <div className="hidden lg:block">
            <div className="sticky top-8">
              <div className="inline-flex items-center gap-2 bg-white border border-primary-200 rounded-full px-4 py-2 mb-6 shadow-sm">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-semibold text-green-700">Bienvenido de vuelta</span>
              </div>

              <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                Sigue haciendo crecer{' '}
                <span className="text-gradient">tu negocio</span>
              </h1>

              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                Accede a tu dashboard para ver tus métricas, gestionar clientes y hacer crecer tu programa de fidelización.
              </p>

              {/* Quick access features */}
              <div className="space-y-4 mb-10">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Analytics en tiempo real</h3>
                    <p className="text-gray-600 text-sm">Ve cómo está funcionando tu programa hoy</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Gestiona tus clientes</h3>
                    <p className="text-gray-600 text-sm">Suma puntos, canjea recompensas y más</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Aumenta tus ventas</h3>
                    <p className="text-gray-600 text-sm">Herramientas para fidelizar y crecer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div>
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100">
              {/* Form Header */}
              <div className="text-center mb-8">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 mb-4">
                  <LogIn className="w-10 h-10 text-primary-600" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Inicia sesión</h2>
                <p className="text-gray-600">
                  Accede a tu cuenta de negocio
                </p>
              </div>

              {error && (
                <div className="mb-6 bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-gray-900 placeholder-gray-400"
                    placeholder="tu@email.com"
                    autoFocus
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                      Contraseña
                    </label>
                    <Link to="/forgot-password" className="text-xs text-primary-600 hover:text-primary-700 font-semibold">
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-gray-900"
                    placeholder="••••••••"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-primary-600 to-accent-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        Iniciando sesión...
                      </>
                    ) : (
                      <>
                        <LogIn className="w-5 h-5" />
                        Acceder a mi cuenta
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-4 text-center border-t border-gray-200">
                  <p className="text-gray-600">
                    ¿Primera vez en Karma?{' '}
                    <Link to="/register" className="text-primary-600 hover:text-primary-700 font-bold">
                      Prueba gratis 14 días
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
