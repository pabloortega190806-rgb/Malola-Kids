import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

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

  return (
    <>
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
        <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Categories Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif font-bold text-[#3E2A24] mb-4">Nuestras Categorías</h2>
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
            <h2 className="text-2xl font-serif font-bold text-[#3E2A24]">Trabajamos con las mejores marcas</h2>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24">
            {brands.map((brand, index) => (
              <div 
                key={index} 
                onClick={() => navigate(`/marca/${brand.toLowerCase()}`)}
                className="text-2xl md:text-4xl font-serif font-medium text-[#8B7355] opacity-80 hover:opacity-100 transition-opacity duration-300 cursor-pointer tracking-wide"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
