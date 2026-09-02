import { AdminData } from "./types";

const STORAGE_KEY = "menuq-admin-data";

const demo: AdminData = {
  categories: [
    { id: "entradas", name: "Entradas", emoji: "🥗" },
    { id: "hamburguesas", name: "Hamburguesas", emoji: "🍔" },
    { id: "pizza", name: "Pizza", emoji: "🍕" },
    { id: "parrilla", name: "Parrilla", emoji: "🥩" },
    { id: "dulces", name: "Dulces", emoji: "🍰" },
    { id: "bebidas", name: "Bebidas", emoji: "🥤" },
  ],
  dishes: [
    { id: "palitos", name: "Palitos de queso", description: "Crocantes palitos rebozados con salsa especial de la casa.", price: 6.5, emoji: "🧀", categoryId: "entradas", popular: true },
    { id: "nachos", name: "Nachos supremos", description: "Nachos con queso cheddar fundido, jalapeños y pico de gallo.", price: 7.9, emoji: "🌮", categoryId: "entradas" },
    { id: "classica", name: "Hamburguesa clásica", description: "Carne 100% de res, lechuga, tomate y nuestra salsa secreta.", price: 9.9, emoji: "🍔", categoryId: "hamburguesas", popular: true },
    { id: "double", name: "Hamburguesa doble", description: "Doble carne, doble queso cheddar y tocino crocante.", price: 13.5, emoji: "🍔", categoryId: "hamburguesas" },
    { id: "margherita", name: "Pizza margherita", description: "Salsa de tomate italiana, mozzarella fresca y albahaca.", price: 11.9, emoji: "🍕", categoryId: "pizza", popular: true },
    { id: "pepperoni", name: "Pizza pepperoni", description: "Generosa capa de pepperoni y queso fundido, masa al horno de leña.", price: 13.9, emoji: "🍕", categoryId: "pizza" },
    { id: "costillas", name: "Costillas BBQ", description: "Pork ribs glaseadas en BBQ, con papas rústicas.", price: 16.9, emoji: "🍖", categoryId: "parrilla", popular: true },
    { id: "lomo", name: "Lomo saltado", description: "Lomo de res con verduras salteadas al estilo criollo.", price: 14.5, emoji: "🥩", categoryId: "parrilla" },
    { id: "torta", name: "Torta de chocolate", description: "Porción de torta húmeda de chocolate con crema belga.", price: 5.9, emoji: "🍰", categoryId: "dulces", popular: true },
    { id: "cheesecake", name: "Cheesecake de maracuyá", description: "Suave cheesecake con coulis de maracuyá.", price: 6.9, emoji: "🎂", categoryId: "dulces" },
    { id: "limonada", name: "Limonada frozen", description: "Limonada natural con hielo y hierbabuena.", price: 3.5, emoji: "🍋", categoryId: "bebidas" },
    { id: "maracuya", name: "Jugo de maracuyá", description: "Jugo fresco de maracuyá con agua mineral.", price: 3.9, emoji: "🥤", categoryId: "bebidas" },
  ],
  mesas: [1, 2, 3, 4, 5, 6].map((n) => ({ numero: n })),
  pedidos: [
    {
      id: "P-1001",
      mesa: 3,
      items: [
        { dishId: "costillas", name: "Costillas BBQ", emoji: "🍖", qty: 1, price: 16.9 },
        { dishId: "limonada", name: "Limonada frozen", emoji: "🍋", qty: 2, price: 3.5 },
      ],
      total: 23.9,
      estado: "enviado",
      createdAt: Date.now() - 8 * 60000,
    },
    {
      id: "P-1002",
      mesa: 5,
      items: [
        { dishId: "margherita", name: "Pizza margherita", emoji: "🍕", qty: 1, price: 11.9 },
        { dishId: "torta", name: "Torta de chocolate", emoji: "🍰", qty: 1, price: 5.9 },
      ],
      total: 17.8,
      estado: "en_preparacion",
      createdAt: Date.now() - 22 * 60000,
    },
    {
      id: "P-1003",
      mesa: 1,
      items: [
        { dishId: "palitos", name: "Palitos de queso", emoji: "🧀", qty: 2, price: 6.5 },
        { dishId: "maracuya", name: "Jugo de maracuyá", emoji: "🥤", qty: 1, price: 3.9 },
      ],
      total: 16.9,
      estado: "entregado",
      createdAt: Date.now() - 95 * 60000,
    },
  ],
  resenas: [
    { id: "r1", autor: "Lucía Fernández", rating: 5, texto: "Las costillas BBQ son de otro mundo. El servicio fue excelente.", createdAt: Date.now() - 86400000 },
    { id: "r2", autor: "Jorge Ramírez", rating: 5, texto: "Pedí desde la mesa con el código QR y llegó rapidísimo.", createdAt: Date.now() - 2 * 86400000 },
    { id: "r3", autor: "Sofía Castillo", rating: 4, texto: "Ambiente acogedor y el lomo saltado es de los mejores que he probado.", createdAt: Date.now() - 4 * 86400000 },
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
