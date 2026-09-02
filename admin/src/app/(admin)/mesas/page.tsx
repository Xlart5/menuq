"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";

import { useAdminData } from "@/hooks/use-admin-data";
import { useStorageString } from "@/lib/storage";

export default function MesasPage() {
  const { data, update } = useAdminData();
  const [qrMesa, setQrMesa] = useState<number | null>(null);
  const [qrUrl, setQrUrl] = useState<string>("");
  const [baseUrl, setBaseUrl] = useStorageString(
    "menuq-base-url",
    "http://localhost:8081"
  );

  useEffect(() => {
    if (qrMesa === null || !baseUrl) return;
    QRCode.toDataURL(`${baseUrl}/mesa/${qrMesa}`, {
      width: 280,
      margin: 2,
      color: { dark: "#111114", light: "#ffffff" },
    })
      .then(setQrUrl)
      .catch(() => setQrUrl(""));
  }, [qrMesa, baseUrl]);

  if (!data) return <p className="text-zinc-500">Cargando…</p>;

  const addMesa = () => {
    const next = data.mesas.reduce((m, mesa) => Math.max(m, mesa.numero), 0) + 1;
    update({ ...data, mesas: [...data.mesas, { numero: next }] });
  };

  const removeMesa = (numero: number) => {
    update({ ...data, mesas: data.mesas.filter((m) => m.numero !== numero) });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black">Mesas & Códigos QR</h1>
          <p className="text-sm text-zinc-500">
            Imprime un QR por mesa. El cliente lo escanea y pide desde su celular.
          </p>
        </div>
        <button
          onClick={addMesa}
          className="rounded-full bg-amber-500 px-5 py-2.5 text-sm font-bold text-zinc-950 hover:bg-amber-400"
        >
          + Nueva mesa
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
        <label className="text-sm text-zinc-300">
          URL de la app (se usa dentro del QR):
        </label>
        <input
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          placeholder="http://localhost:8081"
          className="w-64 flex-1 rounded-xl border border-white/10 bg-zinc-900 px-4 py-2 text-sm focus:border-amber-500/50 focus:outline-none sm:flex-none"
        />
        <span className="text-xs text-zinc-500">
          Ej. http://localhost:8081 (Expo web) o tu dominio cuando la subas.
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.mesas.map((mesa) => (
          <div
            key={mesa.numero}
            className="rounded-3xl border border-white/10 bg-white/5 p-6"
          >
            <div className="flex items-center justify-between">
              <p className="text-xl font-black">🪑 Mesa {mesa.numero}</p>
              <button
                onClick={() => removeMesa(mesa.numero)}
                className="rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20"
              >
                Eliminar
              </button>
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              {baseUrl}/mesa/{mesa.numero}
            </p>
            <button
              onClick={() => setQrMesa(mesa.numero)}
              className="mt-4 w-full rounded-full bg-amber-500 py-2.5 font-bold text-zinc-950 hover:bg-amber-400"
            >
              📱 Ver QR para imprimir
            </button>
          </div>
        ))}
      </div>

      {qrMesa !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-sm space-y-4 rounded-3xl border border-white/10 bg-zinc-900 p-6 text-center">
            <h3 className="text-lg font-black">QR de la Mesa {qrMesa}</h3>
            {qrUrl ? (
              <img
                src={qrUrl}
                alt={`QR de la mesa ${qrMesa}`}
                className="mx-auto w-56 rounded-2xl bg-white p-4"
              />
            ) : (
              <div className="py-16 text-zinc-500">Generando…</div>
            )}
            <p className="text-xs text-zinc-500">
              {baseUrl}/mesa/{qrMesa}
            </p>
            <div className="flex gap-3">
              <a
                href={qrUrl}
                download={`mesa-${qrMesa}.png`}
                className="flex-1 rounded-full bg-amber-500 py-2.5 font-bold text-zinc-950 hover:bg-amber-400"
              >
                ⬇️ Descargar
              </a>
              <button
                onClick={() => setQrMesa(null)}
                className="flex-1 rounded-full border border-white/15 py-2.5 font-semibold text-zinc-300 hover:bg-white/5"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
