import { UserPlus, Smartphone, Gift, Repeat, ArrowRight, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    number: '01',
    title: 'Configura en 5 minutos',
    description: 'Crea tu cuenta, personaliza tu tarjeta con tu logo y colores. Listo para usar.',
    color: 'from-blue-500 to-cyan-500',
    details: ['Diseño personalizado', 'Sin código necesario', 'Dashboard intuitivo']
  },
  {
    icon: Smartphone,
    title: 'Clientes se unen',
    number: '02',
    description: 'Tus clientes escanean un QR, registran su email y agregan la tarjeta a su Wallet. En segundos.',
    color: 'from-purple-500 to-pink-500',
    details: ['QR único por cliente', 'Apple & Google Wallet', 'Sin apps que descargar']
  },
  {
    icon: Gift,
    title: 'Acumulan recompensas',
    number: '03',
    description: 'En cada compra, escaneas su código QR y automáticamente suman puntos o sellos.',
    color: 'from-orange-500 to-red-500',
    details: ['Escaneo rápido', 'Actualización instantánea', 'Sin errores manuales']
  },
  {
    icon: Repeat,
    title: 'Regresan por más',
    number: '04',
    description: 'Notificaciones push los traen de vuelta. Canjean recompensas y vuelven una y otra vez.',
    color: 'from-green-500 to-emerald-500',
    details: ['Notificaciones automáticas', 'Ofertas personalizadas', '+ si vretorno']
  }
];

export default function HowItWorks() {
  return (
    <div id="how-it-works" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <span className="bg-primary-100 text-primary-700 text-sm font-semibold px-4 py-2 rounded-full">
              Proceso simple
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            De cero a fidelizando en{' '}
            <span className="text-gradient">4 pasos simples</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Sin complicaciones técnicas. Sin meses de implementación. Sin capacitación extensa.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative group">
                {/* Flecha conectora (solo en desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-20 left-full w-full justify-center items-center -z-10">
                    <ArrowRight className="w-8 h-8 text-primary-300" />
                  </div>
                )}

                <div className="relative bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300 h-full">
                  {/* Número badge */}
                  <div className="absolute -top-4 -left-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${step.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <span className="text-white font-bold text-lg">{step.number}</span>
                    </div>
                  </div>

                  {/* Icono */}
                  <div className="mb-4 mt-4 flex justify-center">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${step.color} shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Contenido */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-center mb-4">{step.description}</p>

                  {/* Details list */}
                  <div className="space-y-2 pt-4 border-t border-gray-100">
                    {step.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Banner destacado mejorado */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-accent-600 rounded-3xl p-10 shadow-2xl">
          {/* Pattern background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '30px 30px'
            }}></div>
          </div>

          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-5 py-2 mb-6">
              <Smartphone className="w-5 h-5 text-white" />
              <span className="text-sm font-semibold text-white">La ventaja de Karma</span>
            </div>

            <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Sin apps que descargar = Mayor conversión
            </h3>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Tus clientes <span className="font-bold underline decoration-white/50">no necesitan descargar ninguna aplicación nueva</span>.
              La tarjeta va directo a <span className="font-bold">Apple Wallet o Google Wallet</span>, las apps que ya usan todos los días.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-4xl font-bold text-white mb-2">0</div>
                <div className="text-white/90 font-medium">Apps que descargar</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-4xl font-bold text-white mb-2">3x</div>
                <div className="text-white/90 font-medium">Más conversión</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-4xl font-bold text-white mb-2">100%</div>
                <div className="text-white/90 font-medium">Compatible</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
