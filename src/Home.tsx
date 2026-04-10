import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

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
