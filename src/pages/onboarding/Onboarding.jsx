import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Award, Sparkles, CheckCircle, ChevronRight, ArrowRight } from 'lucide-react';
import api from '../../services/api';

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Business Info
  const [businessData, setBusinessData] = useState({
    category: '',
    address: '',
    phone: ''
  });
  const [customCategory, setCustomCategory] = useState('');

  // Step 2: Program Selection
  const [programType, setProgramType] = useState('');
  const [programData, setProgramData] = useState({
    name: '',
    stampsRequired: 10,
    pointsConversionRate: 1000
  });

  const categories = [
    'Cafetería',
    'Restaurante',
    'Retail',
    'Belleza y Spa',
    'Gimnasio',
    'Panadería',
    'Otro'
  ];

  const handleBusinessDataChange = (field, value) => {
    setBusinessData({ ...businessData, [field]: value });
  };

  const handleProgramTypeSelect = (type) => {
    setProgramType(type);
    if (type === 'STAMPS') {
      setProgramData({ ...programData, name: 'Tarjeta de Sellos' });
    } else {
      setProgramData({ ...programData, name: 'Programa de Puntos' });
    }
  };

  const handleStep1Next = async () => {
    setLoading(true);
    try {
      const dataToSave = {
        category: businessData.category === 'Otro' ? customCategory : businessData.category,
        address: businessData.address,
        phone: businessData.phone
      };

      // Intentar obtener el negocio existente
      try {
        const businessRes = await api.get('/business/me');
        if (businessRes.data && businessRes.data.id) {
          // Si existe, actualizar
          await api.patch(`/business/${businessRes.data.id}`, dataToSave);
        }
      } catch (error) {
        // Si no existe (404), crear el negocio
        if (error.response?.status === 404) {
          await api.post('/business', {
            name: 'Mi Negocio', // Nombre por defecto, se puede cambiar después
            description: '',
            ...dataToSave
          });
        } else {
          throw error; // Re-lanzar otros errores
        }
      }

      setCurrentStep(2);
    } catch (error) {
      console.error('Error saving business:', error);
      alert('Error al guardar información del negocio. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Next = async () => {
    if (!programType) return;

    setLoading(true);
    try {
      // Crear programa
      const payload = {
        name: programData.name,
        type: programType,
        isActive: true
      };

      if (programType === 'STAMPS') {
        payload.stampsRequired = programData.stampsRequired;
      } else {
        payload.pointsConversionRate = programData.pointsConversionRate;
      }

      await api.post('/loyalty/programs', payload);
      setCurrentStep(3);
    } catch (error) {
      console.error('Error creating program:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    // Verificar que el negocio exista antes de saltar
    try {
      await api.get('/business/me');
      // Si existe, ir al dashboard
      navigate('/dashboard');
    } catch (error) {
      // Si no existe (404), crear el negocio con datos mínimos
      if (error.response?.status === 404) {
        try {
          await api.post('/business', {
            name: 'Mi Negocio',
            description: '',
            category: '',
            address: '',
            phone: ''
          });
          navigate('/dashboard');
        } catch (createError) {
          console.error('Error creating business:', createError);
          alert('Error al crear el perfil del negocio. Por favor completa el onboarding.');
        }
      } else {
        navigate('/dashboard');
      }
    }
  };

  const handleFinish = () => {
    navigate('/dashboard');
  };

  const steps = [
    { number: 1, title: 'Tu Negocio' },
    { number: 2, title: 'Tu Programa' },
    { number: 3, title: '¡Listo!' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Configuración inicial</h1>
                <p className="text-sm text-gray-600">Solo te tomará 2 minutos</p>
              </div>
            </div>
            <button
              onClick={handleSkip}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Saltar por ahora
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                      currentStep >= step.number
                        ? 'bg-gradient-to-br from-primary-600 to-accent-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-4 transition-all ${
                      currentStep > step.number ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Step 1: Business Info */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50 mb-4">
                <Store className="w-10 h-10 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Cuéntanos sobre tu negocio
              </h2>
              <p className="text-gray-600 mb-2">
                Esto nos ayudará a personalizar tu experiencia
              </p>
              <p className="text-sm text-gray-500">
                💡 Podrás cambiar esta información cuando quieras
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría del negocio
                </label>
                <select
                  value={businessData.category}
                  onChange={(e) => {
                    handleBusinessDataChange('category', e.target.value);
                    if (e.target.value !== 'Otro') {
                      setCustomCategory('');
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {businessData.category === 'Otro' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Especifica tu categoría
                  </label>
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    placeholder="Ej: Librería, Ferretería, etc."
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <input
                  type="text"
                  value={businessData.address}
                  onChange={(e) => handleBusinessDataChange('address', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="Calle Principal 123, Santiago"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <input
                  type="tel"
                  value={businessData.phone}
                  onChange={(e) => handleBusinessDataChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="+56912345678"
                />
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={handleSkip}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Saltar
              </button>
              <button
                onClick={handleStep1Next}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    Continuar
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Program Selection */}
        {currentStep === 2 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50 mb-4">
                <Award className="w-10 h-10 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Crea tu primer programa de fidelización
              </h2>
              <p className="text-gray-600 mb-2">
                Elige el tipo de programa que mejor se adapte a tu negocio
              </p>
              <p className="text-sm text-gray-500">
                💡 Podrás ajustar estas configuraciones más adelante
              </p>
            </div>

            {/* Program Type Selection */}
            {!programType ? (
              <div className="space-y-4">
                <button
                  onClick={() => handleProgramTypeSelect('STAMPS')}
                  className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all text-left group"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg group-hover:from-primary-200 group-hover:to-accent-200 transition-all">
                      <Award className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        Tarjeta de Sellos
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Perfecto para cafeterías, panaderías, peluquerías
                      </p>
                      <p className="text-sm text-gray-500">
                        Ejemplo: Acumula 10 sellos y obtén 1 producto gratis
                      </p>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-primary-600 transition-colors" />
                  </div>
                </button>

                <button
                  onClick={() => handleProgramTypeSelect('POINTS')}
                  className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all text-left group"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-accent-100 to-primary-100 rounded-lg group-hover:from-accent-200 group-hover:to-primary-200 transition-all">
                      <Sparkles className="w-6 h-6 text-accent-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        Programa de Puntos
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Ideal para restaurantes, retail, gimnasios
                      </p>
                      <p className="text-sm text-gray-500">
                        Ejemplo: Cada $1000 = 1 punto. Canjea puntos por premios
                      </p>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-primary-600 transition-colors" />
                  </div>
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-primary-800">
                      <span className="font-semibold">
                        {programType === 'STAMPS' ? 'Tarjeta de Sellos' : 'Programa de Puntos'}
                      </span>{' '}
                      seleccionado
                    </p>
                    <p className="text-xs text-primary-600">
                      Editable después
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del programa
                  </label>
                  <input
                    type="text"
                    value={programData.name}
                    onChange={(e) => setProgramData({ ...programData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    placeholder={programType === 'STAMPS' ? 'Tarjeta de Sellos' : 'Programa de Puntos'}
                  />
                </div>

                {programType === 'STAMPS' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ¿Cuántos sellos se necesitan?
                    </label>
                    <select
                      value={programData.stampsRequired}
                      onChange={(e) =>
                        setProgramData({ ...programData, stampsRequired: parseInt(e.target.value) })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value={5}>5 sellos</option>
                      <option value={8}>8 sellos</option>
                      <option value={10}>10 sellos</option>
                      <option value={12}>12 sellos</option>
                    </select>
                  </div>
                )}

                {programType === 'POINTS' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Conversión de puntos
                    </label>
                    <select
                      value={programData.pointsConversionRate}
                      onChange={(e) =>
                        setProgramData({
                          ...programData,
                          pointsConversionRate: parseInt(e.target.value)
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value={100}>Cada $100 = 1 punto</option>
                      <option value={500}>Cada $500 = 1 punto</option>
                      <option value={1000}>Cada $1000 = 1 punto</option>
                      <option value={5000}>Cada $5000 = 1 punto</option>
                    </select>
                  </div>
                )}

                <div className="mt-8 flex gap-3">
                  <button
                    onClick={() => setProgramType('')}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Volver
                  </button>
                  <button
                    onClick={handleStep2Next}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creando...
                      </>
                    ) : (
                      <>
                        Crear programa
                        <ChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Success */}
        {currentStep === 3 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 mb-6">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                ¡Todo listo!
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Tu programa de fidelización está activo
              </p>

              <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-8 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Próximos pasos:
                </h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-primary-600 rounded-full mt-1">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-gray-700">
                      <span className="font-semibold">Personaliza tu tarjeta</span> en la sección de Personalización
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-primary-600 rounded-full mt-1">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-gray-700">
                      <span className="font-semibold">Registra tu primera venta</span> escaneando el QR de un cliente
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-primary-600 rounded-full mt-1">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-gray-700">
                      <span className="font-semibold">Crea recompensas</span> para motivar a tus clientes
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleFinish}
                className="w-full px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-lg"
              >
                Ir al Dashboard
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
