"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { clearAuth, useStorageAuth } from "@/lib/storage";

const nav = [
  { href: "/dashboard", label: "Dashboard", emoji: "📊" },
  { href: "/platos", label: "Platos", emoji: "🍽️" },
  { href: "/categorias", label: "Categorías", emoji: "🗂️" },
  { href: "/mesas", label: "Mesas & QR", emoji: "🪑" },
  { href: "/pedidos", label: "Pedidos", emoji: "🧾" },
  { href: "/resenas", label: "Reseñas", emoji: "⭐" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const authed = useStorageAuth();

  useEffect(() => {
    if (!authed) {
      router.replace("/login");
    }
  }, [authed, router]);

  if (!authed) {
    return (
      <main className="flex min-h-screen items-center justify-center text-zinc-500">
        Cargando…
      </main>
    );
  }

  const logout = () => {
    clearAuth();
    router.replace("/login");
  };

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-white/10 bg-zinc-950 px-4 py-6">
        <Link href="/dashboard" className="mb-8 flex items-center gap-2 px-2">
          <span className="rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 px-2 py-1 font-black text-zinc-950">
            Q
          </span>
          <span className="font-bold">MenuQ Admin</span>
        </Link>
        <nav className="flex-1 space-y-1">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-amber-500 text-zinc-950"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>{item.emoji}</span> {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={logout}
          className="rounded-xl border border-white/10 px-3 py-2.5 text-left text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          🚪 Cerrar sesión
        </button>
      </aside>
      <main className="flex-1 overflow-x-hidden px-6 py-8 lg:px-10">{children}</main>
    </div>
  );
}
