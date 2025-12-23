import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Lock, UserCheck, Database, Mail } from 'lucide-react';

export default function Privacy() {
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
            <Shield className="w-10 h-10 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Política de Privacidad
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
                <Eye className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Introducción</h2>
                <p className="text-gray-600 leading-relaxed">
                  En Karma, nos comprometemos a proteger la privacidad y seguridad de los datos personales
                  de nuestros usuarios. Esta Política de Privacidad describe cómo recopilamos, usamos,
                  almacenamos y protegemos tu información personal cuando utilizas nuestra plataforma de
                  fidelización digital.
                </p>
              </div>
            </div>
          </section>

          {/* Information We Collect */}
          <section>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Database className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Información que Recopilamos</h2>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">Información de Registro</h3>
                <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
                  <li>Nombre y apellido</li>
                  <li>Dirección de correo electrónico</li>
                  <li>Número de teléfono (opcional)</li>
                  <li>Fecha de nacimiento (opcional)</li>
                  <li>Información del negocio (para usuarios comerciales)</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">Información de Uso</h3>
                <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
                  <li>Historial de transacciones y compras</li>
                  <li>Puntos y sellos acumulados</li>
                  <li>Recompensas canjeadas</li>
                  <li>Interacciones con promociones</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">Información Técnica</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Dirección IP</li>
                  <li>Tipo de navegador y dispositivo</li>
                  <li>Sistema operativo</li>
                  <li>Datos de acceso y uso de la plataforma</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <UserCheck className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Cómo Usamos tu Información</h2>
                <p className="text-gray-600 mb-3">Utilizamos la información recopilada para:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Proporcionar y mantener nuestros servicios de fidelización</li>
                  <li>Procesar transacciones y gestionar tu cuenta</li>
                  <li>Enviar notificaciones sobre puntos, sellos y recompensas</li>
                  <li>Personalizar tu experiencia en la plataforma</li>
                  <li>Comunicar promociones y ofertas especiales (con tu consentimiento)</li>
                  <li>Mejorar nuestros servicios y desarrollar nuevas funcionalidades</li>
                  <li>Prevenir fraudes y garantizar la seguridad de la plataforma</li>
                  <li>Cumplir con obligaciones legales y regulatorias</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Sharing */}
          <section>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Compartir Información</h2>
                <p className="text-gray-600 mb-3">
                  No vendemos tu información personal a terceros. Compartimos tu información únicamente en
                  los siguientes casos:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>
                    <strong>Con Negocios Participantes:</strong> Compartimos información de transacciones
                    con los negocios donde realizas compras para gestionar tu programa de fidelización
                  </li>
                  <li>
                    <strong>Proveedores de Servicios:</strong> Con empresas que nos ayudan a operar nuestra
                    plataforma (hosting, analytics, soporte al cliente)
                  </li>
                  <li>
                    <strong>Cumplimiento Legal:</strong> Cuando sea requerido por ley o para proteger
                    nuestros derechos legales
                  </li>
                  <li>
                    <strong>Con tu Consentimiento:</strong> En cualquier otro caso, solicitaremos tu
                    autorización expresa
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Seguridad de los Datos</h2>
                <p className="text-gray-600 mb-3">
                  Implementamos medidas de seguridad técnicas y organizativas para proteger tu información:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Encriptación de datos en tránsito y en reposo</li>
                  <li>Controles de acceso estrictos</li>
                  <li>Monitoreo continuo de seguridad</li>
                  <li>Auditorías regulares de seguridad</li>
                  <li>Servidores seguros con certificados SSL/TLS</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <UserCheck className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Tus Derechos</h2>
                <p className="text-gray-600 mb-3">Tienes derecho a:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Acceder a tu información personal</li>
                  <li>Rectificar datos inexactos o incompletos</li>
                  <li>Solicitar la eliminación de tus datos</li>
                  <li>Oponerte al procesamiento de tu información</li>
                  <li>Limitar el uso de tus datos</li>
                  <li>Portabilidad de tus datos</li>
                  <li>Retirar tu consentimiento en cualquier momento</li>
                </ul>
                <p className="text-gray-600 mt-3">
                  Para ejercer estos derechos, contáctanos a través de los canales indicados al final de
                  este documento.
                </p>
              </div>
            </div>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Retención de Datos</h2>
            <p className="text-gray-600">
              Conservamos tu información personal mientras mantengas una cuenta activa con nosotros y
              durante el tiempo necesario para cumplir con obligaciones legales, resolver disputas y hacer
              cumplir nuestros acuerdos. Cuando elimines tu cuenta, procederemos a eliminar o anonimizar
              tu información personal, excepto cuando la ley nos obligue a conservarla.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Cookies y Tecnologías Similares</h2>
            <p className="text-gray-600 mb-3">
              Utilizamos cookies y tecnologías similares para mejorar tu experiencia. Para más información,
              consulta nuestra <Link to="/cookies" className="text-primary-600 hover:text-primary-700 font-semibold">Política de Cookies</Link>.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Privacidad de Menores</h2>
            <p className="text-gray-600">
              Nuestros servicios no están dirigidos a menores de 14 años. No recopilamos conscientemente
              información de menores. Si descubres que un menor ha proporcionado información personal,
              contáctanos inmediatamente para que podamos eliminarla.
            </p>
          </section>

          {/* Changes */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Cambios a esta Política</h2>
            <p className="text-gray-600">
              Podemos actualizar esta Política de Privacidad periódicamente. Te notificaremos sobre cambios
              significativos publicando la nueva política en nuestra plataforma y actualizando la fecha de
              "Última actualización". Te recomendamos revisar esta política regularmente.
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
