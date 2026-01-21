import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { PRICING } from '../../constants/pricing';
import {
  Building2,
  ArrowLeft,
  Edit,
  Loader2,
  AlertCircle,
  Users,
  Award,
  Tag,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  X
} from 'lucide-react';

export default function AdminBusinessDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form state for subscription update
  const [subscriptionForm, setSubscriptionForm] = useState({
    plan: 'FREE',
    status: 'TRIAL',
    daysToAdd: 30
  });

  useEffect(() => {
    loadBusinessDetail();
  }, [id]);

  const loadBusinessDetail = async () => {
    try {
      setLoading(true);
      const { data: businessData } = await api.get(`/admin/businesses/${id}`);
      setData(businessData);
      // Initialize form with current values
      setSubscriptionForm({
        plan: businessData.business?.subscriptionPlan || 'FREE',
        status: businessData.business?.subscriptionStatus || 'TRIAL',
        daysToAdd: 30
      });
    } catch (error) {
      // Mostrar error más detallado
      const errorMessage = error.response?.data?.message
        || error.response?.data?.error
        || error.message
        || 'Error al cargar negocio';

      setError(`${errorMessage} (Status: ${error.response?.status || 'unknown'})`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubscription = async (e) => {
    e.preventDefault();
    try {
      setUpdateLoading(true);
      await api.patch(`/admin/businesses/${id}/subscription`, subscriptionForm);
      setMessage({ type: 'success', text: 'Suscripción actualizada exitosamente' });
      setShowUpdateModal(false);
      await loadBusinessDetail();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Error al actualizar suscripción'
      });
    } finally {
      setUpdateLoading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      ACTIVE: { text: 'Activo', icon: CheckCircle, class: 'bg-green-100 text-green-700' },
      TRIAL: { text: 'Prueba', icon: Clock, class: 'bg-blue-100 text-blue-700' },
      EXPIRED: { text: 'Vencido', icon: XCircle, class: 'bg-red-100 text-red-700' },
      CANCELLED: { text: 'Cancelado', icon: AlertCircle, class: 'bg-yellow-100 text-yellow-700' }
    };
    return badges[status] || badges.ACTIVE;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate('/admin/businesses')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a negocios
        </button>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 mb-2">Error al cargar negocio</h3>
              <p className="text-red-700 mb-3">{error || 'Negocio no encontrado'}</p>

              {error?.includes('500') && (
                <div className="bg-red-100 border border-red-300 rounded-lg p-3 text-sm">
                  <p className="font-semibold text-red-900 mb-1">💡 Error del backend (500)</p>
                  <p className="text-red-800">
                    El servidor está fallando al procesar esta solicitud. Revisa:
                  </p>
                  <ul className="list-disc list-inside text-red-800 mt-2 space-y-1">
                    <li>Los logs del backend para ver el error exacto</li>
                    <li>Que el endpoint GET /admin/businesses/:id esté funcionando</li>
                    <li>Que el negocio tenga todas las relaciones necesarias</li>
                    <li>Que no haya errores en las queries SQL</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { business, programs, promotions, stats } = data;
  const statusBadge = getStatusBadge(business.subscriptionStatus);
  const StatusIcon = statusBadge.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/businesses')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{business.name}</h1>
            <p className="text-gray-600">{business.email}</p>
          </div>
        </div>
        <button
          onClick={() => setShowUpdateModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-semibold"
        >
          <Edit className="w-4 h-4" />
          Actualizar Suscripción
        </button>
      </div>

      {/* Success/Error Message */}
      {message.text && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${
          message.type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Subscription Status */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Estado de Suscripción</h2>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${statusBadge.class}`}>
                <StatusIcon className="w-4 h-4" />
                {statusBadge.text}
              </span>
              <span className="px-4 py-2 rounded-full bg-white text-gray-900 font-semibold">
                Plan {business.subscriptionPlan}
              </span>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4 bg-white rounded-xl p-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Fecha de vencimiento</p>
            <p className="font-semibold text-gray-900">
              {business.subscriptionExpiresAt
                ? new Date(business.subscriptionExpiresAt).toLocaleDateString('es-CL', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })
                : '-'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Días restantes</p>
            <p className="font-semibold text-gray-900">
              {business.subscriptionExpiresAt
                ? Math.ceil((new Date(business.subscriptionExpiresAt) - new Date()) / (1000 * 60 * 60 * 24))
                : '-'} días
            </p>
          </div>
        </div>
      </div>

      {/* Business Info */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Información del Negocio</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <InfoItem icon={Building2} label="Categoría" value={business.category || 'No especificada'} />
          <InfoItem icon={Mail} label="Email" value={business.email || '-'} />
          <InfoItem icon={Phone} label="Teléfono" value={business.phone || '-'} />
          <InfoItem icon={MapPin} label="Dirección" value={business.address || '-'} />
          <InfoItem icon={Calendar} label="Fecha de creación" value={new Date(business.createdAt).toLocaleDateString('es-CL')} />
        </div>
        {business.description && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Descripción</p>
            <p className="text-gray-900">{business.description}</p>
          </div>
        )}
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid md:grid-cols-4 gap-6">
          <StatCard icon={Users} label="Clientes" value={stats.customerCount} color="from-blue-500 to-cyan-500" />
          <StatCard icon={Award} label="Programas" value={stats.programsCount} color="from-purple-500 to-pink-500" />
          <StatCard icon={Tag} label="Promociones" value={stats.promotionsCount} color="from-orange-500 to-red-500" />
          <StatCard icon={TrendingUp} label="Transacciones" value={stats.totalTransactions} color="from-green-500 to-emerald-500" />
        </div>
      )}

      {/* Programs */}
      {programs && programs.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-6 h-6 text-purple-600" />
            Programas de Lealtad
          </h2>
          <div className="space-y-3">
            {programs.map((program) => (
              <div key={program.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{program.name}</p>
                    <p className="text-sm text-gray-600">Tipo: {program.type}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    program.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {program.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Update Subscription Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Actualizar Suscripción</h3>
              <button
                onClick={() => setShowUpdateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubscription} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plan
                </label>
                <select
                  value={subscriptionForm.plan}
                  onChange={(e) => setSubscriptionForm({ ...subscriptionForm, plan: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                >
                  <option value="FREE">FREE (Trial)</option>
                  <option value="PRO">PRO ({PRICING.PRO.formattedWithTax})</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  value={subscriptionForm.status}
                  onChange={(e) => setSubscriptionForm({ ...subscriptionForm, status: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                >
                  <option value="TRIAL">TRIAL (Prueba)</option>
                  <option value="ACTIVE">ACTIVE (Activo)</option>
                  <option value="EXPIRED">EXPIRED (Vencido)</option>
                  <option value="CANCELLED">CANCELLED (Cancelado)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Días a extender
                </label>
                <input
                  type="number"
                  value={subscriptionForm.daysToAdd}
                  onChange={(e) => setSubscriptionForm({ ...subscriptionForm, daysToAdd: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  min="0"
                  max="365"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Se agregarán desde la fecha de vencimiento actual
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50"
                >
                  {updateLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                      Actualizando...
                    </>
                  ) : (
                    'Actualizar'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 bg-gray-50 rounded-lg">
        <Icon className="w-5 h-5 text-gray-600" />
      </div>
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-r ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}
