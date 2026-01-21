import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Building2,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  ExternalLink,
  Calendar,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';

export default function AdminBusinesses() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const limit = 20;

  useEffect(() => {
    loadBusinesses();
  }, [page]);

  const loadBusinesses = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/admin/businesses?page=${page}&limit=${limit}`);
      setBusinesses(data.businesses);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (error) {
      
      setError(error.response?.data?.message || 'Error al cargar negocios');
    } finally {
      setLoading(false);
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

  const getPlanBadge = (plan) => {
    const badges = {
      FREE: { text: 'Free', class: 'bg-gray-100 text-gray-700' },
      PRO: { text: 'Pro', class: 'bg-purple-100 text-purple-700' }
    };
    return badges[plan] || badges.FREE;
  };

  const filteredBusinesses = businesses.filter(business =>
    business.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <div>
            <h3 className="font-semibold text-red-900">Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Negocios</h1>
        <p className="text-gray-600">Gestión y administración de todos los negocios</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Mostrando {filteredBusinesses.length} de {total} negocios
        </p>
      </div>

      {/* Businesses Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
          </div>
        ) : filteredBusinesses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Building2 className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-gray-600">No se encontraron negocios</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Negocio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Vencimiento
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBusinesses.map((business) => {
                  const statusBadge = getStatusBadge(business.subscriptionStatus);
                  const planBadge = getPlanBadge(business.subscriptionPlan);
                  const StatusIcon = statusBadge.icon;
                  const daysUntilExpiration = business.subscriptionExpiresAt
                    ? Math.ceil((new Date(business.subscriptionExpiresAt) - new Date()) / (1000 * 60 * 60 * 24))
                    : null;

                  return (
                    <tr key={business.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{business.name}</p>
                          <p className="text-sm text-gray-600">{business.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${planBadge.class}`}>
                          {planBadge.text}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusBadge.class}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusBadge.text}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {business.subscriptionExpiresAt ? (
                          <div>
                            <p className="text-sm text-gray-900">
                              {new Date(business.subscriptionExpiresAt).toLocaleDateString('es-CL')}
                            </p>
                            {daysUntilExpiration !== null && (
                              <p className={`text-xs ${
                                daysUntilExpiration <= 7 ? 'text-red-600 font-semibold' :
                                daysUntilExpiration <= 30 ? 'text-amber-600' :
                                'text-gray-500'
                              }`}>
                                {daysUntilExpiration > 0 ? `${daysUntilExpiration} días` : 'Vencido'}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/admin/businesses/${business.id}`}
                          className="inline-flex items-center gap-1.5 text-purple-600 hover:text-purple-700 font-medium text-sm"
                        >
                          Ver detalles
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">
            Página {page} de {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
