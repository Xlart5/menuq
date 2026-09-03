export type Category = {
  id: string;
  name: string;
  emoji: string;
};

export type Dish = {
  id: string;
  name: string;
  description: string;
  price: number;
  emoji: string;
  categoryId: string;
  popular?: boolean;
  allergens?: string;
  available?: boolean;
};

export const RESTAURANT = {
  name: "La Estancia",
  tagline: "Steakhouse premium · cortes madurados",
  badge: "Parrilla premium",
};

export const APP_URL =
  process.env.EXPO_PUBLIC_APP_URL ?? "https://menuq-app-mobile.vercel.app";

export const categories: Category[] = [
  { id: "entradas", name: "Entradas", emoji: "🧀" },
  { id: "cortes", name: "Cortes", emoji: "🥩" },
  { id: "guarniciones", name: "Guarniciones", emoji: "🥔" },
  { id: "dulces", name: "Dulces", emoji: "🍰" },
  { id: "bebidas", name: "Bebidas", emoji: "🍷" },
];

export const dishes: Dish[] = [
  {
    id: "provoleta",
    name: "Provoleta a la parrilla",
    description: "Provoleta fundida con orégano, aceite de oliva y pan de campo.",
    price: 8.9,
    emoji: "🧀",
    categoryId: "entradas",
    popular: true,
    allergens: "contiene lactosa",
  },
  {
    id: "chorizo",
    name: "Chorizo criollo",
    description: "Chorizo a la brasa con chimichurri de la casa.",
    price: 7.9,
    emoji: "🌭",
    categoryId: "entradas",
  },
  {
    id: "bife",
    name: "Bife de chorizo",
    description: "Corte premium 300g con maduración de 21 días, a la parrilla.",
    price: 18.9,
    emoji: "🥩",
    categoryId: "cortes",
    popular: true,
  },
  {
    id: "ojo",
    name: "Ojo de bife",
    description: "Ancho de vaca 400g al término perfecto, con chimichurri.",
    price: 24.9,
    emoji: "🥩",
    categoryId: "cortes",
    popular: true,
  },
  {
    id: "asado",
    name: "Asado de tira",
    description: "Asado de tira de res, 12 horas de cocción lenta al carbón.",
    price: 16.9,
    emoji: "🍖",
    categoryId: "cortes",
  },
  {
    id: "lomo",
    name: "Lomo al carbón",
    description: "Medallones de lomo fino con reducción de vino tinto.",
    price: 19.9,
    emoji: "🥓",
    categoryId: "cortes",
  },
  {
    id: "papas",
    name: "Papas rústicas",
    description: "Papas doradas con romero fresco y sal de mar.",
    price: 5.5,
    emoji: "🍟",
    categoryId: "guarniciones",
  },
  {
    id: "ensalada",
    name: "Ensalada césar",
    description: "Lechuga, pollo a la plancha, parmesano y crutones.",
    price: 7.9,
    emoji: "🥗",
    categoryId: "guarniciones",
    allergens: "contiene gluten, lactosa y huevo",
  },
  {
    id: "torta",
    name: "Torta de chocolate",
    description: "Porción de torta húmeda de chocolate con crema belga.",
    price: 5.9,
    emoji: "🍰",
    categoryId: "dulces",
    popular: true,
    allergens: "contiene gluten, lactosa y huevo",
  },
  {
    id: "cheesecake",
    name: "Cheesecake de maracuyá",
    description: "Suave cheesecake con coulis de maracuyá.",
    price: 6.9,
    emoji: "🎂",
    categoryId: "dulces",
    allergens: "contiene lactosa",
  },
  {
    id: "limonada",
    name: "Limonada frozen",
    description: "Limonada natural con hielo y hierbabuena.",
    price: 3.5,
    emoji: "🍋",
    categoryId: "bebidas",
  },
  {
    id: "vino",
    name: "Copa de vino tinto",
    description: "Malbec argentino seleccionado por nuestro sommelier.",
    price: 7.9,
    emoji: "🍷",
    categoryId: "bebidas",
    popular: true,
  },
];

export const formatPrice = (value: number) => `$${value.toFixed(2)}`;

export function getCategory(id: string) {
  return categories.find((c) => c.id === id);
}

export function getDish(id: string) {
  return dishes.find((d) => d.id === id);
}
