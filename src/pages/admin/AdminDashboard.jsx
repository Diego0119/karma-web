import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Users,
  Building2,
  UserCircle,
  Award,
  Tag,
  TrendingUp,
  Loader2,
  AlertCircle,
  BarChart3,
  Clock,
  CheckCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [expiringBusinesses, setExpiringBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, expiringRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/businesses/expiring/soon?days=7')
      ]);
      setStats(statsRes.data);
      setExpiringBusinesses(expiringRes.data);
    } catch (error) {
      console.error('Error loading admin dashboard:', error);
      setError(error.response?.data?.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <div>
            <h3 className="font-semibold text-red-900">Error al cargar dashboard</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Usuarios',
      value: stats?.users?.total || 0,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      link: '/admin/users'
    },
    {
      title: 'Total Negocios',
      value: stats?.businesses?.total || 0,
      icon: Building2,
      color: 'from-purple-500 to-pink-500',
      link: '/admin/businesses',
      subtitle: `${stats?.businesses?.active || 0} activos`
    },
    {
      title: 'Total Clientes',
      value: stats?.customers?.total || 0,
      icon: UserCircle,
      color: 'from-green-500 to-emerald-500',
      link: '/admin/customers'
    },
    {
      title: 'Programas de Lealtad',
      value: stats?.programs?.total || 0,
      icon: Award,
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard de Administración</h1>
        <p className="text-gray-600">Vista general del sistema Karma</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const CardContent = (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  {stat.subtitle && (
                    <p className="text-sm text-gray-500 mt-1">{stat.subtitle}</p>
                  )}
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );

          return stat.link ? (
            <Link key={index} to={stat.link}>
              {CardContent}
            </Link>
          ) : (
            <div key={index}>{CardContent}</div>
          );
        })}
      </div>

      {/* Business Status Overview */}
      {stats?.businesses && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-purple-600" />
            Estado de Negocios
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <StatBox
              label="Activos"
              value={stats.businesses.active}
              icon={CheckCircle}
              color="text-green-600"
              bgColor="bg-green-50"
            />
            <StatBox
              label="En Prueba"
              value={stats.businesses.trial}
              icon={Clock}
              color="text-blue-600"
              bgColor="bg-blue-50"
            />
            <StatBox
              label="Expirados"
              value={stats.businesses.expired}
              icon={AlertCircle}
              color="text-red-600"
              bgColor="bg-red-50"
            />
            <StatBox
              label="Por Vencer (7d)"
              value={expiringBusinesses.length}
              icon={AlertCircle}
              color="text-amber-600"
              bgColor="bg-amber-50"
            />
          </div>
        </div>
      )}

      {/* Plans Distribution */}
      {stats?.businesses?.byPlan && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-purple-600" />
            Distribución por Plan
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <PlanCard
              name="FREE"
              count={stats.businesses.byPlan.free || 0}
              total={stats.businesses.total}
              color="from-gray-400 to-gray-600"
            />
            <PlanCard
              name="PRO"
              count={stats.businesses.byPlan.pro || 0}
              total={stats.businesses.total}
              color="from-purple-500 to-indigo-600"
            />
          </div>
        </div>
      )}

      {/* Expiring Soon */}
      {expiringBusinesses.length > 0 && (
        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-amber-900 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-amber-600" />
              Negocios por Vencer (próximos 7 días)
            </h2>
            <Link
              to="/admin/expiring"
              className="text-amber-700 hover:text-amber-800 font-semibold text-sm"
            >
              Ver todos →
            </Link>
          </div>
          <div className="space-y-3">
            {expiringBusinesses.slice(0, 5).map((business) => (
              <Link
                key={business.id}
                to={`/admin/businesses/${business.id}`}
                className="flex items-center justify-between p-4 bg-white rounded-lg hover:bg-amber-100 transition-colors"
              >
                <div>
                  <p className="font-semibold text-gray-900">{business.name}</p>
                  <p className="text-sm text-gray-600">{business.email}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-amber-700">
                    {business.daysUntilExpiration} días
                  </p>
                  <p className="text-xs text-gray-600">
                    {new Date(business.subscriptionExpiresAt).toLocaleDateString('es-CL')}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <QuickActionCard
          title="Gestionar Negocios"
          description="Ver y administrar todos los negocios"
          icon={Building2}
          link="/admin/businesses"
          color="from-purple-500 to-indigo-600"
        />
        <QuickActionCard
          title="Ver Usuarios"
          description="Administrar usuarios del sistema"
          icon={Users}
          link="/admin/users"
          color="from-blue-500 to-cyan-600"
        />
        <QuickActionCard
          title="Actividad Reciente"
          description="Monitorear actividad del sistema"
          icon={Clock}
          link="/admin/activity"
          color="from-green-500 to-emerald-600"
        />
      </div>
    </div>
  );
}

function StatBox({ label, value, icon: Icon, color, bgColor }) {
  return (
    <div className={`${bgColor} rounded-xl p-4`}>
      <div className="flex items-center gap-3">
        <Icon className={`w-6 h-6 ${color}`} />
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
      </div>
    </div>
  );
}

function PlanCard({ name, count, total, color }) {
  const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200">
      <div className={`inline-flex px-3 py-1 rounded-full bg-gradient-to-r ${color} text-white text-sm font-semibold mb-3`}>
        {name}
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-1">{count}</p>
      <p className="text-sm text-gray-600">{percentage}% del total</p>
    </div>
  );
}

function QuickActionCard({ title, description, icon: Icon, link, color }) {
  return (
    <Link
      to={link}
      className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group"
    >
      <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${color} mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </Link>
  );
}
