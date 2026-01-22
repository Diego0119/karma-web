import { useState } from 'react';
import { Mail, RefreshCw, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function VerifyEmailPending() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleResendEmail = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await api.post('/auth/resend-verification');
      setMessage({
        type: 'success',
        text: 'Email de verificación reenviado. Revisa tu bandeja de entrada.'
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al reenviar el email';
      setMessage({
        type: 'error',
        text: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Icon */}
          <div className="inline-flex p-6 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full mb-6">
            <Mail className="w-12 h-12 text-primary-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Verifica tu email
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-6">
            Te hemos enviado un correo de verificación. Por favor revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.
          </p>

          {/* Info box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-blue-800">
              <strong>No olvides revisar:</strong>
            </p>
            <ul className="text-sm text-blue-700 mt-2 space-y-1">
              <li>• Tu carpeta de spam o correo no deseado</li>
              <li>• La pestaña de promociones (Gmail)</li>
              <li>• Que el email esté correctamente escrito</li>
            </ul>
          </div>

          {/* Message */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="text-sm">{message.text}</span>
            </div>
          )}

          {/* Resend button */}
          <button
            onClick={handleResendEmail}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Reenviando...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                Reenviar email de verificación
              </>
            )}
          </button>

          {/* Back to login */}
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mt-6 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio de sesión
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Problemas con la verificación?{' '}
          <a href="mailto:soporte@karma.cl" className="text-primary-600 hover:underline">
            Contacta soporte
          </a>
        </p>
      </div>
    </div>
  );
}
