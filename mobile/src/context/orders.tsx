import { createContext, useCallback, useContext, useMemo, useState } from "react";

import { Dish } from "@/data/menu";

export type PedidoEstado = "enviado" | "en_preparacion" | "entregado";

export type PedidoItem = {
  dishId: string;
  name: string;
  emoji: string;
  qty: number;
  price: number;
};

export type Pedido = {
  id: string;
  mesa: number;
  items: PedidoItem[];
  total: number;
  estado: PedidoEstado;
  createdAt: number;
};

type OrdersContextValue = {
  pedidos: Pedido[];
  createPedido: (mesa: number, items: { dish: Dish; qty: number }[]) => void;
};

const OrdersContext = createContext<OrdersContextValue | null>(null);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  const createPedido = useCallback(
    (mesa: number, items: { dish: Dish; qty: number }[]) => {
      const pedido: Pedido = {
        id: `P-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        mesa,
        items: items.map(({ dish, qty }) => ({
          dishId: dish.id,
          name: dish.name,
          emoji: dish.emoji,
          qty,
          price: dish.price,
        })),
        total: items.reduce((sum, { dish, qty }) => sum + dish.price * qty, 0),
        estado: "enviado",
        createdAt: Date.now(),
      };

      setPedidos((prev) => [pedido, ...prev]);

      setTimeout(() => {
        setPedidos((prev) =>
          prev.map((p) =>
            p.id === pedido.id && p.estado === "enviado"
              ? { ...p, estado: "en_preparacion" }
              : p
          )
        );
      }, 12000);

      setTimeout(() => {
        setPedidos((prev) =>
          prev.map((p) =>
            p.id === pedido.id && p.estado === "en_preparacion"
              ? { ...p, estado: "entregado" }
              : p
          )
        );
      }, 35000);
    },
    []
  );

  const value = useMemo(() => ({ pedidos, createPedido }), [pedidos, createPedido]);

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders debe usarse dentro de OrdersProvider");
  return ctx;
}
