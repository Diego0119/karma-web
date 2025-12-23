import { Linkedin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const whatsappMessage = encodeURIComponent('Hola, quiero más información acerca de Karma 😄');
  const whatsappUrl = `https://wa.me/56996298273?text=${whatsappMessage}`;

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent mb-4">
              Karma
            </h3>
            <p className="text-gray-400 mb-4 max-w-md">
              La plataforma de fidelización que transforma clientes ocasionales en embajadores de tu marca.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.linkedin.com/in/diego-sanhueza-ag/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-lg hover:bg-gradient-to-r hover:from-primary-600 hover:to-accent-600 transition-all duration-200"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Producto</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-primary-400 transition-colors">Características</a></li>
              <li><a href="#pricing" className="hover:text-primary-400 transition-colors">Precios</a></li>
              <li><a href="#benefits" className="hover:text-primary-400 transition-colors">Casos de uso</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2">
              <li><a href="/about" className="hover:text-primary-400 transition-colors">Sobre nosotros</a></li>
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-400 transition-colors"
                >
                  Contacto
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            {currentYear} Karma. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="/privacy" className="text-sm hover:text-primary-400 transition-colors">Privacidad</a>
            <a href="/terms" className="text-sm hover:text-primary-400 transition-colors">Términos</a>
            <a href="/cookies" className="text-sm hover:text-primary-400 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
