import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Award,
  CreditCard,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  TrendingDown,
  Star,
  CheckCircle,
  Clock
} from 'lucide-react';
import api from '../../services/api';

export default function CustomerDetails() {
  const { customerId } = useParams();
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomerDetails();
  }, [customerId]);

  const loadCustomerDetails = async () => {
    try {
      const res = await api.get(`/business/my/customers/${customerId}`);
      setCustomerData(res.data);
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  };

  // La base de datos guarda hora de Chile, pero el backend agrega 'Z' (UTC)
  const parseAsChileTime = (dateString) => {
    if (!dateString) return new Date();
    const cleanDate = dateString.replace('Z', '').replace(/[+-]\d{2}:\d{2}$/, '');
    return new Date(cleanDate);
  };

  const formatDate = (dateString) => {
    const date = parseAsChileTime(dateString);
    return date.toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    const date = parseAsChileTime(dateString);
    return date.toLocaleString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!customerData) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Cliente no encontrado
          </h3>
          <p className="text-gray-600 mb-6">
            No se pudo cargar la información del cliente
          </p>
          <Link
            to="/dashboard/customers"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Clientes
          </Link>
        </div>
      </div>
    );
  }

  const { customer, points, stampCards } = customerData;

  return (
    <div className="max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/dashboard/customers"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Clientes
        </Link>

        <div className="flex items-center gap-4 mb-2">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-white font-bold text-2xl">
            {customer.firstName[0]}{customer.lastName[0]}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {customer.firstName} {customer.lastName}
            </h1>
            <p className="text-gray-600">
              Cliente desde {formatDate(customer.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Información de Contacto</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-50">
              <Mail className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium text-gray-900">{customer.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent-50">
              <Phone className="w-5 h-5 text-accent-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Teléfono</p>
              <p className="font-medium text-gray-900">{customer.phone}</p>
            </div>
          </div>
          {customer.birthDate && (
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-50">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Fecha de Nacimiento</p>
                <p className="font-medium text-gray-900">{formatDate(customer.birthDate)}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Points Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary-600" />
            Puntos de Fidelización
          </h2>
          <div className="text-right">
            <p className="text-sm text-gray-600">Balance Actual</p>
            <p className="text-3xl font-bold text-primary-600">
              {points.balance.toLocaleString('es-CL')} pts
            </p>
          </div>
        </div>

        {points.transactions.length === 0 ? (
          <div className="text-center py-8">
            <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No hay transacciones de puntos</p>
          </div>
        ) : (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Historial de Transacciones</h3>
            {points.transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className={`p-2 rounded-lg ${
                    transaction.type === 'EARN'
                      ? 'bg-green-100'
                      : 'bg-red-100'
                  }`}>
                    {transaction.type === 'EARN' ? (
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDateTime(transaction.createdAt)}
                    </p>
                  </div>
                </div>
                <div className={`font-bold text-lg ${
                  transaction.type === 'EARN'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {transaction.type === 'EARN' ? '+' : ''}{transaction.points.toLocaleString('es-CL')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stamp Cards Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary-600" />
          Tarjetas de Sellos
        </h2>

        {stampCards.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No tiene tarjetas de sellos</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {stampCards.map((card) => (
              <div
                key={card.id}
                className={`rounded-xl p-6 border-2 ${
                  card.isCompleted
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'
                    : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-300'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {card.programName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Creada el {formatDate(card.createdAt)}
                    </p>
                  </div>
                  {card.isCompleted ? (
                    <div className="p-2 bg-green-100 rounded-full">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  ) : (
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progreso</span>
                    <span className="text-sm font-bold text-gray-900">
                      {card.stampsCollected}/{card.stampsRequired}
                    </span>
                  </div>
                  <div className="h-2 bg-white rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        card.isCompleted
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                          : 'bg-gradient-to-r from-blue-500 to-purple-500'
                      }`}
                      style={{ width: `${(card.stampsCollected / card.stampsRequired) * 100}%` }}
                    />
                  </div>
                </div>

                {card.isCompleted && card.completedAt && (
                  <div className="mb-4 p-3 bg-green-100 rounded-lg">
                    <p className="text-sm font-semibold text-green-800">
                      ✅ Completada el {formatDate(card.completedAt)}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Sellos ({card.stamps.length})
                  </p>
                  <div className="grid grid-cols-5 gap-2">
                    {Array.from({ length: card.stampsRequired }).map((_, index) => (
                      <div
                        key={index}
                        className={`aspect-square rounded-lg flex items-center justify-center transition-all duration-300 ${
                          index < card.stampsCollected
                            ? card.isCompleted
                              ? 'bg-green-500'
                              : 'bg-blue-500'
                            : 'bg-white border-2 border-dashed border-gray-300'
                        }`}
                      >
                        {index < card.stampsCollected && (
                          <Star className="w-4 h-4 text-white" fill="white" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {card.stamps.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-600 mb-2">Último sello agregado:</p>
                    <p className="text-xs font-medium text-gray-700">
                      {formatDateTime(card.stamps[card.stamps.length - 1].createdAt)}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
