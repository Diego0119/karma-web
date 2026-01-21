import { Link } from 'react-router-dom';
import { ArrowLeft, Target, Zap, Users, Heart, TrendingUp, Award, Rocket, Star, Shield } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <span className="bg-primary-100 text-primary-700 text-sm font-semibold px-4 py-2 rounded-full">
              Nuestra historia
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Democratizamos la{' '}
            <span className="text-gradient">fidelización digital</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Creamos la herramienta que los negocios locales necesitan para competir con las grandes cadenas,
            sin complejidad ni costos prohibitivos.
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
              Ser la plataforma líder de fidelización, donde cada negocio local
              pueda ofrecer experiencias digitales excepcionales que conviertan clientes
              ocasionales en embajadores de marca.
            </p>
          </div>
        </div>

        {/* Our Story */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-xl p-10 md:p-14 mb-20 border-2 border-gray-100">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 rounded-full blur-3xl opacity-30"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-8">El problema que resolvemos</h2>
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                <span className="font-bold text-gray-900">Las grandes cadenas dominan la fidelización.</span> Tienen apps sofisticadas,
                programas de puntos integrados, notificaciones push y datos en tiempo real.
                Todo diseñado para que sus clientes vuelvan una y otra vez.
              </p>
              <p>
                <span className="font-bold text-gray-900">Los negocios locales usan tarjetas de papel.</span> Se pierden, se mojan,
                se olvidan en casa. El 70% termina en la basura. No hay datos, no hay seguimiento,
                no hay forma de traer clientes de vuelta.
              </p>
              <p>
                <span className="font-bold text-gray-900">Decidimos nivelar el campo de juego.</span> Creamos Karma: una plataforma
                tan poderosa como las que usan Starbucks o Sephora, pero tan simple que cualquier
                cafetería, peluquería o gimnasio puede usarla desde el día uno.
              </p>
              <div className="bg-white rounded-2xl p-6 border-2 border-primary-200 mt-8">
                <p className="font-bold text-primary-900 text-xl mb-2">
                  Sin apps que descargar. Sin hardware costoso. Sin meses de implementación.
                </p>
                <p className="text-gray-600">
                  Solo resultados reales: más clientes que vuelven, más ventas, más crecimiento.
                </p>
              </div>
            </div>
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

        {/* CTA */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl p-12 md:p-16 text-center">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '30px 30px'
            }}></div>
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-6">
              <Rocket className="w-4 h-4 text-white" />
              <span className="text-sm font-semibold text-white">Comienza hoy</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
              ¿Listo para transformar tu negocio?
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Únete
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                to="/register"
                className="group inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-10 py-5 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-200"
              >
                Probar gratis 14 días
                <TrendingUp className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="https://wa.me/5696298273?text=Hola%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n%20acerca%20de%20Karma"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-white/20 transition-all"
              >
                Hablar con ventas
              </a>
            </div>

            <p className="text-sm text-gray-400">
              ✓ Sin tarjeta de crédito &nbsp;•&nbsp; ✓ Configuración en 5 minutos &nbsp;•&nbsp; ✓ Soporte en español
            </p>
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
