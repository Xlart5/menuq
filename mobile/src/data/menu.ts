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
};

export const RESTAURANT = {
  name: "El Buen Sabor",
  tagline: "Cocina criolla & parrilla · Web / Demo",
  badge: "Restaurante demo",
};

export const APP_URL =
  process.env.EXPO_PUBLIC_APP_URL ?? "https://menuq-app-mobile.vercel.app";

export const categories: Category[] = [
  { id: "entradas", name: "Entradas", emoji: "🥗" },
  { id: "hamburguesas", name: "Hamburguesas", emoji: "🍔" },
  { id: "pizza", name: "Pizza", emoji: "🍕" },
  { id: "parrilla", name: "Parrilla", emoji: "🥩" },
  { id: "dulces", name: "Dulces", emoji: "🍰" },
  { id: "bebidas", name: "Bebidas", emoji: "🥤" },
];

export const dishes: Dish[] = [
  {
    id: "palitos",
    name: "Palitos de queso",
    description: "Crocantes palitos rebozados con salsa especial de la casa.",
    price: 6.5,
    emoji: "🧀",
    categoryId: "entradas",
    popular: true,
  },
  {
    id: "nachos",
    name: "Nachos supremos",
    description: "Nachos con queso cheddar fundido, jalapeños y pico de gallo.",
    price: 7.9,
    emoji: "🌮",
    categoryId: "entradas",
  },
  {
    id: "classica",
    name: "Hamburguesa clásica",
    description: "Carne 100% de res, lechuga, tomate y nuestra salsa secreta.",
    price: 9.9,
    emoji: "🍔",
    categoryId: "hamburguesas",
    popular: true,
  },
  {
    id: "double",
    name: "Hamburguesa doble",
    description: "Doble carne, doble queso cheddar y tocino crocante.",
    price: 13.5,
    emoji: "🍔",
    categoryId: "hamburguesas",
  },
  {
    id: "margherita",
    name: "Pizza margherita",
    description: "Salsa de tomate italiana, mozzarella fresca y albahaca.",
    price: 11.9,
    emoji: "🍕",
    categoryId: "pizza",
    popular: true,
  },
  {
    id: "pepperoni",
    name: "Pizza pepperoni",
    description: "Generosa capa de pepperoni y queso fundido, masa al horno de leña.",
    price: 13.9,
    emoji: "🍕",
    categoryId: "pizza",
  },
  {
    id: "costillas",
    name: "Costillas BBQ",
    description: "Pork ribs glaseadas en BBQ, con papas rústicas.",
    price: 16.9,
    emoji: "🍖",
    categoryId: "parrilla",
    popular: true,
  },
  {
    id: "lomo",
    name: "Lomo saltado",
    description: "Lomo de res con verduras salteadas al estilo criollo.",
    price: 14.5,
    emoji: "🥩",
    categoryId: "parrilla",
  },
  {
    id: "torta",
    name: "Torta de chocolate",
    description: "Porción de torta húmeda de chocolate con crema belga.",
    price: 5.9,
    emoji: "🍰",
    categoryId: "dulces",
    popular: true,
  },
  {
    id: "cheesecake",
    name: "Cheesecake de maracuyá",
    description: "Suave cheesecake con coulis de maracuyá.",
    price: 6.9,
    emoji: "🎂",
    categoryId: "dulces",
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
    id: "maracuya",
    name: "Jugo de maracuyá",
    description: "Jugo fresco de maracuyá con agua mineral.",
    price: 3.9,
    emoji: "🥤",
    categoryId: "bebidas",
  },
];

export const formatPrice = (value: number) => `$${value.toFixed(2)}`;

export function getCategory(id: string) {
  return categories.find((c) => c.id === id);
}

export function getDish(id: string) {
  return dishes.find((d) => d.id === id);
}
