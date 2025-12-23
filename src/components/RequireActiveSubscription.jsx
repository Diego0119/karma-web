import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Lock, CreditCard, Loader2 } from 'lucide-react';

/**
 * Guard component que requiere una suscripción activa
 * para acceder a ciertas rutas o funcionalidades
 */
export default function RequireActiveSubscription({ children }) {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    try {
      const { data } = await api.get('/subscription');
      setSubscription(data);
    } catch (error) {
      console.error('Error checking subscription:', error);
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verificando suscripción...</p>
        </div>
      </div>
    );
  }

  // Si no tiene suscripción activa, mostrar mensaje de upgrade
  if (!subscription?.isActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="text-center">
            <div className="inline-flex p-4 rounded-full bg-amber-50 mb-6">
              <Lock className="w-12 h-12 text-amber-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Suscripción Requerida
            </h2>

            <p className="text-gray-600 mb-6">
              {subscription?.status === 'EXPIRED' ? (
                'Tu suscripción ha expirado. Renueva tu plan para continuar accediendo a esta funcionalidad.'
              ) : subscription?.status === 'TRIAL' ? (
                'Tu período de prueba ha terminado. Actualiza a un plan PRO para continuar.'
              ) : (
                'Necesitas una suscripción activa para acceder a esta funcionalidad.'
              )}
            </p>

            <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-4 mb-6">
              <p className="text-sm font-semibold text-gray-900 mb-1">
                Plan Actual: {subscription?.plan || 'FREE'}
              </p>
              <p className="text-xs text-gray-600">
                Estado: {subscription?.status || 'Inactivo'}
              </p>
              {subscription?.daysRemaining !== null && (
                <p className="text-xs text-gray-600 mt-1">
                  Días restantes: {subscription.daysRemaining}
                </p>
              )}
            </div>

            <Link
              to="/dashboard/billing"
              className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 mb-3"
            >
              <CreditCard className="w-5 h-5" />
              {subscription?.status === 'EXPIRED' ? 'Renovar Suscripción' : 'Actualizar a PRO'}
            </Link>

            <Link
              to="/dashboard"
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Volver al Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Si tiene suscripción activa, renderizar el contenido
  return children;
}
