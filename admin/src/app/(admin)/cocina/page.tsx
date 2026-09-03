"use client";

import { useEffect, useRef } from "react";

import { useAdminData } from "@/hooks/use-admin-data";
import { formatPrice, timeAgo } from "@/lib/data";
import { PedidoEstado } from "@/lib/types";

const meta: Record<PedidoEstado, { label: string; badge: string }> = {
  enviado: { label: "Nuevo", badge: "bg-amber-500/15 text-amber-400" },
  en_preparacion: {
    label: "Cocinando",
    badge: "bg-sky-500/15 text-sky-400",
  },
  entregado: { label: "Entregado", badge: "bg-green-500/15 text-green-400" },
};

const next: Record<PedidoEstado, PedidoEstado> = {
  enviado: "en_preparacion",
  en_preparacion: "entregado",
  entregado: "entregado",
};

export default function CocinaPage() {
  const { data, update, reload, remote } = useAdminData();
  const started = useRef(false);

  useEffect(() => {
    if (!remote || started.current) return;
    started.current = true;
    const timer = setInterval(() => reload(), 10000);
    return () => clearInterval(timer);
  }, [remote, reload]);

  if (!data) return <p className="text-zinc-500">Cargando…</p>;

  const activos = data.pedidos
    .filter((p) => p.estado !== "entregado")
    .sort((a, b) => a.createdAt - b.createdAt);

  const advance = (id: string) => {
    update({
      ...data,
      pedidos: data.pedidos.map((p) =>
        p.id === id ? { ...p, estado: next[p.estado] } : p
      ),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Cocina</h1>
          <p className="text-sm text-zinc-500">
            Pedidos que llegaron a la parrilla. Marcá el estado a medida que
            avanza cada pedido.
            {remote && (
              <span className="ml-2 rounded-full bg-green-500/15 px-2 py-0.5 text-xs font-bold text-green-400">
                ● En vivo (cada 10s)
              </span>
            )}
          </p>
        </div>
        <span className="rounded-full bg-amber-500 px-4 py-2 text-sm font-black text-zinc-950">
          {activos.length} pendiente{activos.length === 1 ? "" : "s"}
        </span>
      </div>

      {activos.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center">
          <p className="text-5xl">🧑‍🍳</p>
          <p className="mt-3 font-bold text-white">Parrilla al día 🔥</p>
          <p className="text-sm text-zinc-500">
            No hay pedidos pendientes. Cuando un cliente ordene, aparecerá acá
            en segundos.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {activos.map((p) => {
            const m = meta[p.estado];
            return (
              <div
                key={p.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🪑</span>
                    <p className="font-black text-lg">Mesa {p.mesa}</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${m.badge}`}
                  >
                    {m.label}
                  </span>
                </div>
                <p className="text-xs text-zinc-500">
                  {p.id} · {timeAgo(p.createdAt)}
                </p>
                <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
                  {p.items.map((i) => (
                    <div
                      key={i.dishId}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm">
                        {i.emoji} <b>{i.qty}×</b> {i.name}
                      </span>
                      <span className="text-sm text-zinc-400">
                        {formatPrice(i.price * i.qty)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                  <span className="font-black">{formatPrice(p.total)}</span>
                  {p.estado !== "entregado" && (
                    <button
                      onClick={() => advance(p.id)}
                      className="rounded-full bg-amber-500 px-4 py-2 text-sm font-bold text-zinc-950 hover:bg-amber-400"
                    >
                      {p.estado === "enviado" ? "🔥 A cocinar" : "✅ Servido"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
