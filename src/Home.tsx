import React, { useState, useEffect } from 'react';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from './hooks/useProducts';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/products?limit=100');
        if (!response.ok) {
          throw new Error('Error al cargar los productos');
        }
        const data = await response.json();
        setProducts(data.data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
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

      {/* Products Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif font-bold text-[#3E2A24] mb-4">Todos nuestros productos</h2>
          <div className="w-24 h-1 bg-[#D9C8B4] mx-auto"></div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B89F82]"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-12">{error}</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-[#7A5C53] mb-4">No se encontraron productos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.code} className="group flex flex-col bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-[#F5F0EB]">
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden bg-[#FCFBF9]">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544126592-807ade215a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  {/* Quick Add Button */}
                  <button className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm text-[#5D4037] py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 font-medium text-sm flex items-center justify-center hover:bg-[#B89F82] hover:text-white">
                    <ShoppingBag size={16} className="mr-2" />
                    Añadir al carrito
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-4 flex flex-col flex-grow">
                  <div className="text-xs text-[#967A70] mb-1 uppercase tracking-wider">{product.category}</div>
                  <h3 className="text-[#3E2A24] font-medium mb-1 line-clamp-2">{product.name}</h3>
                  <p className="text-sm text-[#7A5C53] mb-3 line-clamp-1">{product.color} | {product.description}</p>
                  
                  <div className="mt-auto flex items-baseline space-x-2">
                    <span className="text-lg font-bold text-[#5D4037]">{Number(product.original_price).toFixed(2)} €</span>
                  </div>

                  {/* Sizes */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {Object.entries(product.sizes_stock).map(([size, stock]) => {
                      const stockNum = Number(stock);
                      return (
                        <span 
                          key={size} 
                          className={`text-[10px] px-2 py-1 border rounded-sm ${
                            stockNum > 0 
                              ? 'border-[#E5D9C5] text-[#7A5C53] bg-white' 
                              : 'border-gray-100 text-gray-300 bg-gray-50 line-through'
                          }`}
                          title={stockNum > 0 ? `Stock: ${stockNum}` : 'Agotado'}
                        >
                          {size.split('(')[0].trim()}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
