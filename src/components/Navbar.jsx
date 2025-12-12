import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-gradient">Karma</span>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-primary-600 transition-colors">Características</a>
              <a href="#pricing" className="text-gray-700 hover:text-primary-600 transition-colors">Precios</a>
              <a href="#contact" className="text-gray-700 hover:text-primary-600 transition-colors">Contacto</a>
              <button className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-2 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200">
                Comenzar Gratis
              </button>
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#features" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md">Características</a>
            <a href="#pricing" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md">Precios</a>
            <a href="#contact" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md">Contacto</a>
            <button className="w-full text-left bg-gradient-to-r from-primary-600 to-accent-600 text-white px-3 py-2 rounded-md">
              Comenzar Gratis
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
