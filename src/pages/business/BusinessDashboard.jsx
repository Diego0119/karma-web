import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import { useBusinessAuth, NoBusinessMessage } from '../../hooks/useBusinessAuth.jsx';
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
  BarChart3,
  CreditCard,
  XCircle,
  AlertCircle
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
  const [programsStats, setProgramsStats] = useState(null);
  const [topCustomers, setTopCustomers] = useState([]);
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
        const [dashboardRes, customersRes, programsRes] = await Promise.all([
          api.get('/analytics/dashboard'),
          api.get('/analytics/top-customers?limit=5'),
          api.get('/analytics/programs-stats'),
        ]);
        setAnalytics(dashboardRes.data);
        setTopCustomers(customersRes.data);
        setProgramsStats(programsRes.data);
      } catch (error) {
        // Es normal que analytics falle para negocios nuevos (404) o sin permisos (403)
        const status = error.response?.status;
        if (status === 404) {
          console.log('ℹ️ Analytics not available yet (no data)');
        } else if (status === 403) {
          console.log('ℹ️ Analytics access restricted by backend');
        } else {
          console.error('❌ Error loading analytics:', error);
        }
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Validación de negocio
  if (businessLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
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

      {/* Analytics Section */}
      {analytics && (
        <>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-primary-600" />
                Resumen de Actividad
              </h2>
            </div>

            {/* Main Business Metrics */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <MetricCard
                icon={<Users className="w-6 h-6" />}
                title="Total Clientes"
                value={analytics.totalCustomers}
                color="primary"
                subtitle="Clientes registrados"
              />
              {programsStats && (
                <>
                  <MetricCard
                    icon={<CreditCard className="w-6 h-6" />}
                    title="Tarjetas Emitidas"
                    value={programsStats.totalCards}
                    color="accent"
                    subtitle="Total de tarjetas"
                  />
                  <MetricCard
                    icon={<Award className="w-6 h-6" />}
                    title="Tarjetas Activas"
                    value={programsStats.activeCards}
                    color="primary"
                    subtitle="En progreso"
                  />
                  <MetricCard
                    icon={<CheckCircle className="w-6 h-6" />}
                    title="Tarjetas Completadas"
                    value={programsStats.completedCards}
                    color="accent"
                    subtitle={`${programsStats.completionRate.toFixed(0)}% tasa completación`}
                  />
                </>
              )}
            </div>

            {/* Points & Rewards Metrics */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                icon={<Star className="w-6 h-6" />}
                title="Puntos Otorgados"
                value={analytics.totalPointsGiven.toLocaleString('es-CL')}
                color="primary"
                subtitle="Total acumulados"
              />
              <MetricCard
                icon={<Gift className="w-6 h-6" />}
                title="Puntos Canjeados"
                value={analytics.totalPointsRedeemed.toLocaleString('es-CL')}
                color="accent"
                subtitle="Total redimidos"
              />
              <MetricCard
                icon={<TrendingUp className="w-6 h-6" />}
                title="Promedio por Cliente"
                value={Math.round(analytics.averagePointsPerCustomer).toLocaleString('es-CL')}
                color="primary"
                subtitle="Puntos promedio"
              />
              <MetricCard
                icon={<Sparkles className="w-6 h-6" />}
                title="Recompensas Canjeadas"
                value={analytics.totalRewardsRedeemed}
                color="accent"
                subtitle="Total redenciones"
              />
            </div>
          </div>

          {/* Top Customers */}
          {topCustomers.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary-600" />
                  Top 5 Clientes
                </h3>
                <Link
                  to="/dashboard/customers"
                  className="text-sm text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1"
                >
                  Ver todos
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-3">
                {topCustomers.map((customer, index) => (
                  <div
                    key={customer.customerId}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                        index === 0 ? 'bg-yellow-100 text-yellow-700' :
                        index === 1 ? 'bg-gray-200 text-gray-700' :
                        index === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="font-medium text-gray-900">{customer.name}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 font-semibold rounded-full text-sm">
                      <Star className="w-4 h-4" />
                      {customer.totalPoints.toLocaleString('es-CL')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
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
