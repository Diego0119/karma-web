import { useEffect, useState } from 'react';
import api from '../../services/api';
import {
  CreditCard,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Receipt
} from 'lucide-react';

const STATUS_CONFIG = {
  PAID: { label: 'Pagado', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  PENDING: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  FAILED: { label: 'Fallido', color: 'bg-red-100 text-red-800', icon: XCircle },
  CANCELLED: { label: 'Cancelado', color: 'bg-gray-100 text-gray-800', icon: XCircle },
  REFUNDED: { label: 'Reembolsado', color: 'bg-blue-100 text-blue-800', icon: RefreshCw }
};

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [grossIncome, setGrossIncome] = useState(0);
  const [netIncome, setNetIncome] = useState(0);

  useEffect(() => {
    loadTransactions();
  }, [page]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/transactions?page=${page}&limit=20`);
      setTransactions(response.data.transactions);
      setTotalPages(response.data.totalPages);
      setTotal(response.data.total);
      setGrossIncome(response.data.grossIncome || 0);
      setNetIncome(response.data.netIncome || 0);
    } catch (error) {
      
      setError(error.response?.data?.message || 'Error al cargar transacciones');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount, currency = 'CLP') => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && transactions.length === 0) {
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
            <h3 className="font-semibold text-red-900">Error al cargar transacciones</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Transacciones</h1>
          <p className="text-gray-600">Historial de pagos de suscripciones</p>
        </div>
        <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg font-semibold">
          {total} transacciones
        </div>
      </div>

      {/* Income Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Ingresos Brutos</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(grossIncome)}</p>
              <p className="text-xs text-gray-500 mt-1">Total facturado (con IVA)</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Ingresos Netos</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(netIncome)}</p>
              <p className="text-xs text-gray-500 mt-1">Sin IVA (19%)</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
              <Receipt className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Factura
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Negocio
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Método
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No hay transacciones registradas</p>
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => {
                  const statusConfig = STATUS_CONFIG[tx.status] || STATUS_CONFIG.PENDING;
                  const StatusIcon = statusConfig.icon;
                  return (
                    <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-gray-900">
                          {tx.invoiceNumber || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">
                          {tx.businessName || 'Sin nombre'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                          tx.plan === 'PRO'
                            ? 'bg-purple-100 text-purple-800'
                            : tx.plan === 'ENTERPRISE'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {tx.plan || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(tx.amount, tx.currency)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {tx.paymentMethod || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {formatDate(tx.paidAt || tx.createdAt)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              Página {page} de {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
