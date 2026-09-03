"use client";

import { useEffect, useRef, useState } from "react";

import { useAdminData } from "@/hooks/use-admin-data";
import { formatPrice, timeAgo } from "@/lib/data";
import { Pedido, PedidoEstado } from "@/lib/types";

const estadoMeta: Record<PedidoEstado, { label: string; badge: string }> = {
  enviado: { label: "Enviado", badge: "bg-amber-500/15 text-amber-400" },
  en_preparacion: {
    label: "En preparación",
    badge: "bg-sky-500/15 text-sky-400",
  },
  entregado: { label: "Entregado", badge: "bg-green-500/15 text-green-400" },
  pagado: { label: "Pagado", badge: "bg-white/10 text-zinc-200" },
};

const nextEstado: Record<PedidoEstado, PedidoEstado> = {
  enviado: "en_preparacion",
  en_preparacion: "entregado",
  entregado: "entregado",
  pagado: "pagado",
};

export default function PedidosPage() {
  const { data, update, reload, remote } = useAdminData();
  const [manual, setManual] = useState(false);
  const [mMesa, setMMesa] = useState(1);
  const [mDish, setMDish] = useState<string>("");
  const [mQty, setMQty] = useState(1);
  const [cobro, setCobro] = useState<Pedido | null>(null);
  const [metodo, setMetodo] = useState<"efectivo" | "tarjeta" | "transferencia" | "qr">("efectivo");
  const [propina, setPropina] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!remote || started.current) return;
    started.current = true;
    const timer = setInterval(() => reload(), 12000);
    return () => clearInterval(timer);
  }, [remote, reload]);

  if (!data) return <p className="text-zinc-500">Cargando…</p>;

  const advance = (id: string) => {
    update({
      ...data,
      pedidos: data.pedidos.map((p) =>
        p.id === id ? { ...p, estado: nextEstado[p.estado] } : p
      ),
    });
  };

  const cobrar = () => {
    if (!cobro) return;
    const pago = {
      id: `pg-${Date.now()}`,
      pedidoId: cobro.id,
      mesa: cobro.mesa,
      metodo,
      monto: cobro.total,
      propina,
      cajero: "Admin",
      createdAt: Date.now(),
    };
    update({
      ...data,
      pedidos: data.pedidos.map((p) =>
        p.id === cobro.id ? { ...p, estado: "pagado" as const } : p
      ),
      pagos: [pago, ...data.pagos],
    });
    setCobro(null);
    setPropina(0);
  };

  const addManual = () => {
    const dish = data.dishes.find((d) => d.id === mDish);
    if (!dish) return;
    const pedido: Pedido = {
      id: `P-${Date.now()}`,
      mesa: mMesa,
      items: [
        {
          dishId: dish.id,
          name: dish.name,
          emoji: dish.emoji,
          qty: Math.max(1, mQty),
          price: dish.price,
        },
      ],
      total: dish.price * Math.max(1, mQty),
      estado: "entregado",
      createdAt: Date.now(),
    };
    update({ ...data, pedidos: [pedido, ...data.pedidos] });
    setManual(false);
    setMQty(1);
  };

  const sorted = [...data.pedidos].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Pedidos</h1>
          <p className="text-sm text-zinc-500">
            Cambia estados, atiende pedidos y registra ventas manuales.
            {remote && (
              <span className="ml-2 rounded-full bg-green-500/15 px-2 py-0.5 text-xs font-bold text-green-400">
                ● En vivo (cada 12s)
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => {
            setMMesa(data.mesas[0]?.numero ?? 1);
            setMDish(data.dishes[0]?.id ?? "");
            setManual(true);
          }}
          className="rounded-full bg-amber-500 px-5 py-2.5 text-sm font-bold text-zinc-950 hover:bg-amber-400"
        >
          + Registrar venta
        </button>
      </div>

      <div className="space-y-3">
        {sorted.map((p) => {
          const meta = estadoMeta[p.estado];
          return (
            <div
              key={p.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🪑</span>
                  <div>
                    <p className="font-bold">
                      Mesa {p.mesa} · {p.id}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {timeAgo(p.createdAt)} ·{" "}
                      {p.items.reduce((s, i) => s + i.qty, 0)}{" "}
                      artículo(s)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${meta.badge}`}
                  >
                    {meta.label}
                  </span>
                  <span className="font-black">{formatPrice(p.total)}</span>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {p.items.map((i) => (
                  <span
                    key={i.dishId}
                    className="rounded-full bg-zinc-900 px-3 py-1 text-xs text-zinc-300"
                  >
                    {i.emoji} {i.qty}× {i.name}
                  </span>
                ))}
              </div>
              {p.estado !== "entregado" && p.estado !== "pagado" && (
                <button
                  onClick={() => advance(p.id)}
                  className="mt-4 rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/15"
                >
                  Avanzar a {estadoMeta[nextEstado[p.estado]].label} →
                </button>
              )}
              {p.estado === "entregado" && (
                <button
                  onClick={() => {
                    setCobro(p);
                    setPropina(0);
                    setMetodo("efectivo");
                  }}
                  className="mt-4 rounded-full bg-amber-500 px-4 py-2 text-xs font-bold text-zinc-950 hover:bg-amber-400"
                >
                  💵 Cobrar
                </button>
              )}
            </div>
          );
        })}
      </div>

      {cobro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-sm space-y-4 rounded-3xl border border-white/10 bg-zinc-900 p-6">
            <h3 className="text-lg font-black">
              Cobrar Mesa {cobro.mesa} · {formatPrice(cobro.total)}
            </h3>
            <label className="block">
              <span className="mb-1 block text-sm text-zinc-300">Método de pago</span>
              <select
                value={metodo}
                onChange={(e) => setMetodo(e.target.value as typeof metodo)}
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-2.5 focus:border-amber-500/50 focus:outline-none"
              >
                <option value="efectivo">💵 Efectivo</option>
                <option value="tarjeta">💳 Tarjeta</option>
                <option value="transferencia">🏦 Transferencia bancaria</option>
                <option value="qr">📱 QR Simple</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm text-zinc-300">
                Propina (Bs)
              </span>
              <input
                type="number"
                min={0}
                value={propina}
                onChange={(e) => setPropina(Number(e.target.value) || 0)}
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-2.5 focus:border-amber-500/50 focus:outline-none"
              />
            </label>
            <div className="flex gap-2">
              {[0, 5, 10, 15].map((p) => (
                <button
                  key={p}
                  onClick={() =>
                    setPropina(Number(((cobro.total * p) / 100).toFixed(2)))
                  }
                  className={`flex-1 rounded-full px-2 py-2 text-xs font-bold ${
                    Math.round((propina / cobro.total) * 100) === p
                      ? "bg-amber-500 text-zinc-950"
                      : "bg-white/5 text-zinc-300 hover:bg-white/10"
                  }`}
                >
                  {p}%
                </button>
              ))}
            </div>
            <div className="flex gap-3 pt-1">
              <button
                onClick={cobrar}
                className="flex-1 rounded-full bg-amber-500 py-2.5 font-bold text-zinc-950 hover:bg-amber-400"
              >
                Confirmar pago
              </button>
              <button
                onClick={() => setCobro(null)}
                className="flex-1 rounded-full border border-white/15 py-2.5 font-semibold text-zinc-300 hover:bg-white/5"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {manual && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-sm space-y-4 rounded-3xl border border-white/10 bg-zinc-900 p-6">
            <h3 className="text-lg font-black">Registrar venta</h3>
            <label className="block">
              <span className="mb-1 block text-sm text-zinc-300">Mesa</span>
              <select
                value={mMesa}
                onChange={(e) => setMMesa(Number(e.target.value))}
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-2.5 focus:border-amber-500/50 focus:outline-none"
              >
                {data.mesas.map((m) => (
                  <option key={m.numero} value={m.numero}>
                    Mesa {m.numero}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm text-zinc-300">Plato</span>
              <select
                value={mDish}
                onChange={(e) => setMDish(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-2.5 focus:border-amber-500/50 focus:outline-none"
              >
                {data.dishes.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.emoji} {d.name} — {formatPrice(d.price)}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm text-zinc-300">Cantidad</span>
              <input
                type="number"
                min={1}
                value={mQty}
                onChange={(e) => setMQty(Number(e.target.value))}
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-2.5 focus:border-amber-500/50 focus:outline-none"
              />
            </label>
            <div className="flex gap-3 pt-1">
              <button
                onClick={addManual}
                className="flex-1 rounded-full bg-amber-500 py-2.5 font-bold text-zinc-950 hover:bg-amber-400"
              >
                Guardar venta
              </button>
              <button
                onClick={() => setManual(false)}
                className="flex-1 rounded-full border border-white/15 py-2.5 font-semibold text-zinc-300 hover:bg-white/5"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
