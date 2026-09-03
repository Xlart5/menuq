"use client";

import { useEffect, useRef, useState } from "react";

import { useAdminData } from "@/hooks/use-admin-data";
import { formatPrice } from "@/lib/data";
import { Pedido } from "@/lib/types";

type Period = "hoy" | "semana" | "mes" | "todo";

const startOfDay = (d: Date) => new Date(d.setHours(0, 0, 0, 0));
const startOfWeek = (d: Date) => {
  const dd = startOfDay(d);
  dd.setDate(dd.getDate() - ((dd.getDay() + 6) % 7));
  return dd;
};
const startOfMonth = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), 1);

const dayLabel = (ts: number) => {
  const d = new Date(ts);
  return d.toLocaleDateString("es", { day: "2-digit", month: "short" });
};
const monthLabel = (ts: number) => {
  const d = new Date(ts);
  return d.toLocaleDateString("es", { month: "long", year: "numeric" });
};

export default function ReportesPage() {
  const { data, reload, remote } = useAdminData();
  const started = useRef(false);
  const [period, setPeriod] = useState<Period>("semana");
  const [exportMsg, setExportMsg] = useState("");

  useEffect(() => {
    if (!remote || started.current) return;
    started.current = true;
    const timer = setInterval(() => reload(), 30000);
    return () => clearInterval(timer);
  }, [remote, reload]);

  if (!data) return <p className="text-zinc-500">Cargando…</p>;

  const now = new Date();
  const from =
    period === "hoy"
      ? startOfDay(new Date(now))
      : period === "semana"
        ? startOfWeek(new Date(now))
        : period === "mes"
          ? startOfMonth(new Date(now))
          : new Date(0);
  const to = new Date();

  const filtered = data.pedidos.filter((p) => {
    const ts = p.createdAt;
    if (ts < from.getTime() || ts > to.getTime()) return false;
    if (period !== "todo" && p.estado !== "entregado" && p.estado !== "en_preparacion" && p.estado !== "enviado") return false;
    return true;
  });

  const totalVentas = filtered.reduce((s, p) => s + p.total, 0);
  const ticket = filtered.length > 0 ? totalVentas / filtered.length : 0;

  // resumen por día (últimos 14 días dentro del rango)
  const days: { label: string; qty: number; total: number; ts: number }[] = [];
  const dayMap = new Map<string, Pedido[]>();
  for (const p of filtered) {
    const key = startOfDay(new Date(p.createdAt)).toDateString();
    if (!dayMap.has(key)) dayMap.set(key, []);
    dayMap.get(key)!.push(p);
  }
  dayMap.forEach((pedidos, key) => {
    days.push({
      ts: new Date(key).getTime(),
      label: dayLabel(new Date(key).getTime()),
      qty: pedidos.length,
      total: pedidos.reduce((s, p) => s + p.total, 0),
    });
  });
  days.sort((a, b) => b.ts - a.ts);
  const maxTotal = Math.max(1, ...days.map((d) => d.total));

  // resumen por mes (últimos 6 meses)
  const months: { label: string; qty: number; total: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const m = new Date();
    m.setMonth(m.getMonth() - i);
    const mFrom = new Date(m.getFullYear(), m.getMonth(), 1);
    const mTo = new Date(m.getFullYear(), m.getMonth() + 1, 0, 23, 59, 59);
    const mMes = filtered.filter(
      (p) => p.createdAt >= mFrom.getTime() && p.createdAt <= mTo.getTime()
    );
    months.push({
      label: monthLabel(mFrom.getTime()),
      qty: mMes.length,
      total: mMes.reduce((s, p) => s + p.total, 0),
    });
  }

  const exportCsv = () => {
    const rows = [
      "Id Pedido;Fecha;Mesa;Articulos;Total;Estado",
      ...filtered
        .sort((a, b) => a.createdAt - b.createdAt)
        .map((p) =>
          [
            p.id,
            new Date(p.createdAt).toLocaleString("es"),
            p.mesa,
            p.items.reduce((s, i) => s + i.qty, 0),
            p.total.toFixed(2),
            p.estado.replace("_", " "),
          ].join(";")
        ),
    ];
    const blob = new Blob(["\uFEFF" + rows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `reporte-la-estancia-${period}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    setExportMsg("Reporte descargado.");
    setTimeout(() => setExportMsg(""), 4000);
  };

  const periods: { id: Period; label: string }[] = [
    { id: "hoy", label: "Hoy" },
    { id: "semana", label: "Esta semana" },
    { id: "mes", label: "Este mes" },
    { id: "todo", label: "Histórico" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black">Reportes</h1>
          <p className="text-sm text-zinc-500">
            Ventas registradas de todos los pedidos.
            {remote && (
              <span className="ml-2 rounded-full bg-green-500/15 px-2 py-0.5 text-xs font-bold text-green-400">
                ● Datos en vivo
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          {periods.map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                period === p.id
                  ? "bg-amber-500 text-zinc-950"
                  : "bg-white/5 text-zinc-300 hover:bg-white/10"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-2xl">💵</p>
          <p className="mt-3 text-3xl font-black">{formatPrice(totalVentas)}</p>
          <p className="text-sm text-zinc-500">Ventas del período</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-2xl">🧾</p>
          <p className="mt-3 text-3xl font-black">{filtered.length}</p>
          <p className="text-sm text-zinc-500">Pedidos del período</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-2xl">🎟️</p>
          <p className="mt-3 text-3xl font-black">{formatPrice(ticket)}</p>
          <p className="text-sm text-zinc-500">Ticket promedio</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="font-bold text-white">Ventas por día</h2>
          <div className="mt-5 space-y-2">
            {days.slice(0, 14).map((d) => (
              <div key={d.ts} className="flex items-center gap-3">
                <span className="w-20 shrink-0 text-xs text-zinc-400">
                  {d.label}
                </span>
                <div className="h-6 flex-1 overflow-hidden rounded-full bg-zinc-900">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-600"
                    style={{ width: `${Math.max(4, (d.total / maxTotal) * 100)}%` }}
                  />
                </div>
                <span className="w-20 shrink-0 text-right text-xs font-bold">
                  {formatPrice(d.total)}
                </span>
              </div>
            ))}
            {days.length === 0 && (
              <p className="py-6 text-center text-sm text-zinc-500">
                Sin pedidos en el rango.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="font-bold text-white">Resumen mensual</h2>
          <div className="mt-4 space-y-2">
            {months.map((m) => (
              <div
                key={m.label}
                className="flex items-center justify-between rounded-2xl bg-zinc-900 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-bold capitalize">{m.label}</p>
                  <p className="text-xs text-zinc-500">{m.qty} pedidos</p>
                </div>
                <p className="font-black">{formatPrice(m.total)}</p>
              </div>
            ))}
            {months.every((m) => m.qty === 0) && (
              <p className="py-6 text-center text-sm text-zinc-500">
                Todavía no hay ventas en los meses mostrados.
              </p>
            )}
          </div>
        </section>
      </div>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-bold text-white">Exportar</h2>
          <button
            onClick={exportCsv}
            className="rounded-full bg-amber-500 px-5 py-2.5 text-sm font-bold text-zinc-950 hover:bg-amber-400"
          >
            ⬇️ Descargar CSV
          </button>
        </div>
        {exportMsg && <p className="mt-2 text-sm text-green-400">{exportMsg}</p>}
        <p className="mt-2 text-xs text-zinc-500">
          CSV compatible con Excel: abrí el archivo y filtrá por fechas, mesas o
          estados.
        </p>
      </section>
    </div>
  );
}
