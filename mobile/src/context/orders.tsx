import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Dish } from "@/data/menu";
import { supabase } from "@/lib/supabase";

export type PedidoEstado =
  | "enviado"
  | "en_preparacion"
  | "listo"
  | "en_camino"
  | "entregado";

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

function mapRow(o: {
  id: string;
  mesa: number;
  items: PedidoItem[];
  total: number | string;
  estado: PedidoEstado;
  created_at: string;
}): Pedido {
  return {
    id: o.id,
    mesa: o.mesa,
    items: o.items ?? [],
    total: Number(o.total),
    estado: o.estado,
    createdAt: new Date(o.created_at).getTime(),
  };
}

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [lastMesa, setLastMesa] = useState<number | null>(null);

  // El estado real vive en la base: llegó de la cocina, lo vemos acá.
  const sync = useCallback(async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(30);
    if (error || !data) return;
    const remote = data
      .filter((o) =>
        (["enviado", "en_preparacion", "listo", "en_camino", "entregado"] as string[]).includes(
          o.estado
        )
      )
      .map(mapRow);
    setPedidos((prev) => {
      const localOnly = prev.filter((p) => !remote.some((r) => r.id === p.id));
      return [...remote, ...localOnly];
    });
  }, []);

  useEffect(() => {
    sync();
    const timer = setInterval(sync, 8000);
    return () => clearInterval(timer);
  }, [sync]);

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
