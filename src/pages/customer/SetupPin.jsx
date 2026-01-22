import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, CheckCircle, AlertCircle, ArrowLeft, Shield } from 'lucide-react';
import api from '../../services/api';
import PinInput from '../../components/common/PinInput';

export default function SetupPin() {
  const navigate = useNavigate();
  const location = useLocation();
  const isChangingPin = location.state?.isChangingPin || false;

  const [step, setStep] = useState(isChangingPin ? 0 : 1); // 0 = current PIN, 1 = new PIN, 2 = confirm PIN
  const [currentPin, setCurrentPin] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCurrentPinSubmit = async () => {
    if (currentPin.length !== 4) {
      setError('Ingresa los 4 dígitos de tu PIN actual');
      return;
    }

    setError('');
    setStep(1);
  };

  const handlePinSubmit = () => {
    if (pin.length !== 4) {
      setError('Ingresa los 4 dígitos de tu PIN');
      return;
    }

    setError('');
    setStep(2);
  };

  const handleConfirmSubmit = async () => {
    if (confirmPin.length !== 4) {
      setError('Ingresa los 4 dígitos para confirmar');
      return;
    }

    if (pin !== confirmPin) {
      setError('Los PINs no coinciden. Intenta de nuevo.');
      setConfirmPin('');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isChangingPin) {
        await api.patch('/customers/pin/update', {
          currentPin,
          newPin: pin
        });
      } else {
        await api.post('/customers/pin/setup', { pin });
      }

      // Redirect to intended destination or customer dashboard
      const redirectTo = location.state?.from || '/customer';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al configurar el PIN';

      if (err.response?.status === 401 && isChangingPin) {
        setError('PIN actual incorrecto');
        setStep(0);
        setCurrentPin('');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setError('');
    if (step === 2) {
      setConfirmPin('');
      setStep(1);
    } else if (step === 1 && isChangingPin) {
      setPin('');
      setStep(0);
    } else if (isChangingPin) {
      navigate(-1);
    }
  };

  const renderStepIndicator = () => {
    const totalSteps = isChangingPin ? 3 : 2;
    const currentStep = isChangingPin ? step + 1 : step;

    return (
      <div className="flex items-center justify-center gap-2 mb-6">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all ${
              i < currentStep
                ? 'w-8 bg-primary-600'
                : i === currentStep
                ? 'w-8 bg-primary-300'
                : 'w-2 bg-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex p-4 bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl mb-4">
              <Lock className="w-12 h-12 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isChangingPin ? 'Cambiar PIN' : 'Configura tu PIN de seguridad'}
            </h1>
            <p className="text-gray-600">
              {isChangingPin
                ? 'Ingresa tu PIN actual y luego el nuevo PIN'
                : 'Este PIN es obligatorio para acumular puntos'}
            </p>
          </div>

          {renderStepIndicator()}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {/* Step 0: Current PIN (only for changing) */}
          {step === 0 && isChangingPin && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700 mb-4">
                  Ingresa tu PIN actual
                </p>
                <PinInput
                  value={currentPin}
                  onChange={setCurrentPin}
                  disabled={loading}
                  error={!!error}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  <ArrowLeft className="w-5 h-5" />
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleCurrentPinSubmit}
                  disabled={currentPin.length !== 4 || loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Enter PIN */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700 mb-4">
                  {isChangingPin ? 'Ingresa tu nuevo PIN de 4 dígitos' : 'Ingresa un PIN de 4 dígitos'}
                </p>
                <PinInput
                  value={pin}
                  onChange={setPin}
                  disabled={loading}
                  error={!!error}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-700">
                    <p className="font-semibold mb-1">Mantén tu PIN seguro</p>
                    <p>Este PIN se te pedirá cuando acumules puntos en los negocios.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                {(isChangingPin || step > 1) && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Atrás
                  </button>
                )}
                <button
                  type="button"
                  onClick={handlePinSubmit}
                  disabled={pin.length !== 4 || loading}
                  className={`${isChangingPin ? 'flex-1' : 'w-full'} px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Confirm PIN */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700 mb-4">
                  Confirma tu PIN
                </p>
                <PinInput
                  value={confirmPin}
                  onChange={setConfirmPin}
                  disabled={loading}
                  error={!!error && confirmPin.length === 4}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  <ArrowLeft className="w-5 h-5" />
                  Atrás
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSubmit}
                  disabled={confirmPin.length !== 4 || loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Confirmar PIN
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer note */}
        {!isChangingPin && (
          <p className="text-center text-sm text-gray-500 mt-6">
            Este paso es obligatorio para tu seguridad
          </p>
        )}
      </div>
    </div>
  );
}
