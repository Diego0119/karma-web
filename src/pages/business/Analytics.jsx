import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Users, Award, Gift, Sparkles, Star, CheckCircle } from 'lucide-react';
import api from '../../services/api';

export default function Analytics() {
  const [dashboard, setDashboard] = useState(null);
  const [topCustomers, setTopCustomers] = useState([]);
  const [topRewards, setTopRewards] = useState([]);
  const [pointsActivity, setPointsActivity] = useState([]);
  const [customerGrowth, setCustomerGrowth] = useState([]);
  const [programsStats, setProgramsStats] = useState(null);
  const [promotionsStats, setPromotionsStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllAnalytics();
  }, []);

  const loadAllAnalytics = async () => {
    try {
      const [
        dashboardRes,
        customersRes,
        rewardsRes,
        activityRes,
        growthRes,
        programsRes,
        promotionsRes
      ] = await Promise.all([
        api.get('/analytics/dashboard'),
        api.get('/analytics/top-customers?limit=10'),
        api.get('/analytics/top-rewards?limit=10'),
        api.get('/analytics/points-activity?days=30'),
        api.get('/analytics/customer-growth'),
        api.get('/analytics/programs-stats'),
        api.get('/analytics/promotions-stats')
      ]);

      setDashboard(dashboardRes.data);
      setTopCustomers(customersRes.data);
      setTopRewards(rewardsRes.data);
      setPointsActivity(activityRes.data);
      setCustomerGrowth(growthRes.data);
      setProgramsStats(programsRes.data);
      setPromotionsStats(promotionsRes.data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        </div>
        <p className="text-gray-600">
          Analiza el rendimiento de tu negocio y tus programas de fidelización
        </p>
      </div>

      {/* Main Metrics */}
      {dashboard && (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            icon={<Users className="w-6 h-6" />}
            title="Total Clientes"
            value={dashboard.totalCustomers}
            color="primary"
          />
          <MetricCard
            icon={<Star className="w-6 h-6" />}
            title="Puntos Otorgados"
            value={dashboard.totalPointsGiven.toLocaleString('es-CL')}
            color="accent"
          />
          <MetricCard
            icon={<Gift className="w-6 h-6" />}
            title="Puntos Canjeados"
            value={dashboard.totalPointsRedeemed.toLocaleString('es-CL')}
            color="primary"
          />
          <MetricCard
            icon={<Award className="w-6 h-6" />}
            title="Recompensas Canjeadas"
            value={dashboard.totalRewardsRedeemed}
            color="accent"
          />
        </div>
      )}

      {/* Secondary Metrics */}
      {dashboard && (
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <MetricCard
            icon={<Sparkles className="w-6 h-6" />}
            title="Promociones Activas"
            value={dashboard.activePromotions}
            color="primary"
          />
          <MetricCard
            icon={<CheckCircle className="w-6 h-6" />}
            title="Tarjetas Completadas"
            value={dashboard.completedStampCards}
            color="accent"
          />
          <MetricCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="Promedio Puntos/Cliente"
            value={Math.round(dashboard.averagePointsPerCustomer)}
            color="primary"
          />
        </div>
      )}

      {/* Programs & Promotions Stats */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {programsStats && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-primary-600" />
              Estadísticas de Programas
            </h3>
            <div className="space-y-3">
              <StatRow label="Tarjetas Activas" value={programsStats.activeCards} />
              <StatRow label="Tarjetas Completadas" value={programsStats.completedCards} />
              <StatRow label="Total de Tarjetas" value={programsStats.totalCards} />
              <StatRow
                label="Tasa de Completación"
                value={`${programsStats.completionRate.toFixed(1)}%`}
              />
            </div>
          </div>
        )}

        {promotionsStats && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary-600" />
              Estadísticas de Promociones
            </h3>
            <div className="space-y-3">
              <StatRow label="Total Promociones" value={promotionsStats.total} />
              <StatRow label="Activas" value={promotionsStats.active} color="green" />
              <StatRow label="Expiradas" value={promotionsStats.expired} color="red" />
              <StatRow label="Programadas" value={promotionsStats.scheduled} color="blue" />
            </div>
          </div>
        )}
      </div>

      {/* Top Customers */}
      {topCustomers.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary-600" />
            Top 10 Clientes
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">#</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Cliente</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Puntos</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((customer, index) => (
                  <tr key={customer.customerId} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                        index === 0 ? 'bg-yellow-100 text-yellow-700' :
                        index === 1 ? 'bg-gray-200 text-gray-700' :
                        index === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">{customer.name}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 font-semibold rounded-full text-sm">
                        <Star className="w-4 h-4" />
                        {customer.totalPoints.toLocaleString('es-CL')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Top Rewards */}
      {topRewards.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary-600" />
            Recompensas Más Canjeadas
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">#</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Recompensa</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Costo</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Veces Canjeada</th>
                </tr>
              </thead>
              <tbody>
                {topRewards.map((reward, index) => (
                  <tr key={reward.rewardId} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-600">{index + 1}</td>
                    <td className="py-3 px-4 font-medium text-gray-900">{reward.name}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-primary-600 font-semibold">
                        {reward.pointsCost.toLocaleString('es-CL')} pts
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent-100 text-accent-700 font-semibold rounded-full text-sm">
                        {reward.timesRedeemed}x
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Customer Growth */}
      {customerGrowth.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-600" />
            Crecimiento de Clientes (últimos 6 meses)
          </h3>
          <div className="space-y-2">
            {customerGrowth.map((item) => {
              const maxCustomers = Math.max(...customerGrowth.map(i => i.newCustomers));
              const percentage = (item.newCustomers / maxCustomers) * 100;

              return (
                <div key={item.month} className="flex items-center gap-4">
                  <div className="w-24 text-sm font-medium text-gray-600">
                    {new Date(item.month + '-01').toLocaleDateString('es-CL', {
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="flex-1 relative">
                    <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg flex items-center px-3"
                        style={{ width: `${percentage}%` }}
                      >
                        {item.newCustomers > 0 && (
                          <span className="text-white text-xs font-semibold">
                            {item.newCustomers}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Points Activity */}
      {pointsActivity.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary-600" />
            Actividad de Puntos (últimos 30 días)
          </h3>
          <div className="text-sm text-gray-600 mb-4">
            Puntos ganados vs canjeados por día
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Fecha</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Ganados</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Canjeados</th>
                </tr>
              </thead>
              <tbody>
                {/* Group by date */}
                {Array.from(new Set(pointsActivity.map(p => p.date))).slice(0, 10).map((date) => {
                  const earnItem = pointsActivity.find(p => p.date === date && p.type === 'EARN');
                  const redeemItem = pointsActivity.find(p => p.date === date && p.type === 'REDEEM');

                  return (
                    <tr key={date} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900">
                        {new Date(date).toLocaleDateString('es-CL')}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-green-600 font-semibold">
                          +{earnItem?.totalPoints.toLocaleString('es-CL') || 0}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-red-600 font-semibold">
                          -{redeemItem?.totalPoints.toLocaleString('es-CL') || 0}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ icon, title, value, color = 'primary' }) {
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
        </div>
      </div>
    </div>
  );
}

function StatRow({ label, value, color }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-600">{label}</span>
      <span className={`font-semibold ${
        color === 'green' ? 'text-green-600' :
        color === 'red' ? 'text-red-600' :
        color === 'blue' ? 'text-blue-600' :
        'text-gray-900'
      }`}>
        {value}
      </span>
    </div>
  );
}
