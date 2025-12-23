import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function PaymentReturn() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing'); // processing, success, failed, error
  const [message, setMessage] = useState('');
  const token = searchParams.get('token');

  useEffect(() => {
    processPaymentReturn();
  }, []);

  const processPaymentReturn = async (retryCount = 0) => {
    try {
      console.log('📥 Retorno de Flow recibido. Token:', token);
      console.log('🔄 Intento:', retryCount + 1);

      // Esperar más tiempo si es un reintento (el webhook puede tardar)
      const waitTime = retryCount === 0 ? 3000 : 5000;
      await new Promise(resolve => setTimeout(resolve, waitTime));

      // Verificar el estado de la suscripción
      const { data } = await api.get('/subscription');
      console.log('📊 Estado de suscripción:', data);

      // Limpiar sessionId pendiente
      const pendingSession = localStorage.getItem('pendingCheckoutSession');
      if (pendingSession) {
        localStorage.removeItem('pendingCheckoutSession');
      }

      // Verificar si el pago fue exitoso
      if (data.plan === 'PRO' && data.status === 'ACTIVE') {
        setStatus('success');
        setMessage('¡Pago exitoso! Tu plan PRO ha sido activado.');
        // Redirigir al dashboard después de 3 segundos
        setTimeout(() => {
          navigate('/dashboard?payment=success');
        }, 3000);
      } else if ((data.status === 'TRIAL' || data.status === 'EXPIRED') && retryCount < 2) {
        // El webhook puede estar tardando, reintentar
        console.log('⏳ Webhook aún procesando, reintentando...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        return processPaymentReturn(retryCount + 1);
      } else if (data.status === 'TRIAL' || data.status === 'EXPIRED') {
        // Después de reintentos, el pago falló
        setStatus('failed');
        setMessage('El pago no se completó. Por favor intenta nuevamente.');
        setTimeout(() => {
          navigate('/dashboard/billing?payment=failed');
        }, 3000);
      } else {
        // Estado desconocido
        setStatus('error');
        setMessage('No se pudo verificar el estado del pago. Verifica tu suscripción en el dashboard.');
        setTimeout(() => {
          navigate('/dashboard/billing');
        }, 3000);
      }
    } catch (error) {
      console.error('❌ Error al procesar retorno de pago:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);

      // Si es error 401, el usuario no está autenticado
      if (error.response?.status === 401) {
        setStatus('error');
        setMessage('Sesión expirada. Por favor inicia sesión nuevamente.');
        setTimeout(() => {
          navigate('/login?redirect=/dashboard/billing');
        }, 3000);
      } else {
        setStatus('error');
        setMessage('Error al verificar el estado del pago. Por favor contacta a soporte.');
        setTimeout(() => {
          navigate('/dashboard/billing?payment=error');
        }, 3000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        {/* Processing */}
        {status === 'processing' && (
          <div className="text-center">
            <div className="inline-flex p-4 rounded-full bg-blue-50 mb-6">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Procesando tu pago...
            </h2>
            <p className="text-gray-600 mb-4">
              Estamos verificando el estado de tu transacción.
            </p>
            <p className="text-sm text-gray-500">
              Por favor espera un momento.
            </p>
          </div>
        )}

        {/* Success */}
        {status === 'success' && (
          <div className="text-center">
            <div className="inline-flex p-4 rounded-full bg-green-100 mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Pago Exitoso!
            </h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-green-800">
                <span className="font-semibold">Plan PRO activado</span>
                <br />
                Ahora tienes acceso a todas las funcionalidades premium de Karma.
              </p>
            </div>
            <p className="text-sm text-gray-500">
              Redirigiendo al dashboard...
            </p>
          </div>
        )}

        {/* Failed */}
        {status === 'failed' && (
          <div className="text-center">
            <div className="inline-flex p-4 rounded-full bg-red-100 mb-6">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Pago No Completado
            </h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-800">
                El pago no se procesó correctamente. Puedes intentar nuevamente desde la página de facturación.
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard/billing')}
              className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors mb-2"
            >
              Ir a Facturación
            </button>
            <p className="text-sm text-gray-500">
              O espera a ser redirigido automáticamente...
            </p>
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div className="text-center">
            <div className="inline-flex p-4 rounded-full bg-amber-100 mb-6">
              <AlertCircle className="w-12 h-12 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Error al Verificar Pago
            </h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-amber-800">
                Si realizaste el pago y ves este mensaje, por favor contacta a soporte con el código de transacción.
              </p>
              {token && (
                <p className="text-xs text-amber-700 mt-2 font-mono break-all">
                  Token: {token}
                </p>
              )}
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors mb-2"
            >
              Ir al Dashboard
            </button>
            <button
              onClick={() => navigate('/dashboard/billing')}
              className="w-full bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Ver Facturación
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
