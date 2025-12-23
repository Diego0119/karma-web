import { UserPlus, Smartphone, Gift, Repeat } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    number: '01',
    title: 'Cliente se registra',
    description: 'Tus clientes se registran con su email o número de teléfono. Simple y rápido.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Smartphone,
    title: 'Agregan a su Wallet',
    number: '02',
    description: 'La tarjeta de fidelización se agrega automáticamente a Apple Wallet o Google Wallet. Sin aplicaciones que descargar.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Gift,
    title: 'Acumulan puntos o sellos',
    number: '03',
    description: 'Con cada compra, tus clientes acumulan puntos o sellos automáticamente en su wallet. Siempre a mano.',
    color: 'from-orange-500 to-red-500'
  },
  {
    icon: Repeat,
    title: 'Canjean recompensas',
    number: '04',
    description: 'Los clientes canjean sus puntos por recompensas directamente desde su wallet y vuelven una y otra vez.',
    color: 'from-green-500 to-emerald-500'
  }
];

export default function HowItWorks() {
  return (
    <div id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            ¿Cómo funciona?
            <span className="text-gradient block mt-2">Simple y sin complicaciones</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Implementa tu programa de fidelización en minutos. Tus clientes usan Apple Wallet o Google Wallet, sin descargar nada nuevo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                {/* Línea conectora (solo en desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-gray-200 to-gray-300 -z-10"></div>
                )}

                <div className="text-center">
                  {/* Número */}
                  <div className="text-6xl font-bold text-gray-100 mb-4">{step.number}</div>

                  {/* Icono */}
                  <div className="relative -mt-16 mb-6 flex justify-center">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${step.color} shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Contenido */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Banner destacado */}
        <div className="mt-16 bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-8 border-2 border-primary-200">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              🚀 Directo a Apple Wallet y Google Wallet
            </h3>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Tus clientes <span className="font-semibold text-primary-700">no necesitan descargar ninguna aplicación nueva</span>.
              La tarjeta de fidelización se agrega directamente a <span className="font-semibold text-primary-700">Apple Wallet o Google Wallet</span>, las apps que ya tienen en sus teléfonos.
              Esto significa <span className="font-semibold text-primary-700">más conversiones y menos barreras</span> para tus clientes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
