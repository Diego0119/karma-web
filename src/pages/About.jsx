import { Link } from 'react-router-dom';
import { ArrowLeft, Target, Zap, Users, Heart, TrendingUp, Award } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-3">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
              <span className="text-2xl font-bold text-gradient">Karma</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Sobre <span className="text-gradient">Nosotros</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transformamos la manera en que los negocios locales se conectan con sus clientes,
            creando relaciones duraderas a través de la tecnología
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-accent-100 rounded-xl flex items-center justify-center mb-6">
              <Target className="w-7 h-7 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Misión</h2>
            <p className="text-gray-600 leading-relaxed">
              Empoderar a los negocios locales con herramientas digitales de clase mundial
              que les permitan competir con grandes cadenas, fortaleciendo la economía local
              y creando comunidades más conectadas.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="w-14 h-14 bg-gradient-to-br from-accent-100 to-primary-100 rounded-xl flex items-center justify-center mb-6">
              <Zap className="w-7 h-7 text-accent-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Visión</h2>
            <p className="text-gray-600 leading-relaxed">
              Ser la plataforma líder de fidelización en Latinoamérica, donde cada negocio local
              pueda ofrecer experiencias digitales excepcionales que conviertan clientes
              ocasionales en embajadores de marca.
            </p>
          </div>
        </div>

        {/* Our Story */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-16 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Nuestra Historia</h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              Karma nació de una observación simple pero poderosa: los negocios locales tienen
              productos y servicios excepcionales, pero carecen de las herramientas tecnológicas
              que las grandes empresas utilizan para fidelizar clientes.
            </p>
            <p>
              Mientras las cadenas multinacionales cuentan con sofisticados programas de puntos
              y aplicaciones móviles, los comercios locales dependen de tarjetas de papel que
              se pierden, se olvidan y terminan en la basura.
            </p>
            <p>
              Decidimos cambiar esto. Creamos Karma para democratizar la fidelización digital,
              ofreciendo una plataforma tan poderosa como las que usan las grandes marcas,
              pero accesible y fácil de usar para cualquier negocio local.
            </p>
            <p className="font-semibold text-gray-900">
              Hoy, estamos orgullosos de ayudar a negocios locales en Punta Arenas y más allá
              a construir relaciones más fuertes con sus clientes, una transacción a la vez.
            </p>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Nuestros Valores</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Cercanía</h3>
              <p className="text-gray-600">
                Creemos en el poder de las relaciones locales. Trabajamos codo a codo
                con nuestros clientes para entender sus necesidades únicas.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Simplicidad</h3>
              <p className="text-gray-600">
                La tecnología debe ser invisible. Creamos soluciones tan intuitivas
                que cualquiera puede usarlas desde el primer día.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Impacto</h3>
              <p className="text-gray-600">
                No solo vendemos software, generamos resultados reales. Nuestro éxito
                se mide por el crecimiento de nuestros clientes.
              </p>
            </div>
          </div>
        </div>

        {/* Why Karma */}
        <div className="bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl shadow-xl p-8 md:p-12 text-white mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <Award className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl font-bold mb-6">¿Por qué Karma?</h2>
            <p className="text-lg leading-relaxed opacity-95 mb-6">
              El nombre "Karma" refleja nuestra filosofía: lo que das, vuelve. Cuando los negocios
              invierten en experiencias excepcionales para sus clientes, estos responden con lealtad,
              referencias y compras repetidas.
            </p>
            <p className="text-lg leading-relaxed opacity-95">
              Creemos en crear círculos virtuosos donde tanto negocios como clientes ganan.
              No es magia, es karma.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100">
            <div className="text-4xl font-bold text-gradient mb-2">100%</div>
            <p className="text-gray-600">Enfoque en negocios locales</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100">
            <div className="text-4xl font-bold text-gradient mb-2">24/7</div>
            <p className="text-gray-600">Soporte dedicado</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100">
            <div className="text-4xl font-bold text-gradient mb-2">0</div>
            <p className="text-gray-600">Costos ocultos</p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¿Listo para hacer crecer tu negocio?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Únete a los negocios que ya están transformando su relación con los clientes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              Comenzar gratis
            </Link>
            <a
              href="https://wa.me/56996298273?text=Hola%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n%20acerca%20de%20Karma%20%F0%9F%98%84"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-all"
            >
              Contactar ventas
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Karma. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
