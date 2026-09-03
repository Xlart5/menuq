"use client";

import { useMemo, useState } from "react";

import { useAdminData } from "@/hooks/use-admin-data";
import { formatPrice, timeAgo } from "@/lib/data";
import { Gasto } from "@/lib/types";

type FinTab = "resumen" | "gastos" | "caja";

type CajaState = {
  estado: "abierta" | "cerrada";
  apertura: number;
  real: string;
  historial: { fecha: string; esperado: number; real: number; diferencia: number }[];
};

const emptyCaja: CajaState = { estado: "cerrada", apertura: 0, real: "", historial: [] };

const HOY_INICIO_MS = new Date(new Date().setHours(0, 0, 0, 0)).getTime();

export default function FinanzasPage() {
  const { data, update, remote } = useAdminData();
  const [tab, setTab] = useState<FinTab>("resumen");
  const [gastoForm, setGastoForm] = useState<Gasto | null>(null);
  const [caja, setCaja] = useState<CajaState>(() => {
    try {
      // eslint-disable-next-line react-hooks/purity
      const raw = localStorage.getItem("menuq-caja");
      if (raw) return JSON.parse(raw) as CajaState;
    } catch {
      // ignorar
    }
    return emptyCaja;
  });

  const saveCaja = (next: CajaState) => {
    setCaja(next);
    localStorage.setItem("menuq-caja", JSON.stringify(next));
  };

  const costoVendido = useMemo(() => {
    if (!data) return 0;
    const costoPorPlato = new Map<string, number>();
    for (const r of data.recipes) {
      const item = data.items.find((i) => i.id === r.itemId);
      costoPorPlato.set(
        r.dishId,
        (costoPorPlato.get(r.dishId) ?? 0) + (item?.cost ?? 0) * r.qty
      );
    }
    let total = 0;
    for (const p of data.pedidos) {
      if (p.estado !== "pagado" && p.estado !== "entregado") continue;
      for (const i of p.items) {
        total += (costoPorPlato.get(i.dishId) ?? 0) * i.qty;
      }
    }
    return total;
  }, [data]);

  if (!data) return <p className="text-zinc-500">Cargando…</p>;

  // ---- cálculos ----
  const hoyInicio = HOY_INICIO_MS;

  const pagosHoy = data.pagos.filter((p) => p.createdAt >= hoyInicio);
  const cobradoHoy = pagosHoy.reduce((s, p) => s + p.monto, 0);
  const propinasHoy = pagosHoy.reduce((s, p) => s + p.propina, 0);
  const porCobrar = data.pedidos
    .filter((p) => p.estado === "entregado")
    .reduce((s, p) => s + p.total, 0);
  const gastosHoy = data.gastos
    .filter((g) => g.createdAt >= hoyInicio)
    .reduce((s, g) => s + g.monto, 0);
  const totalGastos = data.gastos.reduce((s, g) => s + g.monto, 0);

  const margenBrutoHoy = cobradoHoy - costoVendido;

  const abrirCaja = () => {
    const apertura = Number(caja.real || 0) || 0;
    saveCaja({ ...caja, estado: "abierta", apertura, real: "" });
  };

  const cerrarCaja = () => {
    const efectivoEsperado =
      caja.apertura +
      data.pagos
        .filter((p) => p.createdAt >= hoyInicio && p.metodo === "efectivo")
        .reduce((s, p) => s + p.monto + p.propina, 0);
    const real = Number(caja.real || 0) || 0;
    const diferencia = real - efectivoEsperado;
    saveCaja({
      estado: "cerrada",
      apertura: 0,
      real: "",
      historial: [
        {
          fecha: new Date().toLocaleDateString("es"),
          esperado: efectivoEsperado,
          real,
          diferencia,
        },
        ...caja.historial,
      ],
    });
  };

  const metodoCuenta = (m: string) =>
    pagosHoy.filter((p) => p.metodo === m).reduce((s, p) => s + p.monto + p.propina, 0);

  const tabs: { id: FinTab; label: string }[] = [
    { id: "resumen", label: "📈 Resumen" },
    { id: "gastos", label: "💸 Gastos" },
    { id: "caja", label: "🧮 Caja" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">Finanzas</h1>
        <p className="text-sm text-zinc-500">
          Cobros por método, caja del día, gastos y margen.
          {remote && (
            <span className="ml-2 rounded-full bg-green-500/15 px-2 py-0.5 text-xs font-bold text-green-400">
              ● Datos en vivo
            </span>
          )}
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

      {tab === "resumen" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card emoji="💵" label="Cobrado hoy" value={formatPrice(cobradoHoy + propinasHoy)} />
            <Card emoji="⏳" label="Por cobrar (servidos)" value={formatPrice(porCobrar)} />
            <Card
              emoji="📊"
              label="Margen bruto (hoy)"
              value={formatPrice(margenBrutoHoy)}
              accent={margenBrutoHoy >= 0}
            />
          </div>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="font-bold text-white">Cobros por método (hoy)</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-4">
              {[
                ["💵 Efectivo", metodoCuenta("efectivo")],
                ["💳 Tarjeta", metodoCuenta("tarjeta")],
                ["🏦 Transferencia", metodoCuenta("transferencia")],
                ["📱 QR Simple", metodoCuenta("qr")],
              ].map(([label, value]) => (
                <div key={String(label)} className="rounded-2xl bg-zinc-900 px-4 py-3">
                  <p className="text-sm text-zinc-400">{label}</p>
                  <p className="text-lg font-black">{formatPrice(Number(value))}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-zinc-500">
              💡 Boliviano: QR Simple es el estándar interbancario (Banco Unión,
              BCP Bolivia, Mercantil…). También podés aceptar transferencias por
              Yí o Banco de Crédito.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="font-bold text-white">Resumen del período</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-zinc-900 px-4 py-3">
                <p className="text-sm text-zinc-400">Ventas totales (cobrado)</p>
                <p className="text-lg font-black">
                  {formatPrice(data.pagos.reduce((s, p) => s + p.monto + p.propina, 0))}
                </p>
              </div>
              <div className="rounded-2xl bg-zinc-900 px-4 py-3">
                <p className="text-sm text-zinc-400">Costo de mercadería (recetas)</p>
                <p className="text-lg font-black">{formatPrice(costoVendido)}</p>
              </div>
              <div className="rounded-2xl bg-zinc-900 px-4 py-3">
                <p className="text-sm text-zinc-400">Gastos totales</p>
                <p className="text-lg font-black">{formatPrice(totalGastos)}</p>
              </div>
            </div>
          </section>
        </div>
      )}

      {tab === "gastos" && (
        <>
          <div className="flex justify-end">
            <button
              onClick={() =>
                setGastoForm({
                  id: `g-${Date.now()}`,
                  concepto: "",
                  monto: 0,
                  categoria: "Operación",
                  createdAt: Date.now(),
                })
              }
              className="rounded-full bg-amber-500 px-5 py-2.5 text-sm font-bold text-zinc-950 hover:bg-amber-400"
            >
              + Registrar gasto
            </button>
          </div>
          <div className="space-y-2">
            {data.gastos.map((g) => (
              <div
                key={g.id}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <div>
                  <p className="font-bold">{g.concepto}</p>
                  <p className="text-xs text-zinc-500">
                    {g.categoria} · {timeAgo(g.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-black text-red-400">−{formatPrice(g.monto)}</span>
                  <button
                    onClick={() =>
                      update({
                        ...data,
                        gastos: data.gastos.filter((x) => x.id !== g.id),
                      })
                    }
                    className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400 hover:bg-red-500/20"
                  >
                    Quitar
                  </button>
                </div>
              </div>
            ))}
            {data.gastos.length === 0 && (
              <p className="py-10 text-center text-zinc-500">Sin gastos registrados.</p>
            )}
          </div>
        </>
      )}

      {tab === "caja" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="font-bold text-white">
              {caja.estado === "abierta" ? "🧮 Caja abierta" : "🧮 Caja cerrada"}
            </h2>
            {caja.estado === "abierta" ? (
              <div className="mt-4 space-y-4">
                <p className="text-sm text-zinc-400">
                  Fondo de apertura:{" "}
                  <b className="text-white">{formatPrice(caja.apertura)}</b>
                </p>
                <Field
                  label="Efectivo real en caja (para el cierre)"
                  value={caja.real}
                  onChange={(v) => saveCaja({ ...caja, real: v })}
                />
                <button
                  onClick={cerrarCaja}
                  className="w-full rounded-full bg-amber-500 py-2.5 font-bold text-zinc-950 hover:bg-amber-400"
                >
                  Cerrar y archivar
                </button>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                <Field
                  label="Fondo de apertura (dinero inicial en caja)"
                  value={caja.real}
                  onChange={(v) => saveCaja({ ...caja, real: v })}
                />
                <button
                  onClick={abrirCaja}
                  className="w-full rounded-full bg-green-500 py-2.5 font-bold text-zinc-950 hover:bg-green-400"
                >
                  Abrir caja
                </button>
              </div>
            )}
            <div className="mt-6 border-t border-white/10 pt-4">
              <h3 className="text-sm font-bold text-zinc-300">Cierres anteriores</h3>
              <div className="mt-2 space-y-1.5">
                {caja.historial.map((h, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-zinc-400">{h.fecha}</span>
                    <span className="text-zinc-400">
                      esperado {formatPrice(h.esperado)} · real {formatPrice(h.real)}
                    </span>
                    <b className={h.diferencia >= 0 ? "text-green-400" : "text-red-400"}>
                      {h.diferencia >= 0 ? "+" : ""}
                      {formatPrice(h.diferencia)}
                    </b>
                  </div>
                ))}
                {caja.historial.length === 0 && (
                  <p className="text-sm text-zinc-500">Sin cierres aún.</p>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="font-bold text-white">Pagos registrados</h2>
            <div className="mt-3 space-y-2">
              {data.pagos.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-2xl bg-zinc-900 px-4 py-3 text-sm"
                >
                  <div>
                    <span className="font-bold">Mesa {p.mesa}</span>
                    <span className="ml-2 text-xs text-zinc-500">
                      {p.metodo} · {p.cajero || "Admin"}
                    </span>
                    {p.propina > 0 && (
                      <span className="ml-1 text-xs text-green-400">
                        propina {formatPrice(p.propina)}
                      </span>
                    )}
                  </div>
                  <span className="font-black">{formatPrice(p.monto + p.propina)}</span>
                </div>
              ))}
              {data.pagos.length === 0 && (
                <p className="py-8 text-center text-sm text-zinc-500">
                  Sin pagos registrados. Los cobros desde el módulo Pedidos aparecen acá.
                </p>
              )}
            </div>
          </section>
        </div>
      )}

      {gastoForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md space-y-4 rounded-3xl border border-white/10 bg-zinc-900 p-6">
            <h3 className="text-lg font-black">Nuevo gasto</h3>
            <Field
              label="Concepto"
              value={gastoForm.concepto}
              onChange={(v) => setGastoForm({ ...gastoForm, concepto: v })}
            />
            <Field
              label="Categoría"
              value={gastoForm.categoria}
              onChange={(v) => setGastoForm({ ...gastoForm, categoria: v })}
            />
            <Field
              label="Monto (Bs)"
              value={String(gastoForm.monto)}
              onChange={(v) =>
                setGastoForm({ ...gastoForm, monto: Number(v) || 0 })
              }
            />
            <button
              onClick={() => {
                if (!gastoForm.concepto.trim()) return;
                update({ ...data, gastos: [gastoForm, ...data.gastos] });
                setGastoForm(null);
              }}
              className="w-full rounded-full bg-amber-500 py-2.5 font-bold text-zinc-950 hover:bg-amber-400"
            >
              Guardar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Card({
  emoji,
  label,
  value,
  accent = true,
}: {
  emoji: string;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <p className="text-2xl">{emoji}</p>
      <p className={`mt-3 text-2xl font-black ${accent ? "" : "text-red-400"}`}>
        {value}
      </p>
      <p className="text-sm text-zinc-500">{label}</p>
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
