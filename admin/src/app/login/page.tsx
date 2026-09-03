"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [crear, setCrear] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOk("");
    if (!email.trim() || password.length < 6) {
      setError("Ingresa un correo válido y una contraseña de 6+ caracteres.");
      return;
    }
    setBusy(true);
    try {
      if (crear) {
        const { data, error: signErr } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });
        if (signErr) {
          setError(signErr.message);
          return;
        }
        if (!data.user) {
          setError("Revisa tu correo: la confirmación puede estar activada.");
          return;
        }
        await supabase.from("profiles").upsert({
          user_id: data.user.id,
          nombre: email.trim(),
          rol: "staff",
        });
        setOk(
          "Cuenta creada. Si Supabase exige confirmación, revisa tu bandeja; luego entra con estos datos."
        );
        setCrear(false);
        setBusy(false);
        return;
      }
      const { data, error: signErr } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signErr) {
        setError(signErr.message);
        return;
      }
      if (data.session) {
        router.replace("/dashboard");
      }
    } catch {
      setError("Fallo de conexión. Intenta de nuevo.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="inline-block rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 px-3 py-1.5 font-black text-zinc-950">
            LE
          </span>
          <h1 className="mt-4 text-2xl font-black">La Estancia</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Panel de administración del restaurante
          </p>
        </div>
        <form
          onSubmit={submit}
          className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6"
        >
          <label className="block">
            <span className="mb-1 block text-sm text-zinc-300">Correo</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@laestancia.bo"
              className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-white placeholder:text-zinc-600 focus:border-amber-500/50 focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-zinc-300">Contraseña</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-white placeholder:text-zinc-600 focus:border-amber-500/50 focus:outline-none"
            />
          </label>
          {error && <p className="text-sm text-red-400">{error}</p>}
          {ok && <p className="text-sm text-green-400">{ok}</p>}
          <button
            disabled={busy}
            className="w-full rounded-xl bg-amber-500 py-3 font-bold text-zinc-950 transition-colors hover:bg-amber-400 disabled:opacity-50"
          >
            {busy ? "Un momento…" : crear ? "Crear acceso" : "Entrar"}
          </button>
          <button
            type="button"
            onClick={() => setCrear(!crear)}
            className="w-full text-center text-xs text-zinc-500 hover:text-zinc-300"
          >
            {crear
              ? "Ya tengo cuenta → entrar"
              : "¿Sin acceso? Creá la primera cuenta (rol: staff)"}
          </button>
        </form>
      </div>
    </main>
  );
}
