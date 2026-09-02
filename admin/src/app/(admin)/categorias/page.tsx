"use client";

import { useState } from "react";

import { useAdminData } from "@/hooks/use-admin-data";

export default function CategoriasPage() {
  const { data, update } = useAdminData();
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🍽️");

  if (!data) return <p className="text-zinc-500">Cargando…</p>;

  const add = () => {
    if (!name.trim()) return;
    const id = `${Date.now()}-${Math.floor(Math.random() * 999)}`;
    update({
      ...data,
      categories: [...data.categories, { id, name: name.trim(), emoji: emoji || "🍽️" }],
    });
    setName("");
    setEmoji("🍽️");
  };

  const remove = (id: string) => {
    const count = data.dishes.filter((d) => d.categoryId === id).length;
    if (count > 0) {
      alert(`No se puede eliminar: hay ${count} plato(s) en esta categoría.`);
      return;
    }
    update({ ...data, categories: data.categories.filter((c) => c.id !== id) });
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-black">Categorías</h1>
        <p className="text-sm text-zinc-500">
          Ordena el menú en categorías (entradas, postres, bebidas…).
        </p>
      </div>

      <div className="flex gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Nombre (ej. Postres)"
          className="flex-1 rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 focus:border-amber-500/50 focus:outline-none"
        />
        <input
          value={emoji}
          onChange={(e) => setEmoji(e.target.value)}
          maxLength={4}
          placeholder="🍰"
          className="w-16 rounded-xl border border-white/10 bg-zinc-900 px-3 py-2.5 text-center focus:border-amber-500/50 focus:outline-none"
        />
        <button
          onClick={add}
          className="rounded-xl bg-amber-500 px-5 font-bold text-zinc-950 hover:bg-amber-400"
        >
          Añadir
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {data.categories.map((c) => {
          const count = data.dishes.filter((d) => d.categoryId === c.id).length;
          return (
            <div
              key={c.id}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/15 text-xl">
                  {c.emoji}
                </span>
                <div>
                  <p className="font-bold">{c.name}</p>
                  <p className="text-xs text-zinc-500">
                    {count} plato{count === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => remove(c.id)}
                className="rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20"
              >
                Eliminar
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
