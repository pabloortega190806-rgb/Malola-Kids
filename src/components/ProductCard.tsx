import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';

export function ProductCard({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { addItem } = useCart();

  const originalPrice = Number(product.original_price);
  const discountedPrice = Number(product.discounted_price);
  const discountPercentage = originalPrice > discountedPrice 
    ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100) 
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (selectedSize) {
      addItem(product, selectedSize);
      setSelectedSize(null); // Reset after adding
    }
  };

  return (
    <Link to={`/producto/${product.code}`} className="group relative bg-white p-3 sm:p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
      <div className="relative w-full aspect-[3/4] mb-3 sm:mb-4 overflow-hidden rounded-lg bg-gray-100">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544126592-807ade215a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
          }}
        />
        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-[#B89F82] text-white text-xs font-bold px-2 py-1 rounded">
            -{discountPercentage}%
          </div>
        )}
      </div>
      
      <div className="flex-1 flex flex-col">
        <h3 className="text-sm font-medium text-[#3E2A24] mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-xs text-[#967A70] mb-2">{product.brand}</p>
        
        <div className="mt-auto">
          <div className="flex items-baseline space-x-2 mb-3">
            <span className={`text-lg font-bold ${discountPercentage > 0 ? 'text-red-600' : 'text-[#5D4037]'}`}>
              {Number(product.discounted_price).toFixed(2)} €
            </span>
            {discountPercentage > 0 && (
              <span className="text-sm text-[#967A70] line-through">
                {Number(product.original_price).toFixed(2)} €
              </span>
            )}
          </div>

          {/* Size Selector */}
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Selecciona talla:</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(product.sizes_stock).map(([size, stock]) => {
                const isOutOfStock = Number(stock) === 0;
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    disabled={isOutOfStock}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedSize(size);
                    }}
                    className={`
                      min-w-[2.5rem] px-2 py-1 text-xs font-medium rounded-md border transition-colors
                      ${isOutOfStock 
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through' 
                        : isSelected
                          ? 'bg-[#5D4037] text-white border-[#5D4037]'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-[#5D4037]'
                      }
                    `}
                  >
                    {size.split('(')[0].trim()}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!selectedSize}
            className={`w-full py-2 px-4 rounded-md font-medium transition-colors text-sm ${
              selectedSize
                ? 'bg-[#5D4037] text-white hover:bg-[#3E2A24]'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {selectedSize ? 'Añadir al carrito' : 'Selecciona una talla'}
          </button>
        </div>
      </div>
    </Link>
  );
}
