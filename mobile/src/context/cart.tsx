import { createContext, useCallback, useContext, useMemo, useState } from "react";

import { Dish } from "@/data/menu";

export type CartItem = {
  dish: Dish;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  add: (dish: Dish) => void;
  remove: (dishId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const add = useCallback((dish: Dish) => {
    setItems((prev) => {
      const existing = prev.find((it) => it.dish.id === dish.id);
      if (existing) {
        return prev.map((it) =>
          it.dish.id === dish.id ? { ...it, qty: it.qty + 1 } : it
        );
      }
      return [...prev, { dish, qty: 1 }];
    });
  }, []);

  const remove = useCallback((dishId: string) => {
    setItems((prev) =>
      prev
        .map((it) => (it.dish.id === dishId ? { ...it, qty: it.qty - 1 } : it))
        .filter((it) => it.qty > 0)
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(() => {
    const totalItems = items.reduce((sum, it) => sum + it.qty, 0);
    const totalPrice = items.reduce((sum, it) => sum + it.dish.price * it.qty, 0);
    return { items, totalItems, totalPrice, add, remove, clear };
  }, [items, add, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return ctx;
}
