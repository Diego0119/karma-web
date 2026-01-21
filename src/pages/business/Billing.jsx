import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  CreditCard,
  FileText,
  Download,
  Plus,
  Check,
  Calendar,
  DollarSign,
  Building2,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Trash2,
  AlertCircle,
  Crown,
  Zap,
  TrendingUp,
  Loader2,
  XCircle,
  CheckCircle2
} from 'lucide-react';
import api from '../../services/api';
import jsPDF from 'jspdf';
import { formatCLP, formatDate } from '../../utils/formatters';
import { PRICING } from '../../constants/pricing';

export default function Billing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [cancelLoading, setCancelLoading] = useState(false);
  const [reactivateLoading, setReactivateLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const messageTimeoutRef = useRef(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
    };
  }, []);

  // Manejar redirección desde 403 (trial expirado)
  useEffect(() => {
    if (searchParams.get('expired') === 'true') {
      setMessage({
        type: 'error',
        text: 'Tu período de prueba ha expirado. Activa tu subscripción para continuar.'
      });
      // Limpiar el parámetro de la URL
      searchParams.delete('expired');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Cargar datos de subscripción
  useEffect(() => {
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = async () => {
    try {
      setLoading(true);
      const [subRes, invoicesRes] = await Promise.all([
        api.get('/subscription'),
        api.get('/subscription/invoices')
      ]);
      setSubscription(subRes.data);
      setInvoices(invoicesRes.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Error al cargar datos de facturación');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    try {
      setCancelLoading(true);
      setShowCancelModal(false);
      const { data } = await api.post('/subscription/cancel');
      setMessage({ type: 'success', text: data.message });
      await loadSubscriptionData();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Error al cancelar subscripción'
      });
    } finally {
      setCancelLoading(false);
      messageTimeoutRef.current = setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
  };

  const handleReactivateSubscription = async () => {
    try {
      setReactivateLoading(true);

      // Crear sesión de checkout en Flow
      const { data } = await api.post('/subscription/create-checkout', {
        plan: 'PRO'
      });

      // Redirigir al usuario a Flow para completar el pago
      if (data.checkoutUrl) {
        // Guardar sessionId en localStorage para verificar después
        localStorage.setItem('pendingCheckoutSession', data.sessionId);
        // Redirigir a Flow
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('No se recibió URL de checkout');
      }
    } catch (error) {
      setReactivateLoading(false);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Error al iniciar el proceso de pago. Por favor intenta nuevamente.'
      });
      messageTimeoutRef.current = setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
    // No setear loading a false aquí porque el usuario será redirigido
  };

  // Generar PDF del comprobante de pago
  const generateInvoicePDF = (invoice) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // Colores
    const primaryColor = [99, 102, 241]; // Indigo
    const grayColor = [107, 114, 128];
    const blackColor = [17, 24, 39];

    // Header con fondo
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 40, 'F');

    // Logo/Título
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('KARMA', 20, 25);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Sistema de Lealtad', 20, 32);

    // Número de factura en header
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(invoice.invoiceNumber, pageWidth - 20, 25, { align: 'right' });

    // Título del documento
    doc.setTextColor(...blackColor);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('COMPROBANTE DE PAGO', 20, 55);

    // Nota tributaria
    doc.setFontSize(9);
    doc.setTextColor(...grayColor);
    doc.setFont('helvetica', 'italic');
    doc.text('Este documento es un comprobante interno y no constituye', 20, 63);
    doc.text('documento tributario válido para fines contables o de SII.', 20, 68);

    // Información de la empresa (Karma)
    doc.setTextColor(...blackColor);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('EMISOR:', 20, 85);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Karma SpA', 20, 92);
    doc.text('RUT: XX.XXX.XXX-X', 20, 98);
    doc.text('contacto@karma.cl', 20, 104);
    doc.text('Santiago, Chile', 20, 110);

    // Información del cliente (se llenará con datos reales si están disponibles)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('CLIENTE:', pageWidth / 2 + 10, 85);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Negocio Karma', pageWidth / 2 + 10, 92);
    // TODO: Agregar datos reales del negocio cuando estén disponibles

    // Línea separadora
    doc.setDrawColor(...grayColor);
    doc.setLineWidth(0.5);
    doc.line(20, 120, pageWidth - 20, 120);

    // Detalles de la factura
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...blackColor);
    doc.text('DETALLE DEL PAGO:', 20, 132);

    // Tabla de detalles
    const startY = 140;
    const lineHeight = 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    // Plan
    doc.setFont('helvetica', 'bold');
    doc.text('Plan:', 25, startY);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.plan, 70, startY);

    // Período de facturación
    doc.setFont('helvetica', 'bold');
    doc.text('Período:', 25, startY + lineHeight);
    doc.setFont('helvetica', 'normal');
    const periodo = `${formatDate(invoice.billingPeriodStart)} - ${formatDate(invoice.billingPeriodEnd)}`;
    doc.text(periodo, 70, startY + lineHeight);

    // Fecha de pago
    doc.setFont('helvetica', 'bold');
    doc.text('Fecha de pago:', 25, startY + lineHeight * 2);
    doc.setFont('helvetica', 'normal');
    doc.text(formatDate(invoice.paidAt || invoice.createdAt), 70, startY + lineHeight * 2);

    // Método de pago
    doc.setFont('helvetica', 'bold');
    doc.text('Método de pago:', 25, startY + lineHeight * 3);
    doc.setFont('helvetica', 'normal');
    let metodoPago = 'Flow (Transferencia/Débito/Crédito)';
    if (invoice.paymentMethod === 'STRIPE') metodoPago = 'Stripe (Tarjeta)';
    if (invoice.paymentMethod === 'MERCADO_PAGO') metodoPago = 'Flow (Transferencia/Débito/Crédito)';
    doc.text(metodoPago, 70, startY + lineHeight * 3);

    // Estado
    doc.setFont('helvetica', 'bold');
    doc.text('Estado:', 25, startY + lineHeight * 4);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(34, 197, 94); // Verde
    doc.text('PAGADO', 70, startY + lineHeight * 4);

    // Línea separadora
    doc.setDrawColor(...grayColor);
    doc.setLineWidth(0.5);
    doc.line(20, startY + lineHeight * 5 + 5, pageWidth - 20, startY + lineHeight * 5 + 5);

    // Total
    doc.setTextColor(...blackColor);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL PAGADO:', 25, startY + lineHeight * 6 + 10);

    // Monto en CLP - Precio fijo según el plan
    const montoCLP = invoice.plan === 'PRO' ? PRICING.PRO.price : 0;
    doc.setFontSize(18);
    doc.setTextColor(...primaryColor);
    doc.text(formatCLP(montoCLP) + ' + IVA', pageWidth - 25, startY + lineHeight * 6 + 10, { align: 'right' });

    // Nota al pie
    doc.setFontSize(9);
    doc.setTextColor(...grayColor);
    doc.setFont('helvetica', 'italic');
    const footerY = doc.internal.pageSize.height - 30;
    doc.text('Gracias por confiar en Karma para tu programa de lealtad.', pageWidth / 2, footerY, { align: 'center' });
    doc.text('Para soporte: soporte@karma.cl', pageWidth / 2, footerY + 5, { align: 'center' });

    // Línea decorativa al final
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(2);
    doc.line(20, doc.internal.pageSize.height - 20, pageWidth - 20, doc.internal.pageSize.height - 20);

    // Timestamp de generación
    doc.setFontSize(8);
    doc.setTextColor(...grayColor);
    doc.text(`Generado: ${new Date().toLocaleString('es-CL')}`, pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });

    // Descargar el PDF
    doc.save(`Comprobante-${invoice.invoiceNumber}.pdf`);
  };

  // Plan features - Características reales de Karma
  const getPlanFeatures = () => {
    return [
      'Clientes ilimitados',
      'Programas de puntos y sellos',
      'Apple Wallet + Google Wallet',
      'Dashboard de analytics',
      'Campañas automatizadas',
      'Notificaciones push',
      'Promociones personalizadas',
      'Soporte dedicado',
      'Sin comisiones por transacción',
      'Actualizaciones incluidas'
    ];
  };

  const getStatusBadge = (status) => {
    const badges = {
      ACTIVE: { text: 'Activo', class: 'bg-green-100 text-green-700' },
      TRIAL: { text: 'Prueba', class: 'bg-blue-100 text-blue-700' },
      EXPIRED: { text: 'Vencido', class: 'bg-red-100 text-red-700' },
      CANCELLED: { text: 'Cancelado', class: 'bg-yellow-100 text-yellow-700' }
    };
    return badges[status] || badges.ACTIVE;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (error && !subscription) {
    return (
      <div className="max-w-2xl mx-auto mt-12 bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <XCircle className="w-6 h-6 text-red-600" />
          <div>
            <h3 className="font-semibold text-red-900">Error al cargar datos</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const currentPlan = {
    name: 'Karma',
    price: PRICING.PRO.price,
    billingCycle: 'monthly',
    nextBillingDate: subscription?.expiresAt,
    features: getPlanFeatures(),
    status: subscription?.status,
    daysRemaining: subscription?.daysRemaining,
    isActive: subscription?.isActive
  };


  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Facturación</h1>
        <p className="text-gray-600">
          Gestiona tu subscripción y revisa tu historial de facturas
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-4 font-medium transition-colors ${
              activeTab === 'overview'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Resumen
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-6 py-4 font-medium transition-colors ${
              activeTab === 'invoices'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Facturas
          </button>
        </div>
      </div>

      {/* Mensaje de éxito/error */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
          message.type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Alerta de Trial */}
      {currentPlan.status === 'TRIAL' && currentPlan.daysRemaining > 0 && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900">
                Período de prueba - {currentPlan.daysRemaining} días restantes
              </h3>
              <p className="text-blue-700 text-sm">
                Estás usando Karma en modo de prueba gratuita. Vence el{' '}
                {new Date(currentPlan.nextBillingDate).toLocaleDateString('es-CL')}.
                {currentPlan.daysRemaining <= 7 && ' ¡Activa tu subscripción pronto para no perder acceso!'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Alerta de subscripción por vencer */}
      {currentPlan.daysRemaining <= 7 && currentPlan.daysRemaining > 0 && currentPlan.status === 'ACTIVE' && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900">Tu subscripción vence pronto</h3>
              <p className="text-yellow-700 text-sm">
                Te quedan {currentPlan.daysRemaining} días de acceso. Renueva ahora para no perder acceso a tus clientes.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Alerta de subscripción EXPIRADA */}
      {currentPlan.status === 'EXPIRED' && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900">Subscripción expirada</h3>
              <p className="text-red-700 text-sm mb-3">
                Tu subscripción ha expirado. Reactiva tu cuenta para seguir usando Karma y acceder a tus clientes.
              </p>
              <button
                onClick={handleReactivateSubscription}
                disabled={reactivateLoading}
                className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50"
              >
                {reactivateLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Reactivando...
                  </>
                ) : (
                  `Reactivar Subscripción - ${PRICING.PRO.formattedWithTax}`
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alerta de subscripción cancelada */}
      {currentPlan.status === 'CANCELLED' && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-900">Subscripción cancelada</h3>
              <p className="text-yellow-700 text-sm mb-3">
                Tu subscripción ha sido cancelada. Mantendrás acceso hasta{' '}
                {new Date(currentPlan.nextBillingDate).toLocaleDateString('es-CL')}.
              </p>
              <button
                onClick={handleReactivateSubscription}
                disabled={reactivateLoading}
                className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50"
              >
                {reactivateLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Reactivando...
                  </>
                ) : (
                  'Reactivar Subscripción'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Current Plan */}
          <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl border border-primary-200 p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">Plan {currentPlan.name}</h2>
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadge(currentPlan.status).class}`}>
                    {getStatusBadge(currentPlan.status).text}
                  </span>
                </div>
                <p className="text-gray-900 font-semibold text-lg mb-1">
                  ${currentPlan.price.toLocaleString('es-CL')}/mes
                </p>
                <p className="text-sm text-gray-600">
                  Sin contrato • Cancela cuando quieras
                </p>
              </div>
              <div>
                {/* Si está en TRIAL o EXPIRED, mostrar botón de activar/reactivar */}
                {(currentPlan.status === 'TRIAL' || currentPlan.status === 'EXPIRED') && (
                  <button
                    onClick={handleReactivateSubscription}
                    disabled={reactivateLoading}
                    className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50"
                  >
                    {reactivateLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                        Procesando...
                      </>
                    ) : currentPlan.status === 'TRIAL' ? (
                      `Activar Plan PRO - ${PRICING.PRO.formattedWithTax}`
                    ) : (
                      'Reactivar Subscripción'
                    )}
                  </button>
                )}

                {/* Si está ACTIVE (pagando), mostrar botón de cancelar */}
                {currentPlan.status === 'ACTIVE' && currentPlan.isActive && (
                  <button
                    onClick={handleCancelClick}
                    disabled={cancelLoading}
                    className="px-4 py-2 bg-white border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium disabled:opacity-50"
                  >
                    {cancelLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                        Cancelando...
                      </>
                    ) : (
                      'Cancelar Subscripción'
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Próxima facturación</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(currentPlan.nextBillingDate).toLocaleDateString('es-CL')}
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {currentPlan.status === 'CANCELLED'
                  ? 'Tu subscripción ha sido cancelada. Mantendrás acceso hasta esta fecha.'
                  : `Se cobrará $${currentPlan.price.toLocaleString('es-CL')} en esta fecha.`
                }
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-primary-200">
              <h3 className="font-semibold text-gray-900 mb-3">Características incluidas:</h3>
              <ul className="grid md:grid-cols-2 gap-2">
                {currentPlan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recent Invoices */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Facturas Recientes</h2>
              {invoices.length > 0 && (
                <button
                  onClick={() => setActiveTab('invoices')}
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  Ver todas →
                </button>
              )}
            </div>
            {invoices.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 text-sm">No hay facturas disponibles</p>
              </div>
            ) : (
              <div className="space-y-3">
                {invoices.slice(0, 3).map((invoice) => (
                  <div
                    key={invoice.invoiceNumber}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white rounded-lg">
                        <FileText className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{invoice.invoiceNumber}</p>
                        <p className="text-sm text-gray-600">
                          {invoice.paidAt ? new Date(invoice.paidAt).toLocaleDateString('es-CL') : '-'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-gray-900">
                        ${invoice.amount.toLocaleString('es-CL')}
                      </span>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                        invoice.status === 'PAID'
                          ? 'bg-green-100 text-green-700'
                          : invoice.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {invoice.status === 'PAID' ? 'Pagado' : invoice.status === 'PENDING' ? 'Pendiente' : 'Fallido'}
                      </span>
                      {invoice.status === 'PAID' && (
                        <button className="p-2 text-gray-600 hover:text-primary-600 transition-colors">
                          <Download className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Invoices Tab */}
      {activeTab === 'invoices' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Historial de Facturas</h2>
            {invoices.length > 0 && (
              <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                Descargar todas
              </button>
            )}
          </div>

          {invoices.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay facturas</h3>
              <p className="text-gray-600">Tus facturas aparecerán aquí una vez que realices pagos.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Factura</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Período</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Fecha de Pago</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Monto</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Estado</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.invoiceNumber} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <p className="font-semibold text-gray-900">{invoice.invoiceNumber}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-gray-700">
                          {new Date(invoice.billingPeriodStart).toLocaleDateString('es-CL', { month: 'short', day: 'numeric' })}
                          {' - '}
                          {new Date(invoice.billingPeriodEnd).toLocaleDateString('es-CL', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-700">
                          {invoice.paidAt ? new Date(invoice.paidAt).toLocaleDateString('es-CL', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : '-'}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-semibold text-gray-900">
                          ${invoice.amount.toLocaleString('es-CL')}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                          invoice.status === 'PAID'
                            ? 'bg-green-100 text-green-700'
                            : invoice.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {invoice.status === 'PAID' ? 'Pagado' : invoice.status === 'PENDING' ? 'Pendiente' : 'Fallido'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        {invoice.status === 'PAID' && (
                          <button
                            onClick={() => generateInvoicePDF(invoice)}
                            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            Descargar PDF
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal de Confirmación de Cancelación */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-red-100 rounded-full flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  ¿Cancelar subscripción?
                </h3>
                <p className="text-gray-600">
                  ¿Estás seguro de que deseas cancelar tu subscripción? Mantendrás acceso hasta la fecha de vencimiento.
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-900">
                <strong>Nota:</strong> Podrás reactivar tu subscripción en cualquier momento antes de la fecha de vencimiento.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                No, mantener activa
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Sí, cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
