import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { ChevronDown, Search, ShoppingBag, Menu, Instagram, MapPin, Mail, X } from 'lucide-react';
import Home from './Home';
import AvisoLegal from './AvisoLegal';
import PoliticaPrivacidad from './PoliticaPrivacidad';
import PoliticaCookies from './PoliticaCookies';
import CookieBanner from './CookieBanner';
import WhatsAppButton from './WhatsAppButton';
import Catalog from './Catalog';
import ProductDetails from './ProductDetails';
import { Analytics } from '@vercel/analytics/react';
import { useCart } from './context/CartContext';
import { CartDrawer } from './components/CartDrawer';
import Checkout from './Checkout';
import { Sidebar } from './components/Sidebar';
import EnviosYDevoluciones from './EnviosYDevoluciones';
import GuiaDeTallas from './GuiaDeTallas';
import TerminosYCondiciones from './TerminosYCondiciones';
import Contacto from './Contacto';
import SearchPage from './SearchPage';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();

  return (
    <div className="min-h-screen bg-[#FCFBF9] font-sans text-[#5D4037]">
      <ScrollToTop />
      {/* Top Banner */}
      <div className="bg-[#D9C8B4] text-[#3E2A24] text-center py-2 text-sm font-medium tracking-wide px-4">
        Envíos 5,50€ | Gratis a partir de 80€ | Recogida en tienda y opción "Acumular" GRATIS
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24 md:h-28">
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-[#967A70] hover:text-[#B89F82] transition-colors"
              >
                <Menu size={24} />
              </button>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center justify-center lg:justify-start flex-1 lg:flex-none">
              <Link to="/">
                <img 
                  src="https://i.postimg.cc/XYchPMsm/image.png" 
                  alt="Malola | Moda Infantil y Mujer" 
                  className="h-16 md:h-24 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-6">
              <Link to="/" className="text-[#5D4037] hover:text-[#B89F82] px-2 py-2 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-[#B89F82]">Inicio</Link>
              
              {/* Dropdown Bebés */}
              <div className="relative group">
                <button className="flex items-center text-[#5D4037] hover:text-[#B89F82] px-2 py-2 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-[#B89F82]">
                  Bebés <ChevronDown size={16} className="ml-1" />
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-100 shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left scale-95 group-hover:scale-100 z-50">
                  <Link to="/categoria/Bebe%20niña%200-4%20años" className="block px-4 py-2 text-sm text-[#7A5C53] hover:bg-[#FCFBF9] hover:text-[#B89F82]">Niña (hasta 4 años)</Link>
                  <Link to="/categoria/Bebe%20niño%200-4%20años" className="block px-4 py-2 text-sm text-[#7A5C53] hover:bg-[#FCFBF9] hover:text-[#B89F82]">Niño (hasta 4 años)</Link>
                </div>
              </div>

              {/* Dropdown Infantil */}
              <div className="relative group">
                <button className="flex items-center text-[#5D4037] hover:text-[#B89F82] px-2 py-2 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-[#B89F82]">
                  Infantil <ChevronDown size={16} className="ml-1" />
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-100 shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left scale-95 group-hover:scale-100 z-50">
                  <Link to="/categoria/Niña%204-16%20años" className="block px-4 py-2 text-sm text-[#7A5C53] hover:bg-[#FCFBF9] hover:text-[#B89F82]">Niña</Link>
                  <Link to="/categoria/Niño%204-16%20años" className="block px-4 py-2 text-sm text-[#7A5C53] hover:bg-[#FCFBF9] hover:text-[#B89F82]">Niño</Link>
                </div>
              </div>
              
              <Link to="/categoria/Complementos" className="text-[#5D4037] hover:text-[#B89F82] px-2 py-2 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-[#B89F82]">Complementos</Link>
              {/* Dropdown Marcas */}
              <div className="relative group">
                <button className="flex items-center text-[#5D4037] hover:text-[#B89F82] px-2 py-2 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-[#B89F82]">
                  Marcas <ChevronDown size={16} className="ml-1" />
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-100 shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left scale-95 group-hover:scale-100 z-50">
                  <Link to="/marca/calamaro" className="block px-4 py-2 text-sm text-[#7A5C53] hover:bg-[#FCFBF9] hover:text-[#B89F82]">Calamaro</Link>
                  <Link to="/marca/juliana" className="block px-4 py-2 text-sm text-[#7A5C53] hover:bg-[#FCFBF9] hover:text-[#B89F82]">Juliana</Link>
                  <Link to="/marca/babidu" className="block px-4 py-2 text-sm text-[#7A5C53] hover:bg-[#FCFBF9] hover:text-[#B89F82]">Babidu</Link>
                  <Link to="/marca/igor" className="block px-4 py-2 text-sm text-[#7A5C53] hover:bg-[#FCFBF9] hover:text-[#B89F82]">Igor</Link>
                  <Link to="/marca/condor" className="block px-4 py-2 text-sm text-[#7A5C53] hover:bg-[#FCFBF9] hover:text-[#B89F82]">Condor</Link>
                </div>
              </div>
            </nav>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              <Link to="/buscar" className="text-[#967A70] hover:text-[#B89F82] transition-colors">
                <Search size={20} />
              </Link>
              <button 
                className="text-[#967A70] hover:text-[#B89F82] transition-colors relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#B89F82] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Menu */}
        <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/aviso-legal" element={<AvisoLegal />} />
          <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
          <Route path="/politica-cookies" element={<PoliticaCookies />} />
          <Route path="/envios-y-devoluciones" element={<EnviosYDevoluciones />} />
          <Route path="/guia-de-tallas" element={<GuiaDeTallas />} />
          <Route path="/terminos-y-condiciones" element={<TerminosYCondiciones />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/buscar" element={<SearchPage />} />
          <Route path="/marca/:brandName" element={<Catalog />} />
          <Route path="/categoria/:categoryName" element={<Catalog />} />
          <Route path="/producto/:code" element={<ProductDetails />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-[#FAF8F5] text-[#967A70] pt-16 pb-8 border-t border-[#E5D9C5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            {/* About */}
            <div className="lg:col-span-2">
              <img 
                src="https://i.postimg.cc/XYchPMsm/image.png" 
                alt="Malola | Moda Infantil y Mujer" 
                className="h-16 md:h-20 w-auto object-contain mb-6"
                referrerPolicy="no-referrer"
              />
              <p className="text-sm leading-relaxed mb-6">
                Especialistas en moda infantil de 0 a 9 años. Colecciones cuidadosamente seleccionadas en tonos blancos y beige para los más pequeños de la casa.
              </p>
              <div className="flex space-x-4">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[#A38A6D] hover:text-[#B89F82] transition-colors">
                  <Instagram size={20} />
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-lg font-serif font-semibold text-[#3E2A24] mb-6">Atención al Cliente</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/envios-y-devoluciones" className="hover:text-[#B89F82] transition-colors">Envíos (5,50€ o Gratis &gt; 80€)</Link></li>
                <li><Link to="/envios-y-devoluciones" className="hover:text-[#B89F82] transition-colors">Recogida en tienda (Gratis)</Link></li>
                <li><Link to="/envios-y-devoluciones" className="hover:text-[#B89F82] transition-colors">Opción "Acumular Pedido"</Link></li>
                <li><Link to="/envios-y-devoluciones" className="hover:text-[#B89F82] transition-colors">Devoluciones (15 días - GLS)</Link></li>
                <li><Link to="/guia-de-tallas" className="hover:text-[#B89F82] transition-colors">Guía de Tallas</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-serif font-semibold text-[#3E2A24] mb-6">Contacto</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start">
                  <MapPin size={18} className="mr-3 text-[#B89F82] flex-shrink-0 mt-0.5" />
                  <span>Calle Principal, 123<br />28001 Madrid, España</span>
                </li>
                <li className="flex items-center">
                  <Mail size={18} className="mr-3 text-[#B89F82] flex-shrink-0" />
                  <a href="mailto:info@malolashop.com" className="hover:text-[#B89F82] transition-colors">info@malolashop.com</a>
                </li>
                <li>
                  <Link to="/contacto" className="text-[#B89F82] hover:text-[#A38A6D] transition-colors font-medium">Ir a la página de contacto</Link>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-lg font-serif font-semibold text-[#3E2A24] mb-6">Newsletter</h4>
              <p className="text-sm mb-4">Suscríbete para recibir novedades y ofertas exclusivas.</p>
              <form 
                className="flex flex-col space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('¡Gracias por suscribirte a nuestra newsletter!');
                  (e.target as HTMLFormElement).reset();
                }}
              >
                <input 
                  type="email" 
                  placeholder="Tu correo electrónico" 
                  className="bg-white border border-[#E5D9C5] text-[#5D4037] px-4 py-2 rounded-md focus:outline-none focus:border-[#B89F82] transition-colors text-sm"
                  required
                />
                <button 
                  type="submit" 
                  className="bg-[#B89F82] text-white px-4 py-2 rounded-md font-medium hover:bg-[#A38A6D] transition-colors text-sm"
                >
                  Suscribirse
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-[#E5D9C5] pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
            <p>&copy; {new Date().getFullYear()} Malola | Moda Infantil y Mujer. Todos los derechos reservados.</p>
            <div className="flex flex-wrap gap-4 mt-4 md:mt-0 justify-center md:justify-end">
              <Link to="/politica-privacidad" className="hover:text-[#B89F82] transition-colors">Política de Privacidad</Link>
              <Link to="/politica-cookies" className="hover:text-[#B89F82] transition-colors">Política de Cookies</Link>
              <Link to="/terminos-y-condiciones" className="hover:text-[#B89F82] transition-colors">Términos y Condiciones</Link>
              <Link to="/aviso-legal" className="hover:text-[#B89F82] transition-colors">Aviso Legal</Link>
            </div>
          </div>
        </div>
      </footer>

      <WhatsAppButton />
      <CookieBanner />
      <CartDrawer />
      <Analytics />
    </div>
  );
}
