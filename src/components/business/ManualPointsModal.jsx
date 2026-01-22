import { useState, useEffect } from 'react';
import { X, Phone, Mail, Calculator, AlertCircle, CheckCircle, Award, Star, Minus, Plus } from 'lucide-react';
import api from '../../services/api';
import PinInput from '../common/PinInput';

export default function ManualPointsModal({ isOpen, onClose, program, onSuccess }) {
  const [identifierType, setIdentifierType] = useState('phone'); // 'phone' or 'email'
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [stampsCount, setStampsCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [earnedValue, setEarnedValue] = useState(0);

  const isStampsProgram = program?.type === 'STAMPS';

  // Calculate points preview (only for POINTS programs)
  const calculatedPoints = !isStampsProgram && purchaseAmount && program?.pointsConversionRate
    ? Math.floor(parseFloat(purchaseAmount) / program.pointsConversionRate)
    : 0;

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setIdentifierType('phone');
      setPhone('');
      setEmail('');
      setPin('');
      setPurchaseAmount('');
      setStampsCount(1);
      setError('');
      setSuccess(false);
      setEarnedValue(0);
    }
  }, [isOpen]);

  const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, '');

    if (digits.length <= 2) {
      return digits;
    } else if (digits.length <= 3) {
      return `+${digits.slice(0, 2)} ${digits.slice(2)}`;
    } else if (digits.length <= 7) {
      return `+${digits.slice(0, 2)} ${digits.slice(2, 3)} ${digits.slice(3)}`;
    } else {
      return `+${digits.slice(0, 2)} ${digits.slice(2, 3)} ${digits.slice(3, 7)} ${digits.slice(7, 11)}`;
    }
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const getCleanPhone = () => {
    return '+' + phone.replace(/\D/g, '');
  };

  const validateForm = () => {
    if (identifierType === 'phone') {
      const cleanPhone = getCleanPhone();
      if (cleanPhone.length < 12) {
        setError('Ingresa un número de teléfono válido (+56 9 XXXX XXXX)');
        return false;
      }
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Ingresa un email válido');
        return false;
      }
    }

    if (pin.length !== 4) {
      setError('Ingresa el PIN de 4 dígitos del cliente');
      return false;
    }

    if (!isStampsProgram) {
      // Validations for POINTS
      if (!purchaseAmount || parseFloat(purchaseAmount) <= 0) {
        setError('Ingresa un monto de compra válido');
        return false;
      }

      if (program?.minimumPurchaseAmount && parseFloat(purchaseAmount) < program.minimumPurchaseAmount) {
        setError(`El monto mínimo de compra es $${Math.round(program.minimumPurchaseAmount).toLocaleString('es-CL')}`);
        return false;
      }
    } else {
      // Validations for STAMPS
      if (stampsCount < 1 || stampsCount > 10) {
        setError('La cantidad de sellos debe ser entre 1 y 10');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const payload = {
        pin
      };

      if (identifierType === 'phone') {
        payload.phone = getCleanPhone();
      } else {
        payload.email = email;
      }

      let response;

      if (isStampsProgram) {
        // Call stamps endpoint
        payload.stamps = stampsCount;
        response = await api.post('/loyalty/stamp-cards/earn-manual', payload);
        setEarnedValue(response.data.stampsEarned || stampsCount);
      } else {
        // Call points endpoint
        payload.purchaseAmount = parseFloat(purchaseAmount);
        response = await api.post('/loyalty/points/earn-manual', payload);
        setEarnedValue(response.data.pointsEarned || calculatedPoints);
      }

      setSuccess(true);

      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (err) {
      const errorData = err.response?.data;
      let errorMessage = isStampsProgram ? 'Error al otorgar sellos' : 'Error al otorgar puntos';

      if (err.response?.status === 401) {
        errorMessage = 'PIN incorrecto. Verifica el PIN del cliente.';
      } else if (err.response?.status === 404) {
        errorMessage = 'Cliente no encontrado. Verifica el teléfono o email.';
      } else if (err.response?.status === 403) {
        errorMessage = 'El cliente no está inscrito en tu negocio.';
      } else if (errorData?.message) {
        errorMessage = Array.isArray(errorData.message) ? errorData.message.join('. ') : errorData.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isStampsProgram
              ? 'bg-gradient-to-br from-green-100 to-emerald-100'
              : 'bg-gradient-to-br from-primary-100 to-accent-100'}`}>
              {isStampsProgram
                ? <Star className="w-6 h-6 text-green-600" />
                : <Award className="w-6 h-6 text-primary-600" />
              }
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isStampsProgram ? 'Sellos Manual' : 'Puntos Manual'}
              </h2>
              <p className="text-sm text-gray-500">
                Otorgar {isStampsProgram ? 'sellos' : 'puntos'} sin QR
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Success State */}
        {success ? (
          <div className="p-6 text-center">
            <div className={`inline-flex p-4 rounded-full mb-4 ${isStampsProgram ? 'bg-green-100' : 'bg-primary-100'}`}>
              <CheckCircle className={`w-12 h-12 ${isStampsProgram ? 'text-green-600' : 'text-primary-600'}`} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {isStampsProgram ? '¡Sellos Otorgados!' : '¡Puntos Otorgados!'}
            </h3>
            <p className="text-gray-600 mb-4">
              Se han otorgado exitosamente
            </p>
            <div className={`rounded-xl p-6 mb-6 ${isStampsProgram
              ? 'bg-gradient-to-br from-green-50 to-emerald-50'
              : 'bg-gradient-to-br from-primary-50 to-accent-50'}`}>
              <p className={`text-4xl font-bold ${isStampsProgram ? 'text-green-600' : 'text-primary-600'}`}>
                {earnedValue.toLocaleString('es-CL')}
              </p>
              <p className="text-gray-600">{isStampsProgram ? 'sellos' : 'puntos'}</p>
            </div>
            <button
              onClick={handleClose}
              className="w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            {/* Identifier Type Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Identificar cliente por
              </label>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setIdentifierType('phone')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${identifierType === 'phone'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  <Phone className="w-4 h-4" />
                  Teléfono
                </button>
                <button
                  type="button"
                  onClick={() => setIdentifierType('email')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${identifierType === 'email'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  <Mail className="w-4 h-4" />
                  Email
                </button>
              </div>
            </div>

            {/* Phone or Email Input */}
            {identifierType === 'phone' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono del cliente
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="+56 9 1234 5678"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  disabled={loading}
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email del cliente
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="cliente@ejemplo.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  disabled={loading}
                />
              </div>
            )}

            {/* PIN Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PIN del cliente
              </label>
              <PinInput
                value={pin}
                onChange={setPin}
                disabled={loading}
                error={error.includes('PIN')}
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                El cliente debe proporcionar su PIN de 4 dígitos
              </p>
            </div>

            {/* STAMPS: Stamps Count */}
            {isStampsProgram ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cantidad de sellos
                </label>
                <div className="flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => setStampsCount(Math.max(1, stampsCount - 1))}
                    disabled={loading || stampsCount <= 1}
                    className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-5 h-5 text-gray-600" />
                  </button>
                  <div className="flex items-center justify-center w-20 h-16 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                    <span className="text-3xl font-bold text-green-600">{stampsCount}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStampsCount(Math.min(10, stampsCount + 1))}
                    disabled={loading || stampsCount >= 10}
                    className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Máximo 10 sellos por transacción
                </p>
                {program?.stampsRequired && (
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    Este programa requiere {program.stampsRequired} sellos para la recompensa
                  </p>
                )}
              </div>
            ) : (
              <>
                {/* POINTS: Purchase Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monto de compra
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                      $
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={purchaseAmount ? Number(purchaseAmount).toLocaleString('es-CL') : ''}
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/\D/g, '');
                        setPurchaseAmount(rawValue);
                      }}
                      placeholder="0"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                      disabled={loading}
                    />
                  </div>
                  {program?.minimumPurchaseAmount > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Monto mínimo: ${Math.round(program.minimumPurchaseAmount).toLocaleString('es-CL')}
                    </p>
                  )}
                </div>

                {/* Points Preview */}
                {calculatedPoints > 0 && (
                  <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <Calculator className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Puntos a otorgar</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {calculatedPoints.toLocaleString('es-CL')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right text-xs text-gray-500">
                        <p>${Number(purchaseAmount).toLocaleString('es-CL')} ÷ ${Math.round(program?.pointsConversionRate || 0).toLocaleString('es-CL')}</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || (!isStampsProgram && calculatedPoints === 0)}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    Otorgando...
                  </>
                ) : (
                  <>
                    {isStampsProgram ? <Star className="w-5 h-5" /> : <Award className="w-5 h-5" />}
                    Otorgar {isStampsProgram ? `${stampsCount} Sello${stampsCount > 1 ? 's' : ''}` : 'Puntos'}
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
