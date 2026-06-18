import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const slides = [
    {
      image: "https://i.postimg.cc/hG8VP0ZJ/21327-B-1.jpg",
      title: "Nueva Colección Infantil",
      subtitle: "Moda de 0 a 9 años en tonos alegres y divertidos",
      buttonText: "Ver Colección",
      link: "/categoria/Niña%20(3-9%20años)",
      position: "object-[center_30%]"
    },
    {
      image: "https://i.postimg.cc/fLwm301w/22109-1.jpg",
      title: "Primera Postura",
      subtitle: "La mayor suavidad para sus primeros días",
      buttonText: "Descubrir",
      link: "/categoria/Primera%20Postura",
      position: "object-[center_40%]"
    },
    {
      image: "https://i.postimg.cc/ZqP6KLsB/32548-1.jpg",
      title: "Aventuras al Aire Libre",
      subtitle: "Conjuntos cómodos y frescos para jugar",
      buttonText: "Explorar",
      link: "/edad/3-9",
      position: "object-[center_30%]"
    },
    {
      image: "https://i.postimg.cc/NMgmyrZs/11313-N-1.jpg",
      title: "Marcas Exclusivas",
      subtitle: "Mayoral, Calamaro y Prim Baby",
      buttonText: "Comprar Ahora",
      link: "/marca/calamaro",
      position: "object-[center_25%]"
    }
  ];

  const genderCategories = [
    {
      title: "Niña",
      image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=800&auto=format&fit=crop",
      link: "/genero/niña"
    },
    {
      title: "Niño",
      image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=800&auto=format&fit=crop",
      link: "/genero/niño"
    },
    {
      title: "Primera Postura",
      image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=800&auto=format&fit=crop",
      link: "/categoria/Primera%20Postura"
    }
  ];

  const ageCategories = [
    {
      title: "0 a 4 años",
      subtitle: "Primera infancia",
      image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?q=80&w=1000&auto=format&fit=crop",
      link: "/edad/0-4"
    },
    {
      title: "3 a 9 años",
      subtitle: "Infantil",
      image: "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?q=80&w=1000&auto=format&fit=crop",
      link: "/edad/3-9"
    }
  ];

  const brandCategories = [
    {
      title: "Mayoral",
      image: "https://images.unsplash.com/photo-1622290319146-7b63df48a635?q=80&w=800&auto=format&fit=crop",
      link: "/marca/mayoral"
    },
    {
      title: "Calamaro",
      image: "https://images.unsplash.com/photo-1598539961915-040bb3be3f69?q=80&w=800&auto=format&fit=crop",
      link: "/marca/calamaro"
    },
    {
      title: "Prim Baby",
      image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop",
      link: "/marca/prim baby"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Pequeño anuncio elegante de rebajas (Rebajas de hasta el 50%) */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => navigate('/categoria/Niña%20(3-9%20años)')}
        className="bg-gradient-to-r from-[#9E2A2B] via-[#BD3A42] to-[#801B1D] text-white py-3.5 px-4 shadow-md flex items-center justify-center gap-3 cursor-pointer group text-center relative overflow-hidden z-25"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none" />
        
        {/* Destello elegante que recorre la barra periódicamente */}
        <motion.div 
          animate={{ x: ["-100%", "250%"] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", repeatDelay: 3 }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none skew-x-12"
        />

        <div className="relative z-10 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs sm:text-sm tracking-wide font-sans font-medium">
          <span className="flex items-center justify-center bg-white/25 px-2.5 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider animate-pulse">
            ✨ REBAJAS
          </span>
          <span className="font-serif italic font-semibold text-white">¡Grandes rebajas de hasta un 50% en toda la web!</span>
          <span className="opacity-90">• Descuento directo en carrito</span>
          <span className="underline underline-offset-4 decoration-white/50 text-[#FCF5EC] hover:text-white ml-1 font-semibold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
            Comprar ahora <ArrowRight size={14} className="inline opacity-90 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </motion.div>

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
              className={`absolute inset-0 w-full h-full object-cover ${slide.position || 'object-center'}`}
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 drop-shadow-lg transform translate-y-0 transition-transform duration-700">
                {slide.title}
              </h2>
              <p className="text-lg md:text-xl text-white mb-8 max-w-2xl drop-shadow-md">
                {slide.subtitle}
              </p>
              <button 
                onClick={() => navigate(slide.link)}
                className="bg-white text-[#B89F82] px-8 py-3 rounded-full font-semibold hover:bg-[#F5F0EB] transition-colors duration-300 shadow-lg flex items-center group"
              >
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

      {/* Banner de Rebajas Especiales - Altamente visual, elegante y dinámico */}
      <motion.div 
        initial={{ opacity: 0, y: 35, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-20"
      >
        <div className="relative overflow-hidden rounded-3xl bg-[#3E2A24] bg-gradient-to-br from-[#3E2A24] via-[#523B33] to-[#2B1D19] p-8 sm:p-10 md:p-14 shadow-2xl border border-[#D9C8B4]/25">
          
          {/* Fondo suave y elegante de luces sutiles */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(184,159,130,0.2),transparent_55%)] pointer-events-none" />
          <div className="absolute -left-12 -bottom-12 w-72 h-72 bg-[#B89F82]/8 rounded-full blur-3xl pointer-events-none" />

          {/* Destello dorado animado con transición elegante y llamativa que recorre el banner periódicamente */}
          <motion.div 
            animate={{ 
              x: ["-150%", "250%"]
            }}
            transition={{ 
              repeat: Infinity, 
              repeatDelay: 5, 
              duration: 2.5, 
              ease: "easeInOut" 
            }}
            className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-[#FCF5EC]/15 to-transparent skew-x-12 pointer-events-none"
          />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12">
            
            {/* Texto y reclamo */}
            <div className="flex-1 text-center lg:text-left">
              <motion.span 
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#B89F82]/20 text-[#FCFCFC] border border-[#B89F82]/40 mb-6"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#B89F82] animate-ping" />
                Colección con Descuento Especial
              </motion.span>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-serif text-white leading-[1.12] tracking-tight mb-4">
                Grandes Rebajas <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F3E6D5] via-[#E8D4BE] to-[#B89F82] drop-shadow-sm font-bold">
                  de hasta un 50%
                </span>
                <span className="text-2xl sm:text-3xl block md:inline font-sans font-light tracking-wide text-gray-200 ml-0 md:ml-3">
                  en toda la web
                </span>
              </h2>
              
              <p className="text-[#F3E6D5]/80 text-sm md:text-base max-w-xl mb-6 leading-relaxed font-sans">
                Viste a los más pequeños con la dulzura, elegancia y exclusividad de siempre. 
                <span className="block mt-2 font-medium text-white/95">
                  ✨ Descuento especial aplicado directamente en el carrito. ¡Solo por tiempo limitado!
                </span>
              </p>
              
              {/* Información adicional con toque premium */}
              <div className="inline-flex items-center gap-2 text-xs text-[#E8D4BE] border-t border-[#D9C8B4]/20 pt-4 w-full justify-center lg:justify-start">
                <span className="text-sm">✨</span>
                <p className="tracking-wide">Prendas de alta calidad con stock ultra limitado y envío rápido.</p>
              </div>
            </div>

            {/* Llamada a la acción interactiva de alta relevancia visual */}
            <div className="flex-shrink-0 w-full sm:w-auto flex flex-col items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 10px 30px -5px rgba(0,0,0,0.4)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/categoria/Niña%20(3-9%20años)')}
                className="w-full sm:w-auto bg-[#F3E6D5] text-[#3E2A24] hover:bg-white font-serif font-bold px-12 py-5 rounded-2xl shadow-xl transition-colors flex items-center justify-center gap-3 cursor-pointer group"
              >
                <span className="tracking-wider uppercase text-sm">Ver Rebajas</span>
                <ArrowRight size={18} className="transform group-hover:translate-x-1.5 transition-transform duration-300 text-[#5D4037]" />
              </motion.button>
              
              <div className="flex items-center gap-3 text-xs text-[#FCF5EC]/65">
                <span className="hover:text-white transition-colors cursor-pointer" onClick={() => navigate('/categoria/Primera%20Postura')}>Primera Postura</span>
                <span className="h-1 w-1 rounded-full bg-white/20" />
                <span className="hover:text-white transition-colors cursor-pointer" onClick={() => navigate('/genero/niña')}>Niña</span>
                <span className="h-1 w-1 rounded-full bg-white/20" />
                <span className="hover:text-white transition-colors cursor-pointer" onClick={() => navigate('/genero/niño')}>Niño</span>
              </div>
            </div>

          </div>

          {/* Detalles ornamentales y elegantes en las esquinas */}
          <div className="absolute top-0 right-0 w-16 h-[1px] bg-gradient-to-l from-[#B89F82]/30 to-transparent" />
          <div className="absolute top-0 right-0 h-16 w-[1px] bg-gradient-to-b from-[#B89F82]/30 to-transparent" />
          <div className="absolute bottom-0 left-0 w-16 h-[1px] bg-gradient-to-r from-[#B89F82]/30 to-transparent" />
          <div className="absolute bottom-0 left-0 h-16 w-[1px] bg-gradient-to-t from-[#B89F82]/30 to-transparent" />

        </div>
      </motion.div>

      {/* Comprar por Género */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-[#3E2A24] mb-4">Comprar por Género</h2>
          <div className="w-24 h-1 bg-[#D9C8B4] mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {genderCategories.map((cat, index) => (
            <Link 
              key={index} 
              to={cat.link}
              className="group relative h-96 overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-500"
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500 z-10" />
              <img 
                src={cat.image} 
                alt={cat.title} 
                className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
                <h3 className="text-3xl font-serif font-bold text-white tracking-wide drop-shadow-md">{cat.title}</h3>
                <div className="mt-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  <span className="bg-white text-[#5D4037] px-6 py-2 rounded-full text-sm font-medium">Ver colección</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Comprar por Edad */}
      <section className="py-20 bg-[#F5F0EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-[#3E2A24] mb-4">Comprar por Edad</h2>
            <div className="w-24 h-1 bg-[#D9C8B4] mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
            {ageCategories.map((cat, index) => (
              <Link 
                key={index} 
                to={cat.link}
                className="group relative h-[400px] overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
                <img 
                  src={cat.image} 
                  alt={cat.title} 
                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                  <p className="text-white/90 text-sm font-medium uppercase tracking-wider mb-2">{cat.subtitle}</p>
                  <h3 className="text-4xl font-serif font-bold text-white mb-4">{cat.title}</h3>
                  <div className="flex items-center text-white font-medium group-hover:text-[#D9C8B4] transition-colors">
                    Explorar <ArrowRight size={18} className="ml-2 transform group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Comprar por Marca */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-[#3E2A24] mb-4">Nuestras Marcas</h2>
          <div className="w-24 h-1 bg-[#D9C8B4] mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {brandCategories.map((cat, index) => (
            <Link 
              key={index} 
              to={cat.link}
              className="group relative h-80 overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition-all duration-500 bg-white border border-[#E5D9C5]"
            >
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500 z-10" />
              <img 
                src={cat.image} 
                alt={cat.title} 
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transform group-hover:scale-110 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 z-20 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-sm px-8 py-4 rounded-xl shadow-sm transform group-hover:-translate-y-2 transition-transform duration-500">
                  <h3 className="text-2xl font-serif font-bold text-[#5D4037] tracking-wide">{cat.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
