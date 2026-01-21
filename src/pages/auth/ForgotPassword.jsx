import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, AlertCircle, ArrowLeft, CheckCircle, Clock } from 'lucide-react';
import api from '../../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/request-password-reset', { email });

      // Siempre mostramos el mensaje de éxito por seguridad
      // (no revelamos si el email existe o no)
      setSubmitted(true);
    } catch (err) {
      // Si el error es 500, probablemente es un error del servidor (email no configurado)
      if (err.response?.status === 500) {
        setError('Error del servidor al procesar la solicitud. Por favor contacta al administrador o intenta más tarde.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Hubo un error al procesar tu solicitud. Por favor intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100 text-center">
            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              Revisa tu correo
            </h2>

            <p className="text-gray-600 mb-6 leading-relaxed">
              Si tu correo está registrado en nuestra plataforma, recibirás un enlace para restablecer tu contraseña.
            </p>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">El enlace expira en 1 hora</p>
                  <p className="text-blue-700">Si no recibes el correo, revisa tu carpeta de spam.</p>
                </div>
              </div>
            </div>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/login" className="flex items-center gap-3">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
              <span className="text-2xl font-bold text-gradient">Karma</span>
            </Link>
            <Link to="/register" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
              ¿No tienes cuenta? <span className="font-semibold">Regístrate</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Information */}
          <div className="hidden lg:block">
            <div className="sticky top-8">
              <div className="inline-flex items-center gap-2 bg-white border border-primary-200 rounded-full px-4 py-2 mb-6 shadow-sm">
                <Mail className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-semibold text-primary-700">Recuperación de contraseña</span>
              </div>

              <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                ¿Olvidaste tu{' '}
                <span className="text-gradient">contraseña?</span>
              </h1>

              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                No te preocupes, te enviaremos un enlace seguro para que puedas crear una nueva contraseña.
              </p>

              {/* Process steps */}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Ingresa tu correo</h3>
                    <p className="text-gray-600 text-sm">El que usaste al registrarte</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                    <span className="text-purple-600 font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Revisa tu correo</h3>
                    <p className="text-gray-600 text-sm">Te enviaremos un enlace seguro</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                    <span className="text-green-600 font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Crea tu nueva contraseña</h3>
                    <p className="text-gray-600 text-sm">Y vuelve a acceder a tu cuenta</p>
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
                  <Mail className="w-10 h-10 text-primary-600" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Recuperar contraseña</h2>
                <p className="text-gray-600">
                  Ingresa tu correo electrónico
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
                  <p className="mt-1.5 text-xs text-gray-500">
                    Te enviaremos un enlace para restablecer tu contraseña
                  </p>
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
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Mail className="w-5 h-5" />
                        Enviar enlace de recuperación
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-4 text-center border-t border-gray-200">
                  <p className="text-gray-600">
                    ¿Recordaste tu contraseña?{' '}
                    <Link to="/login" className="text-primary-600 hover:text-primary-700 font-bold">
                      Inicia sesión
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
