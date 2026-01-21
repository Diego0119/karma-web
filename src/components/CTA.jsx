import { Link } from 'react-router-dom';
import { ArrowRight, Rocket, CheckCircle, Sparkles } from 'lucide-react';

export default function CTA() {
  return (
    <div className="relative py-24 overflow-hidden">
      {/* Background gradient más moderno */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-accent-600 to-primary-700"></div>

      {/* Patrón de puntos */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Círculos decorativos */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Badge superior */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-5 py-2.5 shadow-lg">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm font-semibold text-white">Únete</span>
            </div>
          </div>

          {/* Título principal */}
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight text-center">
            Empieza a fidelizar hoy.{' '}
            <span className="block mt-2">Crece mañana.</span>
          </h2>

          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed text-center">
            Únete a los negocios que están aumentando sus ventas con programas de fidelización que realmente funcionan.
          </p>

          {/* Beneficios rápidos */}
          <div className="grid md:grid-cols-3 gap-4 mb-10 max-w-3xl mx-auto">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
              <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
              <span className="text-white font-medium text-sm">14 días gratis</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
              <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
              <span className="text-white font-medium text-sm">Sin tarjeta requerida</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
              <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
              <span className="text-white font-medium text-sm">Cancela cuando quieras</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/register"
              className="group relative bg-white text-primary-600 px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                <Rocket className="w-6 h-6" />
                Crear mi programa gratis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-12 text-center">
            <p className="text-white/60 text-sm mb-4">Herramienta de confianza para:</p>
            <div className="flex flex-wrap justify-center items-center gap-6">
              <div className="text-white/80 font-semibold">Cafeterías</div>
              <div className="w-1 h-1 bg-white/40 rounded-full"></div>
              <div className="text-white/80 font-semibold">Restaurantes</div>
              <div className="w-1 h-1 bg-white/40 rounded-full"></div>
              <div className="text-white/80 font-semibold">Salones de belleza</div>
              <div className="w-1 h-1 bg-white/40 rounded-full"></div>
              <div className="text-white/80 font-semibold">Gimnasios</div>
              <div className="w-1 h-1 bg-white/40 rounded-full"></div>
              <div className="text-white/80 font-semibold">Retail</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
