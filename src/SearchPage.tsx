import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useProducts } from './hooks/useProducts';
import { ProductCard } from './components/ProductCard';
import { Search } from 'lucide-react';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [inputValue, setInputValue] = useState(query);
  const { products, loading, error } = useProducts({ search: query });

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSearchParams({ q: inputValue.trim() });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl font-serif font-bold text-[#3E2A24] mb-6 text-center">
          Buscar Productos
        </h1>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Buscar por nombre, código o marca..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-[#E5D9C5] rounded-full focus:outline-none focus:ring-2 focus:ring-[#B89F82] focus:border-transparent text-[#5D4037] shadow-sm"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#967A70]" size={20} />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#B89F82] text-white px-6 py-2 rounded-full hover:bg-[#A38A6D] transition-colors text-sm font-medium"
          >
            Buscar
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B89F82]"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 py-12 bg-red-50 rounded-lg">
          <p>{error}</p>
        </div>
      ) : products.length > 0 ? (
        <div>
          <p className="text-[#967A70] mb-6">
            Se encontraron {products.length} resultados para "{query}"
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.code} product={product} />
            ))}
          </div>
        </div>
      ) : query ? (
        <div className="text-center py-20 bg-white rounded-xl border border-[#E5D9C5]">
          <Search className="mx-auto h-12 w-12 text-[#D9C8B4] mb-4" />
          <h2 className="text-xl font-serif font-medium text-[#3E2A24] mb-2">No se encontraron resultados</h2>
          <p className="text-[#967A70] mb-6">
            No pudimos encontrar ningún producto que coincida con "{query}".
          </p>
          <Link 
            to="/" 
            className="inline-block bg-[#B89F82] text-white px-8 py-3 rounded-md hover:bg-[#A38A6D] transition-colors font-medium"
          >
            Volver al inicio
          </Link>
        </div>
      ) : null}
    </div>
  );
}
