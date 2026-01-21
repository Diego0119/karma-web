import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  AlertCircle,
  Building2,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ExternalLink,
  Calendar,
  Clock,
  Mail,
  Bell
} from 'lucide-react';

export default function AdminExpiring() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [days, setDays] = useState(7);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadExpiringBusinesses();
  }, [days]);

  const loadExpiringBusinesses = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/admin/businesses/expiring/soon?days=${days}`);
      setBusinesses(data);
    } catch (error) {
      
      setError(error.response?.data?.message || 'Error al cargar negocios por vencer');
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (daysUntil) => {
    if (daysUntil <= 1) return 'bg-red-100 text-red-700 border-red-200';
    if (daysUntil <= 3) return 'bg-orange-100 text-orange-700 border-orange-200';
    if (daysUntil <= 7) return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  };

  const filteredBusinesses = businesses.filter(business =>
    business.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const dayOptions = [
    { value: 3, label: '3 días' },
    { value: 7, label: '7 días' },
    { value: 14, label: '14 días' },
    { value: 30, label: '30 días' }
  ];

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Negocios por Vencer</h1>
        <p className="text-gray-600">Negocios cuya suscripción está próxima a expirar</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Days filter */}
          <div className="flex flex-wrap gap-2">
            {dayOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setDays(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  days === option.value
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Próximos {option.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-3">
          {filteredBusinesses.length} negocios por vencer en los próximos {days} días
        </p>
      </div>

      {/* Expiring Businesses List */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-12 h-12 text-amber-600 animate-spin" />
          </div>
        ) : filteredBusinesses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Building2 className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-gray-600">No hay negocios por vencer</p>
            <p className="text-sm text-gray-500 mt-1">
              No hay suscripciones que expiren en los próximos {days} días
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredBusinesses.map((business) => {
              const urgencyClass = getUrgencyColor(business.daysUntilExpiration);

              return (
                <div key={business.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg border ${urgencyClass}`}>
                        <Clock className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{business.name}</p>
                        <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5" />
                            {business.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(business.subscriptionExpiresAt).toLocaleDateString('es-CL')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className={`text-lg font-bold ${
                          business.daysUntilExpiration <= 3 ? 'text-red-600' : 'text-amber-600'
                        }`}>
                          {business.daysUntilExpiration === 0
                            ? 'Hoy'
                            : business.daysUntilExpiration === 1
                              ? 'Mañana'
                              : `${business.daysUntilExpiration} días`
                          }
                        </p>
                        <p className="text-xs text-gray-500">para vencer</p>
                      </div>

                      <Link
                        to={`/admin/businesses/${business.id}`}
                        className="inline-flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                      >
                        Ver detalles
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Summary Card */}
      {!loading && filteredBusinesses.length > 0 && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 border border-amber-200">
          <h3 className="font-bold text-amber-900 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Resumen de Vencimientos
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-red-200">
              <p className="text-2xl font-bold text-red-600">
                {filteredBusinesses.filter(b => b.daysUntilExpiration <= 1).length}
              </p>
              <p className="text-sm text-gray-600">Hoy o mañana</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-orange-200">
              <p className="text-2xl font-bold text-orange-600">
                {filteredBusinesses.filter(b => b.daysUntilExpiration > 1 && b.daysUntilExpiration <= 3).length}
              </p>
              <p className="text-sm text-gray-600">2-3 días</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-amber-200">
              <p className="text-2xl font-bold text-amber-600">
                {filteredBusinesses.filter(b => b.daysUntilExpiration > 3 && b.daysUntilExpiration <= 7).length}
              </p>
              <p className="text-sm text-gray-600">4-7 días</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-yellow-200">
              <p className="text-2xl font-bold text-yellow-600">
                {filteredBusinesses.filter(b => b.daysUntilExpiration > 7).length}
              </p>
              <p className="text-sm text-gray-600">Más de 7 días</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
