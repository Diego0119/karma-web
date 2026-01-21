import { Link } from 'react-router-dom';
import { Sparkles, TrendingUp, Star, Users, Zap } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-white via-primary-50/30 to-white">
      {/* Background gradients - more subtle */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-400/20 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent-400/20 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Contenido de texto */}
          <div className="text-center lg:text-left">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-[1.1] tracking-tight">
              Convierte clientes en{' '}
              <span className="relative inline-block">
                <span className="text-gradient">fans leales</span>
                <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 12" fill="none">
                  <path d="M2 10C60 2 140 2 198 10" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-xl lg:max-w-none mx-auto lg:mx-0">
              La forma más simple de crear programas de fidelización digital. Sin app que descargar, directo a Apple Wallet y Google Wallet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 lg:justify-start justify-center">
              <Link
                to="/register"
                className="group relative bg-gradient-to-r from-primary-600 to-accent-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Prueba gratis 14 días
                  <TrendingUp className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-accent-600 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </Link>
            </div>

            <p className="text-sm text-gray-500 mt-4 lg:text-left text-center">
              Sin tarjeta de crédito • Configuración en 5 minutos
            </p>
          </div>

          {/* Imagen del celular - mejorada */}
          <div className="relative lg:block hidden">
            <div className="relative">
              {/* Círculo decorativo detrás - más grande y sutil */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-full blur-3xl transform scale-150"></div>

              {/* Imagen del celular con efecto de profundidad */}
              <div className="relative z-10 flex justify-center">
                <div className="relative group">
                  <img
                    src="/images/phone_image.png"
                    alt="Karma App - Wallet digital de fidelización"
                    className="w-full max-w-4xl drop-shadow-2xl transform transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Floating card elements */}
                  <div className="absolute top-10 -left-10 bg-white rounded-2xl shadow-2xl p-4 animate-float hidden xl:block">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Ventas mensuales</div>
                        <div className="text-xl font-bold text-gray-900">+32%</div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-20 -right-10 bg-white rounded-2xl shadow-2xl p-4 animate-float-delay hidden xl:block">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Clientes nuevos</div>
                        <div className="text-xl font-bold text-gray-900">+247</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Imagen móvil */}
          <div className="lg:hidden flex justify-center mt-8">
            <img
              src="/images/phone_image.png"
              alt="Karma App - Wallet digital de fidelización"
              className="w-full max-w-sm drop-shadow-2xl"
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float 3s ease-in-out infinite;
          animation-delay: 1.5s;
        }
      `}</style>
    </div>
  );
}
