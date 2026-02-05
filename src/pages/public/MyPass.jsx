import { useState, useRef, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Store, AlertCircle, Loader2, Download, QrCode, Lock, CreditCard, Search } from 'lucide-react';
import api from '../../services/api';

export default function MyPass() {
  const { businessQrCode } = useParams();
  const [step, setStep] = useState(businessQrCode ? 'form' : 'selectBusiness'); // 'selectBusiness', 'form', 'success'
  const [businessInfo, setBusinessInfo] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [customerData, setCustomerData] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    pin: ''
  });
  const pinInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Cargar info del negocio si viene por QR, o cargar todos los negocios
  useEffect(() => {
    if (businessQrCode) {
      loadBusinessInfo();
    } else {
      loadAllBusinesses();
    }
  }, [businessQrCode]);

  const loadBusinessInfo = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/public/business/${businessQrCode}`);
      setBusinessInfo(res.data);
      setSelectedBusiness(res.data.business);
      setStep('form');
    } catch {
      setError('Negocio no encontrado');
    } finally {
      setLoading(false);
    }
  };

  // Cargar todos los negocios
  const loadAllBusinesses = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/public/businesses');
      setBusinesses(res.data || []);
    } catch {
      setError('Error al cargar negocios');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar negocios localmente
  const filteredBusinesses = useMemo(() => {
    if (!searchTerm.trim()) return businesses;
    const search = searchTerm.toLowerCase();
    return businesses.filter(b =>
      b.name.toLowerCase().includes(search) ||
      b.category?.toLowerCase().includes(search)
    );
  }, [businesses, searchTerm]);

  const handleSelectBusiness = (business) => {
    setSelectedBusiness(business);
    setStep('form');
    setError('');
  };

  // PIN input handlers
  const handlePinChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;

    const newPin = formData.pin.split('');
    newPin[index] = value;
    setFormData({ ...formData, pin: newPin.join('').slice(0, 4) });

    if (value && index < 3) {
      pinInputRefs[index + 1].current?.focus();
    }
  };

  const handlePinKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !formData.pin[index] && index > 0) {
      pinInputRefs[index - 1].current?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      pinInputRefs[index - 1].current?.focus();
    }
    if (e.key === 'ArrowRight' && index < 3) {
      pinInputRefs[index + 1].current?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.pin.length !== 4) {
      setError('Ingresa tu PIN de 4 dígitos');
      return;
    }

    if (!selectedBusiness) {
      setError('Selecciona un negocio');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await api.post('/public/my-pass', {
        email: formData.email,
        pin: formData.pin,
        businessId: selectedBusiness.id
      });

      setCustomerData(res.data);
      setStep('success');
    } catch (err) {
      const message = err.response?.data?.message;
      if (message?.toLowerCase().includes('no encontrado') || message?.toLowerCase().includes('not found')) {
        setError('No encontramos una cuenta con ese email');
      } else if (message?.toLowerCase().includes('pin') || message?.toLowerCase().includes('unauthorized')) {
        setError('PIN incorrecto');
      } else if (message?.toLowerCase().includes('inscrito') || message?.toLowerCase().includes('enrolled')) {
        setError('No estás inscrito en este negocio');
      } else {
        setError(message || 'Error al verificar. Intenta nuevamente.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Funciones de wallet
  const addToAppleWallet = () => {
    if (!customerData) return;
    const apiUrl = import.meta.env.VITE_API_URL || '/api';
    window.location.href = `${apiUrl}/wallet/apple/${customerData.customer.id}/${customerData.business.id}`;
  };

  const addToGoogleWallet = async () => {
    if (!customerData) return;
    setSubmitting(true);
    try {
      const response = await api.get(`/wallet/google/${customerData.customer.id}/${customerData.business.id}`);
      if (response.data.saveUrl) {
        window.open(response.data.saveUrl, '_blank');
      }
    } catch {
      setError('Error al generar la tarjeta de Google Wallet');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !businessInfo && !businesses.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link to="/" className="text-2xl font-bold text-gradient">Karma</Link>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-12">
        {/* Step: Select Business */}
        {step === 'selectBusiness' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Recuperar mi pase</h2>
              <p className="text-gray-600">Selecciona el negocio del que quieres descargar tu pase</p>
            </div>

            {/* Filter */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filtrar por nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Cargando negocios...</p>
              </div>
            )}

            {/* Business List */}
            {!loading && filteredBusinesses.length > 0 && (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                <p className="text-sm text-gray-500 mb-2">
                  {filteredBusinesses.length} negocio{filteredBusinesses.length !== 1 ? 's' : ''} disponible{filteredBusinesses.length !== 1 ? 's' : ''}
                </p>
                {filteredBusinesses.map((business) => (
                  <button
                    key={business.id}
                    onClick={() => handleSelectBusiness(business)}
                    className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-primary-50 rounded-xl border border-gray-200 hover:border-primary-300 transition-all text-left"
                  >
                    {business.logo ? (
                      <img src={business.logo} alt={business.name} className="w-12 h-12 rounded-lg object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center">
                        <Store className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{business.name}</h4>
                      {business.category && (
                        <p className="text-sm text-gray-500">{business.category}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && businesses.length > 0 && filteredBusinesses.length === 0 && (
              <div className="text-center py-8">
                <Store className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No se encontraron negocios con "{searchTerm}"</p>
              </div>
            )}

            {!loading && businesses.length === 0 && !error && (
              <div className="text-center py-8">
                <Store className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No hay negocios disponibles</p>
              </div>
            )}

            {/* Info */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> También puedes escanear el QR del negocio para ir directamente al formulario.
              </p>
            </div>
          </div>
        )}

        {/* Step: Form */}
        {step === 'form' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Selected Business */}
            {selectedBusiness && (
              <div className="flex items-center gap-4 p-4 bg-primary-50 rounded-xl border border-primary-200 mb-8">
                {selectedBusiness.logo ? (
                  <img src={selectedBusiness.logo} alt={selectedBusiness.name} className="w-12 h-12 rounded-lg object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center">
                    <Store className="w-6 h-6 text-white" />
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{selectedBusiness.name}</h4>
                  <p className="text-sm text-gray-500">Descargando pase de este negocio</p>
                </div>
                {!businessQrCode && (
                  <button
                    onClick={() => { setStep('selectBusiness'); setSelectedBusiness(null); }}
                    className="text-sm text-primary-600 hover:underline"
                  >
                    Cambiar
                  </button>
                )}
              </div>
            )}

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifica tu identidad</h2>
              <p className="text-gray-600">Ingresa tu email y PIN para descargar tu pase</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PIN de 4 dígitos
                </label>
                <div className="flex gap-3 justify-center">
                  {[0, 1, 2, 3].map((index) => (
                    <input
                      key={index}
                      ref={pinInputRefs[index]}
                      type="password"
                      inputMode="numeric"
                      maxLength={1}
                      value={formData.pin[index] || ''}
                      onChange={(e) => handlePinChange(index, e.target.value)}
                      onKeyDown={(e) => handlePinKeyDown(index, e)}
                      className="w-14 h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                      disabled={submitting}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  'Verificar y descargar pase'
                )}
              </button>
            </form>
          </div>
        )}

        {/* Step: Success */}
        {step === 'success' && customerData && (
          <>
            {/* Success Message */}
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                ¡Hola, {customerData.customer.firstName}!
              </h2>
              <p className="text-gray-600">
                Tu pase de <strong>{customerData.business.name}</strong> está listo
              </p>
            </div>

            {/* QR Code */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Tu código QR</h3>
                <div className="inline-block p-4 bg-white rounded-xl border-2 border-gray-200 mb-4">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(customerData.customer.qrCode)}&size=200x200&margin=20`}
                    alt="Tu código QR"
                    className="w-40 h-40"
                  />
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            {/* Wallet Buttons */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">Descarga tu pase</h3>
              <p className="text-gray-600 text-center mb-6 text-sm">
                Guárdalo en tu wallet para tenerlo siempre disponible
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <button
                  onClick={addToAppleWallet}
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-4 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50"
                >
                  <Download className="w-5 h-5" />
                  Apple Wallet
                </button>
                <button
                  onClick={addToGoogleWallet}
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Download className="w-5 h-5" />
                  )}
                  Google Wallet
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 py-8 mt-auto">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            Powered by <span className="font-semibold text-gradient">Karma</span>
          </p>
        </div>
      </div>
    </div>
  );
}
