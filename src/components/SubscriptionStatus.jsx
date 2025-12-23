import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { CheckCircle, XCircle, Clock, AlertTriangle, CreditCard } from 'lucide-react';

export default function SubscriptionStatus() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const { data } = await api.get('/subscription');
      setSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!subscription) return null;

  const getStatusConfig = () => {
    switch (subscription.status) {
      case 'ACTIVE':
        return {
          icon: CheckCircle,
          color: 'green',
          text: 'Activa',
          bgClass: 'bg-green-50',
          textClass: 'text-green-700',
          iconClass: 'text-green-600',
        };
      case 'TRIAL':
        return {
          icon: Clock,
          color: 'blue',
          text: 'Período de Prueba',
          bgClass: 'bg-blue-50',
          textClass: 'text-blue-700',
          iconClass: 'text-blue-600',
        };
      case 'EXPIRED':
        return {
          icon: XCircle,
          color: 'red',
          text: 'Expirada',
          bgClass: 'bg-red-50',
          textClass: 'text-red-700',
          iconClass: 'text-red-600',
        };
      case 'CANCELLED':
        return {
          icon: AlertTriangle,
          color: 'orange',
          text: 'Cancelada',
          bgClass: 'bg-orange-50',
          textClass: 'text-orange-700',
          iconClass: 'text-orange-600',
        };
      default:
        return {
          icon: AlertTriangle,
          color: 'gray',
          text: 'Desconocido',
          bgClass: 'bg-gray-50',
          textClass: 'text-gray-700',
          iconClass: 'text-gray-600',
        };
    }
  };

  const statusConfig = getStatusConfig();
  const Icon = statusConfig.icon;
  const showUpgrade = subscription.plan === 'FREE' && subscription.isActive;
  const showWarning = subscription.status === 'TRIAL' && subscription.daysRemaining <= 7;
  const showExpired = subscription.status === 'EXPIRED' || !subscription.isActive;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Tu Suscripción</h3>
        <Link
          to="/dashboard/billing"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
        >
          <CreditCard className="w-4 h-4" />
          Gestionar
        </Link>
      </div>

      <div className="space-y-4">
        {/* Plan y Estado */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl font-bold text-gray-900">
              Plan {subscription.plan}
            </span>
            {subscription.plan === 'PRO' && (
              <span className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                Premium
              </span>
            )}
          </div>

          <div className={`inline-flex items-center gap-2 ${statusConfig.bgClass} ${statusConfig.textClass} px-3 py-1.5 rounded-lg`}>
            <Icon className={`w-4 h-4 ${statusConfig.iconClass}`} />
            <span className="font-medium text-sm">{statusConfig.text}</span>
          </div>
        </div>

        {/* Días restantes */}
        {subscription.daysRemaining !== null && subscription.isActive && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600 mb-1">Días restantes</p>
            <p className="text-2xl font-bold text-gray-900">{subscription.daysRemaining}</p>
            {subscription.expiresAt && (
              <p className="text-xs text-gray-500 mt-1">
                Expira: {new Date(subscription.expiresAt).toLocaleDateString('es-CL')}
              </p>
            )}
          </div>
        )}

        {/* Warning - Trial ending soon */}
        {showWarning && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-800 font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Tu período de prueba termina pronto
            </p>
            <Link
              to="/dashboard/billing"
              className="text-sm text-amber-700 hover:text-amber-800 underline mt-1 inline-block"
            >
              Actualiza a PRO para continuar
            </Link>
          </div>
        )}

        {/* Expired Warning */}
        {showExpired && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800 font-medium flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              Tu suscripción ha expirado
            </p>
            <Link
              to="/dashboard/billing"
              className="inline-block mt-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Renovar Ahora
            </Link>
          </div>
        )}

        {/* Upgrade CTA for FREE plan */}
        {showUpgrade && !showExpired && (
          <Link
            to="/dashboard/billing"
            className="block bg-gradient-to-r from-primary-600 to-accent-600 text-white px-4 py-3 rounded-lg text-center font-medium hover:shadow-lg transition-all"
          >
            Actualizar a Plan PRO
          </Link>
        )}
      </div>
    </div>
  );
}
