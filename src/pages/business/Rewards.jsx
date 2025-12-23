import { useEffect, useState } from 'react';
import { Plus, AlertCircle, CheckCircle, Gift, Edit2, Trash2, ToggleLeft, ToggleRight, HelpCircle, Star, Award } from 'lucide-react';
import api from '../../services/api';
import { useBusinessAuth, NoBusinessMessage } from '../../hooks/useBusinessAuth.jsx';

export default function Rewards() {
  const { business, loading: businessLoading, error: businessError } = useBusinessAuth();
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReward, setEditingReward] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'POINTS', // POINTS or STAMPS
    pointsCost: 100,
    stampsCost: 5,
    isActive: true
  });

  useEffect(() => {
    if (business) {
      loadRewards();
    }
  }, [business]);

  const loadRewards = async () => {
    try {
      const res = await api.get('/rewards/my');
      setRewards(res.data);
    } catch (error) {
      // Si es 404, significa que no hay recompensas todavía (es normal para negocios nuevos)
      if (error.response?.status === 404) {
        setRewards([]);
      } else {
        console.error('Error loading rewards:', error);
        setMessage({ type: 'error', text: 'Error al cargar las recompensas' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Para inputs numéricos con formato, remover los puntos de miles
    if (name === 'pointsCost' || name === 'stampsCost') {
      const numericValue = value.replace(/\./g, '').replace(/[^0-9]/g, '');
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

  // Formatear número con separador de miles
  const formatNumber = (num) => {
    if (!num || num === '0') return '';
    return parseInt(num).toLocaleString('es-CL');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Validar campos numéricos
    if (formData.type === 'POINTS') {
      if (!formData.pointsCost || parseInt(formData.pointsCost) < 1) {
        setMessage({ type: 'error', text: 'El costo en puntos debe ser mayor a 0' });
        return;
      }
    } else {
      if (!formData.stampsCost || parseInt(formData.stampsCost) < 1) {
        setMessage({ type: 'error', text: 'El costo en sellos debe ser mayor a 0' });
        return;
      }
    }

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        isActive: formData.isActive
      };

      // Agregar el costo según el tipo
      if (formData.type === 'POINTS') {
        payload.pointsCost = parseInt(formData.pointsCost);
      } else {
        payload.stampsCost = parseInt(formData.stampsCost);
      }

      if (editingReward) {
        await api.patch(`/rewards/${editingReward.id}`, payload);
        setMessage({ type: 'success', text: 'Recompensa actualizada exitosamente' });
      } else {
        await api.post('/rewards', payload);
        setMessage({ type: 'success', text: 'Recompensa creada exitosamente' });
      }

      setShowForm(false);
      setEditingReward(null);
      setFormData({
        name: '',
        description: '',
        type: 'POINTS',
        pointsCost: 100,
        stampsCost: 5,
        isActive: true
      });
      loadRewards();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Error al guardar la recompensa'
      });
    }
  };

  const handleEdit = (reward) => {
    setEditingReward(reward);
    setFormData({
      name: reward.name,
      description: reward.description,
      type: reward.type || 'POINTS',
      pointsCost: reward.pointsCost || 100,
      stampsCost: reward.stampsCost || 5,
      isActive: reward.isActive
    });
    setShowForm(true);
  };

  const handleDelete = async (rewardId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta recompensa?')) {
      return;
    }

    try {
      await api.delete(`/rewards/${rewardId}`);
      setMessage({ type: 'success', text: 'Recompensa eliminada exitosamente' });
      loadRewards();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Error al eliminar la recompensa'
      });
    }
  };

  const handleToggleActive = async (reward) => {
    try {
      await api.patch(`/rewards/${reward.id}`, {
        isActive: !reward.isActive
      });
      setMessage({
        type: 'success',
        text: `Recompensa ${!reward.isActive ? 'activada' : 'desactivada'} exitosamente`
      });
      loadRewards();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Error al actualizar la recompensa'
      });
    }
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    setEditingReward(null);
    setFormData({
      name: '',
      description: '',
      type: 'POINTS',
      pointsCost: 100,
      stampsCost: 5,
      isActive: true
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
    return <NoBusinessMessage icon={Gift} />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Gift className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">Recompensas</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            {showForm ? 'Cancelar' : 'Nueva Recompensa'}
          </button>
        </div>
        <p className="text-gray-600">
          Gestiona las recompensas que los clientes pueden canjear con sus puntos o sellos
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
            {editingReward ? 'Editar Recompensa' : 'Crear Nueva Recompensa'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la recompensa *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                placeholder="Ej: Café gratis"
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
                placeholder="Describe la recompensa en detalle..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tipo de recompensa *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'POINTS' })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.type === 'POINTS'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Star className={`w-5 h-5 ${
                      formData.type === 'POINTS' ? 'text-primary-600' : 'text-gray-400'
                    }`} />
                    <span className={`font-semibold ${
                      formData.type === 'POINTS' ? 'text-primary-900' : 'text-gray-700'
                    }`}>
                      Puntos
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Por dinero gastado
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'STAMPS' })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.type === 'STAMPS'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Award className={`w-5 h-5 ${
                      formData.type === 'STAMPS' ? 'text-primary-600' : 'text-gray-400'
                    }`} />
                    <span className={`font-semibold ${
                      formData.type === 'STAMPS' ? 'text-primary-900' : 'text-gray-700'
                    }`}>
                      Sellos
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Por visitas completadas
                  </p>
                </button>
              </div>
            </div>

            {formData.type === 'POINTS' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Costo en puntos *
                </label>
                <input
                  type="text"
                  name="pointsCost"
                  required
                  value={formatNumber(formData.pointsCost)}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="100"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Cantidad de puntos que el cliente debe canjear para obtener esta recompensa
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Costo en sellos *
                </label>
                <input
                  type="number"
                  name="stampsCost"
                  required
                  min="1"
                  step="1"
                  value={formData.stampsCost}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="5"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Cantidad de sellos que el cliente debe canjear para obtener esta recompensa
                </p>
              </div>
            )}

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
                Recompensa activa
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
                {editingReward ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Actualizar Recompensa
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Crear Recompensa
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Rewards List */}
      {rewards.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No tienes recompensas creadas
          </h3>
          <p className="text-gray-600 mb-6">
            Crea recompensas que tus clientes puedan canjear con sus puntos o tarjetas de sellos completadas
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            Crear Primera Recompensa
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-primary-50 to-accent-50">
                    <Gift className="w-8 h-8 text-primary-600" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{reward.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        reward.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {reward.isActive ? 'Activa' : 'Inactiva'}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-3">{reward.description}</p>

                    <div className="flex items-center gap-2 text-sm">
                      {reward.type === 'STAMPS' ? (
                        <span className="px-3 py-1 bg-accent-100 text-accent-700 font-semibold rounded-full flex items-center gap-1">
                          <Award className="w-4 h-4" />
                          {reward.stampsCost} {reward.stampsCost === 1 ? 'sello' : 'sellos'}
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-primary-100 text-primary-700 font-semibold rounded-full flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          {reward.pointsCost.toLocaleString('es-CL')} puntos
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(reward)}
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-all"
                    title={reward.isActive ? 'Desactivar' : 'Activar'}
                  >
                    {reward.isActive ? (
                      <ToggleRight className="w-5 h-5" />
                    ) : (
                      <ToggleLeft className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleEdit(reward)}
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-all"
                    title="Editar"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(reward.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Eliminar"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* How it works section */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200 p-6 mt-8">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-purple-100 rounded-xl">
            <HelpCircle className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-3">¿Cómo funcionan las recompensas?</h3>

            <div className="space-y-4">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary-600" />
                  Sistema de Puntos
                </h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• <strong>Los clientes acumulan puntos proporcionales al monto que gastan</strong> en tu negocio</li>
                  <li>• Tú defines la conversión en tu "Programa de Puntos" (ej: 1 punto por cada $100)</li>
                  <li>• Si un cliente gasta $5.000 y tu conversión es $100 → obtiene 50 puntos</li>
                  <li>• Los clientes ven sus puntos disponibles en su Apple Wallet o Google Wallet</li>
                  <li>• Cuando tienen suficientes puntos, <strong>pueden canjearlos por recompensas</strong> de tu catálogo</li>
                </ul>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-accent-600" />
                  Sistema de Sellos
                </h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• <strong>Los clientes reciben sellos por cada visita</strong> a tu negocio (sin importar el monto)</li>
                  <li>• Tú defines cuántos sellos se necesitan para completar una tarjeta (ej: 10 sellos)</li>
                  <li>• Cada vez que el cliente compra, recibe 1 sello en su tarjeta digital</li>
                  <li>• Cuando completan la tarjeta (todos los sellos), <strong>pueden canjearla por recompensas</strong></li>
                  <li>• Perfecto para negocios que quieren premiar la frecuencia de visitas</li>
                </ul>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-purple-600" />
                  Creando Recompensas
                </h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• <strong>Define el nombre:</strong> "Café gratis", "Descuento 20%", "Producto gratis"</li>
                  <li>• <strong>Elige el tipo:</strong> Por puntos (dinero gastado) o por sellos (visitas)</li>
                  <li>• <strong>Establece el costo:</strong> Cuántos puntos o sellos debe canjear el cliente</li>
                  <li>• <strong>Activa/desactiva:</strong> Controla qué recompensas están disponibles</li>
                  <li>• El cliente escanea su tarjeta y tú canjeas la recompensa desde tu panel</li>
                </ul>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-900">
                    <strong>✅ Ejemplo con Puntos:</strong><br/>
                    Recompensa: "Café gratis"<br/>
                    Tipo: Puntos<br/>
                    Costo: 500 puntos<br/>
                    Conversión: 1 punto por $100<br/>
                    → El cliente necesita gastar $50.000 total
                  </p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>✅ Ejemplo con Sellos:</strong><br/>
                    Recompensa: "Postre gratis"<br/>
                    Tipo: Sellos<br/>
                    Costo: 20 sellos<br/>
                    Tarjeta de: 10 sellos<br/>
                    → El cliente necesita 2 tarjetas completas (20 sellos totales)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
