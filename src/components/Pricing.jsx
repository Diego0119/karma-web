import { Link } from 'react-router-dom';
import { Check, Sparkles } from 'lucide-react';

const features = [
  'Clientes ilimitados',
  'Programas de puntos y sellos',
  'Apple Wallet + Google Wallet',
  'Dashboard de analytics',
  'Campañas automatizadas',
  'Notificaciones push',
  'Promociones personalizadas',
  'Soporte dedicado',
  'Sin comisiones por transacción',
  'Actualizaciones incluidas'
];

export default function Pricing() {
  return (
    <div id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Precio simple y transparente
            <span className="text-gradient block mt-2">sin sorpresas</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Un solo precio. Todas las funcionalidades incluidas.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="relative bg-gradient-to-br from-primary-50 to-accent-50 rounded-3xl p-8 md:p-12 border-2 border-primary-300 shadow-2xl">
            {/* Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
                <Sparkles className="w-4 h-4" />
                Todo incluido
              </div>
            </div>

            {/* Precio */}
            <div className="text-center mb-10">
              <div className="mb-4">
                <span className="text-gray-600 text-lg">Desde</span>
              </div>
              <div className="flex items-end justify-center gap-2 mb-2">
                <span className="text-6xl md:text-7xl font-bold text-gray-900">$24.990</span>
                <span className="text-2xl text-gray-600 pb-2">/mes + IVA</span>
              </div>
              <p className="text-gray-600 text-lg">
                Sin contrato • Cancela cuando quieras
              </p>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-2 gap-4 mb-10">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-white/60 backdrop-blur-sm rounded-xl p-4">
                  <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-full p-1 mt-0.5 flex-shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center">
              <Link
                to="/register"
                className="inline-block w-full md:w-auto bg-gradient-to-r from-primary-600 to-accent-600 text-white px-12 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-200"
              >
                Comenzar ahora
              </Link>
              <p className="text-sm text-gray-600 mt-4">
                Prueba gratis por 14 días • No se requiere tarjeta de crédito
              </p>
            </div>
          </div>

          {/* Nota adicional */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              ¿Tienes una cadena de locales o necesidades especiales?{' '}
              <a href="#contact" className="text-primary-600 hover:text-primary-700 font-semibold">
                Contáctanos para un plan Enterprise
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
