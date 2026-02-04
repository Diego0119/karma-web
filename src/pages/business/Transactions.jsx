import { useEffect, useState, useMemo } from 'react';
import api from '../../services/api';
import PageLoader from '../../components/common/PageLoader';
import {
  Receipt,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Filter,
  Search,
  ChevronDown,
  Coins,
  User,
  History,
  DollarSign,
  Zap
} from 'lucide-react';

export default function Transactions() {
  const [business, setBusiness] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [stats, setStats] = useState({
    totalEarned: 0,
    totalRedeemed: 0,
    totalTransactions: 0,
    stampsEarned: 0,
    stampsRedeemed: 0
  });

  useEffect(() => {
    loadBusinessData();
  }, []);

  useEffect(() => {
    if (business) {
      loadCustomersAndTransactions();
    } else if (business === null) {
      // Si business es explícitamente null, ya terminó de cargar y no hay business
      setLoading(false);
    }
  }, [business]);

  // Memoized filtered transactions
  const filteredTransactions = useMemo(() => {
    let filtered = [...allTransactions];

    if (selectedCustomer !== 'all') {
      filtered = filtered.filter(t => t.customer?.id === selectedCustomer);
    }

    if (selectedType !== 'all') {
      switch (selectedType) {
        case 'POINTS_EARN':
          filtered = filtered.filter(t => t.type === 'POINTS' && t.action === 'EARN');
          break;
        case 'POINTS_REDEEM':
          filtered = filtered.filter(t => t.type === 'POINTS' && t.action === 'REDEEM');
          break;
        case 'STAMPS_EARN':
          filtered = filtered.filter(t => t.type === 'STAMPS' && t.action === 'EARN');
          break;
        case 'STAMPS_REDEEM':
          filtered = filtered.filter(t => t.type === 'STAMPS' && t.action === 'REDEEM');
          break;
        case 'POINTS':
          filtered = filtered.filter(t => t.type === 'POINTS');
          break;
        case 'STAMPS':
          filtered = filtered.filter(t => t.type === 'STAMPS');
          break;
      }
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(t =>
        t.description?.toLowerCase().includes(search) ||
        t.customer?.firstName?.toLowerCase().includes(search) ||
        t.customer?.lastName?.toLowerCase().includes(search)
      );
    }

    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter(t => new Date(t.createdAt) >= fromDate);
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(t => new Date(t.createdAt) <= toDate);
    }

    return filtered;
  }, [allTransactions, selectedCustomer, selectedType, searchTerm, dateFrom, dateTo]);

  const loadBusinessData = async () => {
    try {
      const res = await api.get('/business/me');

      // Validar que el usuario tenga un negocio asociado
      if (!res.data || !res.data.id) {
        setBusiness(null);
        setLoading(false);
        return;
      }

      setBusiness(res.data);
    } catch (error) {
      // Si es 404, significa que no tiene perfil de negocio
      if (error.response?.status === 404) {
        setBusiness(null);
      }

      setLoading(false);
    }
  };

  const loadCustomersAndTransactions = async () => {
    try {
      setLoading(true);

      // Cargar clientes del negocio
      const customersRes = await api.get('/business/my/customers');
      const customersData = customersRes.data.data || customersRes.data || [];
      setCustomers(customersData);

      // Si no hay clientes, no hay transacciones
      if (!customersData || customersData.length === 0) {
        setAllTransactions([]);
        setStats({
          totalEarned: 0,
          totalRedeemed: 0,
          totalTransactions: 0,
          stampsEarned: 0,
          stampsRedeemed: 0
        });
        setLoading(false);
        return;
      }

      // Cargar transacciones unificadas (puntos y sellos) de todos los clientes
      const transactionsPromises = customersData.map(customer =>
        api.get(`/analytics/transactions/${customer.id}?type=ALL`)
          .then(res => res.data.map(t => ({ ...t, customer })))
          .catch(() => [])
      );

      const transactionsArrays = await Promise.all(transactionsPromises);
      const transactions = transactionsArrays.flat();

      // Ordenar por fecha descendente
      transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setAllTransactions(transactions);

      // Calcular estadísticas
      const pointsEarned = transactions
        .filter(t => t.type === 'POINTS' && t.action === 'EARN')
        .reduce((sum, t) => sum + t.amount, 0);

      const pointsRedeemed = transactions
        .filter(t => t.type === 'POINTS' && t.action === 'REDEEM')
        .reduce((sum, t) => sum + t.amount, 0);

      const stampsEarned = transactions
        .filter(t => t.type === 'STAMPS' && t.action === 'EARN')
        .reduce((sum, t) => sum + t.amount, 0);

      const stampsRedeemed = transactions
        .filter(t => t.type === 'STAMPS' && t.action === 'REDEEM')
        .reduce((sum, t) => sum + t.amount, 0);

      setStats({
        totalEarned: pointsEarned,
        totalRedeemed: pointsRedeemed,
        totalTransactions: transactions.length,
        stampsEarned,
        stampsRedeemed
      });
    } catch {
      // Set empty data on error
      setAllTransactions([]);
      setStats({
        totalEarned: 0,
        totalRedeemed: 0,
        totalTransactions: 0,
        stampsEarned: 0,
        stampsRedeemed: 0
      });
    } finally {
      setLoading(false);
    }
  };

  // La base de datos guarda hora de Chile, pero el backend agrega 'Z' (UTC)
  // Quitamos la Z para interpretar como hora local
  const parseAsChileTime = (dateString) => {
    if (!dateString) return new Date();
    // Remover Z y cualquier offset de timezone para tratar como hora local
    const cleanDate = dateString.replace('Z', '').replace(/[+-]\d{2}:\d{2}$/, '');
    return new Date(cleanDate);
  };

  const formatDate = (dateString) => {
    const date = parseAsChileTime(dateString);
    return date.toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = parseAsChileTime(dateString);
    return date.toLocaleTimeString('es-CL', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  // Extraer monto de la descripción si existe (ej: "Compra de $5000.00")
  const extractAmountFromDescription = (description) => {
    if (!description) return null;
    const match = description.match(/\$([0-9,.]+)/);
    if (match) {
      const amount = parseFloat(match[1].replace(/,/g, ''));
      return isNaN(amount) ? null : amount;
    }
    return null;
  };

  if (loading) {
    return <PageLoader message="Cargando transacciones..." />;
  }

  if (!business) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100">
          <Receipt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ⚠️ Perfil de Negocio Requerido
          </h2>
          <p className="text-gray-600 mb-4">
            No tienes un perfil de negocio asociado a tu cuenta.
          </p>
          <p className="text-sm text-gray-500">
            Para acceder a esta sección, primero debes completar tu perfil de negocio en la sección "Configuración de cuenta".
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Receipt className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Historial de Transacciones</h1>
        </div>
        <p className="text-gray-600">
          Revisa todos los movimientos de puntos y sellos de tus clientes
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Receipt className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-blue-600 font-medium">Total Transacciones</p>
              <p className="text-2xl font-bold text-blue-900">{stats.totalTransactions.toLocaleString('es-CL')}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <Coins className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-green-600 font-medium">Puntos Otorgados</p>
              <p className="text-2xl font-bold text-green-900">{stats.totalEarned.toLocaleString('es-CL')}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-200 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-red-600 font-medium">Puntos Canjeados</p>
              <p className="text-2xl font-bold text-red-900">{stats.totalRedeemed.toLocaleString('es-CL')}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl border border-purple-200 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-purple-600 font-medium">Sellos Otorgados</p>
              <p className="text-2xl font-bold text-purple-900">{stats.stampsEarned.toLocaleString('es-CL')}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border border-amber-200 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-xl">
              <TrendingDown className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-amber-600 font-medium">Sellos Canjeados</p>
              <p className="text-2xl font-bold text-amber-900">{stats.stampsRedeemed.toLocaleString('es-CL')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-bold text-gray-900">Filtros</h2>
        </div>

        <div className="space-y-4">
          {/* Primera fila: Cliente, Tipo, Búsqueda */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* Filtro por Cliente */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Cliente</label>
              <select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
              >
                <option value="all">Todos los clientes</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.firstName} {customer.lastName}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-5 h-5 text-gray-400 absolute right-3 bottom-3 pointer-events-none" />
            </div>

            {/* Filtro por Tipo */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Movimiento</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
              >
                <option value="all">Todos los movimientos</option>
                <optgroup label="Puntos">
                  <option value="POINTS">Todos los puntos</option>
                  <option value="POINTS_EARN">Puntos ganados</option>
                  <option value="POINTS_REDEEM">Puntos canjeados</option>
                </optgroup>
                <optgroup label="Sellos">
                  <option value="STAMPS">Todos los sellos</option>
                  <option value="STAMPS_EARN">Sellos ganados</option>
                  <option value="STAMPS_REDEEM">Sellos canjeados</option>
                </optgroup>
              </select>
              <ChevronDown className="w-5 h-5 text-gray-400 absolute right-3 bottom-3 pointer-events-none" />
            </div>

            {/* Búsqueda */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por descripción o cliente..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Segunda fila: Filtros de fecha */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* Fecha desde */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Desde</label>
              <div className="relative">
                <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* Fecha hasta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hasta</label>
              <div className="relative">
                <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* Botón para limpiar filtros de fecha */}
            {(dateFrom || dateTo) && (
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setDateFrom('');
                    setDateTo('');
                  }}
                  className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Limpiar fechas
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lista de Transacciones */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <History className="w-5 h-5 text-primary-600" />
          <h2 className="text-xl font-bold text-gray-900">
            Transacciones
            {filteredTransactions.length !== allTransactions.length && (
              <span className="text-gray-500 font-normal text-base ml-2">
                ({filteredTransactions.length} de {allTransactions.length})
              </span>
            )}
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No hay transacciones que coincidan con los filtros</p>
            <p className="text-sm text-gray-500 mt-1">
              Prueba ajustando los filtros de búsqueda
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => {
              const amount = extractAmountFromDescription(transaction.description);

              const isEarn = transaction.action === 'EARN';
              const isPoints = transaction.type === 'POINTS';

              return (
              <div
                key={transaction.id}
                className={`p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                  isEarn
                    ? 'bg-green-50 border-green-200 hover:border-green-300'
                    : 'bg-red-50 border-red-200 hover:border-red-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  {/* Info Principal */}
                  <div className="flex items-start gap-4 flex-1">
                    {/* Icono */}
                    <div className={`p-3 rounded-xl ${
                      isEarn ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {isEarn ? (
                        <TrendingUp className={`w-6 h-6 ${
                          isEarn ? 'text-green-600' : 'text-red-600'
                        }`} />
                      ) : (
                        <TrendingDown className={`w-6 h-6 ${
                          isEarn ? 'text-green-600' : 'text-red-600'
                        }`} />
                      )}
                    </div>

                    {/* Detalles */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg mb-1">
                            {transaction.description || (
                              isPoints
                                ? (isEarn ? 'Puntos ganados' : 'Puntos canjeados')
                                : (isEarn ? 'Sellos ganados' : 'Sellos canjeados')
                            )}
                          </h3>

                          {/* Cliente */}
                          {transaction.customer && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                              <User className="w-4 h-4" />
                              <span>
                                {transaction.customer.firstName} {transaction.customer.lastName}
                              </span>
                            </div>
                          )}

                          {/* Monto si existe (solo para puntos ganados) */}
                          {amount && isPoints && isEarn && (
                            <div className="flex items-center gap-2 text-sm text-gray-700 bg-white px-3 py-1 rounded-lg inline-flex mt-1">
                              <DollarSign className="w-4 h-4" />
                              <span className="font-semibold">{formatCurrency(amount)}</span>
                            </div>
                          )}

                          {/* Badge de tipo */}
                          <div className="mt-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              isPoints
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-purple-100 text-purple-700'
                            }`}>
                              {isPoints ? 'Puntos' : 'Sellos'}
                            </span>
                          </div>
                        </div>

                        {/* Cantidad */}
                        <div className={`text-right ml-4 ${
                          isEarn ? 'text-green-600' : 'text-red-600'
                        }`}>
                          <p className="text-2xl font-bold">
                            {isEarn ? '+' : ''}{transaction.amount.toLocaleString('es-CL')}
                          </p>
                          <p className="text-sm font-medium">{isPoints ? 'puntos' : 'sellos'}</p>
                        </div>
                      </div>

                      {/* Fecha y Hora */}
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(transaction.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatTime(transaction.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Info Section */}
      {filteredTransactions.length > 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6 mt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">📊 Información sobre transacciones</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• <strong>Puntos Otorgados:</strong> Se registran cuando un cliente realiza una compra (proporcional al monto)</li>
            <li>• <strong>Puntos Canjeados:</strong> Se descuentan cuando un cliente canjea una recompensa de puntos</li>
            <li>• <strong>Sellos Otorgados:</strong> Se registran por cada visita/compra del cliente (independiente del monto)</li>
            <li>• <strong>Sellos Canjeados:</strong> Se descuentan cuando un cliente completa una tarjeta y canjea una recompensa</li>
            <li>• <strong>Filtros:</strong> Filtra por cliente, tipo de movimiento (puntos/sellos ganados/canjeados) o rango de fechas</li>
            <li>• <strong>Búsqueda:</strong> Busca por descripción o nombre del cliente</li>
          </ul>
        </div>
      )}
    </div>
  );
}
