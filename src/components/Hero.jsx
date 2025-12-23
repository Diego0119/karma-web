import { Link } from 'react-router-dom';
import { Sparkles, TrendingUp } from 'lucide-react';

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
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Contenido de texto */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200 rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium text-primary-700">Transforma la fidelización de tus clientes</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Aumenta tus ventas con
              <span className="text-gradient block mt-2">fidelización inteligente</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
              La plataforma de fidelización que necesitas para convertir clientes ocasionales en embajadores de tu marca. Simple, potente y diseñada para negocios modernos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 lg:justify-start justify-center">
              <Link
                to="/register"
                className="group bg-gradient-to-r from-primary-600 to-accent-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Comenzar gratis
                <TrendingUp className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#how-it-works"
                className="bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold border-2 border-gray-200 hover:border-primary-600 hover:text-primary-600 transition-all duration-200 text-center"
              >
                Ver cómo funciona
              </a>
            </div>
          </div>

          {/* Imagen del celular */}
          <div className="relative lg:block hidden">
            <div className="relative">
              {/* Círculo decorativo detrás */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 to-accent-400/20 rounded-full blur-3xl transform scale-125"></div>

              {/* Imagen del celular */}
              <div className="relative z-10 flex justify-center">
                <img
                  src="/images/phone_image.png"
                  alt="Karma App - Wallet digital de fidelización"
                  className="w-full max-w-4xl drop-shadow-2xl hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Elementos decorativos flotantes */}
              <div className="absolute -top-10 -left-10 w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-accent-500 to-primary-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
            </div>
          </div>

          {/* Imagen móvil - centrada */}
          <div className="lg:hidden flex justify-center mt-12">
            <img
              src="/images/phone_image.png"
              alt="Karma App - Wallet digital de fidelización"
              className="w-full max-w-sm drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
