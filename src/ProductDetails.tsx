import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Edit, Share2, Check } from 'lucide-react';
import { Product } from './hooks/useProducts';
import { useCart } from './context/CartContext';
import { useAdmin } from './context/AdminContext';
import { ProductModal } from './components/ProductModal';

export default function ProductDetails() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isAdmin } = useAdmin();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const fetchProductAndImages = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/products/${code}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Producto no encontrado');
          }
          throw new Error('Error al cargar el producto');
        }
        
        const foundProduct = await response.json();
        setProduct(foundProduct);

        if (foundProduct.local_images && foundProduct.local_images.length > 0) {
          setImages(foundProduct.local_images);
        } else {
          setImages([foundProduct.image_url]);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (code) {
      fetchProductAndImages();
    }
  }, [code]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B89F82]"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-serif font-semibold text-[#3E2A24] mb-4">
          {error || 'Producto no encontrado'}
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-[#B89F82] hover:text-[#967A70]"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Volver
        </button>
      </div>
    );
  }

  const originalPrice = Number(product.original_price);
  const discountedPrice = Number(product.discounted_price);
  const discountPercentage = originalPrice > discountedPrice 
    ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100) 
    : 0;

  const handleAddToCart = () => {
    if (selectedSize) {
      addItem(product, selectedSize);
      setSelectedSize(null);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          url: url
        });
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center text-[#B89F82] hover:text-[#967A70] mb-8"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        Volver
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Carousel */}
        <div className="relative aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden group">
          <img
            src={images[currentImageIndex]}
            alt={`${product.name} - Imagen ${currentImageIndex + 1}`}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544126592-807ade215a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
            }}
          />
          
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentImageIndex ? 'bg-[#5D4037] w-4' : 'bg-gray-400 hover:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {discountPercentage > 0 && (
            <div className="absolute top-4 left-4 bg-[#B89F82] text-white text-sm font-bold px-3 py-1 rounded">
              -{discountPercentage}%
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <p className="text-[#967A70] font-medium mb-2">{product.brand}</p>
          <h1 className="text-3xl font-serif font-bold text-[#3E2A24] mb-4">
            {product.name}
          </h1>
          
          <div className="flex items-baseline space-x-4 mb-8">
            <span className={`text-3xl font-bold ${discountPercentage > 0 ? 'text-red-600' : 'text-[#5D4037]'}`}>
              {discountedPrice.toFixed(2)} €
            </span>
            {discountPercentage > 0 && (
              <span className="text-xl text-[#967A70] line-through">
                {originalPrice.toFixed(2)} €
              </span>
            )}
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Selecciona tu talla</h3>
            <div className="flex flex-wrap gap-3">
              {Object.entries(product.sizes_stock).map(([size, stock]) => {
                const isOutOfStock = Number(stock) === 0;
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    disabled={isOutOfStock}
                    onClick={() => setSelectedSize(size)}
                    className={`
                      min-w-[3.5rem] px-4 py-2 text-sm font-medium rounded-md border transition-all
                      ${isOutOfStock 
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through' 
                        : isSelected
                          ? 'bg-[#5D4037] text-white border-[#5D4037] shadow-md'
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
            className={`w-full py-4 px-8 rounded-md font-medium transition-all text-lg ${
              selectedSize
                ? 'bg-[#5D4037] text-white hover:bg-[#3E2A24] shadow-md hover:shadow-lg'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {selectedSize ? 'Añadir al carrito' : 'Selecciona una talla'}
          </button>

          <div className="mt-4 flex gap-4">
            <button
              onClick={handleShare}
              className="flex-1 py-3 px-4 rounded-md font-medium transition-all flex items-center justify-center bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm"
            >
              {isCopied ? (
                <>
                  <Check size={18} className="mr-2 text-green-600" />
                  <span className="text-green-600">¡Enlace copiado!</span>
                </>
              ) : (
                <>
                  <Share2 size={18} className="mr-2" />
                  Compartir
                </>
              )}
            </button>
            
            {isAdmin && (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex-1 py-3 px-4 rounded-md font-medium transition-all bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-center"
              >
                <Edit size={18} className="mr-2" />
                Editar
              </button>
            )}
          </div>

          <div className="mt-12 prose prose-sm text-gray-500">
            <h3 className="text-gray-900 font-medium">Detalles del producto</h3>
            <p className="mt-2">
              Código de producto: {product.code}
            </p>
            <p className="mt-2">
              Categoría: <span className="capitalize">{product.category}</span>
            </p>
          </div>
        </div>
      </div>

      {isAdmin && product && (
        <ProductModal
          product={product}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={(updatedProduct) => {
            setProduct(updatedProduct);
            if (updatedProduct.local_images && updatedProduct.local_images.length > 0) {
              setImages(updatedProduct.local_images);
            } else {
              setImages([updatedProduct.image_url]);
            }
            setCurrentImageIndex(0);
          }}
          mode="edit"
        />
      )}
    </div>
  );
}
