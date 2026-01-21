import { Link } from 'react-router-dom';
import { TrendingUp, Zap, Smartphone, Settings, BarChart3, CreditCard } from 'lucide-react';

const benefits = [
  {
    icon: CreditCard,
    title: 'Sin hardware',
    description: 'No compras nada. Ni tablets, ni impresoras, ni tarjetas físicas.'
  },
  {
    icon: Smartphone,
    title: 'Wallet del celular',
    description: 'Tus clientes ya tienen Apple Wallet o Google Wallet. Usamos eso.'
  },
  {
    icon: Settings,
    title: 'Lo configuras tú',
    description: 'Defines las reglas de tu programa. Sin depender de nadie.'
  },
  {
    icon: BarChart3,
    title: 'Ves quién vuelve',
    description: 'Sabes qué clientes regresan y cuánto compran. Datos reales.'
  }
];

export default function Benefits() {
  return (
    <div id="benefits" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Benefits grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-100 text-primary-600 mb-4">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-12 shadow-2xl">
          {/* Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '30px 30px'
            }}></div>
          </div>

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-6">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-semibold text-white">Oferta</span>
            </div>

            <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              14 días gratis para probar todo
            </h3>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              No pedimos tarjeta. No hay trucos. Solo 14 días completos para ver si Karma funciona para tu negocio.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="group bg-white text-gray-900 px-10 py-5 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-200 flex items-center gap-3"
              >
                Comenzar prueba gratis
                <TrendingUp className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <p className="text-sm text-gray-400 mt-6">
              ✓ Sin tarjeta de crédito &nbsp;•&nbsp; ✓ Cancelación instantánea &nbsp;•&nbsp; ✓ Soporte en español
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
