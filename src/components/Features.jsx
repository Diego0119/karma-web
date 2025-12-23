import { Gift, Smartphone, BarChart3, Zap, Shield, HeartHandshake } from 'lucide-react';

const features = [
  {
    icon: Gift,
    title: 'Programa de Recompensas',
    description: 'Crea programas de puntos personalizados que mantienen a tus clientes regresando por más.',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: BarChart3,
    title: 'Analytics en Tiempo Real',
    description: 'Toma decisiones informadas con datos detallados sobre el comportamiento de tus clientes.',
    gradient: 'from-orange-500 to-red-500'
  },
  {
    icon: Zap,
    title: 'Configuración Rápida',
    description: 'Lanza tu programa de fidelización en minutos, no en semanas. Sin complicaciones técnicas.',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    icon: Shield,
    title: 'Seguridad Garantizada',
    description: 'Protegemos los datos de tus clientes con los más altos estándares de seguridad.',
    gradient: 'from-indigo-500 to-blue-500'
  },
  {
    icon: HeartHandshake,
    title: 'Soporte Dedicado',
    description: 'Nuestro equipo está aquí para ayudarte a maximizar el éxito de tu programa.',
    gradient: 'from-pink-500 to-rose-500'
  },
  {
    icon: Smartphone,
    title: 'Apple Wallet y Google Wallet',
    description: 'Se integra directamente con las wallets nativas. Tus clientes no necesitan descargar aplicaciones adicionales.',
    gradient: 'from-purple-500 to-pink-500'
  },
];

export default function Features() {
  return (
    <div id="features" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Todo lo que necesitas para
            <span className="text-gradient block mt-2">fidelizar como un profesional</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Herramientas poderosas diseñadas para hacer crecer tu negocio y construir relaciones duraderas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
