import { Link } from 'react-router-dom';
import { TrendingUp, Clock, DollarSign, Users, Zap, Shield } from 'lucide-react';

const benefits = [
  {
    icon: TrendingUp,
    title: 'Aumenta tus ventas hasta un 40%',
    description: 'Los programas de fidelización aumentan la frecuencia de compra y el ticket promedio de tus clientes.',
    stat: '+40%',
    statLabel: 'en ventas'
  },
  {
    icon: Users,
    title: 'Retén más clientes',
    description: 'Convierte compradores ocasionales en clientes recurrentes que vuelven una y otra vez.',
    stat: '5x',
    statLabel: 'más valiosos'
  },
  {
    icon: Clock,
    title: 'Implementación en minutos',
    description: 'No necesitas desarrolladores ni meses de implementación. Configura tu programa en menos de 10 minutos.',
    stat: '10 min',
    statLabel: 'setup'
  },
  {
    icon: DollarSign,
    title: 'Sin costos ocultos',
    description: 'Sin hardware costoso, sin tablets, sin impresoras. Solo una plataforma web simple y accesible.',
    stat: '$0',
    statLabel: 'hardware'
  },
  {
    icon: Zap,
    title: 'Apple Wallet y Google Wallet',
    description: 'Tus clientes usan las wallets nativas de sus teléfonos. No necesitan descargar aplicaciones adicionales.',
    stat: '0',
    statLabel: 'descargas'
  },
  {
    icon: Shield,
    title: 'Datos seguros y protegidos',
    description: 'Toda la información de tus clientes está protegida con los más altos estándares de seguridad.',
    stat: 'SSL',
    statLabel: 'encriptado'
  }
];

export default function Benefits() {
  return (
    <div id="benefits" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Beneficios reales para
            <span className="text-gradient block mt-2">tu negocio</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Diseñado pensando en negocios como el tuyo. Simple, efectivo y sin complicaciones técnicas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Icono y estadística */}
                <div className="flex items-start justify-between mb-6">
                  <div className="bg-gradient-to-r from-primary-500 to-accent-500 p-3 rounded-xl">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gradient">{benefit.stat}</div>
                    <div className="text-xs text-gray-500 font-medium">{benefit.statLabel}</div>
                  </div>
                </div>

                {/* Contenido */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ¿Listo para aumentar la lealtad de tus clientes?
            </h3>
            <p className="text-gray-600 mb-6 max-w-xl">
              Únete a negocios que ya están usando Karma para fidelizar a sus clientes de forma simple y efectiva.
            </p>
            <Link
              to="/register"
              className="inline-block bg-gradient-to-r from-primary-600 to-accent-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              Comenzar gratis
            </Link>
            <p className="text-sm text-gray-500 mt-4">
              Sin tarjeta de crédito • Configuración instantánea
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
