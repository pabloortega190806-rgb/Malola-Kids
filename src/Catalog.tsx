import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Filter, ChevronDown, ShoppingBag } from 'lucide-react';
import { Product } from './hooks/useProducts';

export default function Catalog() {
  const { brandName } = useParams<{ brandName: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = '/api/products?limit=100';
        if (brandName) {
          url += `&brand=${encodeURIComponent(brandName)}`;
        }
        
        const response = await fetch(url);
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
  }, [brandName]);

  const displayBrand = brandName ? brandName.charAt(0).toUpperCase() + brandName.slice(1) : 'Catálogo';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif font-bold text-[#3E2A24] mb-4">{displayBrand}</h1>
        <div className="w-24 h-1 bg-[#D9C8B4] mx-auto mb-6"></div>
        <p className="text-[#7A5C53] max-w-2xl mx-auto">
          Descubre nuestra selección exclusiva de {displayBrand}. Moda infantil diseñada con mimo y los mejores materiales para los más pequeños.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 pb-4 border-b border-[#E5D9C5] gap-4">
        <div className="flex items-center text-[#7A5C53]">
          <Filter size={20} className="mr-2" />
          <span className="font-medium">Filtrar por</span>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <span className="text-[#967A70]">{products.length} productos</span>
          <div className="relative">
            <select className="appearance-none bg-transparent border border-[#E5D9C5] text-[#5D4037] py-2 pl-4 pr-10 rounded-md focus:outline-none focus:border-[#B89F82] cursor-pointer">
              <option>Novedades</option>
              <option>Precio: Menor a Mayor</option>
              <option>Precio: Mayor a Menor</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#967A70] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B89F82]"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-12">{error}</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-[#7A5C53] mb-4">No se encontraron productos para {displayBrand}.</p>
          <Link to="/" className="text-[#B89F82] hover:underline font-medium">Volver a inicio</Link>
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
                    // Fallback image if postimg placeholder fails
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
    </div>
  );
}
