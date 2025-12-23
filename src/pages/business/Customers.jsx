import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Award, CreditCard, Eye, Search, TrendingUp, Calendar } from 'lucide-react';
import api from '../../services/api';
import { useBusinessAuth, NoBusinessMessage } from '../../hooks/useBusinessAuth.jsx';

export default function Customers() {
  const { business, loading: businessLoading, error: businessError } = useBusinessAuth();
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('lastActivity'); // 'lastActivity', 'points', 'name'

  useEffect(() => {
    if (business) {
      loadCustomers();
    }
  }, [business]);

  useEffect(() => {
    filterAndSortCustomers();
  }, [searchTerm, sortBy, customers]);

  const loadCustomers = async () => {
    try {
      const res = await api.get('/business/my/customers');
      setCustomers(res.data);
      setFilteredCustomers(res.data);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortCustomers = () => {
    let filtered = [...customers];

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
      );
    }

    // Ordenar
    filtered.sort((a, b) => {
      if (sortBy === 'lastActivity') {
        return new Date(b.lastActivity) - new Date(a.lastActivity);
      } else if (sortBy === 'points') {
        return b.loyalty.points - a.loyalty.points;
      } else if (sortBy === 'name') {
        return a.firstName.localeCompare(b.firstName);
      }
      return 0;
    });

    setFilteredCustomers(filtered);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Validación de negocio
  if (businessLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!business || businessError) {
    return <NoBusinessMessage icon={Users} />;
  }

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
          <Users className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
        </div>
        <p className="text-gray-600">
          Gestiona tus clientes y visualiza su actividad de fidelización
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary-50 to-accent-50">
              <Users className="w-6 h-6 text-primary-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Total Clientes</p>
              <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-accent-50 to-primary-50">
              <Award className="w-6 h-6 text-accent-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Puntos Totales</p>
              <p className="text-2xl font-bold text-gray-900">
                {customers.reduce((sum, c) => sum + c.loyalty.points, 0).toLocaleString('es-CL')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary-50 to-accent-50">
              <CreditCard className="w-6 h-6 text-primary-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Tarjetas Activas</p>
              <p className="text-2xl font-bold text-gray-900">
                {customers.reduce((sum, c) => sum + c.loyalty.activeStampCards, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Sort */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="md:w-64">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            >
              <option value="lastActivity">Ordenar por última actividad</option>
              <option value="points">Ordenar por puntos</option>
              <option value="name">Ordenar por nombre</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers List */}
      {filteredCustomers.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchTerm ? 'No se encontraron clientes' : 'Aún no tienes clientes'}
          </h3>
          <p className="text-gray-600">
            {searchTerm
              ? 'Intenta con otro término de búsqueda'
              : 'Los clientes aparecerán aquí cuando comiencen a acumular puntos o sellos'
            }
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Cliente</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Contacto</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-gray-600">Puntos</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-gray-600">Tarjetas</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-gray-600">Última Actividad</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-white font-semibold">
                          {customer.firstName[0]}{customer.lastName[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {customer.firstName} {customer.lastName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm">
                        <p className="text-gray-900">{customer.email}</p>
                        <p className="text-gray-500">{customer.phone}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 font-semibold rounded-full text-sm">
                        <Award className="w-4 h-4" />
                        {customer.loyalty.points.toLocaleString('es-CL')}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="text-sm">
                        <p className="font-semibold text-gray-900">
                          {customer.loyalty.activeStampCards} activas
                        </p>
                        <p className="text-gray-500">
                          {customer.loyalty.completedStampCards} completadas
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="inline-flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {formatDate(customer.lastActivity)}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Link
                        to={`/dashboard/customers/${customer.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Detalles
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-200 p-6 mt-8">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Acerca de tus Clientes</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>• <strong>Aquí verás solo los clientes que han interactuado con tu negocio:</strong> clientes que han acumulado puntos o tienen tarjetas de sellos.</p>
              <p>• <strong>Puntos:</strong> Muestra el balance actual de puntos de cada cliente.</p>
              <p>• <strong>Tarjetas:</strong> Cantidad de tarjetas de sellos activas (en progreso) y completadas.</p>
              <p>• <strong>Última actividad:</strong> Fecha de la última transacción o sello agregado.</p>
              <p>• <strong>Haz clic en "Ver Detalles"</strong> para ver el historial completo de transacciones y tarjetas de un cliente.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
