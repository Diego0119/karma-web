import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, ArrowRight, Mail } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(3);

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('Token de verificación no proporcionado');
      return;
    }

    verifyEmail();
  }, [token]);

  // Auto-redirect después de verificación exitosa
  useEffect(() => {
    if (status === 'success') {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate('/onboarding');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [status, navigate]);

  const verifyEmail = async () => {
    try {
      await api.post('/auth/verify-email', { token });
      setStatus('success');

      // Refrescar estado de autenticación
      await checkAuth();
    } catch (error) {
      setStatus('error');
      const message = error.response?.data?.message || 'Error al verificar el email';

      if (message.includes('expired') || message.includes('expirado')) {
        setErrorMessage('El enlace de verificación ha expirado. Por favor solicita uno nuevo.');
      } else if (message.includes('invalid') || message.includes('inválido')) {
        setErrorMessage('El enlace de verificación no es válido.');
      } else if (message.includes('already') || message.includes('verificado')) {
        setErrorMessage('Este email ya ha sido verificado anteriormente.');
        setStatus('already_verified');
      } else {
        setErrorMessage(message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Loading state */}
          {status === 'loading' && (
            <>
              <div className="inline-flex p-6 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full mb-6">
                <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                Verificando tu email...
              </h1>
              <p className="text-gray-600">
                Por favor espera mientras confirmamos tu cuenta.
              </p>
            </>
          )}

          {/* Success state */}
          {status === 'success' && (
            <>
              <div className="inline-flex p-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                Email verificado
              </h1>
              <p className="text-gray-600 mb-4">
                Tu cuenta ha sido verificada exitosamente. Ahora puedes continuar con la configuración de tu negocio.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                <p className="text-sm text-blue-800">
                  Redirigiendo en <strong>{countdown}</strong> segundos...
                </p>
              </div>
              <Link
                to="/onboarding"
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                Continuar ahora
                <ArrowRight className="w-5 h-5" />
              </Link>
            </>
          )}

          {/* Already verified state */}
          {status === 'already_verified' && (
            <>
              <div className="inline-flex p-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mb-6">
                <Mail className="w-12 h-12 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                Email ya verificado
              </h1>
              <p className="text-gray-600 mb-6">
                {errorMessage}
              </p>
              <Link
                to="/login"
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                Iniciar sesión
                <ArrowRight className="w-5 h-5" />
              </Link>
            </>
          )}

          {/* Error state */}
          {status === 'error' && (
            <>
              <div className="inline-flex p-6 bg-gradient-to-br from-red-100 to-orange-100 rounded-full mb-6">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                Error de verificación
              </h1>
              <p className="text-gray-600 mb-6">
                {errorMessage}
              </p>
              <div className="space-y-3">
                <Link
                  to="/verify-email-pending"
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  Solicitar nuevo enlace
                </Link>
                <Link
                  to="/login"
                  className="w-full inline-flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                >
                  Volver al inicio de sesión
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
