import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Store, Award, Star, Gift, AlertCircle, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import api from '../../services/api';

export default function JoinBusiness() {
  const { businessQrCode } = useParams();
  const navigate = useNavigate();
  const [businessInfo, setBusinessInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    birthDate: ''
  });

  useEffect(() => {
    loadBusinessInfo();
  }, [businessQrCode]);

  const loadBusinessInfo = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/public/business/${businessQrCode}`);
      setBusinessInfo(res.data);
    } catch (error) {
      console.error('Error loading business:', error);
      setError('Negocio no encontrado');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await api.post(`/public/join/${businessQrCode}`, formData);

      // La cookie httpOnly se guarda automáticamente
      // Guardar datos del cliente para referencia local
      localStorage.setItem('customerQrCode', res.data.customer.qrCode);

      // Redirigir a página de éxito con datos
      navigate('/join-success', { state: res.data });
    } catch (error) {
      console.error('Error joining business:', error);
      setError(
        error.response?.data?.message ||
        error.response?.status === 400 && error.response?.data?.message?.includes('email')
          ? 'Este email ya está registrado. Por favor inicia sesión.'
          : 'Error al registrarse. Por favor intenta nuevamente.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando información...</p>
        </div>
      </div>
    );
  }

  if (error && !businessInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Negocio no encontrado</h2>
          <p className="text-gray-600 mb-6">
            El código QR que escaneaste no es válido o el negocio ya no está activo.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const { business, programs } = businessInfo;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gradient">Karma</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Business Info Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            {business.logo ? (
              <img
                src={business.logo}
                alt={business.name}
                className="w-24 h-24 rounded-2xl mx-auto object-cover shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl mx-auto bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center shadow-lg">
                <Store className="w-12 h-12 text-white" />
              </div>
            )}
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">{business.name}</h2>
          {business.description && (
            <p className="text-lg text-gray-600 mb-2">{business.description}</p>
          )}
          {business.category && (
            <span className="inline-block px-4 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
              {business.category}
            </span>
          )}
        </div>

        {/* Programs Preview */}
        {programs.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-6">
              Únete y disfruta de estos beneficios
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {programs.map((program) => (
                <div
                  key={program.id}
                  className="bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-primary-300 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                      program.type === 'POINTS'
                        ? 'bg-gradient-to-br from-blue-100 to-indigo-100'
                        : 'bg-gradient-to-br from-green-100 to-emerald-100'
                    }`}>
                      {program.type === 'POINTS' ? (
                        <Award className={`w-6 h-6 ${
                          program.type === 'POINTS' ? 'text-blue-600' : 'text-green-600'
                        }`} />
                      ) : (
                        <Star className="w-6 h-6 text-green-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-1">{program.name}</h4>
                      {program.type === 'POINTS' ? (
                        <p className="text-sm text-gray-600">
                          Gana 1 punto por cada ${program.pointsConversionRate} de compra
                        </p>
                      ) : (
                        <p className="text-sm text-gray-600">
                          Completa {program.stampsRequired} sellos y obtén recompensas
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Regístrate gratis
            </h3>
            <p className="text-gray-600">
              Crea tu cuenta y serás inscrito automáticamente en todos los programas
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="Juan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apellido *
                </label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="Pérez"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                placeholder="juan@ejemplo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña * (mínimo 6 caracteres)
              </label>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono (opcional)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="+56912345678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de nacimiento (opcional)
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Registrando...
                </>
              ) : (
                <>
                  Unirse a {business.name}
                  <ArrowRight className="w-6 h-6" />
                </>
              )}
            </button>

            <p className="text-xs text-center text-gray-500">
              Al registrarte, aceptas nuestros términos de servicio y política de privacidad
            </p>
          </form>
        </div>

        {/* Footer Info */}
        {(business.address || business.phone) && (
          <div className="mt-12 text-center space-y-2">
            {business.address && (
              <p className="text-sm text-gray-600">
                📍 {business.address}
              </p>
            )}
            {business.phone && (
              <p className="text-sm text-gray-600">
                📞 {business.phone}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            Powered by <span className="font-semibold text-gradient">Karma</span>
          </p>
        </div>
      </div>
    </div>
  );
}
