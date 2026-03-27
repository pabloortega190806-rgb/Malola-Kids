import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Filter, ChevronDown } from 'lucide-react';
import { Product } from './hooks/useProducts';
import { ProductCard } from './components/ProductCard';

export default function Catalog() {
  const { brandName, categoryName, genderName, ageName } = useParams<{ brandName?: string, categoryName?: string, genderName?: string, ageName?: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('Novedades');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = '/api/products?limit=100';
        if (brandName) {
          url += `&brand=${encodeURIComponent(brandName)}`;
        }
        if (categoryName) {
          url += `&category=${encodeURIComponent(categoryName)}`;
        }
        if (genderName) {
          url += `&gender=${encodeURIComponent(genderName)}`;
        }
        if (ageName) {
          url += `&age=${encodeURIComponent(ageName)}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) {
          let errorMessage = 'Error al cargar los productos';
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } catch (e) {
            errorMessage = `Error del servidor (${response.status}): No se pudo conectar a la base de datos o a la API.`;
          }
          throw new Error(errorMessage);
        }
        const data = await response.json();
        setProducts(data.data || []);
      } catch (err: any) {
        setError(err.message || 'Error de conexión. Verifica que el servidor y la base de datos estén funcionando.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [brandName, categoryName, genderName, ageName]);

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'Precio: Menor a Mayor') {
      return parseFloat(a.discounted_price || a.original_price) - parseFloat(b.discounted_price || b.original_price);
    } else if (sortBy === 'Precio: Mayor a Menor') {
      return parseFloat(b.discounted_price || b.original_price) - parseFloat(a.discounted_price || a.original_price);
    }
    // Default: Novedades (assuming newer products have higher IDs or are fetched first, we can just return 0 or sort by created_at if available)
    return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
  });

  const displayTitle = brandName 
    ? brandName.charAt(0).toUpperCase() + brandName.slice(1) 
    : categoryName 
      ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
      : genderName
        ? genderName.charAt(0).toUpperCase() + genderName.slice(1)
        : ageName
          ? `Edad: ${ageName}`
          : 'Catálogo';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif font-bold text-[#3E2A24] mb-4">{displayTitle}</h1>
        <div className="w-24 h-1 bg-[#D9C8B4] mx-auto mb-6"></div>
        <p className="text-[#7A5C53] max-w-2xl mx-auto">
          Descubre nuestra selección exclusiva de {displayTitle}. Moda infantil diseñada con mimo y los mejores materiales para los más pequeños.
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
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-transparent border border-[#E5D9C5] text-[#5D4037] py-2 pl-4 pr-10 rounded-md focus:outline-none focus:border-[#B89F82] cursor-pointer"
            >
              <option value="Novedades">Novedades</option>
              <option value="Precio: Menor a Mayor">Precio: Menor a Mayor</option>
              <option value="Precio: Mayor a Menor">Precio: Mayor a Menor</option>
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
        <div className="text-center py-20 px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-2xl mx-auto shadow-sm">
            <h3 className="text-red-800 font-serif font-bold text-xl mb-3">Error de conexión a la base de datos</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <div className="bg-white rounded p-4 text-left border border-red-100">
              <p className="text-sm text-red-800 font-medium mb-2">Si estás viendo esto en Vercel, asegúrate de que:</p>
              <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                <li>La variable de entorno <strong>DATABASE_URL</strong> esté configurada en los Settings de Vercel.</li>
                <li>La base de datos (Neon/Postgres) esté activa y accesible.</li>
                <li>El backend se haya desplegado correctamente.</li>
              </ul>
            </div>
          </div>
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-[#7A5C53] mb-4">No se encontraron productos para {displayTitle}.</p>
          <Link to="/" className="text-[#B89F82] hover:underline font-medium">Volver a inicio</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {sortedProducts.map((product) => (
            <ProductCard key={product.code} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
