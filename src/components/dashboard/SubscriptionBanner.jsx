import { useEffect, useState } from 'react';
import { AlertCircle, Clock } from 'lucide-react';
import api from '../../services/api';

export default function SubscriptionBanner() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const { data } = await api.get('/subscription');
      setSubscription(data);
    } catch (error) {
      // Si es 404, no hay subscripción - esto es normal para negocios nuevos
      if (error.response?.status === 404) {
        setSubscription(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // No mostrar nada si está cargando o no hay subscripción
  if (loading || !subscription) {
    return null;
  }

  const { status, trialEndsAt, expiresAt } = subscription;

  // Calcular días restantes
  let daysRemaining = 0;
  let expirationDate = null;

  if (status === 'TRIAL' && trialEndsAt) {
    const endDate = new Date(trialEndsAt);
    const now = new Date();
    daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
    expirationDate = endDate;
  } else if (status === 'ACTIVE' && expiresAt) {
    const endDate = new Date(expiresAt);
    const now = new Date();
    daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
    expirationDate = endDate;
  }

  // Banner crítico - Trial expirado (deshabilitado)
  // if (status === 'EXPIRED') {
  //   return null;
  // }

  // Banner de advertencia - Trial con 3 días o menos
  if (status === 'TRIAL' && daysRemaining <= 3 && daysRemaining > 0) {
    return (
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-amber-900 mb-1">
              Tu período de prueba termina pronto
            </h3>
            <p className="text-amber-700 text-sm">
              Te quedan <strong>{daysRemaining} día{daysRemaining !== 1 ? 's' : ''}</strong> de prueba gratuita.
              Vence el {expirationDate?.toLocaleDateString('es-CL', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Banner informativo - Subscripción cancelada pero todavía activa
  if (status === 'CANCELLED' && daysRemaining > 0) {
    return (
      <div className="bg-gray-50 border-l-4 border-gray-400 p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">
              Subscripción cancelada
            </h3>
            <p className="text-gray-700 text-sm">
              Tu subscripción ha sido cancelada. Mantendrás acceso hasta el{' '}
              {expirationDate?.toLocaleDateString('es-CL', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}. Contacta a soporte si deseas reactivarla.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // No mostrar nada si todo está bien (TRIAL con >3 días o ACTIVE)
  return null;
}
