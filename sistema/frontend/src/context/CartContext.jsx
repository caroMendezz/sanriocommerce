import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CART_KEY = 'sanriocommerce.cart';
const CartContext = createContext(null);

const readCart = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(CART_KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo(() => {
    const count = items.reduce((total, item) => total + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

    const add = (product, quantity = 1) => {
      setItems((current) => {
        const existing = current.find((item) => item.productId === product.id);
        const limit = product.stock ?? existing?.stock ?? 99;

        if (existing) {
          return current.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: Math.min(item.quantity + quantity, limit) }
              : item,
          );
        }

        return [
          ...current,
          {
            productId: product.id,
            name: product.name,
            character: product.character,
            emoji: product.emoji,
            price: Number(product.price),
            stock: product.stock,
            quantity: Math.min(quantity, limit),
          },
        ];
      });
    };

    const updateQuantity = (productId, quantity) => {
      setItems((current) =>
        current.map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity: Math.max(1, Math.min(quantity, item.stock ?? 99)),
              }
            : item,
        ),
      );
    };

    const remove = (productId) =>
      setItems((current) => current.filter((item) => item.productId !== productId));

    const clear = () => setItems([]);

    return { items, count, total, add, updateQuantity, remove, clear };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe usarse dentro de CartProvider');
  return context;
};
