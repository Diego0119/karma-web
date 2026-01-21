import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, AlertCircle, ArrowLeft, CheckCircle, Shield } from 'lucide-react';
import api from '../../services/api';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (!tokenFromUrl) {
      setError('Token de recuperación no válido. Por favor solicita un nuevo enlace.');
    } else {
      setToken(tokenFromUrl);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Token de recuperación no válido');
      return;
    }

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/reset-password', {
        token,
        newPassword,
      });

      setSuccess(true);

      // Redirigir a login después de 3 segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Hubo un error al restablecer tu contraseña. El enlace puede haber expirado.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100 text-center">
            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              ¡Contraseña actualizada!
            </h2>

            <p className="text-gray-600 mb-6 leading-relaxed">
              Tu contraseña ha sido cambiada exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña.
            </p>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-blue-800">
                Serás redirigido al inicio de sesión en unos segundos...
              </p>
            </div>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
            >
              Ir al inicio de sesión
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
                <Shield className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-semibold text-primary-700">Seguro y protegido</span>
              </div>

              <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                Crea tu{' '}
                <span className="text-gradient">nueva contraseña</span>
              </h1>

              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                Elige una contraseña segura que no hayas usado antes. Asegúrate de recordarla.
              </p>

              {/* Security tips */}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Al menos 6 caracteres</h3>
                    <p className="text-gray-600 text-sm">Mientras más larga, más segura</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Usa letras y números</h3>
                    <p className="text-gray-600 text-sm">Combina mayúsculas, minúsculas y números</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Evita contraseñas comunes</h3>
                    <p className="text-gray-600 text-sm">No uses 123456, password, etc.</p>
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
                  <Lock className="w-10 h-10 text-primary-600" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Restablecer contraseña</h2>
                <p className="text-gray-600">
                  Ingresa tu nueva contraseña
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
                  <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    Nueva contraseña
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-gray-900"
                    placeholder="Mínimo 6 caracteres"
                    autoFocus
                    disabled={!token}
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirma tu contraseña
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-gray-900"
                    placeholder="Repite la contraseña"
                    disabled={!token}
                  />
                  <p className="mt-1.5 text-xs text-gray-500">
                    Asegúrate de que ambas contraseñas coincidan
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading || !token}
                    className="w-full bg-gradient-to-r from-primary-600 to-accent-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        Cambiando contraseña...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        Cambiar contraseña
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

            {/* Token expiration notice */}
            <div className="mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
              <p className="text-sm text-yellow-800 text-center">
                <span className="font-semibold">Nota:</span> Este enlace expira en 1 hora. Si ha expirado, solicita uno nuevo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
