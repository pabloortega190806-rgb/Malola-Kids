import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { ChevronDown, Search, ShoppingBag, Menu, Instagram, MapPin, Mail, X, User } from 'lucide-react';
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
import AdminDashboard from './AdminDashboard';
import Gracias from './Gracias';

function PageTracker() {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    fetch('/api/track-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: location.pathname })
    }).catch(err => console.error("Error tracking view:", err));
  }, [location]);

  return null;
}

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();

  return (
    <div className="min-h-screen bg-[#FCFBF9] font-sans text-[#5D4037]">
      <ScrollToTop />
      <PageTracker />
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
                  <Link to="/categoria/Bebé%20Niña%20(0-4%20años)" className="block px-4 py-2 text-sm text-[#7A5C53] hover:bg-[#FCFBF9] hover:text-[#B89F82]">Niña (hasta 4 años)</Link>
                  <Link to="/categoria/Bebé%20Niño%20(0-4%20años)" className="block px-4 py-2 text-sm text-[#7A5C53] hover:bg-[#FCFBF9] hover:text-[#B89F82]">Niño (hasta 4 años)</Link>
                </div>
              </div>

              {/* Dropdown Infantil */}
              <div className="relative group">
                <button className="flex items-center text-[#5D4037] hover:text-[#B89F82] px-2 py-2 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-[#B89F82]">
                  Infantil <ChevronDown size={16} className="ml-1" />
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-100 shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left scale-95 group-hover:scale-100 z-50">
                  <Link to="/categoria/Niña%20(3-9%20años)" className="block px-4 py-2 text-sm text-[#7A5C53] hover:bg-[#FCFBF9] hover:text-[#B89F82]">Niña</Link>
                  <Link to="/categoria/Niño%20(3-9%20años)" className="block px-4 py-2 text-sm text-[#7A5C53] hover:bg-[#FCFBF9] hover:text-[#B89F82]">Niño</Link>
                </div>
              </div>

              {/* Dropdown Baño */}
              <div className="relative group">
                <button className="flex items-center text-[#5D4037] hover:text-[#B89F82] px-2 py-2 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-[#B89F82]">
                  Baño <ChevronDown size={16} className="ml-1" />
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-100 shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left scale-95 group-hover:scale-100 z-50">
                  <Link to="/categoria/Baño%20Niña" className="block px-4 py-2 text-sm text-[#7A5C53] hover:bg-[#FCFBF9] hover:text-[#B89F82]">Baño Niña</Link>
                  <Link to="/categoria/Baño%20Niño" className="block px-4 py-2 text-sm text-[#7A5C53] hover:bg-[#FCFBF9] hover:text-[#B89F82]">Baño Niño</Link>
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
                  <Link to="/marca/mayoral" className="block px-4 py-2 text-sm text-[#7A5C53] hover:bg-[#FCFBF9] hover:text-[#B89F82]">Mayoral</Link>
                  <Link to="/marca/prim baby" className="block px-4 py-2 text-sm text-[#7A5C53] hover:bg-[#FCFBF9] hover:text-[#B89F82]">Prim Baby</Link>
                </div>
              </div>
            </nav>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              <Link to="/admin" className="text-[#967A70] hover:text-[#B89F82] transition-colors" title="Acceso Propietaria">
                <User size={20} />
              </Link>
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
          <Route path="/genero/:genderName" element={<Catalog />} />
          <Route path="/edad/:ageName" element={<Catalog />} />
          <Route path="/producto/:code" element={<ProductDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/gracias" element={<Gracias />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-[#FAF8F5] text-[#967A70] pt-16 pb-8 border-t border-[#E5D9C5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* About */}
            <div className="lg:col-span-2">
              <img 
                src="https://i.postimg.cc/XYchPMsm/image.png" 
                alt="Malola | Moda Infantil y Mujer" 
                className="h-16 md:h-20 w-auto object-contain mb-6"
                referrerPolicy="no-referrer"
              />
              <p className="text-sm leading-relaxed mb-6">
                Especialistas en moda infantil de 0 a 9 años, desde 2022.<br/>
                Vistiendo a los pequeños siempre con dulzura y estilo.
              </p>
              <div className="flex space-x-4">
                <a href="https://www.instagram.com/malola_mskids?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="text-[#A38A6D] hover:text-[#B89F82] transition-colors">
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
                <li><Link to="/envios-y-devoluciones" className="hover:text-[#B89F82] transition-colors">Devoluciones (14 días - Vale Web)</Link></li>
                <li><Link to="/guia-de-tallas" className="hover:text-[#B89F82] transition-colors">Guía de Tallas</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-serif font-semibold text-[#3E2A24] mb-6">Contacto</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start">
                  <MapPin size={18} className="mr-3 text-[#B89F82] flex-shrink-0 mt-0.5" />
                  <span>Calle Moguer 15<br />41500 Alcalá de Guadaíra, Sevilla</span>
                </li>
                <li className="flex items-center">
                  <Mail size={18} className="mr-3 text-[#B89F82] flex-shrink-0" />
                  <a href="mailto:Malola.alcala@gmail.com" className="hover:text-[#B89F82] transition-colors">Malola.alcala@gmail.com</a>
                </li>
                <li>
                  <Link to="/contacto" className="text-[#B89F82] hover:text-[#A38A6D] transition-colors font-medium">Ir a la página de contacto</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-[#E5D9C5] pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
            <div className="flex flex-col items-center md:items-start space-y-1.5 mb-4 md:mb-0">
              <p>&copy; {new Date().getFullYear()} Malola | Moda Infantil y Mujer. Todos los derechos reservados.</p>
              <p className="opacity-70">
                Diseño y desarrollo por <a href="https://www.zentioweb.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#B89F82] transition-colors font-medium">Zentio Studio</a>
              </p>
            </div>
            <div className="flex flex-wrap gap-4 justify-center md:justify-end">
              <Link to="/politica-privacidad" className="hover:text-[#B89F82] transition-colors">Política de Privacidad</Link>
              <Link to="/politica-cookies" className="hover:text-[#B89F82] transition-colors">Política de Cookies</Link>
              <Link to="/terminos-y-condiciones" className="hover:text-[#B89F82] transition-colors">Términos y Condiciones</Link>
              <Link to="/aviso-legal" className="hover:text-[#B89F82] transition-colors">Aviso Legal</Link>
              <Link to="/admin" className="hover:text-[#B89F82] transition-colors font-medium">Acceso Propietaria</Link>
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
