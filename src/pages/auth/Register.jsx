import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Store, AlertCircle, CheckCircle, TrendingUp, Users, Zap, ArrowLeft, Sparkles, Clock, Shield } from 'lucide-react';

export default function Register() {
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!businessName.trim()) {
      setError('El nombre del negocio es requerido');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    const result = await register(email, password, 'BUSINESS', businessName.trim());

    if (result.success) {
      navigate('/onboarding');
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
            <Link to="/login" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
              ¿Ya tienes cuenta? <span className="font-semibold">Inicia sesión</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Benefits */}
          <div className="hidden lg:block">
            <div className="sticky top-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white border border-primary-200 rounded-full px-4 py-2 mb-6 shadow-sm">
                <Sparkles className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-semibold text-primary-700">Únete</span>
              </div>

              <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                Empieza a fidelizar en{' '}
                <span className="text-gradient">5 minutos</span>
              </h1>

              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                Configura tu programa de fidelización completo, sin complicaciones técnicas.
                Te guiamos paso a paso.
              </p>

              {/* What you get */}
              <div className="space-y-4 mb-10">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">14 días gratis completos</h3>
                    <p className="text-gray-600 text-sm">Prueba todas las funciones sin tarjeta de crédito</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Configuración en 5 minutos</h3>
                    <p className="text-gray-600 text-sm">Te ayudamos a personalizar tu tarjeta y programa</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Soporte dedicado en español</h3>
                    <p className="text-gray-600 text-sm">Estamos aquí para ayudarte cuando lo necesites</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div>
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100">
              {/* Form Header */}
              <div className="text-center mb-8">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 mb-4">
                  <Store className="w-10 h-10 text-primary-600" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Crea tu cuenta</h2>
                <p className="text-gray-600">
                  Comienza tu prueba gratuita de 14 días
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
                  <label htmlFor="businessName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre de tu negocio *
                  </label>
                  <input
                    id="businessName"
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-gray-900 placeholder-gray-400"
                    placeholder="Ej: Café Central"
                  />
                  <p className="mt-1.5 text-xs text-gray-500">Este es el nombre que verán tus clientes</p>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Tu correo electrónico *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-gray-900 placeholder-gray-400"
                    placeholder="tu@email.com"
                  />
                  <p className="mt-1.5 text-xs text-gray-500">Usaremos este email para comunicarnos contigo</p>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Crea una contraseña *
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-gray-900"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirma tu contraseña *
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-gray-900"
                    placeholder="Repite la contraseña"
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
                        Creando tu cuenta...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Comenzar mi prueba gratis
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Shield className="w-4 h-4" />
                    <span>Sin tarjeta de crédito • Cancela cuando quieras</span>
                  </div>
                </div>
              </form>
            </div>

            {/* Mobile testimonial */}
            <div className="lg:hidden mt-6 bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-6 border border-primary-200">
              <p className="text-sm text-gray-700 italic mb-3">
                "En 2 meses aumentamos un 35% las ventas recurrentes. Los clientes aman la simplicidad."
              </p>
              <p className="text-xs font-semibold text-gray-900">- María González, Cafetería Central</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
