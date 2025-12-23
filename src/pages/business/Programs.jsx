import { useEffect, useState } from 'react';
import { Plus, AlertCircle, CheckCircle, Star, Award, Edit2, Trash2, Info, HelpCircle } from 'lucide-react';
import api from '../../services/api';
import { useBusinessAuth, NoBusinessMessage } from '../../hooks/useBusinessAuth.jsx';

export default function Programs() {
  const { business, loading: businessLoading, error: businessError } = useBusinessAuth();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    name: '',
    type: 'STAMPS',
    isActive: true,
    stampsRequired: 10,
    pointsConversionRate: 100,
    minimumPurchaseAmount: 0
  });

  useEffect(() => {
    if (business) {
      loadPrograms();
    }
  }, [business]);

  const loadPrograms = async () => {
    try {
      const res = await api.get('/loyalty/programs/my');
      setPrograms(res.data);
    } catch (error) {
      // Si es 404, significa que no hay programas todavía (es normal para negocios nuevos)
      if (error.response?.status === 404) {
        setPrograms([]);
      } else {
        console.error('Error loading programs:', error);
        setMessage({ type: 'error', text: 'Error al cargar los programas' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;

    // Para inputs numéricos con formato, remover los puntos de miles
    if (name === 'pointsConversionRate' || name === 'minimumPurchaseAmount') {
      const numericValue = value.replace(/\./g, '').replace(/[^0-9]/g, '');
      setFormData({
        ...formData,
        [name]: numericValue
      });
    } else {
      setFormData({
        ...formData,
        [name]: inputType === 'checkbox' ? checked : value
      });
    }
  };

  // Formatear número con separador de miles
  const formatNumber = (num) => {
    if (!num || num === '0') return '';
    return parseInt(num).toLocaleString('es-CL');
  };

  // Check if a program of the selected type already exists
  const hasExistingProgram = (type) => {
    return programs.some(program => program.type === type);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Validar campos numéricos
    if (formData.type === 'POINTS') {
      if (!formData.pointsConversionRate || parseInt(formData.pointsConversionRate) < 1) {
        setMessage({ type: 'error', text: 'La conversión de puntos debe ser mayor a 0' });
        return;
      }
    }

    try {
      const payload = {
        name: formData.name,
        isActive: formData.isActive
      };

      // Solo incluir type al crear (no al editar)
      if (!editingProgram) {
        payload.type = formData.type;
      }

      if (formData.type === 'STAMPS') {
        payload.stampsRequired = parseInt(formData.stampsRequired);
      } else {
        payload.pointsConversionRate = parseInt(formData.pointsConversionRate);
        if (formData.minimumPurchaseAmount && parseInt(formData.minimumPurchaseAmount) > 0) {
          payload.minimumPurchaseAmount = parseInt(formData.minimumPurchaseAmount);
        }
      }

      if (editingProgram) {
        // Actualizar programa existente
        await api.patch(`/loyalty/programs/${editingProgram.id}`, payload);
        setMessage({ type: 'success', text: 'Programa actualizado exitosamente' });
      } else {
        // Crear nuevo programa
        await api.post('/loyalty/programs', payload);
        setMessage({ type: 'success', text: 'Programa creado exitosamente' });
      }

      setShowForm(false);
      setEditingProgram(null);
      setFormData({
        name: '',
        type: 'STAMPS',
        isActive: true,
        stampsRequired: 10,
        pointsConversionRate: 100,
        minimumPurchaseAmount: 0
      });
      loadPrograms();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al guardar el programa';

      // Detect if it's a duplicate program error
      let displayMessage = errorMessage;
      if (errorMessage.toLowerCase().includes('already exists') ||
          errorMessage.toLowerCase().includes('ya existe') ||
          errorMessage.toLowerCase().includes('duplicate') ||
          errorMessage.toLowerCase().includes('duplicado')) {
        const programType = formData.type === 'STAMPS' ? 'SELLOS' : 'PUNTOS';
        displayMessage = `❌ No se puede crear otro programa de ${programType}. Solo puedes tener un programa de sellos y un programa de puntos activo. Si deseas cambiar el programa existente, puedes editarlo o eliminarlo primero.`;
      } else if (errorMessage.includes('stampsRequired') || errorMessage.includes('tarjetas de sellos')) {
        displayMessage = `⚠️ No puedes cambiar la cantidad de sellos requeridos porque ya existen tarjetas creadas con este programa. Si necesitas cambiarlo, deberás crear un nuevo programa.`;
      } else if (errorMessage.includes('pointsConversionRate') || errorMessage.includes('transacciones de puntos')) {
        displayMessage = `⚠️ No puedes cambiar la conversión de puntos porque ya existen transacciones con este programa. Si necesitas cambiarlo, deberás crear un nuevo programa.`;
      }

      setMessage({
        type: 'error',
        text: displayMessage
      });

      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleEdit = (program) => {
    setEditingProgram(program);
    setFormData({
      name: program.name,
      type: program.type,
      isActive: program.isActive,
      stampsRequired: parseInt(program.stampsRequired) || 10,
      pointsConversionRate: parseInt(program.pointsConversionRate) || 100,
      minimumPurchaseAmount: parseInt(program.minimumPurchaseAmount) || 0
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (program) => {
    const programType = program.type === 'STAMPS' ? 'sellos' : 'puntos';
    if (!confirm(`¿Estás seguro de que deseas eliminar el programa "${program.name}"?\n\nEsto desactivará el programa pero conservará todo el historial de clientes.`)) {
      return;
    }

    try {
      await api.delete(`/loyalty/programs/${program.id}`);
      setMessage({
        type: 'success',
        text: `Programa eliminado exitosamente. El historial de clientes se mantiene intacto.`
      });
      loadPrograms();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Error al eliminar el programa'
      });
    }
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    setEditingProgram(null);
    setFormData({
      name: '',
      type: 'STAMPS',
      isActive: true,
      stampsRequired: 10,
      pointsConversionRate: 100,
      minimumPurchaseAmount: 0
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
    return <NoBusinessMessage icon={Award} />;
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
            <Award className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">Programas de Fidelización</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            {showForm ? 'Cancelar' : 'Nuevo Programa'}
          </button>
        </div>
        <p className="text-gray-600">
          Gestiona tus programas de sellos y puntos
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

      {/* Form to create/edit program */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {editingProgram ? 'Editar Programa' : 'Crear Nuevo Programa'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del programa *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                placeholder="Ej: 10 cafés, 1 gratis"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de programa *
              </label>
              {editingProgram && (
                <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    ⚠️ No puedes cambiar el tipo de programa (Sellos/Puntos) una vez creado
                  </p>
                </div>
              )}
              <div className="grid md:grid-cols-2 gap-4">
                <label className={`relative flex items-center p-4 border-2 rounded-lg transition-all ${
                  formData.type === 'STAMPS'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${editingProgram ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}>
                  <input
                    type="radio"
                    name="type"
                    value="STAMPS"
                    checked={formData.type === 'STAMPS'}
                    onChange={handleChange}
                    disabled={editingProgram}
                    className="sr-only"
                  />
                  <Star className="w-6 h-6 text-primary-600 mr-3" />
                  <div>
                    <div className="font-semibold text-gray-900">Sellos</div>
                    <div className="text-sm text-gray-600">Sistema de tarjetas con sellos</div>
                  </div>
                </label>

                <label className={`relative flex items-center p-4 border-2 rounded-lg transition-all ${
                  formData.type === 'POINTS'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${editingProgram ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}>
                  <input
                    type="radio"
                    name="type"
                    value="POINTS"
                    checked={formData.type === 'POINTS'}
                    onChange={handleChange}
                    disabled={editingProgram}
                    className="sr-only"
                  />
                  <Award className="w-6 h-6 text-primary-600 mr-3" />
                  <div>
                    <div className="font-semibold text-gray-900">Puntos</div>
                    <div className="text-sm text-gray-600">Sistema de acumulación de puntos</div>
                  </div>
                </label>
              </div>

              {/* Warning if program type already exists (solo al crear, no al editar) */}
              {!editingProgram && hasExistingProgram(formData.type) && (
                <div className="mt-4 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-amber-900 mb-1">
                        ⚠️ Ya existe un programa de {formData.type === 'STAMPS' ? 'SELLOS' : 'PUNTOS'}
                      </h4>
                      <p className="text-sm text-amber-800">
                        Solo puedes tener un programa de cada tipo activo. Si intentas crear otro, el sistema lo rechazará.
                        Si deseas cambiar el programa existente, puedes editarlo o eliminarlo primero.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {formData.type === 'STAMPS' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sellos requeridos *
                </label>
                <input
                  type="number"
                  name="stampsRequired"
                  required
                  min="1"
                  value={formData.stampsRequired}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="10"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Cantidad de sellos necesarios para completar la tarjeta
                </p>
              </div>
            )}

            {formData.type === 'POINTS' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Conversión de puntos *
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-700 font-medium">1 punto por cada $</span>
                    <input
                      type="text"
                      name="pointsConversionRate"
                      required
                      value={formatNumber(formData.pointsConversionRate)}
                      onChange={handleChange}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                      placeholder="100"
                    />
                    <span className="text-gray-700 font-medium">pesos</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Ejemplo: Si pones 100, el cliente obtendrá 1 punto por cada $100 que gaste
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monto mínimo de compra (opcional)
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-700">$</span>
                    <input
                      type="text"
                      name="minimumPurchaseAmount"
                      value={formatNumber(formData.minimumPurchaseAmount)}
                      onChange={handleChange}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                      placeholder="0"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Compra mínima para otorgar puntos. Dejar vacío para no tener mínimo
                  </p>
                </div>
              </>
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
                Programa activo
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
                {editingProgram ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Actualizar Programa
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Crear Programa
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Programs List */}
      {programs.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No tienes programas de fidelización
          </h3>
          <p className="text-gray-600 mb-6">
            Crea tu primer programa de sellos o puntos para comenzar a fidelizar clientes
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            Crear Primer Programa
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {programs.map((program) => (
            <div
              key={program.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`p-3 rounded-xl ${
                    program.type === 'STAMPS'
                      ? 'bg-gradient-to-br from-primary-50 to-accent-50'
                      : 'bg-gradient-to-br from-accent-50 to-primary-50'
                  }`}>
                    {program.type === 'STAMPS' ? (
                      <Star className="w-8 h-8 text-primary-600" />
                    ) : (
                      <Award className="w-8 h-8 text-accent-600" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{program.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        program.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {program.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Tipo:</span>
                        <span className="capitalize">
                          {program.type === 'STAMPS' ? 'Sellos' : 'Puntos'}
                        </span>
                      </div>

                      {program.type === 'STAMPS' && program.stampsRequired && (
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-primary-600" />
                          <span>{program.stampsRequired} sellos requeridos</span>
                        </div>
                      )}

                      {program.type === 'POINTS' && program.pointsConversionRate && (
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-accent-600" />
                          <span>1 punto por cada ${Number(program.pointsConversionRate).toLocaleString('es-CL')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(program)}
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-all"
                    title="Editar programa"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(program)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Eliminar programa"
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
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6 mt-8">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <HelpCircle className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-3">¿Cómo funcionan los programas?</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-primary-600" />
                  <h4 className="font-semibold text-gray-900">Programas de Sellos</h4>
                </div>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• El cliente acumula <strong>sellos</strong> por cada compra</li>
                  <li>• Define cuántos sellos se necesitan (ej: 10 sellos)</li>
                  <li>• Al completar la tarjeta, obtiene una recompensa</li>
                  <li>• Perfecto para: cafeterías, restaurantes, peluquerías</li>
                  <li>• <strong>Ejemplo:</strong> "10 cafés, 1 gratis"</li>
                </ul>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-accent-600" />
                  <h4 className="font-semibold text-gray-900">Programas de Puntos</h4>
                </div>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• El cliente acumula <strong>puntos proporcionales al monto gastado</strong></li>
                  <li>• Define la conversión (ej: 1 punto por cada $100 pesos)</li>
                  <li>• Si gasta $5.000 con conversión de $100 → obtiene 50 puntos</li>
                  <li>• Los puntos se canjean por recompensas en el catálogo</li>
                  <li>• Perfecto para: tiendas retail, supermercados, restaurantes</li>
                  <li>• <strong>Ejemplo:</strong> "1 punto por cada $100 gastados"</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-900">
                <strong>💡 Tip:</strong> Puedes tener múltiples programas activos al mismo tiempo. Por ejemplo,
                un programa de sellos para cafés y otro de puntos para productos de pastelería.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
