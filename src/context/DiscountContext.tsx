import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../hooks/useProducts';

export interface AutomaticDiscount {
  id: number;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: string;
  active: boolean;
  usage_limit: number | null;
  used_count: number;
  included_categories: string[] | null;
  excluded_categories: string[] | null;
  is_automatic: boolean;
}

interface DiscountContextType {
  activeDiscount: AutomaticDiscount | null;
  loading: boolean;
  applyDiscount: (product: Product) => {
    hasDiscount: boolean;
    originalPrice: number;
    discountedPrice: number;
    discountValue: number;
    discountType: 'percentage' | 'fixed';
  };
}

const DiscountContext = createContext<DiscountContextType | undefined>(undefined);

export function DiscountProvider({ children }: { children: React.ReactNode }) {
  const [activeDiscount, setActiveDiscount] = useState<AutomaticDiscount | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAutomaticDiscount = async () => {
    try {
      const res = await fetch('/api/discount-codes/automatic');
      const data = await res.json();
      if (data.found && data.discount) {
        setActiveDiscount(data.discount);
      } else {
        setActiveDiscount(null);
      }
    } catch (err) {
      console.error("Error loading automatic discount:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAutomaticDiscount();
    // Refresh automatic discounts every 5 minutes in case admin updates them
    const interval = setInterval(fetchAutomaticDiscount, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const applyDiscount = (product: Product) => {
    const basePrice = Number(product.discounted_price);

    if (!activeDiscount || !activeDiscount.active) {
      return {
        hasDiscount: false,
        originalPrice: basePrice,
        discountedPrice: basePrice,
        discountValue: 0,
        discountType: 'percentage' as const
      };
    }

    const incl = Array.isArray(activeDiscount.included_categories) ? activeDiscount.included_categories : [];
    const excl = Array.isArray(activeDiscount.excluded_categories) ? activeDiscount.excluded_categories : [];

    const isIncluded = incl.length === 0 || incl.includes(product.category);
    const isExcluded = excl.length > 0 && excl.includes(product.category);

    if (isIncluded && !isExcluded) {
      const val = Number(activeDiscount.discount_value);
      let finalPrice = basePrice;

      if (activeDiscount.discount_type === 'percentage') {
        finalPrice = basePrice * (1 - val / 100);
      } else if (activeDiscount.discount_type === 'fixed') {
        finalPrice = Math.max(0, basePrice - val);
      }

      return {
        hasDiscount: true,
        originalPrice: basePrice,
        discountedPrice: finalPrice,
        discountValue: val,
        discountType: activeDiscount.discount_type
      };
    }

    return {
      hasDiscount: false,
      originalPrice: basePrice,
      discountedPrice: basePrice,
      discountValue: 0,
      discountType: 'percentage' as const
    };
  };

  return (
    <DiscountContext.Provider value={{ activeDiscount, loading, applyDiscount }}>
      {children}
    </DiscountContext.Provider>
  );
}

export function useDiscount() {
  const context = useContext(DiscountContext);
  if (context === undefined) {
    throw new Error('useDiscount must be used within a DiscountProvider');
  }
  return context;
}
