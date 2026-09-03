"use client";

import { useAdminData } from "@/hooks/use-admin-data";
import { timeAgo } from "@/lib/data";
import { Personal } from "@/lib/types";

type Estado = Personal["estado"];

const badge: Record<Personal["estado"], string> = {
  pendiente: "bg-amber-500/15 text-amber-400",
  aprobado: "bg-green-500/15 text-green-400",
  rechazado: "bg-red-500/15 text-red-400",
};

const label: Record<Personal["estado"], string> = {
  pendiente: "⏳ En espera",
  aprobado: "✓ Aprobado",
  rechazado: "✗ Rechazado",
};

export default function PersonalPage() {
  const { data, update } = useAdminData();

  if (!data) return <p className="text-zinc-500">Cargando…</p>;

  const setEstado = (id: string, estado: Estado) => {
    update({
      ...data,
      personales: data.personales.map((p) =>
        p.id === id ? { ...p, estado } : p
      ),
    });
  };

  const pendientes = data.personales.filter((p) => p.estado === "pendiente");
  const otros = data.personales.filter((p) => p.estado !== "pendiente");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">Personal</h1>
        <p className="text-sm text-zinc-500">
          Meseros que se registraron desde la app. Aprueba antes de que puedan
          trabajar.
        </p>
      </div>

      <section className="rounded-3xl border border-amber-500/30 bg-amber-500/5 p-6">
        <h2 className="font-bold text-amber-300">
          ⏳ En espera de aprobación ({pendientes.length})
        </h2>
        <div className="mt-4 space-y-2">
          {pendientes.map((p) => (
            <div
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-zinc-900 px-4 py-3"
            >
              <div>
                <p className="font-bold">{p.nombre}</p>
                <p className="text-xs text-zinc-500">
                  Solicitó hace {timeAgo(p.createdAt)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEstado(p.id, "aprobado")}
                  className="rounded-full bg-green-500 px-4 py-2 text-sm font-bold text-zinc-950 hover:bg-green-400"
                >
                  ✓ Aprobar
                </button>
                <button
                  onClick={() => setEstado(p.id, "rechazado")}
                  className="rounded-full bg-red-500/15 px-4 py-2 text-sm font-bold text-red-400 hover:bg-red-500/25"
                >
                  Rechazar
                </button>
              </div>
            </div>
          ))}
          {pendientes.length === 0 && (
            <p className="py-4 text-center text-sm text-zinc-500">
              Nada en espera. Los registros desde la app aparecen acá al
              instante.
            </p>
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="font-bold text-white">Equipo</h2>
        <div className="mt-4 space-y-2">
          {otros.map((p) => (
            <div
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-zinc-900 px-4 py-3"
            >
              <div>
                <p className="font-bold">{p.nombre}</p>
                <p className="text-xs text-zinc-500">
                  PIN •••• · {timeAgo(p.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-bold ${badge[p.estado]}`}
                >
                  {label[p.estado]}
                </span>
                {p.estado === "rechazado" && (
                  <button
                    onClick={() => setEstado(p.id, "aprobado")}
                    className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-zinc-200 hover:bg-white/15"
                  >
                    Aprobar
                  </button>
                )}
              </div>
            </div>
          ))}
          {otros.length === 0 && (
            <p className="py-4 text-center text-sm text-zinc-500">
              Sin personal registrado aún.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
