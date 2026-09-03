"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

const nav = [
  { href: "/dashboard", label: "Dashboard", emoji: "📊", adminOnly: false },
  { href: "/cocina", label: "Cocina", emoji: "🔪", adminOnly: false },
  { href: "/pedidos", label: "Pedidos", emoji: "🧾", adminOnly: false },
  { href: "/finanzas", label: "Finanzas", emoji: "💰", adminOnly: true },
  { href: "/inventario", label: "Inventario", emoji: "📦", adminOnly: true },
  { href: "/reportes", label: "Reportes", emoji: "📈", adminOnly: true },
  { href: "/platos", label: "Platos", emoji: "🍽️", adminOnly: true },
  { href: "/categorias", label: "Categorías", emoji: "🗂️", adminOnly: true },
  { href: "/mesas", label: "Mesas & QR", emoji: "🪑", adminOnly: true },
  { href: "/resenas", label: "Reseñas", emoji: "⭐", adminOnly: true },
  { href: "/personal", label: "Personal", emoji: "👥", adminOnly: true },
  { href: "/descargas", label: "Descargas", emoji: "📲", adminOnly: true },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [active, setActive] = useState<"loading" | "out" | "in">("loading");
  const [rol, setRol] = useState<"admin" | "staff">("staff");
  const [llamadasNuevas, setLlamadasNuevas] = useState(0);

  useEffect(() => {
    const tick = async () => {
      const { data, error } = await supabase
        .from("llamadas")
        .select("id")
        .eq("estado", "nuevo");
      if (!error && data) setLlamadasNuevas(data.length);
    };
    tick();
    const timer = setInterval(tick, 15000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      if (!data.session) {
        setActive("out");
        router.replace("/login");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("rol")
        .eq("user_id", data.session.user.id)
        .maybeSingle();
      if (!cancelled) {
        setRol((profile?.rol as "admin" | "staff") ?? "staff");
        setActive("in");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (active !== "in") {
    return (
      <main className="flex min-h-screen items-center justify-center text-zinc-500">
        {active === "loading" ? "Verificando sesión…" : null}
      </main>
    );
  }

  const visibleNav = nav.filter((item) => rol === "admin" || !item.adminOnly);

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-white/10 bg-zinc-950 px-4 py-6">
        <Link href="/dashboard" className="mb-8 flex items-center gap-2 px-2">
          <span className="rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 px-2 py-1 font-black text-zinc-950">
            LE
          </span>
          <span className="font-bold">La Estancia</span>
        </Link>
        <nav className="flex-1 space-y-1">
          {visibleNav.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-amber-500 text-zinc-950"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>{item.emoji}</span> {item.label}
                {item.href === "/cocina" && llamadasNuevas > 0 && (
                  <span className="ml-auto rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-black text-white">
                    {llamadasNuevas}
                  </span>
                )}
                {item.adminOnly && rol === "admin" && (
                  <span className="ml-auto rounded-full bg-white/10 px-1.5 py-0.5 text-[10px]">
                    admin
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="space-y-2">
          <p className="px-2 text-xs text-zinc-500">
            Sesión {rol === "admin" ? "administrador" : "cocina/salón"}
          </p>
          <button
            onClick={logout}
            className="w-full rounded-xl border border-white/10 px-3 py-2.5 text-left text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            🚪 Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden px-6 py-8 lg:px-10">{children}</main>
    </div>
  );
}
