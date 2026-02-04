import { useEffect, useState } from 'react';
import { Plus, AlertCircle, CheckCircle, Sparkles, Edit2, Trash2, ToggleLeft, ToggleRight, Calendar, HelpCircle, Zap } from 'lucide-react';
import api from '../../services/api';
import { useBusinessAuth, NoBusinessMessage } from '../../hooks/useBusinessAuth.jsx';
import PageLoader from '../../components/common/PageLoader';

export default function Promotions() {
  const { business, loading: businessLoading, error: businessError } = useBusinessAuth();
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount: 10,
    startDate: '',
    endDate: '',
    isActive: true
  });

  useEffect(() => {
    if (business) {
      loadPromotions();
    }
  }, [business]);

  const loadPromotions = async () => {
    try {
      const res = await api.get('/promotions/my');
      setPromotions(res.data);
    } catch (error) {
      // Si es 404, significa que no hay promociones todavía (es normal para negocios nuevos)
      if (error.response?.status === 404) {
        setPromotions([]);
      } else {
        
        setMessage({ type: 'error', text: 'Error al cargar las promociones' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Para el descuento, solo permitir números enteros
    if (name === 'discount') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData({
        ...formData,
        [name]: numericValue
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  // Formatear número sin decimales
  const formatNumber = (num) => {
    if (!num || num === '0') return '';
    return parseInt(num).toString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Validar descuento
    const discount = parseInt(formData.discount);
    if (!formData.discount || isNaN(discount) || discount < 0 || discount > 100) {
      setMessage({ type: 'error', text: 'El descuento debe ser un número entre 0 y 100' });
      return;
    }

    try {
      // Validate dates
      if (!formData.startDate || !formData.endDate) {
        setMessage({ type: 'error', text: 'Las fechas de inicio y fin son requeridas' });
        return;
      }

      // Convert datetime-local format to ISO 8601
      // datetime-local returns format: "2024-12-13T10:30"
      // We need to convert to: "2024-12-13T10:30:00.000Z"
      const startDateTime = new Date(formData.startDate);
      const endDateTime = new Date(formData.endDate);

      // Validate that dates are valid
      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        setMessage({ type: 'error', text: 'Formato de fecha inválido' });
        return;
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        discount: parseInt(formData.discount),
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
        isActive: formData.isActive
      };

      if (editingPromotion) {
        await api.patch(`/promotions/${editingPromotion.id}`, payload);
        setMessage({ type: 'success', text: 'Promoción actualizada exitosamente' });
      } else {
        await api.post('/promotions', payload);
        setMessage({ type: 'success', text: 'Promoción creada exitosamente' });
      }

      setShowForm(false);
      setEditingPromotion(null);
      setFormData({
        title: '',
        description: '',
        discount: 10,
        startDate: '',
        endDate: '',
        isActive: true
      });
      loadPromotions();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Error al guardar la promoción'
      });
    }
  };

  const handleEdit = (promotion) => {
    setEditingPromotion(promotion);
    setFormData({
      title: promotion.title,
      description: promotion.description,
      discount: parseInt(promotion.discount),
      startDate: new Date(promotion.startDate).toISOString().slice(0, 16),
      endDate: new Date(promotion.endDate).toISOString().slice(0, 16),
      isActive: promotion.isActive
    });
    setShowForm(true);
  };

  const handleDelete = async (promotionId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta promoción?')) {
      return;
    }

    try {
      await api.delete(`/promotions/${promotionId}`);
      setMessage({ type: 'success', text: 'Promoción eliminada exitosamente' });
      loadPromotions();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Error al eliminar la promoción'
      });
    }
  };

  const handleToggleActive = async (promotion) => {
    try {
      await api.patch(`/promotions/${promotion.id}`, {
        isActive: !promotion.isActive
      });
      setMessage({
        type: 'success',
        text: `Promoción ${!promotion.isActive ? 'activada' : 'desactivada'} exitosamente`
      });
      loadPromotions();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Error al actualizar la promoción'
      });
    }
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    setEditingPromotion(null);
    setFormData({
      title: '',
      description: '',
      discount: 10,
      startDate: '',
      endDate: '',
      isActive: true
    });
  };

  const getPromotionStatus = (promotion) => {
    const now = new Date();
    const start = new Date(promotion.startDate);
    const end = new Date(promotion.endDate);

    if (!promotion.isActive) return { text: 'Inactiva', color: 'gray' };
    if (now < start) return { text: 'Programada', color: 'blue' };
    if (now > end) return { text: 'Expirada', color: 'red' };
    return { text: 'Activa', color: 'green' };
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Validación de negocio
  if (businessLoading || loading) {
    return <PageLoader message="Cargando promociones..." />;
  }

  if (!business || businessError) {
    return <NoBusinessMessage icon={Sparkles} />;
  }

  return (
    <div className="max-w-6xl overflow-x-hidden">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary-600 flex-shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Promociones</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 w-full sm:w-auto"
          >
            <Plus className="w-5 h-5" />
            {showForm ? 'Cancelar' : 'Nueva Promoción'}
          </button>
        </div>
        <p className="text-gray-600 text-sm sm:text-base">
          Gestiona las promociones y ofertas especiales
        </p>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
          message.type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {editingPromotion ? 'Editar Promoción' : 'Crear Nueva Promoción'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título de la promoción *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                placeholder="Ej: 2x1 en cafés"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                placeholder="Describe la promoción en detalle..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descuento (%) *
              </label>
              <input
                type="text"
                name="discount"
                required
                value={formatNumber(formData.discount)}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                placeholder="50"
              />
              <p className="text-sm text-gray-500 mt-1">
                Porcentaje de descuento (0-100)
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de inicio *
                </label>
                <input
                  type="datetime-local"
                  name="startDate"
                  required
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de fin *
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  required
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                id="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="isActive" className="ml-3 text-sm font-medium text-gray-700">
                Promoción activa
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                {editingPromotion ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Actualizar Promoción
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Crear Promoción
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Promotions List */}
      {promotions.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No tienes promociones creadas
          </h3>
          <p className="text-gray-600 mb-6">
            Crea promociones atractivas para aumentar las ventas y fidelizar clientes
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            Crear Primera Promoción
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {promotions.map((promotion) => {
            const status = getPromotionStatus(promotion);
            return (
              <div
                key={promotion.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-primary-50 to-accent-50">
                      <Sparkles className="w-8 h-8 text-primary-600" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{promotion.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          status.color === 'green' ? 'bg-green-100 text-green-700' :
                          status.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                          status.color === 'red' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {status.text}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-3">{promotion.description}</p>

                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-primary-600">
                            {parseInt(promotion.discount)}% dcto
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs sm:text-sm">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{formatDate(promotion.startDate)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs sm:text-sm">
                          <span>→</span>
                          <span className="truncate">{formatDate(promotion.endDate)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-start">
                    <button
                      onClick={() => handleToggleActive(promotion)}
                      className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-all"
                      title={promotion.isActive ? 'Desactivar' : 'Activar'}
                    >
                      {promotion.isActive ? (
                        <ToggleRight className="w-5 h-5" />
                      ) : (
                        <ToggleLeft className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleEdit(promotion)}
                      className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-all"
                      title="Editar"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(promotion.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Eliminar"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* How it works section */}
      <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl border border-orange-200 p-6 mt-8">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-orange-100 rounded-xl">
            <HelpCircle className="w-6 h-6 text-orange-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-3">¿Cómo funcionan las promociones?</h3>

            <div className="space-y-4">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary-600" />
                  Ofertas Temporales
                </h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Las promociones son <strong>ofertas especiales por tiempo limitado</strong></li>
                  <li>• Define el porcentaje de descuento (0% a 100%)</li>
                  <li>• Establece fechas de inicio y fin para la promoción</li>
                  <li>• Los clientes ven las promociones activas en su Apple Wallet o Google Wallet</li>
                  <li>• Puedes activar/desactivar promociones manualmente en cualquier momento</li>
                </ul>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-accent-600" />
                  Estados de las Promociones
                </h4>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">Activa</span>
                    <span className="text-gray-700">Vigente y visible para clientes</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">Programada</span>
                    <span className="text-gray-700">Aún no ha comenzado</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold">Expirada</span>
                    <span className="text-gray-700">Ya pasó la fecha de fin</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-semibold">Inactiva</span>
                    <span className="text-gray-700">Desactivada manualmente</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-900">
                    <strong>✅ Ejemplo 1:</strong><br/>
                    "2x1 en cafés"<br/>
                    Descuento: 50%<br/>
                    Del 1 al 15 de diciembre<br/>
                    <em>Perfecto para aumentar ventas en temporada baja</em>
                  </p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>✅ Ejemplo 2:</strong><br/>
                    "Happy Hour"<br/>
                    Descuento: 30%<br/>
                    Lunes a viernes de 15:00 a 18:00<br/>
                    <em>Atrae clientes en horarios de menos tráfico</em>
                  </p>
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-900 flex items-start gap-2">
                  <Zap className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>💡 Tip:</strong> Las promociones son independientes de los puntos y sellos.
                    Puedes tener una promoción activa mientras los clientes siguen acumulando puntos normalmente.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
