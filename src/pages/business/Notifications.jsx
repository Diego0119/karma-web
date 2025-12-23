import { useState, useEffect } from 'react';
import { Send, Bell, Users, AlertCircle, CheckCircle, Filter, History, Smartphone } from 'lucide-react';
import api from '../../services/api';
import { useBusinessAuth, NoBusinessMessage } from '../../hooks/useBusinessAuth.jsx';

export default function Notifications() {
  const { business, loading: businessLoading, error: businessError } = useBusinessAuth();
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    targetAudience: 'all',
    minPoints: 0,
    minStamps: 0
  });
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [notificationHistory, setNotificationHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeCustomers: 0
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  // Plantillas predeterminadas profesionales
  const templates = {
    miss_you_2weeks: {
      title: '¡Te extrañamos! 💙',
      message: 'Han pasado 2 semanas desde tu última visita. ¡Vuelve pronto y disfruta de tus beneficios acumulados! ✨',
      targetAudience: 'inactive_2weeks'
    },
    miss_you_1month: {
      title: '¡Hace tiempo que no te vemos! 😊',
      message: 'Han pasado 30 días desde tu última visita. ¡Te extrañamos! Vuelve y sigue acumulando recompensas 🎁',
      targetAudience: 'inactive_1month'
    },
    special_offer: {
      title: '🎉 ¡Oferta Especial para Ti!',
      message: 'Aprovecha nuestra promoción exclusiva. ¡Solo por tiempo limitado! No te lo pierdas 🔥',
      targetAudience: 'all'
    },
    points_expiring: {
      title: '⏰ Tus Puntos Están por Vencer',
      message: 'Tienes puntos que expiran pronto. ¡Canjéalos ahora y disfruta de tus recompensas! 🎁',
      targetAudience: 'points'
    },
    new_benefit: {
      title: '✨ ¡Nuevo Beneficio Disponible!',
      message: 'Hemos agregado nuevas recompensas exclusivas para ti. ¡Descúbrelas ahora en nuestro catálogo! 🌟',
      targetAudience: 'active'
    },
    thank_loyal: {
      title: '💝 ¡Gracias por tu Lealtad!',
      message: 'Eres un cliente especial. Como agradecimiento, tenemos una sorpresa esperándote 🎊',
      targetAudience: 'points'
    },
    comeback: {
      title: '🌟 ¡Vuelve y Recibe un Regalo!',
      message: 'Te tenemos una sorpresa especial. ¡Visítanos y reclama tu regalo de bienvenida! 🎁',
      targetAudience: 'inactive_1month'
    },
    milestone: {
      title: '🏆 ¡Felicitaciones!',
      message: '¡Has alcanzado un nuevo nivel! Disfruta de beneficios exclusivos como cliente destacado ⭐',
      targetAudience: 'points'
    }
  };

  useEffect(() => {
    if (business) {
      loadNotificationHistory();
      loadStats();
    }

    // Update time every second for the preview
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [business]);

  const loadNotificationHistory = async () => {
    try {
      const res = await api.get('/notifications/history');
      setNotificationHistory(res.data);
    } catch (error) {
      console.error('Error loading notification history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const loadStats = async () => {
    try {
      const res = await api.get('/notifications/stats');
      setStats(res.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleTemplateChange = (e) => {
    const templateKey = e.target.value;
    setSelectedTemplate(templateKey);

    if (templateKey && templates[templateKey]) {
      const template = templates[templateKey];
      setFormData({
        ...formData,
        title: template.title,
        message: template.message,
        targetAudience: template.targetAudience
      });
    }
  };

  const getEstimatedRecipients = () => {
    if (formData.targetAudience === 'all') {
      return stats.totalCustomers;
    } else if (formData.targetAudience === 'active') {
      return stats.activeCustomers;
    } else if (formData.targetAudience === 'inactive_2weeks') {
      return '~';
    } else if (formData.targetAudience === 'inactive_1month') {
      return '~';
    } else if (formData.targetAudience === 'points') {
      return '~';
    } else if (formData.targetAudience === 'stamps') {
      return '~';
    }
    return 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = {
        title: formData.title,
        message: formData.message,
        targetAudience: formData.targetAudience
      };

      if (formData.targetAudience === 'points') {
        payload.minPoints = parseInt(formData.minPoints);
      } else if (formData.targetAudience === 'stamps') {
        payload.minStamps = parseInt(formData.minStamps);
      }

      const res = await api.post('/notifications/send', payload);

      setMessage({
        type: 'success',
        text: `Notificación enviada exitosamente a ${res.data.recipientCount} clientes`
      });

      // Reset form
      setFormData({
        title: '',
        message: '',
        targetAudience: 'all',
        minPoints: 0,
        minStamps: 0
      });
      setSelectedTemplate('');

      // Reload history
      loadNotificationHistory();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Error al enviar la notificación'
      });
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeForPreview = () => {
    return currentTime.toLocaleTimeString('es-CL', {
      hour: '2-digit',
      minute: '2-digit'
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
    return <NoBusinessMessage icon={Bell} />;
  }

  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Bell className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Notificaciones Push</h1>
        </div>
        <p className="text-gray-600">
          Envía notificaciones a tus clientes directamente a sus dispositivos
        </p>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === 'success'
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

      {/* Estadísticas rápidas */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Total de Clientes</p>
              <p className="text-3xl font-bold text-blue-900">{stats.totalCustomers}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Clientes Activos</p>
              <p className="text-3xl font-bold text-green-900">{stats.activeCustomers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form + iPhone Preview */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Formulario de envío */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Send className="w-5 h-5 text-primary-600" />
            Enviar Notificación
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Selector de Plantillas */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
              <label className="block text-sm font-semibold text-purple-900 mb-2">
                ✨ Plantillas Predeterminadas (Opcional)
              </label>
              <select
                value={selectedTemplate}
                onChange={handleTemplateChange}
                className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white"
              >
                <option value="">Crear mensaje personalizado</option>
                <optgroup label="Usuarios Inactivos">
                  <option value="miss_you_2weeks">💙 Te extrañamos - 2 semanas</option>
                  <option value="miss_you_1month">😊 Te extrañamos - 1 mes</option>
                  <option value="comeback">🌟 Vuelve y recibe un regalo</option>
                </optgroup>
                <optgroup label="Promociones y Ofertas">
                  <option value="special_offer">🎉 Oferta especial</option>
                  <option value="new_benefit">✨ Nuevo beneficio disponible</option>
                </optgroup>
                <optgroup label="Fidelización">
                  <option value="points_expiring">⏰ Puntos por vencer</option>
                  <option value="thank_loyal">💝 Agradecimiento por lealtad</option>
                  <option value="milestone">🏆 Felicitaciones por logro</option>
                </optgroup>
              </select>
              <p className="text-xs text-purple-700 mt-2">
                💡 Selecciona una plantilla para auto-completar el título, mensaje y audiencia. Puedes editarlos después.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título de la notificación *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                placeholder="Ej: ¡Nueva promoción disponible!"
                maxLength={50}
              />
              <p className="text-xs text-gray-500 mt-1">{formData.title.length}/50 caracteres</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensaje *
              </label>
              <textarea
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                placeholder="Ej: 50% de descuento en todos nuestros productos hasta el 31/12"
                maxLength={200}
              />
              <p className="text-xs text-gray-500 mt-1">{formData.message.length}/200 caracteres</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Audiencia objetivo *
              </label>
              <select
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              >
                <option value="all">Todos los clientes</option>
                <option value="active">Clientes activos (últimos 30 días)</option>
                <option value="inactive_2weeks">Clientes inactivos (2 semanas)</option>
                <option value="inactive_1month">Clientes inactivos (1 mes)</option>
                <option value="points">Clientes con puntos mínimos</option>
                <option value="stamps">Clientes con sellos mínimos</option>
              </select>
            </div>

            {formData.targetAudience === 'points' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Puntos mínimos
                </label>
                <input
                  type="number"
                  name="minPoints"
                  min="0"
                  value={formData.minPoints}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="100"
                />
              </div>
            )}

            {formData.targetAudience === 'stamps' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sellos mínimos
                </label>
                <input
                  type="number"
                  name="minStamps"
                  min="0"
                  value={formData.minStamps}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="5"
                />
              </div>
            )}

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Destinatarios estimados:</strong> {getEstimatedRecipients()} clientes
              </p>
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Send className="w-5 h-5" />
              {sending ? 'Enviando...' : 'Enviar Notificación'}
            </button>
          </form>
        </div>

        {/* iPhone Preview */}
        <div className="lg:sticky lg:top-8 lg:self-start">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center gap-2 mb-6">
              <Smartphone className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-bold text-gray-900">Vista Previa</h3>
            </div>

            {/* iPhone Mockup */}
            <div className="mx-auto" style={{ width: '280px' }}>
              {/* iPhone Frame */}
              <div className="relative bg-black rounded-[3rem] p-3 shadow-2xl">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10"></div>

                {/* Screen */}
                <div className="relative bg-gradient-to-b from-blue-900 to-blue-950 rounded-[2.5rem] overflow-hidden" style={{ height: '550px' }}>
                  {/* Status Bar */}
                  <div className="flex items-center justify-between px-6 pt-3 pb-2 text-white text-xs font-medium">
                    <span>{formatTimeForPreview()}</span>
                    <div className="flex items-center gap-1">
                      <div className="flex gap-0.5">
                        <div className="w-1 h-3 bg-white rounded-sm"></div>
                        <div className="w-1 h-3 bg-white rounded-sm opacity-70"></div>
                        <div className="w-1 h-3 bg-white rounded-sm opacity-40"></div>
                        <div className="w-1 h-3 bg-white rounded-sm opacity-20"></div>
                      </div>
                      <svg className="w-4 h-4 ml-1" fill="white" viewBox="0 0 20 20">
                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                      </svg>
                      <div className="w-6 h-3 border-2 border-white rounded-sm ml-1 relative">
                        <div className="absolute inset-0.5 bg-white"></div>
                      </div>
                    </div>
                  </div>

                  {/* Notification */}
                  <div className="px-4 pt-4 animate-slideDown">
                    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden">
                      {/* Notification Header */}
                      <div className="flex items-center gap-3 px-4 pt-3 pb-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center">
                          <Bell className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-900">Karma</p>
                          <p className="text-xs text-gray-500">ahora</p>
                        </div>
                      </div>

                      {/* Notification Content */}
                      <div className="px-4 pb-4">
                        <p className="text-sm font-semibold text-gray-900 mb-1">
                          {formData.title || 'Título de la notificación'}
                        </p>
                        <p className="text-sm text-gray-700">
                          {formData.message || 'El mensaje de tu notificación aparecerá aquí mientras escribes...'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Wallpaper Pattern */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                      backgroundSize: '30px 30px'
                    }}></div>
                  </div>
                </div>

                {/* Home Indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white rounded-full opacity-50"></div>
              </div>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              Vista previa de cómo se verá la notificación en iPhone
            </p>
          </div>
        </div>
      </div>

      {/* Notification History */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <History className="w-5 h-5 text-primary-600" />
          Historial de Notificaciones
        </h2>

        {loadingHistory ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : notificationHistory.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No hay notificaciones enviadas aún</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notificationHistory.map((notification) => (
              <div
                key={notification.id}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  </div>
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                    {notification.recipientCount} destinatarios
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-3">
                  <span>📅 {formatDate(notification.sentAt)}</span>
                  <span>•</span>
                  <span>
                    {notification.targetAudience === 'all' && 'Todos los clientes'}
                    {notification.targetAudience === 'active' && 'Clientes activos'}
                    {notification.targetAudience === 'inactive_2weeks' && 'Clientes inactivos (2 semanas)'}
                    {notification.targetAudience === 'inactive_1month' && 'Clientes inactivos (1 mes)'}
                    {notification.targetAudience === 'points' && `Min. ${notification.minPoints.toLocaleString('es-CL')} puntos`}
                    {notification.targetAudience === 'stamps' && `Min. ${notification.minStamps.toLocaleString('es-CL')} sellos`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200 p-6 mt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-3">💡 Consejos para Notificaciones Efectivas</h3>
        <ul className="text-sm text-gray-700 space-y-2">
          <li>• <strong>Sé breve y claro:</strong> Los títulos deben ser concisos (máx. 50 caracteres)</li>
          <li>• <strong>Crea urgencia:</strong> Usa palabras como "hoy", "ahora", "último día"</li>
          <li>• <strong>Personaliza:</strong> Segmenta tu audiencia para mensajes más relevantes</li>
          <li>• <strong>Timing óptimo:</strong> Envía notificaciones en horarios cuando tus clientes están más activos</li>
          <li>• <strong>Llamado a la acción:</strong> Incluye qué quieres que el cliente haga</li>
        </ul>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
