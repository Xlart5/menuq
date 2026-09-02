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

export type Mesa = {
  numero: number;
};

export type PedidoEstado = "enviado" | "en_preparacion" | "entregado";

export type Pedido = {
  id: string;
  mesa: number;
  items: { dishId: string; name: string; emoji: string; qty: number; price: number }[];
  total: number;
  estado: PedidoEstado;
  createdAt: number;
};

export type Resena = {
  id: string;
  autor: string;
  rating: number;
  texto: string;
  createdAt: number;
};

export type AdminData = {
  categories: Category[];
  dishes: Dish[];
  mesas: Mesa[];
  pedidos: Pedido[];
  resenas: Resena[];
};
