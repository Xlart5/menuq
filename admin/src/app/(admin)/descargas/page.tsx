"use client";

import QRCode from "qrcode";
import { useState } from "react";

import { useStorageString } from "@/lib/storage";

export default function DescargasPage() {
  const [apkUrl, setApkUrl] = useStorageString("menuq-apk-url", "");
  const [qrs, setQrs] = useState<Record<string, string>>({});

  const generar = async () => {
    if (!apkUrl.trim()) return;
    const dataUrl = await QRCode.toDataURL(apkUrl.trim(), {
      width: 280,
      margin: 2,
      color: { dark: "#111114", light: "#ffffff" },
    });
    setQrs({ apk: dataUrl });
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-black">Descargas · App del personal</h1>
        <p className="text-sm text-zinc-500">
          Los meseros escanean este QR para instalar la App de La Estancia
          (APK para Android y el link web iOS).
        </p>
      </div>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="font-bold text-white">Link de la APK</h2>
        <p className="text-xs text-zinc-500">
          Cuando compiles con EAS (ver abajo), pega acá el enlace de descarga y
          genera el QR.
        </p>
        <div className="mt-3 flex gap-2">
          <input
            value={apkUrl}
            onChange={(e) => setApkUrl(e.target.value)}
            placeholder="https://expo.dev/artifacts/…/app.apk"
            className="flex-1 rounded-xl border border-white/10 bg-zinc-950 px-4 py-2.5 focus:border-amber-500/50 focus:outline-none"
          />
          <button
            onClick={generar}
            className="rounded-full bg-amber-500 px-5 py-2 text-sm font-bold text-zinc-950 hover:bg-amber-400"
          >
            Generar QR
          </button>
        </div>
        {qrs.apk && (
          <div className="mt-4 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrs.apk}
              alt="QR de descarga de la app"
              className="mx-auto w-56 rounded-2xl bg-white p-4"
            />
            <p className="mt-2 text-xs text-zinc-500">
              Los meseros escanean esto desde su celular.
            </p>
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="font-bold text-white">Cómo generar la APK (una vez)</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-zinc-300">
          <li>
            Entrá a <b>https://expo.dev</b> y creá una cuenta con tu GitHub
            (gratis).
          </li>
          <li>
            En tu PC: <code className="rounded bg-zinc-900 px-1">npx eas-cli login</code>{" "}
            y autorizá en el navegador.
          </li>
          <li>
            En la carpeta <code className="rounded bg-zinc-900 px-1">mobile</code>:
            <code className="rounded bg-zinc-900 px-1">npx eas-cli build -p android --profile preview</code>{" "}
            (tarda 10-15 min y el enlace de descarga aparece al terminar).
          </li>
          <li>
            En la página del build: clic en <b>Descargar APK</b> → clic derecho
            → <b>«copiar dirección de enlace»</b>. Pegá ese enlace arriba →
            el QR queda listo para tus meseros. 🎉
          </li>
        </ol>
        <p className="mt-3 text-xs text-zinc-500">
          Nota: la misma app web ya es instalable desde el navegador (PWA:
          «Agregar a inicio»), ideal para iOS.
        </p>
      </section>
    </div>
  );
}
