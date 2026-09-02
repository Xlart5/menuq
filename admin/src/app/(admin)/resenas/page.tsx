"use client";

import { useState } from "react";

import { useAdminData } from "@/hooks/use-admin-data";
import { timeAgo } from "@/lib/data";

export default function ResenasPage() {
  const { data, update } = useAdminData();
  const [autor, setAutor] = useState("");
  const [rating, setRating] = useState(5);
  const [texto, setTexto] = useState("");

  if (!data) return <p className="text-zinc-500">Cargando…</p>;

  const add = () => {
    if (!autor.trim() || !texto.trim()) return;
    update({
      ...data,
      resenas: [
        {
          id: `r-${Date.now()}`,
          autor: autor.trim(),
          rating: Math.min(5, Math.max(1, rating)),
          texto: texto.trim(),
          createdAt: Date.now(),
        },
        ...data.resenas,
      ],
    });
    setAutor("");
    setTexto("");
    setRating(5);
  };

  const remove = (id: string) => {
    update({ ...data, resenas: data.resenas.filter((r) => r.id !== id) });
  };

  const avg =
    data.resenas.length > 0
      ? data.resenas.reduce((s, r) => s + r.rating, 0) / data.resenas.length
      : 0;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-black">Reseñas</h1>
        <p className="text-sm text-zinc-500">
          No hay nada mejor que las opiniones de tus clientes. Promedio:{" "}
          <span className="font-bold text-amber-400">
            {avg.toFixed(1)}★
          </span>
        </p>
      </div>

      <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="font-bold">Agregar reseña</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
            placeholder="Nombre del cliente"
            className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 focus:border-amber-500/50 focus:outline-none"
          />
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setRating(n)}
                className={`text-2xl transition-transform hover:scale-110 ${
                  n <= rating ? "text-amber-400" : "text-zinc-700"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Opinión del cliente…"
          rows={3}
          className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 focus:border-amber-500/50 focus:outline-none"
        />
        <button
          onClick={add}
          className="rounded-full bg-amber-500 px-5 py-2.5 text-sm font-bold text-zinc-950 hover:bg-amber-400"
        >
          Guardar reseña
        </button>
      </div>

      <div className="space-y-3">
        {data.resenas.map((r) => (
          <div
            key={r.id}
            className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-5"
          >
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold">{r.autor}</p>
                <span className="text-sm text-amber-400">{"★".repeat(r.rating)}</span>
                <span className="text-xs text-zinc-500">{timeAgo(r.createdAt)}</span>
              </div>
              <p className="mt-1 text-sm text-zinc-400">{r.texto}</p>
            </div>
            <button
              onClick={() => remove(r.id)}
              className="rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
