import { Check, Star } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: '$29',
    description: 'Perfecto para negocios que están comenzando',
    features: [
      'Hasta 500 clientes activos',
      'Programa de puntos básico',
      'App móvil branded',
      'Dashboard de analytics',
      'Soporte por email'
    ],
    cta: 'Comenzar',
    popular: false
  },
  {
    name: 'Growth',
    price: '$79',
    description: 'Para negocios en crecimiento',
    features: [
      'Hasta 5,000 clientes activos',
      'Programas de puntos ilimitados',
      'App móvil personalizada',
      'Analytics avanzados',
      'Soporte prioritario 24/7',
      'Integraciones con POS',
      'Campañas automatizadas'
    ],
    cta: 'Comenzar prueba',
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Soluciones a medida para grandes empresas',
    features: [
      'Clientes ilimitados',
      'Todo de Growth +',
      'Account manager dedicado',
      'API personalizada',
      'SLA garantizado',
      'Onboarding personalizado',
      'Reportes personalizados'
    ],
    cta: 'Contactar ventas',
    popular: false
  }
];

export default function Pricing() {
  return (
    <div id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Precios transparentes
            <span className="text-gradient block mt-2">sin sorpresas</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Elige el plan que mejor se adapte a tu negocio. Siempre puedes cambiar después.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 ${
                plan.popular
                  ? 'bg-gradient-to-br from-primary-50 to-accent-50 border-2 border-primary-300 shadow-2xl scale-105'
                  : 'bg-white border border-gray-200 hover:border-primary-300 hover:shadow-xl transition-all duration-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    Más Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                  {plan.price !== 'Custom' && <span className="text-gray-600">/mes</span>}
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-full p-1 mt-0.5">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white hover:shadow-xl hover:scale-105'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
