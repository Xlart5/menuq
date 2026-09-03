import { AdminData } from "./types";

const STORAGE_KEY = "menuq-admin-data";

const demo: AdminData = {
  categories: [
    { id: "entradas", name: "Entradas", emoji: "🧀" },
    { id: "cortes", name: "Cortes", emoji: "🥩" },
    { id: "guarniciones", name: "Guarniciones", emoji: "🥔" },
    { id: "dulces", name: "Dulces", emoji: "🍰" },
    { id: "bebidas", name: "Bebidas", emoji: "🍷" },
  ],
  dishes: [
    { id: "provoleta", name: "Provoleta a la parrilla", description: "Provoleta fundida con orégano, aceite de oliva y pan de campo.", price: 8.9, emoji: "🧀", categoryId: "entradas", popular: true },
    { id: "chorizo", name: "Chorizo criollo", description: "Chorizo a la brasa con chimichurri de la casa.", price: 7.9, emoji: "🌭", categoryId: "entradas" },
    { id: "bife", name: "Bife de chorizo", description: "Corte premium 300g con maduración de 21 días, a la parrilla.", price: 18.9, emoji: "🥩", categoryId: "cortes", popular: true },
    { id: "ojo", name: "Ojo de bife", description: "Ancho de vaca 400g al término perfecto, con chimichurri.", price: 24.9, emoji: "🥩", categoryId: "cortes", popular: true },
    { id: "asado", name: "Asado de tira", description: "Asado de tira de res, 12 horas de cocción lenta al carbón.", price: 16.9, emoji: "🍖", categoryId: "cortes" },
    { id: "lomo", name: "Lomo al carbón", description: "Medallones de lomo fino con reducción de vino tinto.", price: 19.9, emoji: "🥓", categoryId: "cortes" },
    { id: "papas", name: "Papas rústicas", description: "Papas doradas con romero fresco y sal de mar.", price: 5.5, emoji: "🍟", categoryId: "guarniciones" },
    { id: "ensalada", name: "Ensalada césar", description: "Lechuga, pollo a la plancha, parmesano y crutones.", price: 7.9, emoji: "🥗", categoryId: "guarniciones" },
    { id: "torta", name: "Torta de chocolate", description: "Porción de torta húmeda de chocolate con crema belga.", price: 5.9, emoji: "🍰", categoryId: "dulces", popular: true },
    { id: "cheesecake", name: "Cheesecake de maracuyá", description: "Suave cheesecake con coulis de maracuyá.", price: 6.9, emoji: "🎂", categoryId: "dulces" },
    { id: "limonada", name: "Limonada frozen", description: "Limonada natural con hielo y hierbabuena.", price: 3.5, emoji: "🍋", categoryId: "bebidas" },
    { id: "vino", name: "Copa de vino tinto", description: "Malbec argentino seleccionado por nuestro sommelier.", price: 7.9, emoji: "🍷", categoryId: "bebidas", popular: true },
  ],
  mesas: [1, 2, 3, 4, 5, 6].map((n) => ({ numero: n })),
  pedidos: [
    {
      id: "P-1001",
      mesa: 3,
      items: [
        { dishId: "ojo", name: "Ojo de bife", emoji: "🥩", qty: 1, price: 24.9 },
        { dishId: "vino", name: "Copa de vino tinto", emoji: "🍷", qty: 2, price: 7.9 },
      ],
      total: 40.7,
      estado: "enviado",
      createdAt: Date.now() - 8 * 60000,
    },
    {
      id: "P-1002",
      mesa: 5,
      items: [
        { dishId: "provoleta", name: "Provoleta a la parrilla", emoji: "🧀", qty: 1, price: 8.9 },
        { dishId: "torta", name: "Torta de chocolate", emoji: "🍰", qty: 1, price: 5.9 },
      ],
      total: 14.8,
      estado: "en_preparacion",
      createdAt: Date.now() - 22 * 60000,
    },
    {
      id: "P-1003",
      mesa: 1,
      items: [
        { dishId: "chorizo", name: "Chorizo criollo", emoji: "🌭", qty: 2, price: 7.9 },
        { dishId: "limonada", name: "Limonada frozen", emoji: "🍋", qty: 1, price: 3.5 },
      ],
      total: 19.3,
      estado: "entregado",
      createdAt: Date.now() - 95 * 60000,
    },
  ],
  resenas: [
    { id: "r1", autor: "Lucía Fernández", rating: 5, texto: "El ojo de bife es de otro nivel. Maduración perfecta y la atención impecable.", createdAt: Date.now() - 86400000 },
    { id: "r2", autor: "Jorge Ramírez", rating: 5, texto: "Pedí desde la mesa con el código QR y llegó rapidísimo.", createdAt: Date.now() - 2 * 86400000 },
    { id: "r3", autor: "Sofía Castillo", rating: 4, texto: "Ambiente premium y el bife de chorizo es de los mejores que he probado.", createdAt: Date.now() - 4 * 86400000 },
  ],
};

export function loadData(): AdminData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AdminData;
  } catch {
    // datos corruptos: reiniciar demo
  }
  return JSON.parse(JSON.stringify(demo));
}

export function saveData(data: AdminData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function resetData(): AdminData {
  localStorage.removeItem(STORAGE_KEY);
  return JSON.parse(JSON.stringify(demo));
}

export function formatPrice(value: number) {
  return `$${value.toFixed(2)}`;
}

export function timeAgo(ts: number) {
  const mins = Math.floor((Date.now() - ts) / 60000);
  if (mins < 1) return "hace un momento";
  if (mins === 1) return "hace 1 min";
  if (mins < 60) return `hace ${mins} min`;
  const h = Math.floor(mins / 60);
  return `hace ${h}h ${mins % 60}min`;
}
