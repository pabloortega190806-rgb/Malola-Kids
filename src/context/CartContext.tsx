import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../hooks/useProducts';

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, size: string) => void;
  removeItem: (productCode: string, size: string) => void;
  updateQuantity: (productCode: string, size: string, quantity: number) => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  accumulateOrder: boolean;
  setAccumulateOrder: (accumulate: boolean) => void;
  cartTotal: number;
  cartCount: number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('malola_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [accumulateOrder, setAccumulateOrder] = useState(false);

  useEffect(() => {
    localStorage.setItem('malola_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product, size: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.code === product.code && i.size === size);
      if (existing) {
        return prev.map((i) =>
          i.product.code === product.code && i.size === size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product, size, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeItem = (productCode: string, size: string) => {
    setItems((prev) => prev.filter((i) => !(i.product.code === productCode && i.size === size)));
  };

  const updateQuantity = (productCode: string, size: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(productCode, size);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.product.code === productCode && i.size === size
          ? { ...i, quantity }
          : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const cartTotal = items.reduce((total, item) => total + Number(item.product.discounted_price) * item.quantity, 0);
  const cartCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        isCartOpen,
        setIsCartOpen,
        accumulateOrder,
        setAccumulateOrder,
        cartTotal,
        cartCount,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
