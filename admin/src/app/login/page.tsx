"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { setAuth } from "@/lib/storage";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() === "" || password.trim() === "") {
      setError("Ingresa tu correo y contraseña.");
      return;
    }
    setAuth(email.trim(), Date.now());
    router.replace("/dashboard");
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="inline-block rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 px-3 py-1.5 font-black text-zinc-950">
            Q
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
              placeholder="admin@menuq.app"
              className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-white placeholder:text-zinc-600 focus:border-amber-500/50 focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-zinc-300">Contraseña</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-white placeholder:text-zinc-600 focus:border-amber-500/50 focus:outline-none"
            />
          </label>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button className="w-full rounded-xl bg-amber-500 py-3 font-bold text-zinc-950 transition-colors hover:bg-amber-400">
            Entrar
          </button>
          <p className="text-center text-xs text-zinc-500">
            Acceso inicial: ingresá con tu correo y contraseña del local.
          </p>
        </form>
      </div>
    </main>
  );
}
