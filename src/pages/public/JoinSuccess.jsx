import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { CheckCircle2, Award, Star, Download, ArrowRight, QrCode } from 'lucide-react';
import { useState } from 'react';

export default function JoinSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showQR, setShowQR] = useState(false);
  const registrationData = location.state;

  // Si no hay datos de registro, redirigir al home
  if (!registrationData) {
    return <Navigate to="/" replace />;
  }

  const { customer, enrolledPrograms } = registrationData;

  // URL para generar QR del cliente
  const customerQrImageUrl = customer.qrCode
    ? `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(customer.qrCode)}&size=300x300&margin=20`
    : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gradient">Karma</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            ¡Bienvenido, {customer.firstName}!
          </h2>
          <p className="text-xl text-gray-600 mb-2">
            Tu registro fue exitoso
          </p>
          <p className="text-gray-500">
            Ya puedes empezar a acumular puntos y sellos
          </p>
        </div>

        {/* Enrolled Programs */}
        {enrolledPrograms && enrolledPrograms.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Programas en los que te inscribiste
            </h3>
            <div className="space-y-4">
              {enrolledPrograms.map((program) => (
                <div
                  key={program.programId}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl border border-primary-200"
                >
                  <div className={`p-3 rounded-lg ${
                    program.type === 'POINTS'
                      ? 'bg-blue-100'
                      : 'bg-green-100'
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
                    <h4 className="font-bold text-gray-900">{program.programName}</h4>
                    <p className="text-sm text-gray-600">
                      {program.type === 'POINTS' ? 'Programa de Puntos' : 'Programa de Sellos'}
                    </p>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Próximos pasos</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 font-bold">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Descarga tu tarjeta digital</h4>
                <p className="text-sm text-gray-600">
                  Agrega tu tarjeta de fidelización a Apple Wallet o Google Wallet para tenerla siempre a mano
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 font-bold">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Muestra tu QR al comprar</h4>
                <p className="text-sm text-gray-600">
                  Cuando hagas una compra, muestra tu código QR desde tu wallet para acumular puntos o sellos
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 font-bold">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Obtén recompensas</h4>
                <p className="text-sm text-gray-600">
                  Canjea tus puntos o completa tus tarjetas para obtener premios y descuentos
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center">
            <div className="mb-4">
              <QrCode className="w-8 h-8 text-primary-600 mx-auto mb-2" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Tu código QR personal</h3>
              <p className="text-sm text-gray-600">
                Este es tu código único para acumular puntos y sellos
              </p>
            </div>

            {!showQR ? (
              <button
                onClick={() => setShowQR(true)}
                className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Ver mi código QR
              </button>
            ) : (
              <div className="space-y-4">
                <div className="inline-block p-6 bg-white rounded-xl border-2 border-gray-200">
                  <img
                    src={customerQrImageUrl}
                    alt="Customer QR Code"
                    className="w-64 h-64"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Guarda este código o agrégalo a tu wallet
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <button
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-4 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all"
              onClick={() => window.alert('Funcionalidad de Apple Wallet próximamente')}
            >
              <Download className="w-5 h-5" />
              Agregar a Apple Wallet
            </button>

            <button
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all"
              onClick={() => window.alert('Funcionalidad de Google Wallet próximamente')}
            >
              <Download className="w-5 h-5" />
              Agregar a Google Wallet
            </button>
          </div>
        </div>

        {/* Info Note */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900 text-center">
            💡 <strong>Tip:</strong> Agrega tu tarjeta a tu wallet para tener acceso rápido cuando hagas compras
          </p>
        </div>
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
