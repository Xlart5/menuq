export const restaurant = {
  name: "El Buen Sabor",
  tagline: "Cocina criolla & parrilla desde 1998",
  description:
    "Somos un restaurante familiar con 25 años de historia. Cocina criolla y parrilla al carbón, preparada con ingredientes frescos del mercado y mucho cariño.",
  address: "Av. Los Sabores 1234, Lima",
  hours: "Mar – Dom · 12:00 – 23:00",
  phone: "+51 999 888 777",
  whatsapp: "https://wa.me/51999888777",
  rating: 4.8,
  reviewsCount: 342,
};

export const stats = [
  { value: "25+", label: "Años de experiencia" },
  { value: "120+", label: "Platos en carta" },
  { value: "12k", label: "Clientes al mes" },
  { value: "4.8★", label: "Calificación promedio" },
];

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

export const featuredDishes = dishes.filter((d) => d.popular).slice(0, 6);

export const gallery = [
  { emoji: "🔥", label: "Parrilla al carbón" },
  { emoji: "🍖", label: "Costillas BBQ" },
  { emoji: "🥗", label: "Entradas frescas" },
  { emoji: "🍹", label: "Coctelería de la casa" },
  { emoji: "🎂", label: "Repostería artesanal" },
  { emoji: "✨", label: "Terraza y parrillada brunch" },
];

export const reviews = [
  {
    name: "Lucía Fernández",
    rating: 5,
    text: "Las costillas BBQ son de otro mundo. El servicio y la atención fueron excelentes, ¡volveremos pronto!",
  },
  {
    name: "Jorge Ramírez",
    rating: 5,
    text: "Pedí desde la mesa con el código QR y llegó rapidísimo. Muy práctico y la comida espectacular.",
  },
  {
    name: "Sofía Castillo",
    rating: 4,
    text: "Ambiente acogedor y el lomo saltado es de los mejores que he probado. Recomendado.",
  },
  {
    name: "Andrés Gutiérrez",
    rating: 5,
    text: "Pizza margherita impecable y el cheescake de maracuyá es el postre perfecto para terminar.",
  },
  {
    name: "Claudia Ríos",
    rating: 5,
    text: "Las promociones por la app son un plus. Pedí los nachos supremos y no me arrepiento.",
  },
  {
    name: "Miguel Paredes",
    rating: 4,
    text: "Buena atención, comida deliciosa y precios justos. La terraza es un gran detalle.",
  },
];
