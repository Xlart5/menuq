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

export type Mesa = {
  numero: number;
};

export type PedidoEstado =
  | "enviado"
  | "en_preparacion"
  | "listo"
  | "en_camino"
  | "entregado"
  | "pagado";

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

export type Item = {
  id: string;
  name: string;
  unit: string;
  stock: number;
  minStock: number;
  cost: number;
  category: string;
};

export type Movimiento = {
  id: string;
  itemId: string;
  tipo: "entrada" | "salida" | "merma";
  qty: number;
  motivo: string;
  createdAt: number;
};

export type Recipe = {
  id: string;
  dishId: string;
  itemId: string;
  qty: number;
};

export type Gasto = {
  id: string;
  concepto: string;
  monto: number;
  categoria: string;
  createdAt: number;
};

export type Llamada = {
  id: string;
  mesa: number;
  tipo: "mesero" | "cuenta";
  estado: "nuevo" | "atendido";
  createdAt: number;
};

export type Pago = {
  id: string;
  pedidoId: string | null;
  mesa: number;
  metodo: "efectivo" | "tarjeta" | "transferencia" | "qr";
  monto: number;
  propina: number;
  cajero: string;
  createdAt: number;
};

export type Asignacion = {
  id: string;
  mesa: number;
  mesero: string;
  estado: "asignada" | "libre";
  createdAt: number;
};

export type Personal = {
  id: string;
  nombre: string;
  pin: string;
  estado: "pendiente" | "aprobado" | "rechazado";
  createdAt: number;
};

export type AdminData = {
  categories: Category[];
  dishes: Dish[];
  mesas: Mesa[];
  pedidos: Pedido[];
  resenas: Resena[];
  items: Item[];
  movimientos: Movimiento[];
  recipes: Recipe[];
  gastos: Gasto[];
  llamadas: Llamada[];
  pagos: Pago[];
  asignaciones: Asignacion[];
  personales: Personal[];
};
