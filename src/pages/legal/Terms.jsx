import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, CheckCircle, AlertCircle, Scale, UserX, CreditCard } from 'lucide-react';

export default function Terms() {
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Términos y Condiciones
          </h1>
          <p className="text-gray-600">
            Última actualización: {new Date().toLocaleDateString('es-CL')}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
          {/* Introduction */}
          <section>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Introducción</h2>
                <p className="text-gray-600 leading-relaxed mb-3">
                  Bienvenido a Karma, una plataforma de fidelización digital que conecta negocios locales
                  con sus clientes. Estos Términos y Condiciones ("Términos") regulan el uso de nuestra
                  plataforma y servicios.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Al acceder o utilizar Karma, aceptas estar sujeto a estos Términos. Si no estás de
                  acuerdo con alguna parte de estos términos, no debes usar nuestra plataforma.
                </p>
              </div>
            </div>
          </section>

          {/* Definitions */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Definiciones</h2>
            <div className="space-y-2 text-gray-600">
              <p><strong>"Plataforma":</strong> Se refiere a la aplicación web y móvil de Karma</p>
              <p><strong>"Usuario":</strong> Cualquier persona que utilice la Plataforma</p>
              <p><strong>"Negocio":</strong> Comercio o empresa que ofrece programas de fidelización</p>
              <p><strong>"Cliente":</strong> Usuario que participa en programas de fidelización</p>
              <p><strong>"Servicios":</strong> Todas las funcionalidades ofrecidas por Karma</p>
            </div>
          </section>

          {/* Use of Services */}
          <section>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Uso de los Servicios</h2>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">Elegibilidad</h3>
                <p className="text-gray-600 mb-4">
                  Debes tener al menos 14 años para usar Karma. Los menores de 18 años deben contar con
                  autorización de un padre o tutor legal. Al registrarte, garantizas que toda la información
                  proporcionada es veraz y precisa.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">Cuenta de Usuario</h3>
                <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
                  <li>Eres responsable de mantener la confidencialidad de tu cuenta</li>
                  <li>No debes compartir tu cuenta con terceros</li>
                  <li>Debes notificarnos inmediatamente sobre cualquier uso no autorizado</li>
                  <li>Eres responsable de todas las actividades que ocurran en tu cuenta</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">Uso Aceptable</h3>
                <p className="text-gray-600 mb-2">Te comprometes a:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Usar los Servicios de manera legal y ética</li>
                  <li>No intentar acceder a áreas no autorizadas de la Plataforma</li>
                  <li>No interferir con el funcionamiento de los Servicios</li>
                  <li>No usar los Servicios para actividades fraudulentas</li>
                  <li>Respetar los derechos de propiedad intelectual</li>
                </ul>
              </div>
            </div>
          </section>

          {/* For Businesses */}
          <section>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Para Negocios</h2>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">Obligaciones del Negocio</h3>
                <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
                  <li>Proporcionar información veraz sobre tu negocio</li>
                  <li>Honrar los puntos, sellos y recompensas otorgados a clientes</li>
                  <li>Cumplir con las promociones publicadas en la plataforma</li>
                  <li>Mantener actualizada la información de tu negocio</li>
                  <li>Cumplir con todas las leyes aplicables de protección al consumidor</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tarifas y Pagos</h3>
                <p className="text-gray-600 mb-2">
                  Las tarifas por el uso de la Plataforma se comunicarán claramente durante el proceso de
                  registro. Los pagos deben realizarse según los términos acordados. Karma se reserva el
                  derecho de modificar las tarifas con previo aviso de 30 días.
                </p>
              </div>
            </div>
          </section>

          {/* For Customers */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Para Clientes</h2>
            <p className="text-gray-600 mb-3">Como cliente, entiendes que:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Los puntos y sellos son otorgados por los negocios participantes</li>
              <li>Las recompensas están sujetas a disponibilidad y términos del negocio</li>
              <li>Los puntos/sellos pueden tener fechas de expiración según el programa</li>
              <li>Karma actúa como plataforma facilitadora, no como emisor de las recompensas</li>
              <li>Debes presentar tu código QR válido para acumular puntos o sellos</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Scale className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Propiedad Intelectual</h2>
                <p className="text-gray-600 mb-3">
                  Todos los derechos, títulos e intereses en la Plataforma, incluyendo pero no limitado a
                  software, diseño, contenido, marcas registradas y logos, son propiedad exclusiva de Karma
                  o sus licenciantes.
                </p>
                <p className="text-gray-600">
                  Se te otorga una licencia limitada, no exclusiva e intransferible para usar la Plataforma
                  según estos Términos. No puedes copiar, modificar, distribuir o crear obras derivadas sin
                  autorización expresa.
                </p>
              </div>
            </div>
          </section>

          {/* Liability */}
          <section>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Limitación de Responsabilidad</h2>
                <p className="text-gray-600 mb-3">
                  Karma proporciona la Plataforma "tal cual" y "según disponibilidad". No garantizamos que
                  los Servicios estarán libres de errores o disponibles ininterrumpidamente.
                </p>
                <p className="text-gray-600 mb-3">
                  En la máxima medida permitida por la ley, Karma no será responsable por:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Daños indirectos, incidentales o consecuentes</li>
                  <li>Pérdida de beneficios, datos o oportunidades comerciales</li>
                  <li>Disputas entre usuarios y negocios</li>
                  <li>Acciones u omisiones de terceros</li>
                  <li>Interrupciones del servicio debido a causas fuera de nuestro control</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Termination */}
          <section>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <UserX className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Terminación</h2>
                <p className="text-gray-600 mb-3">
                  Puedes cancelar tu cuenta en cualquier momento. Karma se reserva el derecho de suspender
                  o terminar tu acceso a los Servicios si:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Violas estos Términos</li>
                  <li>Usas los Servicios de manera fraudulenta o ilegal</li>
                  <li>Tu cuenta permanece inactiva por un período prolongado</li>
                  <li>Es necesario por razones de seguridad o cumplimiento legal</li>
                </ul>
                <p className="text-gray-600 mt-3">
                  Tras la terminación, tu derecho a usar los Servicios cesará inmediatamente. Las
                  disposiciones que por su naturaleza deban sobrevivir, permanecerán vigentes.
                </p>
              </div>
            </div>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Modificaciones</h2>
            <p className="text-gray-600">
              Karma se reserva el derecho de modificar estos Términos en cualquier momento. Las
              modificaciones serán efectivas al ser publicadas en la Plataforma. Tu uso continuado después
              de las modificaciones constituye tu aceptación de los nuevos términos. Te notificaremos sobre
              cambios significativos con al menos 15 días de anticipación.
            </p>
          </section>

          {/* Applicable Law */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Ley Aplicable y Jurisdicción</h2>
            <p className="text-gray-600">
              Estos Términos se rigen por las leyes de la República de Chile. Cualquier disputa será
              resuelta en los tribunales competentes de Punta Arenas, Chile, renunciando expresamente a
              cualquier otro fuero que pudiera corresponder.
            </p>
          </section>

          {/* Severability */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Divisibilidad</h2>
            <p className="text-gray-600">
              Si alguna disposición de estos Términos es considerada inválida o inaplicable, las demás
              disposiciones continuarán en pleno vigor y efecto. La disposición inválida será reemplazada
              por una válida que se acerque lo más posible a la intención original.
            </p>
          </section>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
