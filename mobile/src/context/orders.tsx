import { createContext, useCallback, useContext, useMemo, useState } from "react";

import { Dish } from "@/data/menu";
import { supabase } from "@/lib/supabase";

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
  lastMesa: number | null;
  createPedido: (mesa: number, items: { dish: Dish; qty: number }[]) => void;
};

const OrdersContext = createContext<OrdersContextValue | null>(null);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [lastMesa, setLastMesa] = useState<number | null>(null);

  const createPedido = useCallback(
    (mesa: number, items: { dish: Dish; qty: number }[]) => {
      setLastMesa(mesa);
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

      if (supabase) {
        supabase
          .from("orders")
          .insert({
            id: pedido.id,
            mesa: pedido.mesa,
            items: pedido.items,
            total: pedido.total,
            estado: pedido.estado,
            created_at: new Date(pedido.createdAt).toISOString(),
          })
          .then(() => {});
      }

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

  const value = useMemo(
    () => ({ pedidos, lastMesa, createPedido }),
    [pedidos, lastMesa, createPedido]
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders debe usarse dentro de OrdersProvider");
  return ctx;
}
