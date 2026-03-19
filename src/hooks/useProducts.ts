import { useState, useEffect } from 'react';

export interface Product {
  code: string;
  name: string;
  description: string;
  color: string;
  original_price: string;
  discounted_price: string;
  brand: string;
  category: string;
  sizes_stock: Record<string, number>;
  image_url: string;
  created_at: string;
}

interface UseProductsOptions {
  category?: string;
  brand?: string;
  limit?: number;
  offset?: number;
}

export function useProducts(options: UseProductsOptions = {}) {
  const { category, brand, limit = 50, offset = 0 } = options;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);
        
        const params = new URLSearchParams();
        params.append('limit', limit.toString());
        params.append('offset', offset.toString());
        if (category) params.append('category', category);
        if (brand) params.append('brand', brand);
        
        const res = await fetch(`/api/products?${params.toString()}`);
        
        if (!res.ok) {
          let errorMessage = 'Error al cargar los productos';
          try {
            const errorData = await res.json();
            errorMessage = errorData.error || errorMessage;
          } catch (e) {
            errorMessage = `Error del servidor (${res.status}): No se pudo conectar a la base de datos o a la API.`;
          }
          throw new Error(errorMessage);
        }
        
        const json = await res.json();
        setProducts(json.data || []);
        setHasMore(json.pagination?.hasMore || false);
        setTotal(json.pagination?.total || 0);
      } catch (err: any) {
        setError(err.message || 'Error de conexión. Verifica que el servidor y la base de datos estén funcionando.');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [category, brand, limit, offset]);

  return { products, loading, error, hasMore, total };
}
