import { Gift, Smartphone, BarChart3, Zap, Shield, HeartHandshake, Wallet, QrCode, Bell } from 'lucide-react';

const features = [
  {
    icon: Smartphone,
    title: 'Apple & Google Wallet',
    description: 'Tarjetas digitales nativas. Sin apps que descargar, solo un toque y listo.',
    gradient: 'from-purple-500 to-pink-500',
    stats: 'Compatible con todos los smartphones'
  },
  {
    icon: Gift,
    title: 'Puntos y Sellos',
    description: 'Programa de recompensas dual: puntos por compra y sellos por visita. Tú decides.',
    gradient: 'from-blue-500 to-cyan-500',
    stats: 'Personalizable 100%'
  },
  {
    icon: QrCode,
    title: 'Escaneo QR Simple',
    description: 'Los clientes muestran su código, tú escaneas y listo. Rápido y sin errores.',
    gradient: 'from-orange-500 to-red-500',
    stats: 'Menos de 3 segundos'
  },
  {
    icon: BarChart3,
    title: 'Analytics Potentes',
    description: 'Dashboard completo con métricas de clientes, ventas y comportamiento en tiempo real.',
    gradient: 'from-green-500 to-emerald-500',
    stats: 'Datos en tiempo real'
  },
  {
    icon: Bell,
    title: 'Notificaciones Push',
    description: 'Envía promociones y recordatorios directo al wallet. Sin SMS ni emails.',
    gradient: 'from-indigo-500 to-blue-500',
    stats: 'Tasa de apertura +90%'
  },
  {
    icon: Zap,
    title: 'Configuración en 5 minutos',
    description: 'Crea tu programa, personaliza tu tarjeta y empieza a fidelizar. Todo en minutos.',
    gradient: 'from-pink-500 to-rose-500',
    stats: 'Listo en minutos, no semanas'
  },
];

export default function Features() {
  return (
    <div id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header mejorado */}
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <span className="bg-primary-100 text-primary-700 text-sm font-semibold px-4 py-2 rounded-full">
              Características poderosas
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Todo lo que necesitas.{' '}
            <span className="text-gradient">Nada que te sobre.</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Una plataforma completa de fidelización diseñada para negocios que quieren resultados reales, sin complicaciones técnicas.
          </p>
        </div>

        {/* Features grid - más compacto y visual */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300"
              >
                {/* Icon con gradiente */}
                <div className="relative mb-6">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {feature.description}
                </p>

                {/* Stats badge */}
                <div className="inline-block">
                  <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-1.5 rounded-full">
                    {feature.stats}
                  </span>
                </div>

                {/* Hover effect decorativo */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl`}></div>
              </div>
            );
          })}
        </div>

        {/* CTA section dentro de features */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200 rounded-2xl px-8 py-6">
            <div>
              <p className="text-gray-600 mb-2">¿Necesitas integración personalizada o funciones especiales?</p>
              <a
                href="https://wa.me/5696298273?text=Hola%2C%20necesito%20informaci%C3%B3n%20sobre%20integraciones%20personalizadas%20y%20funciones%20especiales%20para%20mi%20negocio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 font-semibold text-lg inline-flex items-center gap-2 group"
              >
                Hablemos de tu caso
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
