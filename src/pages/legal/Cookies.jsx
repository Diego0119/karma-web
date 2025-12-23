import { Link } from 'react-router-dom';
import { ArrowLeft, Cookie, Settings, Eye, BarChart3, Shield, Database } from 'lucide-react';

export default function Cookies() {
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
            <Cookie className="w-10 h-10 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Política de Cookies y Almacenamiento
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
                <Cookie className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Sobre Cookies y Almacenamiento</h2>
                <p className="text-gray-600 leading-relaxed mb-3">
                  Karma utiliza <strong>cookies httpOnly seguras</strong> para la autenticación y
                  <strong> almacenamiento local (localStorage)</strong> para datos no sensibles que mejoran
                  tu experiencia en la plataforma.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Esta política explica qué tecnologías utilizamos, qué datos almacenamos y cómo protegemos
                  tu información.
                </p>
              </div>
            </div>
          </section>

          {/* What We Actually Use */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tecnologías de Almacenamiento que Utilizamos</h2>

            {/* httpOnly Cookies */}
            <div className="mb-6">
              <div className="flex items-start gap-4 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Cookies de Autenticación (httpOnly) 🔒
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Utilizamos cookies httpOnly seguras para gestionar tu sesión de forma protegida. Estas
                    cookies NO pueden ser accedidas por JavaScript, lo que previene ataques de tipo XSS
                    (Cross-Site Scripting).
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-gray-900 mb-2">Datos almacenados:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      <li>Token de autenticación JWT (mantiene tu sesión activa)</li>
                    </ul>
                    <p className="text-sm text-gray-500 mt-3">
                      <strong>Duración:</strong> 7 días o hasta que cierres sesión
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>Propósito:</strong> Autenticación segura
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>Consentimiento:</strong> No requerido (estrictamente necesaria para el servicio)
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>Seguridad:</strong> httpOnly, Secure (solo HTTPS), SameSite=Strict
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* localStorage */}
            <div className="mb-6">
              <div className="flex items-start gap-4 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Database className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Almacenamiento Local (localStorage)
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Utilizamos localStorage para almacenar datos no sensibles que mejoran tu experiencia
                    en la plataforma.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-gray-900 mb-2">Datos almacenados:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      <li>Información básica de tu cuenta (nombre, rol, email) - solo para mostrar en la UI</li>
                      <li>Código QR personal (solo para clientes) - para fácil acceso</li>
                    </ul>
                    <p className="text-sm text-gray-500 mt-3">
                      <strong>Duración:</strong> Persiste hasta que cierres sesión o elimines los datos del navegador
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>Propósito:</strong> Mejorar la experiencia del usuario evitando llamadas repetidas al servidor
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>Consentimiento:</strong> No requerido (datos no sensibles)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-900">
                <strong>✅ Seguridad:</strong> Tu token de autenticación se almacena en una cookie httpOnly
                que JavaScript no puede leer, protegiéndote contra ataques XSS. Solo almacenamos datos no
                sensibles en localStorage para mejorar tu experiencia.
              </p>
            </div>
          </section>

          {/* Potential Future Use */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Cookies Adicionales Futuras</h2>
            <p className="text-gray-600 mb-3">
              Actualmente solo utilizamos cookies esenciales para autenticación. En el futuro, podríamos
              implementar cookies adicionales para:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>
                <strong>Análisis y Métricas:</strong> Entender cómo los usuarios utilizan la plataforma
                (Google Analytics u otros servicios) para mejorar la experiencia
              </li>
              <li>
                <strong>Preferencias:</strong> Recordar configuraciones personalizadas como tema oscuro,
                idioma, o visualización preferida
              </li>
              <li>
                <strong>Marketing:</strong> Mostrar contenido relevante y medir la efectividad de campañas
              </li>
            </ul>
            <p className="text-gray-600">
              Si decidimos implementar cookies adicionales en el futuro, actualizaremos esta política y te
              notificaremos para solicitar tu consentimiento cuando sea requerido por ley.
            </p>
          </section>

          {/* Third Party Services */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Servicios de Terceros</h2>
            <p className="text-gray-600">
              Actualmente, Karma no utiliza servicios de terceros que establezcan cookies o rastreen tu
              actividad (como Google Analytics, Facebook Pixel, etc.). Toda la información que recopilamos
              se almacena localmente en tu dispositivo mediante localStorage.
            </p>
          </section>

          {/* Managing Cookies and Storage */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Cómo Gestionar Cookies y Almacenamiento</h2>
            <p className="text-gray-600 mb-4">
              Tienes control total sobre los datos almacenados en tu dispositivo:
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Cerrar Sesión (Recomendado)</h3>
            <p className="text-gray-600 mb-4">
              La forma más sencilla es cerrar sesión desde tu cuenta de Karma. Esto eliminará automáticamente:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4 ml-4 space-y-1">
              <li>La cookie httpOnly de autenticación (token JWT)</li>
              <li>Datos de usuario almacenados localmente</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">2. Gestionar Cookies en el Navegador</h3>
            <p className="text-gray-600 mb-3">
              Todos los navegadores permiten ver y eliminar cookies. Aquí te mostramos cómo:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-2 text-sm text-gray-600">
              <p><strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies y otros datos de sitios → Ver todas las cookies</p>
              <p><strong>Firefox:</strong> Preferencias → Privacidad y seguridad → Cookies y datos de sitios → Administrar datos</p>
              <p><strong>Safari:</strong> Preferencias → Privacidad → Administrar datos de sitios web</p>
              <p><strong>Edge:</strong> Configuración → Privacidad → Cookies y datos del sitio</p>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">3. Gestionar Almacenamiento Local</h3>
            <p className="text-gray-600 mb-3">
              También puedes borrar el almacenamiento local (datos no sensibles como tu nombre para la UI):
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-2 text-sm text-gray-600">
              <p><strong>Herramientas de desarrollo:</strong> F12 → Application/Storage → Local Storage → karma.com</p>
              <p><strong>Borrar datos de navegación:</strong> Incluye "Datos de sitios web" o "Almacenamiento local"</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-900">
                <strong>⚠️ Importante:</strong> Si eliminas las cookies o el almacenamiento de Karma, cerrarás
                tu sesión automáticamente. Las cookies de autenticación son estrictamente necesarias para usar
                la plataforma.
              </p>
            </div>
          </section>

          {/* Privacy First */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Seguridad y Privacidad por Diseño</h2>
            <p className="text-gray-600 mb-3">
              Karma está diseñado con la seguridad y privacidad en mente desde el principio:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>
                <strong>Cookies httpOnly:</strong> Tu token de autenticación está protegido contra ataques XSS
                porque JavaScript no puede acceder a él
              </li>
              <li>
                <strong>HTTPS Only:</strong> Las cookies solo se transmiten por conexiones seguras en producción
              </li>
              <li>
                <strong>SameSite Strict:</strong> Protección contra ataques CSRF (Cross-Site Request Forgery)
              </li>
              <li>
                <strong>Sin rastreo:</strong> No rastreamos tu actividad fuera de nuestra plataforma
              </li>
              <li>
                <strong>Sin terceros:</strong> No compartimos tus datos con redes publicitarias ni analytics externos
              </li>
              <li>
                <strong>Mínimos datos necesarios:</strong> Solo almacenamos lo estrictamente necesario para el servicio
              </li>
            </ul>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Actualizaciones de esta Política</h2>
            <p className="text-gray-600">
              Podemos actualizar esta política periódicamente para reflejar cambios en nuestras prácticas de
              almacenamiento o por razones legales. Te notificaremos sobre cambios significativos y
              actualizaremos la fecha de "Última actualización" al inicio de este documento.
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
