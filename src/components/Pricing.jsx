import { Link } from 'react-router-dom';
import { Check, Sparkles, TrendingUp, X } from 'lucide-react';
import { PRICING } from '../constants/pricing';

const includedFeatures = [
  'Clientes ilimitados',
  'Programas de puntos y sellos',
  'Apple Wallet + Google Wallet',
  'Dashboard de analytics completo',
  'Soporte dedicado por chat',
  'Sin comisiones por transacción',
  'Todas las actualizaciones gratis'
];

const comparisonData = [
  { label: 'Apps tradicionales de fidelización', price: '$150.000+/mes', hasFeature: false },
  { label: 'Tarjetas físicas de papel', price: '$50.000+/mes', hasFeature: false },
  { label: 'Karma - Todo incluido', price: `${PRICING.PRO.formattedWithInterval}`, hasFeature: true }
];

export default function Pricing() {
  return (
    <div id="pricing" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="bg-primary-100 text-primary-700 text-sm font-semibold px-4 py-2 rounded-full">
              Precios transparentes
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Un precio simple.{' '}
            <span className="text-gradient">Todo incluido.</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Sin costos ocultos, sin sorpresas. Paga solo lo que ves, obtén todo lo que necesitas.
          </p>
        </div>

        {/* Comparison table - mobile friendly */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="grid grid-cols-3 gap-4 p-6 bg-gray-50 border-b border-gray-200">
              <div className="text-sm font-semibold text-gray-600">Solución</div>
              <div className="text-sm font-semibold text-gray-600 text-center">Costo mensual</div>
              <div className="text-sm font-semibold text-gray-600 text-center">Todo incluido</div>
            </div>
            {comparisonData.map((item, idx) => (
              <div
                key={idx}
                className={`grid grid-cols-3 gap-4 p-6 items-center ${item.hasFeature ? 'bg-primary-50 border-2 border-primary-200' : 'border-b border-gray-100'
                  }`}
              >
                <div className={`font-semibold ${item.hasFeature ? 'text-primary-900' : 'text-gray-700'}`}>
                  {item.label}
                  {item.hasFeature && (
                    <span className="ml-2 text-xs bg-primary-600 text-white px-2 py-0.5 rounded-full">Recomendado</span>
                  )}
                </div>
                <div className={`text-center font-bold ${item.hasFeature ? 'text-primary-600 text-lg' : 'text-gray-500'}`}>
                  {item.price}
                </div>
                <div className="flex justify-center">
                  {item.hasFeature ? (
                    <Check className="w-6 h-6 text-green-600" />
                  ) : (
                    <X className="w-6 h-6 text-red-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main pricing card */}
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-white via-primary-50/30 to-white rounded-3xl p-8 md:p-12 border-2 border-primary-200 shadow-2xl">
            {/* Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-8 py-3 rounded-full text-sm font-bold flex items-center gap-2 shadow-xl">
                <Sparkles className="w-5 h-5" />
                Plan PRO - Todo Incluido
              </div>
            </div>

            {/* Grid de 2 columnas */}
            <div className="grid lg:grid-cols-2 gap-12 items-start mt-8">
              {/* Precio y CTA */}
              <div>
                <div className="mb-8">
                  <div className="mb-3">
                    <span className="text-gray-600 text-lg font-medium">Precio mensual</span>
                  </div>
                  <div className="flex items-end gap-2 mb-3">
                    <span className="text-6xl md:text-7xl font-extrabold text-gray-900">{PRICING.PRO.formatted}</span>
                    <span className="text-2xl text-gray-600 pb-3 font-semibold">/mes</span>
                  </div>
                  <p className="text-gray-500 text-lg mb-2">+ IVA</p>
                  <p className="text-gray-600 font-medium">
                    Sin contrato • Cancela cuando quieras
                  </p>
                </div>

                {/* CTA */}
                <div className="mb-8">
                  <Link
                    to="/register"
                    className="group w-full bg-gradient-to-r from-primary-600 to-accent-600 text-white px-10 py-5 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
                  >
                    Comenzar gratis 14 días
                    <TrendingUp className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <p className="text-sm text-gray-500 mt-4 text-center">
                    ✓ No se requiere tarjeta de crédito<br />
                    ✓ Configuración en 5 minutos<br />
                    ✓ Soporte en español
                  </p>
                </div>
              </div>

              {/* Features list */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Todo lo que obtienes:</h3>
                <div className="space-y-3">
                  {includedFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-full p-1 mt-0.5 flex-shrink-0">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Enterprise note */}
          <div className="mt-10 text-center">
            <div className="inline-block bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-2xl px-8 py-6">
              <p className="text-gray-700 mb-2">
                <span className="font-bold text-gray-900">¿Tienes múltiples locales o necesitas funciones especiales?</span>
              </p>
              <a
                href="https://wa.me/5696298273?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20el%20plan%20Enterprise%20personalizado.%20Tengo%20m%C3%BAltiples%20locales"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 font-bold text-lg inline-flex items-center gap-2 group"
              >
                Solicita un plan Enterprise personalizado
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
