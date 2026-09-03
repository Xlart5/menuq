"use client";

import { useState } from "react";

import { useAdminData } from "@/hooks/use-admin-data";
import { formatPrice, timeAgo } from "@/lib/data";
import { Item } from "@/lib/types";

type MovTab = "insumos" | "recetas" | "movimientos";

export default function InventarioPage() {
  const { data, update } = useAdminData();
  const [tab, setTab] = useState<MovTab>("insumos");
  const [itemForm, setItemForm] = useState<Item | null>(null);
  const [moveModal, setMoveModal] = useState<{
    itemId: string; tipo: "entrada" | "salida" | "merma";
  } | null>(null);
  const [moveQty, setMoveQty] = useState("1");
  const [moveMotivo, setMoveMotivo] = useState("");
  const [recetaDish, setRecetaDish] = useState("");
  const [recetaItem, setRecetaItem] = useState("");
  const [recetaQty, setRecetaQty] = useState("1");

  if (!data) return <p className="text-zinc-500">Cargando…</p>;

  const recetasDelPlato = (dishId: string) =>
    data.recipes.filter((r) => r.dishId === dishId);

  const costPlato = (dishId: string) =>
    recetasDelPlato(dishId).reduce((sum, r) => {
      const item = data.items.find((i) => i.id === r.itemId);
      return sum + (item ? item.cost * r.qty : 0);
    }, 0);

  const saveItem = () => {
    if (!itemForm || !itemForm.name.trim()) return;
    const exists = data.items.some((i) => i.id === itemForm.id);
    update({
      ...data,
      items: exists
        ? data.items.map((i) => (i.id === itemForm.id ? itemForm : i))
        : [...data.items, itemForm],
    });
    setItemForm(null);
  };

  const applyMove = () => {
    if (!moveModal) return;
    const qty = Number(moveQty);
    if (!(qty > 0)) return;
    const item = data.items.find((i) => i.id === moveModal.itemId)!;
    const delta =
      moveModal.tipo === "entrada" ? qty : -Math.abs(qty);
    const updateItems = data.items.map((i) =>
      i.id === item.id
        ? { ...i, stock: Math.max(0, Number((i.stock + delta).toFixed(3))) }
        : i
    );
    update({
      ...data,
      items: updateItems,
      movimientos: [
        {
          id: `m-${Date.now()}`,
          itemId: item.id,
          tipo: moveModal.tipo,
          qty,
          motivo: moveMotivo.trim(),
          createdAt: Date.now(),
        },
        ...data.movimientos,
      ],
    });
    setMoveModal(null);
    setMoveQty("1");
    setMoveMotivo("");
  };

  const addReceta = () => {
    if (!recetaDish) return;
    const r = {
      id: `r-${Date.now()}`,
      dishId: recetaDish,
      itemId: recetaItem,
      qty: Number(recetaQty) || 1,
    };
    update({ ...data, recipes: [...data.recipes.filter((x) => x.id !== r.id), r] });
    setRecetaItem("");
    setRecetaQty("1");
  };

  const tabs: { id: MovTab; label: string }[] = [
    { id: "insumos", label: "📦 Insumos" },
    { id: "recetas", label: "🧪 Recetas & costos" },
    { id: "movimientos", label: "🔄 Movimientos" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black">Inventario</h1>
          <p className="text-sm text-zinc-500">
            Insumos, recetas por plato y movimientos. El costo de cada plato
            se calcula solo.
          </p>
        </div>
        <div className="flex gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                tab === t.id
                  ? "bg-amber-500 text-zinc-950"
                  : "bg-white/5 text-zinc-300 hover:bg-white/10"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "insumos" && (
        <>
          <div className="flex justify-end">
            <button
              onClick={() =>
                setItemForm({
                  id: `i-${Date.now()}`,
                  name: "",
                  unit: "unidad",
                  stock: 0,
                  minStock: 0,
                  cost: 0,
                  category: "Insumos",
                })
              }
              className="rounded-full bg-amber-500 px-5 py-2.5 text-sm font-bold text-zinc-950 hover:bg-amber-400"
            >
              + Nuevo insumo
            </button>
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            {data.items.map((item) => {
              const low = item.stock <= item.minStock;
              return (
                <div
                  key={item.id}
                  className={`rounded-3xl border p-5 ${
                    low
                      ? "border-red-500/40 bg-red-500/5"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold">
                        {item.name}
                        {low && (
                          <span className="ml-2 rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-bold text-red-400">
                            🔻 Stock bajo
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {item.category} · {item.unit} · mín.{" "}
                        {item.minStock} {item.unit}
                      </p>
                    </div>
                    <p className="text-lg font-black">
                      {item.stock} <span className="text-xs text-zinc-500">{item.unit}</span>
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-zinc-400">
                    Costo unitario: {formatPrice(item.cost)}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => setMoveModal({ itemId: item.id, tipo: "entrada" })}
                      className="rounded-full bg-green-500/15 px-3 py-1.5 text-xs font-bold text-green-400 hover:bg-green-500/25"
                    >
                      + Entrada
                    </button>
                    <button
                      onClick={() => setMoveModal({ itemId: item.id, tipo: "salida" })}
                      className="rounded-full bg-white/5 px-3 py-1.5 text-xs font-bold text-zinc-300 hover:bg-white/10"
                    >
                      − Salida
                    </button>
                    <button
                      onClick={() => setMoveModal({ itemId: item.id, tipo: "merma" })}
                      className="rounded-full bg-amber-500/15 px-3 py-1.5 text-xs font-bold text-amber-400 hover:bg-amber-500/25"
                    >
                      🗑️ Merma
                    </button>
                    <button
                      onClick={() => setItemForm({ ...item })}
                      className="rounded-full bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-white/10"
                    >
                      Editar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {tab === "recetas" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="font-bold text-white">Receta del plato</h2>
            <select
              value={recetaDish}
              onChange={(e) => setRecetaDish(e.target.value)}
              className="mt-3 w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-2.5 focus:border-amber-500/50 focus:outline-none"
            >
              <option value="">Elegí un plato…</option>
              {data.dishes.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.emoji} {d.name} — costo {formatPrice(costPlato(d.id))}
                </option>
              ))}
            </select>
            {recetaDish && (
              <>
                <div className="mt-4 space-y-2">
                  {recetasDelPlato(recetaDish).map((r) => {
                    const item = data.items.find((i) => i.id === r.itemId);
                    return (
                      <div
                        key={r.id}
                        className="flex items-center justify-between rounded-2xl bg-zinc-900 px-4 py-2.5"
                      >
                        <span className="text-sm">
                          {item?.name ?? r.itemId} · {r.qty} {item?.unit}
                        </span>
                        <span className="text-sm font-bold">
                          {formatPrice((item?.cost ?? 0) * r.qty)}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 flex gap-2">
                  <select
                    value={recetaItem}
                    onChange={(e) => setRecetaItem(e.target.value)}
                    className="flex-1 rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm focus:border-amber-500/50 focus:outline-none"
                  >
                    <option value="">+ agregar insumo…</option>
                    {data.items.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.name}
                      </option>
                    ))}
                  </select>
                  <input
                    value={recetaQty}
                    onChange={(e) => setRecetaQty(e.target.value)}
                    className="w-20 rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm focus:border-amber-500/50 focus:outline-none"
                  />
                  <button
                    onClick={addReceta}
                    className="rounded-xl bg-amber-500 px-4 text-sm font-bold text-zinc-950 hover:bg-amber-400"
                  >
                    OK
                  </button>
                </div>
                <p className="mt-4 rounded-2xl bg-amber-500/10 px-4 py-3 text-sm font-bold text-amber-400">
                  Costo del plato: {formatPrice(costPlato(recetaDish))} → margen
                  bruto:{" "}
                  {formatPrice(
                    (data.dishes.find((d) => d.id === recetaDish)?.price ?? 0) -
                      costPlato(recetaDish)
                  )}
                </p>
              </>
            )}
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="font-bold text-white">Costos por plato</h2>
            <div className="mt-4 space-y-2">
              {data.dishes.map((d) => {
                const c = costPlato(d.id);
                const margen = d.price - c;
                return (
                  <div
                    key={d.id}
                    className="flex items-center justify-between rounded-2xl bg-zinc-900 px-4 py-2.5 text-sm"
                  >
                    <span>{d.emoji} {d.name}</span>
                    <span className="font-black">{formatPrice(c)}</span>
                    <span
                      className={`font-bold ${margen > 0 ? "text-green-400" : "text-red-400"}`}
                    >
                      {formatPrice(margen)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {tab === "movimientos" && (
        <div className="space-y-2">
          {data.movimientos.map((m) => {
            const item = data.items.find((i) => i.id === m.itemId);
            const color =
              m.tipo === "entrada"
                ? "text-green-400"
                : m.tipo === "merma"
                  ? "text-amber-400"
                  : "text-red-400";
            return (
              <div
                key={m.id}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
              >
                <div>
                  <span className={`font-bold capitalize ${color}`}>{m.tipo}</span>{" "}
                  — {item?.name} ({m.qty} {item?.unit})
                  <span className="ml-2 text-xs text-zinc-500">{m.motivo}</span>
                </div>
                <span className="text-xs text-zinc-500">{timeAgo(m.createdAt)}</span>
              </div>
            );
          })}
          {data.movimientos.length === 0 && (
            <p className="py-10 text-center text-zinc-500">
              Sin movimientos registrados.
            </p>
          )}
        </div>
      )}

      {itemForm && (
        <ModalShell title="Insumo" onClose={() => setItemForm(null)}>
          <input
            value={itemForm.name}
            onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
            placeholder="Nombre (ej. Ancho de vaca)"
            className="input"
          />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Unidad" value={itemForm.unit} onChange={(v) => setItemForm({ ...itemForm, unit: v })} />
            <Field label="Categoría" value={itemForm.category} onChange={(v) => setItemForm({ ...itemForm, category: v })} />
            <Field label="Stock" value={String(itemForm.stock)} onChange={(v) => setItemForm({ ...itemForm, stock: Number(v) || 0 })} />
            <Field label="Stock mínimo" value={String(itemForm.minStock)} onChange={(v) => setItemForm({ ...itemForm, minStock: Number(v) || 0 })} />
          </div>
          <Field label="Costo unitario (Bs o $)" value={String(itemForm.cost)} onChange={(v) => setItemForm({ ...itemForm, cost: Number(v) || 0 })} />
          <button onClick={saveItem} className="w-full rounded-full bg-amber-500 py-2.5 font-bold text-zinc-950 hover:bg-amber-400">
            Guardar
          </button>
        </ModalShell>
      )}

      {moveModal && (
        <ModalShell title="Movimiento" onClose={() => setMoveModal(null)}>
          <p className="text-sm text-zinc-400">
            {data.items.find((i) => i.id === moveModal.itemId)?.name} —{" "}
            {moveModal.tipo === "entrada"
              ? "+ entrada (compra)"
              : moveModal.tipo === "salida"
                ? "− salida (consumo)"
                : "🗑️ merma (pérdida)"}
          </p>
          <Field label="Cantidad" value={moveQty} onChange={setMoveQty} />
          <Field label="Motivo" value={moveMotivo} onChange={setMoveMotivo} />
          <button onClick={applyMove} className="w-full rounded-full bg-amber-500 py-2.5 font-bold text-zinc-950 hover:bg-amber-400">
            Registrar
          </button>
        </ModalShell>
      )}
    </div>
  );
}

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md space-y-4 rounded-3xl border border-white/10 bg-zinc-900 p-6 [&_.input]:w-full [&_.input]:rounded-xl [&_.input]:border [&_.input]:border-white/10 [&_.input]:bg-zinc-950 [&_.input]:px-4 [&_.input]:py-2.5 [&_.input]:focus:border-amber-500/50 [&_.input]:focus:outline-none">
        <h3 className="text-lg font-black">{title}</h3>
        {children}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-zinc-300">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-2.5 focus:border-amber-500/50 focus:outline-none"
      />
    </label>
  );
}
