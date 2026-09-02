"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

import { dishes, formatPrice } from "@/data/restaurant";

const ShowcaseScene = dynamic(() => import("./showcase-scene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-6xl opacity-40">
      🍽️
    </div>
  ),
});

const showcaseDishes = dishes.slice(0, 8);

export function Menu3D() {
  const [selected, setSelected] = useState(showcaseDishes[0]);

  return (
    <div className="grid items-center gap-8 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
          El menú en{" "}
          <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            3D interactivo
          </span>
        </h2>
        <p className="mt-4 text-zinc-400">
          Una experiencia de pedido que se siente premium. El cliente gira,
          explora y elige cada plato como si lo tuviera en la mesa.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {showcaseDishes.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelected(d)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                selected.id === d.id
                  ? "bg-amber-500 text-zinc-950"
                  : "border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
              }`}
            >
              {d.emoji} {d.name}
            </button>
          ))}
        </div>
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
          <span className="text-4xl">{selected.emoji}</span>
          <div>
            <p className="font-bold text-white">{selected.name}</p>
            <p className="text-sm text-zinc-400">{selected.description}</p>
            <p className="mt-1 font-black text-amber-400">
              {formatPrice(selected.price)}
            </p>
          </div>
        </div>
      </div>

      <div className="h-[380px] rounded-[2.5rem] border border-white/10 bg-zinc-900/40 lg:col-span-3">
        <ShowcaseScene emoji={selected.emoji} />
      </div>
    </div>
  );
}
