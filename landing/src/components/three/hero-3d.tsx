"use client";

import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("./hero-scene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-[2.5rem] border border-white/10 bg-zinc-900">
      <span className="animate-pulse text-6xl opacity-40">🍖</span>
    </div>
  ),
});

export function Hero3D() {
  return (
    <div className="relative mx-auto h-[440px] w-full max-w-md sm:h-[500px]">
      <div className="absolute inset-0 -z-10 rounded-full bg-amber-500/15 blur-3xl" />
      <div className="rounded-[2.5rem] border border-white/10 bg-zinc-900/40 shadow-2xl">
        <HeroScene />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-4 text-center">
        <span className="rounded-full border border-white/10 bg-zinc-950/70 px-4 py-1.5 text-xs text-zinc-400">
          ↺ Arrastra para girar la pieza
        </span>
      </div>
    </div>
  );
}
