export const restaurant = {
  name: "La Estancia",
  tagline: "Steakhouse premium · cortes madurados 21 días",
  description:
    "Somos un steakhouse familiar con 25 años de historia. Cortes premium con maduración en seco, parrilla de carbón de quebracho y una carta de vinos seleccionada por nuestro sommelier.",
  address: "Av. Los Sabores 1234, Lima",
  hours: "Mar – Dom · 12:00 – 23:00",
  phone: "+51 999 888 777",
  whatsapp: "https://wa.me/51999888777",
  rating: 4.8,
  reviewsCount: 342,
};

export const stats = [
  { value: "25+", label: "Años de parrilla" },
  { value: "120+", label: "Vinos en carta" },
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

export const featuredDishes = dishes.filter((d) => d.popular).slice(0, 6);

export const gallery = [
  { emoji: "🔥", label: "Parrilla a carbón de quebracho" },
  { emoji: "🥩", label: "Cortes madurados 21 días" },
  { emoji: "🍷", label: "Carta de vinos premium" },
  { emoji: "🧀", label: "Provoletas al fuego" },
  { emoji: "🍖", label: "Asado de tira 12 horas" },
  { emoji: "✨", label: "Salón principal & privados" },
];

export const reviews = [
  {
    name: "Lucía Fernández",
    rating: 5,
    text: "El ojo de bife es de otro nivel. Maduración perfecta y la atención, impecable.",
  },
  {
    name: "Jorge Ramírez",
    rating: 5,
    text: "Pedí desde la mesa con el código QR y llegó rapidísimo. Muy práctico y la carne espectacular.",
  },
  {
    name: "Sofía Castillo",
    rating: 4,
    text: "Ambiente premium y el bife de chorizo es de los mejores que he probado.",
  },
  {
    name: "Andrés Gutiérrez",
    rating: 5,
    text: "La provoleta y el vino de la casa no fallan. Perfecto para una cena de negocios.",
  },
  {
    name: "Claudia Ríos",
    rating: 5,
    text: "Las promociones por la app son un plus. El chorizo criollo con chimichurri es imperdible.",
  },
  {
    name: "Miguel Paredes",
    rating: 4,
    text: "Buena parrilla, carta de vinos con selección seria y precios justos para el nivel.",
  },
];
