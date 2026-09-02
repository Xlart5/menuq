"use client";

import { useState } from "react";

import { useAdminData } from "@/hooks/use-admin-data";
import { formatPrice } from "@/lib/data";
import { Dish } from "@/lib/types";

const emptyForm = {
  name: "",
  description: "",
  price: 9.9,
  emoji: "🍽️",
  categoryId: "entradas",
  popular: false,
};

export default function PlatosPage() {
  const { data, update } = useAdminData();
  const [form, setForm] = useState<typeof emptyForm | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  if (!data) return <p className="text-zinc-500">Cargando…</p>;

  const startAdd = () => {
    setEditId(null);
    setForm({ ...emptyForm, categoryId: data.categories[0]?.id ?? "" });
  };

  const startEdit = (dish: Dish) => {
    setEditId(dish.id);
    setForm({
      name: dish.name,
      description: dish.description,
      price: dish.price,
      emoji: dish.emoji,
      categoryId: dish.categoryId,
      popular: !!dish.popular,
    });
  };

  const save = () => {
    if (!form || !form.name.trim()) return;

    if (editId) {
      update({
        ...data,
        dishes: data.dishes.map((d) =>
          d.id === editId
            ? { ...d, ...form, popular: form.popular || d.popular }
            : d
        ),
      });
    } else {
      const id = `${Date.now()}-${Math.floor(Math.random() * 999)}`;
      update({
        ...data,
        dishes: [
          ...data.dishes,
          {
            id,
            name: form.name.trim(),
            description: form.description.trim(),
            price: Number(form.price),
            emoji: form.emoji || "🍽️",
            categoryId: form.categoryId,
            popular: form.popular,
          },
        ],
      });
    }
    setForm(null);
    setEditId(null);
  };

  const remove = (id: string) => {
    update({ ...data, dishes: data.dishes.filter((d) => d.id !== id) });
  };

  const grouped = data.categories
    .map((cat) => ({
      cat,
      items: data.dishes.filter((d) => d.categoryId === cat.id),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Platos</h1>
          <p className="text-sm text-zinc-500">
            Agrega, edita y organiza el menú de tu restaurante.
          </p>
        </div>
        <button
          onClick={startAdd}
          className="rounded-full bg-amber-500 px-5 py-2.5 text-sm font-bold text-zinc-950 transition-colors hover:bg-amber-400"
        >
          + Nuevo plato
        </button>
      </div>

      {grouped.map(({ cat, items }) => (
        <section key={cat.id}>
          <h2 className="mb-3 font-bold text-zinc-300">
            {cat.emoji} {cat.name}
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {items.map((dish) => (
              <div
                key={dish.id}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/15 text-2xl">
                  {dish.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 font-bold">
                    {dish.name}
                    {dish.popular && (
                      <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                        Popular
                      </span>
                    )}
                  </p>
                  <p className="truncate text-xs text-zinc-500">
                    {dish.description}
                  </p>
                  <p className="text-sm font-black text-amber-400">
                    {formatPrice(dish.price)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(dish)}
                    className="rounded-full bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-white/10"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => remove(dish.id)}
                    className="rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md space-y-4 rounded-3xl border border-white/10 bg-zinc-900 p-6">
            <h3 className="text-lg font-black">
              {editId ? "Editar plato" : "Nuevo plato"}
            </h3>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nombre del plato"
              className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-2.5 focus:border-amber-500/50 focus:outline-none"
            />
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Descripción corta"
              className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-2.5 focus:border-amber-500/50 focus:outline-none"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                step="0.1"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: Number(e.target.value) })
                }
                placeholder="Precio"
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-2.5 focus:border-amber-500/50 focus:outline-none"
              />
              <input
                value={form.emoji}
                onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                placeholder="Emoji (🍽️)"
                maxLength={4}
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-2.5 focus:border-amber-500/50 focus:outline-none"
              />
            </div>
            <select
              value={form.categoryId}
              onChange={(e) =>
                setForm({ ...form, categoryId: e.target.value })
              }
              className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-2.5 focus:border-amber-500/50 focus:outline-none"
            >
              {data.categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.emoji} {c.name}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={form.popular}
                onChange={(e) => setForm({ ...form, popular: e.target.checked })}
              />
              Marcar como popular ⭐
            </label>
            <div className="flex gap-3 pt-2">
              <button
                onClick={save}
                className="flex-1 rounded-full bg-amber-500 py-2.5 font-bold text-zinc-950 hover:bg-amber-400"
              >
                Guardar
              </button>
              <button
                onClick={() => {
                  setForm(null);
                  setEditId(null);
                }}
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
