"use client";

import { useEffect, useRef } from "react";

import { useAdminData } from "@/hooks/use-admin-data";
import { formatPrice, timeAgo } from "@/lib/data";

const estadoLabels = {
  enviado: { label: "Enviado", color: "bg-amber-500/15 text-amber-400" },
  en_preparacion: { label: "En preparación", color: "bg-sky-500/15 text-sky-400" },
  listo: { label: "Listo", color: "bg-violet-500/15 text-violet-400" },
  en_camino: { label: "En camino", color: "bg-pink-500/15 text-pink-400" },
  entregado: { label: "Entregado", color: "bg-green-500/15 text-green-400" },
  pagado: { label: "Pagado", color: "bg-white/10 text-zinc-200" },
};

export default function DashboardPage() {
  const { data, reload, remote } = useAdminData();
  const started = useRef(false);

  useEffect(() => {
    if (!remote || started.current) return;
    started.current = true;
    const timer = setInterval(() => reload(), 15000);
    return () => clearInterval(timer);
  }, [remote, reload]);

  if (!data) {
    return <p className="text-zinc-500">Cargando…</p>;
  }

  const todayStart = new Date().setHours(0, 0, 0, 0);
  const hoy = data.pedidos.filter((p) => p.createdAt >= todayStart);
  const ventasHoy = hoy.reduce((s, p) => s + p.total, 0);
  const activos = data.pedidos.filter((p) => p.estado !== "entregado");
  const ticket = hoy.length > 0 ? ventasHoy / hoy.length : 0;

  const stats = [
    { label: "Ventas de hoy", value: formatPrice(ventasHoy), emoji: "💵" },
    { label: "Pedidos activos", value: String(activos.length), emoji: "🔥" },
    { label: "Ticket promedio", value: formatPrice(ticket), emoji: "🎟️" },
    { label: "Mesas activas", value: String(data.mesas.length), emoji: "🪑" },
  ];

  const lastOrders = [...data.pedidos].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black">Dashboard</h1>
        <p className="text-sm text-zinc-500">
          La Estancia · Resumen del día
          {remote && (
            <span className="ml-2 rounded-full bg-green-500/15 px-2 py-0.5 text-xs font-bold text-green-400">
              ● En vivo
            </span>
          )}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-3xl border border-white/10 bg-white/5 p-6"
          >
            <p className="text-2xl">{s.emoji}</p>
            <p className="mt-3 text-2xl font-black">{s.value}</p>
            <p className="text-sm text-zinc-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 lg:col-span-2">
          <h2 className="font-bold text-white">Últimos pedidos</h2>
          <div className="mt-4 space-y-3">
            {lastOrders.map((p) => {
              const meta = estadoLabels[p.estado];
              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🪑</span>
                    <div>
                      <p className="text-sm font-bold text-white">
                        Mesa {p.mesa} · {p.id}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {p.items.reduce((s, i) => s + i.qty, 0)} artículos ·{" "}
                        {timeAgo(p.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${meta.color}`}>
                      {meta.label}
                    </span>
                    <span className="font-black">{formatPrice(p.total)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="font-bold text-white">Reseñas recientes</h2>
          <div className="mt-4 space-y-3">
            {data.resenas.slice(0, 4).map((r) => (
              <div key={r.id} className="rounded-2xl bg-zinc-900 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold">{r.autor}</p>
                  <span className="text-xs text-amber-400">
                    {"★".repeat(r.rating)}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-zinc-400">{r.texto}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
