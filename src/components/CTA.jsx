import { ArrowRight, Rocket } from 'lucide-react';

export default function CTA() {
  return (
    <div className="relative py-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-8">
          <Rocket className="w-4 h-4 text-white" />
          <span className="text-sm font-medium text-white">Únete a miles de negocios exitosos</span>
        </div>

        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          ¿Listo para transformar tu negocio?
        </h2>

        <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
          Comienza tu prueba gratuita hoy y descubre cómo Karma puede ayudarte a construir relaciones duraderas con tus clientes.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="group bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2">
            Comenzar gratis por 14 días
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold border-2 border-white/30 hover:bg-white/20 transition-all duration-200">
            Hablar con un experto
          </button>
        </div>

        <p className="text-white/70 text-sm mt-8">
          No se requiere tarjeta de crédito • Configuración en 5 minutos • Cancela cuando quieras
        </p>
      </div>
    </div>
  );
}
