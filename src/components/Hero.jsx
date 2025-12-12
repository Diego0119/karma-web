import { Sparkles, TrendingUp, Users } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative pt-20 pb-32 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-primary-300/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200 rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-medium text-primary-700">Transforma la fidelización de tus clientes</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Aumenta tus ventas con
            <span className="text-gradient block mt-2">fidelización inteligente</span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            La plataforma de fidelización que necesitas para convertir clientes ocasionales en embajadores de tu marca. Simple, potente y diseñada para negocios modernos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button className="group bg-gradient-to-r from-primary-600 to-accent-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2">
              Comenzar gratis
              <TrendingUp className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold border-2 border-gray-200 hover:border-primary-600 hover:text-primary-600 transition-all duration-200">
              Ver demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl font-bold text-gradient mb-2">+40%</div>
              <div className="text-gray-600 font-medium">Aumento en retención</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl font-bold text-gradient mb-2">5,000+</div>
              <div className="text-gray-600 font-medium">Negocios activos</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl font-bold text-gradient mb-2">98%</div>
              <div className="text-gray-600 font-medium">Satisfacción</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
