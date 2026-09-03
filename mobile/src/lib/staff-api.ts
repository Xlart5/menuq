import { supabase } from "@/lib/supabase";

export type Asignacion = {
  id: string;
  mesa: number;
  mesero: string;
  estado: "asignada" | "libre";
  createdAt: number;
};

export type StaffOrder = {
  id: string;
  mesa: number;
  total: number;
  estado: string;
  items: { name: string; emoji: string; qty: number; price: number }[];
  createdAt: number;
};

export type StaffPago = {
  mesa: number;
  metodo: string;
  monto: number;
  propina: number;
};

const mapAsignacion = (r: any): Asignacion => ({
  id: String(r.id),
  mesa: Number(r.mesa),
  mesero: String(r.mesero ?? ""),
  estado: r.estado === "asignada" ? "asignada" : "libre",
  createdAt: new Date(String(r.created_at)).getTime(),
});

export async function fetchStaffData() {
  const [mesas, asig, orders, pagos] = await Promise.all([
    supabase.from("mesas").select("numero").order("numero"),
    supabase.from("asignaciones").select("*"),
    supabase.from("orders").select("*").order("created_at", { ascending: false }),
    supabase.from("pagos").select("mesa, metodo, monto, propina"),
  ]);

  return {
    numeros: (mesas.data ?? []).map((m) => Number(m.numero)),
    asignaciones: (asig.data ?? []).map(mapAsignacion),
    orders: (orders.data ?? []).map(
      (o): StaffOrder => ({
        id: String(o.id),
        mesa: Number(o.mesa),
        total: Number(o.total),
        estado: String(o.estado),
        items: (o.items ?? []) as StaffOrder["items"],
        createdAt: new Date(String(o.created_at)).getTime(),
      })
    ),
    pagos: (pagos.data ?? []).map(
      (p): StaffPago => ({
        mesa: Number(p.mesa),
        metodo: String(p.metodo),
        monto: Number(p.monto),
        propina: Number(p.propina),
      })
    ),
  };
}

export async function asignarMesa(mesa: number, mesero: string) {
  const { error } = await supabase.from("asignaciones").upsert({
    id: `as-${mesa}`,
    mesa,
    mesero,
    estado: "asignada",
    created_at: new Date().toISOString(),
  });
  return !error;
}

export async function liberarMesa(mesa: number) {
  const { error } = await supabase
    .from("asignaciones")
    .upsert({
      id: `as-${mesa}`,
      mesa,
      mesero: "",
      estado: "libre",
      created_at: new Date().toISOString(),
    });
  return !error;
}

export async function updateOrderEstado(id: string, estado: string) {
  const { error } = await supabase
    .from("orders")
    .update({ estado })
    .eq("id", id);
  return !error;
}

export async function cambiarMesa(
  orderId: string,
  oldMesa: number,
  newMesa: number,
  mesero: string
) {
  const { error: orderErr } = await supabase
    .from("orders")
    .update({ mesa: newMesa })
    .eq("id", orderId);
  if (orderErr) return false;
  await asignarMesa(newMesa, mesero);
  const { data } = await supabase
    .from("orders")
    .select("id")
    .eq("mesa", oldMesa)
    .not("estado", "eq", "pagado");
  if (!data || data.length === 0) {
    await liberarMesa(oldMesa);
  }
  return true;
}
