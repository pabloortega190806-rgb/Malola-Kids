import React, { useState, useEffect } from 'react';
import { ChevronDown, Search, ShoppingBag, Menu, ChevronLeft, ChevronRight, Instagram, MapPin, Mail, ArrowRight, X } from 'lucide-react';

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=2070&auto=format&fit=crop",
      title: "Nueva Colección Infantil",
      subtitle: "Moda de 0 a 9 años en tonos blancos y beige",
      buttonText: "Ver Colección"
    },
    {
      image: "https://images.unsplash.com/photo-1522771930-78848d92d3e8?q=80&w=2070&auto=format&fit=crop",
      title: "Primera Postura",
      subtitle: "La mayor suavidad para sus primeros días",
      buttonText: "Descubrir"
    },
    {
      image: "https://images.unsplash.com/photo-1604467794349-0b74285de7e7?q=80&w=2070&auto=format&fit=crop",
      title: "Marcas Exclusivas",
      subtitle: "Mayoral, Calamaro y Prim Baby",
      buttonText: "Comprar Ahora"
    }
  ];

  const categories = [
    {
      title: "Primera postura",
      image: "https://images.unsplash.com/photo-1522771930-78848d92d3e8?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "Bebé niña (hasta 36 meses)",
      image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=2069&auto=format&fit=crop"
    },
    {
      title: "Bebé niño (hasta 36 meses)",
      image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "Niña",
      image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=1972&auto=format&fit=crop"
    },
    {
      title: "Niño",
      image: "https://images.unsplash.com/photo-1602030028438-4cf153cbae9e?q=80&w=2000&auto=format&fit=crop"
    },
    {
      title: "Complementos",
      image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=2075&auto=format&fit=crop"
    }
  ];

  const brands = [
    "Mayoral",
    "Calamaro",
    "Prim Baby"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="min-h-screen bg-[#FCFBF9] font-sans text-gray-800">
      {/* Top Banner */}
      <div className="bg-[#D9C8B4] text-gray-900 text-center py-2 text-sm font-medium tracking-wide">
        Envíos gratis a partir de 80€ | Devoluciones gratuitas
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24 md:h-28">
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-[#B89F82] transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center justify-center lg:justify-start flex-1 lg:flex-none">
              <img 
                src="https://i.postimg.cc/XYchPMsm/image.png" 
                alt="Malola | Moda Infantil y Mujer" 
                className="h-16 md:h-24 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-6">
              <a href="#" className="text-gray-800 hover:text-[#B89F82] px-2 py-2 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-[#B89F82]">Inicio</a>
              <a href="#" className="text-gray-800 hover:text-[#B89F82] px-2 py-2 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-[#B89F82]">Primera Postura</a>
              
              {/* Dropdown Bebés */}
              <div className="relative group">
                <button className="flex items-center text-gray-800 hover:text-[#B89F82] px-2 py-2 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-[#B89F82]">
                  Bebés <ChevronDown size={16} className="ml-1" />
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-100 shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left scale-95 group-hover:scale-100 z-50">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#FCFBF9] hover:text-[#B89F82]">Niña (hasta 36 meses)</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#FCFBF9] hover:text-[#B89F82]">Niño (hasta 36 meses)</a>
                </div>
              </div>

              {/* Dropdown Infantil */}
              <div className="relative group">
                <button className="flex items-center text-gray-800 hover:text-[#B89F82] px-2 py-2 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-[#B89F82]">
                  Infantil <ChevronDown size={16} className="ml-1" />
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-100 shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left scale-95 group-hover:scale-100 z-50">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#FCFBF9] hover:text-[#B89F82]">Niña</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#FCFBF9] hover:text-[#B89F82]">Niño</a>
                </div>
              </div>
              
              <a href="#" className="text-gray-800 hover:text-[#B89F82] px-2 py-2 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-[#B89F82]">Complementos</a>
              <a href="#" className="text-gray-800 hover:text-[#B89F82] px-2 py-2 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-[#B89F82]">Marcas</a>
            </nav>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-[#B89F82] transition-colors">
                <Search size={20} />
              </button>
              <button className="text-gray-600 hover:text-[#B89F82] transition-colors relative">
                <ShoppingBag size={20} />
                <span className="absolute -top-2 -right-2 bg-[#B89F82] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 absolute w-full left-0 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#" className="block px-3 py-2 text-base font-medium text-gray-800 hover:text-[#B89F82] hover:bg-[#FCFBF9] rounded-md">Inicio</a>
              <a href="#" className="block px-3 py-2 text-base font-medium text-gray-800 hover:text-[#B89F82] hover:bg-[#FCFBF9] rounded-md">Primera Postura</a>
              <a href="#" className="block px-3 py-2 text-base font-medium text-gray-800 hover:text-[#B89F82] hover:bg-[#FCFBF9] rounded-md">Bebé Niña (hasta 36 meses)</a>
              <a href="#" className="block px-3 py-2 text-base font-medium text-gray-800 hover:text-[#B89F82] hover:bg-[#FCFBF9] rounded-md">Bebé Niño (hasta 36 meses)</a>
              <a href="#" className="block px-3 py-2 text-base font-medium text-gray-800 hover:text-[#B89F82] hover:bg-[#FCFBF9] rounded-md">Niña</a>
              <a href="#" className="block px-3 py-2 text-base font-medium text-gray-800 hover:text-[#B89F82] hover:bg-[#FCFBF9] rounded-md">Niño</a>
              <a href="#" className="block px-3 py-2 text-base font-medium text-gray-800 hover:text-[#B89F82] hover:bg-[#FCFBF9] rounded-md">Complementos</a>
              <a href="#" className="block px-3 py-2 text-base font-medium text-gray-800 hover:text-[#B89F82] hover:bg-[#FCFBF9] rounded-md">Marcas</a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Carousel */}
      <div className="relative h-[600px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div className="absolute inset-0 bg-black/20 z-10" />
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 drop-shadow-lg transform translate-y-0 transition-transform duration-700">
                {slide.title}
              </h2>
              <p className="text-lg md:text-xl text-white mb-8 max-w-2xl drop-shadow-md">
                {slide.subtitle}
              </p>
              <button className="bg-white text-[#B89F82] px-8 py-3 rounded-full font-semibold hover:bg-[#F5F0EB] transition-colors duration-300 shadow-lg flex items-center group">
                {slide.buttonText}
                <ArrowRight size={18} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}

        {/* Carousel Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/50 hover:bg-white text-gray-800 p-2 rounded-full backdrop-blur-sm transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/50 hover:bg-white text-gray-800 p-2 rounded-full backdrop-blur-sm transition-all"
        >
          <ChevronRight size={24} />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Nuestras Categorías</h2>
          <div className="w-24 h-1 bg-[#D9C8B4] mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div key={index} className="group relative h-80 overflow-hidden rounded-lg shadow-sm cursor-pointer">
              <img
                src={category.image}
                alt={category.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-xl font-serif font-semibold text-white mb-2 text-center">{category.title}</h3>
                <button className="text-white border-b border-white pb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 text-sm">
                  Ver Colección
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Brands */}
      <section className="py-16 bg-[#F5F0EB] border-y border-[#E5D9C5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-serif font-bold text-gray-900">Trabajamos con las mejores marcas</h2>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24">
            {brands.map((brand, index) => (
              <div 
                key={index} 
                className="text-2xl md:text-4xl font-serif font-medium text-[#8B7355] opacity-80 hover:opacity-100 transition-opacity duration-300 cursor-pointer tracking-wide"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#FAF8F5] text-gray-600 pt-16 pb-8 border-t border-[#E5D9C5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* About */}
            <div>
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
                <a href="#" className="text-gray-400 hover:text-[#B89F82] transition-colors">
                  <Instagram size={20} />
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-lg font-serif font-semibold text-gray-900 mb-6">Categorías</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-[#B89F82] transition-colors">Primera Postura</a></li>
                <li><a href="#" className="hover:text-[#B89F82] transition-colors">Bebé Niña / Niño</a></li>
                <li><a href="#" className="hover:text-[#B89F82] transition-colors">Niña / Niño</a></li>
                <li><a href="#" className="hover:text-[#B89F82] transition-colors">Complementos</a></li>
                <li><a href="#" className="hover:text-[#B89F82] transition-colors">Marcas</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-serif font-semibold text-gray-900 mb-6">Contacto</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start">
                  <MapPin size={18} className="mr-3 text-[#B89F82] flex-shrink-0 mt-0.5" />
                  <span>Calle Principal, 123<br />28001 Madrid, España</span>
                </li>
                <li className="flex items-center">
                  <Mail size={18} className="mr-3 text-[#B89F82] flex-shrink-0" />
                  <a href="mailto:info@malolashop.com" className="hover:text-[#B89F82] transition-colors">info@malolashop.com</a>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-lg font-serif font-semibold text-gray-900 mb-6">Newsletter</h4>
              <p className="text-sm mb-4">Suscríbete para recibir novedades y ofertas exclusivas.</p>
              <form className="flex flex-col space-y-3">
                <input 
                  type="email" 
                  placeholder="Tu correo electrónico" 
                  className="bg-white border border-[#E5D9C5] text-gray-800 px-4 py-2 rounded-md focus:outline-none focus:border-[#B89F82] transition-colors text-sm"
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
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-[#B89F82] transition-colors">Política de Privacidad</a>
              <a href="#" className="hover:text-[#B89F82] transition-colors">Términos y Condiciones</a>
              <a href="#" className="hover:text-[#B89F82] transition-colors">Aviso Legal</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
