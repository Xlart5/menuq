import { Hero3D } from "@/components/three/hero-3d";
import { Menu3D } from "@/components/three/menu-3d";
import { ReviewsLive } from "@/components/reviews-live";
import {
  categories,
  featuredDishes,
  formatPrice,
  gallery,
  restaurant,
  stats,
} from "@/data/restaurant";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <MenuSection />
      <Menu3DSection />
      <Gallery />
      <Reviews />
      <Contact />
      <Footer />
    </>
  );
}

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <a href="#inicio" className="flex items-center gap-2">
          <span className="rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 px-2 py-1 font-black text-zinc-950">
            🍴
          </span>
          <span className="text-lg font-bold tracking-tight">
            {restaurant.name}
          </span>
        </a>
        <nav className="hidden items-center gap-6 text-sm text-zinc-300 md:flex">
          <a href="#nosotros" className="hover:text-white">Nosotros</a>
          <a href="#menu" className="hover:text-white">Menú</a>
          <a href="#galeria" className="hover:text-white">Galería</a>
          <a href="#resenas" className="hover:text-white">Reseñas</a>
          <a href="#contacto" className="hover:text-white">Contacto</a>
        </nav>
        <a
          href="#menu"
          className="rounded-full bg-amber-500 px-4 py-2 text-sm font-bold text-zinc-950 transition-colors hover:bg-amber-400"
        >
          Pedir ahora
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 lg:grid-cols-2 lg:py-28">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
            ⭐ {restaurant.rating} · {restaurant.reviewsCount} reseñas
          </span>
          <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Cortes premium & parrilla{" "}
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              de quebracho
            </span>
          </h1>
          <p className="max-w-xl text-lg text-zinc-400">{restaurant.description}</p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#menu"
              className="rounded-full bg-amber-500 px-6 py-3 font-bold text-zinc-950 transition-colors hover:bg-amber-400"
            >
              Ver menú
            </a>
            <a
              href={restaurant.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              Reservar mesa
            </a>
          </div>
          <p className="text-xs text-zinc-500">
            🕐 {restaurant.hours} · 📍 {restaurant.address}
          </p>
        </div>
        <Hero3D />
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="nosotros" className="border-y border-white/10 bg-white/[0.02]">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            25 años de fuego en cada corte
          </h2>
          <p className="text-zinc-400">
            {restaurant.description}
          </p>
          <p className="text-zinc-400">
            Cada corte pasa por maduración en seco y se cocina sobre carbón de
            quebracho: la técnica de toda una vida perfeccionada en cada
            detalle.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/10 bg-zinc-900 p-5"
              >
                <p className="text-2xl font-black text-amber-400">{s.value}</p>
                <p className="mt-1 text-sm text-zinc-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex flex-1 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-500/20 to-orange-600/10 p-8">
              <span className="text-7xl">👨‍🍳</span>
            </div>
            <div className="flex flex-1 items-center justify-center rounded-3xl bg-gradient-to-br from-red-500/15 to-amber-600/10 p-8">
              <span className="text-7xl">🔥</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-6 rounded-3xl border border-white/10 p-6">
            <div className="text-center">
              <p className="text-3xl">💬</p>
              <p className="mt-1 text-xs text-zinc-400">Pedidos por QR</p>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div className="text-center">
              <p className="text-3xl">🍺</p>
              <p className="mt-1 text-xs text-zinc-400">Terraza & bar</p>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div className="text-center">
              <p className="text-3xl">🚗</p>
              <p className="mt-1 text-xs text-zinc-400">Delivery propio</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MenuSection() {
  return (
    <section id="menu" className="mx-auto max-w-6xl px-4 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
          Nuestros platos favoritos
        </h2>
        <p className="mt-4 text-zinc-400">
          Lo más pedido por nuestros clientes. Escanea el QR de tu mesa para
          ver el menú completo y pedir sin esperar al mesero.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {categories.map((c) => (
          <span
            key={c.id}
            className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm text-zinc-300"
          >
            {c.emoji} {c.name}
          </span>
        ))}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featuredDishes.map((dish) => (
          <div
            key={dish.id}
            className="flex items-center gap-4 rounded-3xl border border-white/10 bg-zinc-900 p-5 transition-colors hover:border-amber-500/30"
          >
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-3xl">
              {dish.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-white">{dish.name}</p>
              <p className="mt-1 line-clamp-2 text-sm text-zinc-400">
                {dish.description}
              </p>
              <p className="mt-2 font-black text-amber-400">
                {formatPrice(dish.price)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <p className="inline-block rounded-full border border-amber-500/40 bg-amber-500/10 px-6 py-3 font-bold text-amber-400">
          📱 El menú completo se abre en tu celular al escanear el QR de tu mesa
        </p>
      </div>
    </section>
  );
}

function Menu3DSection() {
  return (
    <section id="menu-3d" className="mx-auto max-w-6xl px-4 py-20">
      <Menu3D />
    </section>
  );
}

function Gallery() {
  return (
    <section id="galeria" className="border-y border-white/10 bg-white/[0.02]">
      <div className="mx-auto max-w-6xl px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            Un vistazo al local
          </h2>
          <p className="mt-4 text-zinc-400">
            El ambiente que acompaña cada plato: parrilla, terraza y repostería
            artesanal.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
          {gallery.map((g) => (
            <div
              key={g.label}
              className="group relative flex h-48 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/15 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="text-6xl transition-transform group-hover:scale-110">
                {g.emoji}
              </span>
              <p className="absolute bottom-4 left-4 rounded-full bg-zinc-950/70 px-3 py-1 text-xs font-semibold text-zinc-200">
                {g.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <section id="resenas" className="mx-auto max-w-6xl px-4 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
          Lo que dicen nuestros clientes
        </h2>
        <p className="mt-4 text-zinc-400">
          {restaurant.rating} / 5 promedio basado en {restaurant.reviewsCount}{" "}
          reseñas reales.
        </p>
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ReviewsLive />
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contacto" className="relative overflow-hidden border-t border-white/10">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent" />
      <div className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Reserva tu mesa
            </h2>
            <p className="text-zinc-400">
              ¿Vienes en grupo o con toda la familia? Escríbenos y te
              reservamos el mejor lugar.
            </p>
            <div className="space-y-2 text-sm text-zinc-300">
              <p>📍 {restaurant.address}</p>
              <p>🕐 {restaurant.hours}</p>
              <p>📞 {restaurant.phone}</p>
            </div>
            <a
              href={restaurant.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-green-500 px-6 py-3 font-bold text-zinc-950 transition-colors hover:bg-green-400"
            >
              💬 Reservar por WhatsApp
            </a>
          </div>
          <div className="flex items-center justify-center rounded-3xl border border-white/10 bg-zinc-900 p-10">
            <div className="text-center">
              <p className="text-7xl">🗺️</p>
              <p className="mt-4 font-bold text-white">{restaurant.address}</p>
              <p className="mt-1 text-sm text-zinc-400">
                Estacionamiento propio · Zona de juegos para niños
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-zinc-500 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 px-2 py-0.5 font-black text-zinc-950">
            🍴
          </span>
          <span className="font-bold text-white">{restaurant.name}</span>
        </div>
        <p>
          {restaurant.tagline} · {restaurant.hours}
        </p>
      </div>
    </footer>
  );
}
