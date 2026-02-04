import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import { useBusinessAuth, NoBusinessMessage } from '../../hooks/useBusinessAuth.jsx';
import PageLoader from '../../components/common/PageLoader';
import {
  Store,
  Users,
  Award,
  Gift,
  TrendingUp,
  Plus,
  ArrowRight,
  Star,
  Sparkles,
  CheckCircle,
  XCircle
} from 'lucide-react';

export default function BusinessDashboard() {
  const { business, loading: businessLoading, error: businessError } = useBusinessAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [stats, setStats] = useState({
    programs: 0,
    rewards: 0,
    promotions: 0,
  });
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMessage, setPaymentMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    // Check for payment status in URL
    const paymentStatus = searchParams.get('payment');
    if (paymentStatus) {
      if (paymentStatus === 'success') {
        setPaymentMessage({
          type: 'success',
          text: '¡Pago exitoso! Tu plan PRO ha sido activado. 🎉'
        });
      } else if (paymentStatus === 'failed') {
        setPaymentMessage({
          type: 'error',
          text: 'El pago no se completó. Por favor intenta nuevamente.'
        });
      } else if (paymentStatus === 'error') {
        setPaymentMessage({
          type: 'error',
          text: 'Hubo un error al procesar el pago. Verifica tu suscripción o contacta a soporte.'
        });
      }
      // Clean up URL
      searchParams.delete('payment');
      setSearchParams(searchParams, { replace: true });
      // Auto-hide message after 10 seconds
      setTimeout(() => setPaymentMessage({ type: '', text: '' }), 10000);
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (business) {
      loadDashboardData();
    }
  }, [business]);

  const loadDashboardData = async () => {
    try {
      // Cargar programas, recompensas y promociones (manejar 404 como array vacío)
      const loadSafe = async (endpoint) => {
        try {
          const res = await api.get(endpoint);
          return res.data;
        } catch (error) {
          if (error.response?.status === 404) {
            return [];
          }
          throw error;
        }
      };

      const [programsData, rewardsData, promotionsData] = await Promise.all([
        loadSafe('/loyalty/programs/my'),
        loadSafe('/rewards/my'),
        loadSafe('/promotions/my'),
      ]);

      setStats({
        programs: programsData.length,
        rewards: rewardsData.length,
        promotions: promotionsData.length,
      });

      // Cargar analytics (opcional para negocios nuevos)
      try {
        const dashboardRes = await api.get('/analytics/dashboard');
        setAnalytics(dashboardRes.data);
      } catch (error) {
        // Es normal que analytics falle para negocios nuevos
        if (error.response?.status !== 404 && error.response?.status !== 403) {
          
        }
      }
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  };

  // Validación de negocio
  if (businessLoading || loading) {
    return <PageLoader message="Cargando dashboard..." />;
  }

  if (!business || businessError) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100">
          <Store className="w-16 h-16 text-primary-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Bienvenido a Karma!
          </h2>
          <p className="text-gray-600 mb-6">
            Para comenzar, crea el perfil de tu negocio
          </p>
          <Link
            to="/dashboard/business"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            Crear perfil de negocio
          </Link>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Programas de Fidelización',
      value: stats.programs,
      icon: Award,
      color: 'from-blue-500 to-cyan-500',
      link: '/dashboard/programs'
    },
    {
      title: 'Recompensas',
      value: stats.rewards,
      icon: Gift,
      color: 'from-purple-500 to-pink-500',
      link: '/dashboard/rewards'
    },
    {
      title: 'Promociones Activas',
      value: stats.promotions,
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500',
      link: '/dashboard/promotions'
    },
  ];

  const quickActions = [
    {
      title: 'Crear Programa',
      description: 'Nuevo programa de fidelización',
      icon: Award,
      link: '/dashboard/programs',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Nueva Recompensa',
      description: 'Agregar recompensa para clientes',
      icon: Gift,
      link: '/dashboard/rewards',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Crear Promoción',
      description: 'Lanzar nueva promoción',
      icon: TrendingUp,
      link: '/dashboard/promotions',
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'Gestionar Clientes',
      description: 'Ver y gestionar tus clientes',
      icon: Users,
      link: '/dashboard/customers',
      color: 'from-green-500 to-emerald-500'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Payment Status Message */}
      {paymentMessage.text && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${
          paymentMessage.type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {paymentMessage.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="font-medium">{paymentMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          ¡Hola, {business.name}!
        </h1>
        <p className="text-gray-600">
          Gestiona tu programa de fidelización desde aquí
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link
              key={index}
              to={stat.link}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Analytics Section - Métricas clave */}
      {analytics && (
        <div className="grid md:grid-cols-3 gap-6">
          <MetricCard
            icon={<Users className="w-6 h-6" />}
            title="Total Clientes"
            value={analytics.totalCustomers}
            color="primary"
          />
          <MetricCard
            icon={<Star className="w-6 h-6" />}
            title="Puntos Otorgados"
            value={analytics.totalPointsGiven.toLocaleString('es-CL')}
            color="accent"
          />
          <MetricCard
            icon={<Sparkles className="w-6 h-6" />}
            title="Recompensas Canjeadas"
            value={analytics.totalRewardsRedeemed}
            color="primary"
          />
        </div>
      )}

      {/* Información del negocio */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Tu Negocio</h2>
            <p className="text-gray-600">{business.description}</p>
          </div>
          <Link
            to="/dashboard/business"
            className="text-primary-600 hover:text-primary-700 font-semibold text-sm flex items-center gap-1"
          >
            Editar
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Categoría:</span>
            <span className="ml-2 text-gray-900 font-medium">{business.category || 'No especificada'}</span>
          </div>
          <div>
            <span className="text-gray-500">Teléfono:</span>
            <span className="ml-2 text-gray-900 font-medium">{business.phone || 'No especificado'}</span>
          </div>
          <div className="md:col-span-2">
            <span className="text-gray-500">Dirección:</span>
            <span className="ml-2 text-gray-900 font-medium">{business.address || 'No especificada'}</span>
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.link}
                className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group"
              >
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${action.color} mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, title, value, color = 'primary', subtitle }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${
          color === 'primary'
            ? 'bg-gradient-to-br from-primary-50 to-accent-50'
            : 'bg-gradient-to-br from-accent-50 to-primary-50'
        }`}>
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}
