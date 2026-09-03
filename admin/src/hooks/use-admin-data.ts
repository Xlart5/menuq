"use client";

import { useCallback, useEffect, useState } from "react";

import { loadData, resetData, saveData } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { AdminData, Pedido } from "@/lib/types";

const allTables = [
  "categories", "dishes", "mesas", "orders", "resenas",
  "items", "movimientos", "recipes", "gastos", "llamadas", "pagos",
] as const;

const columnMaps: Record<string, Record<string, string>> = {
  items: {
    name: "name", unit: "unit", stock: "stock", minStock: "min_stock",
    cost: "cost", category: "category",
  },
  dishes: {
    name: "name", description: "description", price: "price", emoji: "emoji",
    categoryId: "category_id", popular: "popular",
    allergens: "allergens", available: "available",
  },
  movimientos: { itemId: "item_id", motivo: "motivo", tipo: "tipo", qty: "qty", createdAt: "created_at" },
  recipes: { dishId: "dish_id", itemId: "item_id", qty: "qty" },
  gastos: { concepto: "concepto", monto: "monto", categoria: "categoria", createdAt: "created_at" },
  llamadas: { mesa: "mesa", tipo: "tipo", estado: "estado", createdAt: "created_at" },
  pagos: { pedidoId: "pedido_id", mesa: "mesa", metodo: "metodo", monto: "monto", propina: "propina", cajero: "cajero", createdAt: "created_at" },
};

async function loadFromSupabase(): Promise<AdminData | null> {
  try {
    const results: Record<string, unknown[]> = {};
    for (const t of allTables) {
      const { data, error } = await supabase!.from(t).select("*");
      if (error) return null;
      results[t] = data ?? [];
    }

    const mapRow = (t: string, row: Record<string, unknown>) => {
      if (t === "categories") {
        return { id: String(row.id), name: String(row.name), emoji: String(row.emoji ?? "🍽️") };
      }
      if (t === "orders") {
        return {
          id: String(row.id), mesa: Number(row.mesa),
          items: (row.items as never[]) ?? [],
          total: Number(row.total), estado: String(row.estado),
          createdAt: new Date(String(row.created_at)).getTime(),
        } as Pedido;
      }
      if (t === "resenas") {
        return {
          id: String(row.id), autor: String(row.autor), rating: Number(row.rating),
          texto: String(row.texto), createdAt: new Date(String(row.created_at)).getTime(),
        };
      }
      if (t === "mesas") {
        return { numero: Number(row.numero) };
      }
      const cols = columnMaps[t] ?? {};
      const out: Record<string, unknown> = {};
      for (const [appKey, dbKey] of Object.entries(cols)) {
        if (dbKey === "created_at") {
          out[appKey] = new Date(String(row[dbKey])).getTime();
        } else {
          out[appKey] = row[dbKey];
        }
      }
      out.id = String(row.id);
      return out;
    };

    return {
      categories: (results.categories as unknown[] as Record<string, unknown>[]).map((r) => mapRow("categories", r)) as AdminData["categories"],
      dishes: (results.dishes as Record<string, unknown>[]).map((r) => mapRow("dishes", r)) as AdminData["dishes"],
      mesas: (results.mesas as Record<string, unknown>[]).map((r) => mapRow("mesas", r)) as AdminData["mesas"],
      pedidos: (results.orders as Record<string, unknown>[]).map((r) => mapRow("orders", r)) as AdminData["pedidos"],
      resenas: (results.resenas as Record<string, unknown>[]).map((r) => mapRow("resenas", r)) as AdminData["resenas"],
      items: (results.items as Record<string, unknown>[]).map((r) => mapRow("items", r)) as AdminData["items"],
      movimientos: (results.movimientos as Record<string, unknown>[]).map((r) => mapRow("movimientos", r)) as AdminData["movimientos"],
      recipes: (results.recipes as Record<string, unknown>[]).map((r) => mapRow("recipes", r)) as AdminData["recipes"],
      gastos: (results.gastos as Record<string, unknown>[]).map((r) => mapRow("gastos", r)) as AdminData["gastos"],
      llamadas: (results.llamadas as Record<string, unknown>[]).map((r) => mapRow("llamadas", r)) as AdminData["llamadas"],
      pagos: (results.pagos as Record<string, unknown>[]).map((r) => mapRow("pagos", r)) as AdminData["pagos"],
    };
  } catch {
    return null;
  }
}

async function saveToSupabase(data: AdminData) {
  if (!supabase) return;
  await supabase.from("categories").upsert(
    data.categories.map((c, i) => ({ id: c.id, name: c.name, emoji: c.emoji, sort_order: i + 1 })),
    { onConflict: "id" }
  );
  await supabase.from("dishes").upsert(
    data.dishes.map((d) => ({
      id: d.id, name: d.name, description: d.description, price: d.price,
      emoji: d.emoji, category_id: d.categoryId, popular: d.popular ?? false,
      allergens: d.allergens ?? "", available: d.available ?? true,
    })),
    { onConflict: "id" }
  );
  await supabase.from("mesas").upsert(
    data.mesas.map((m) => ({ numero: m.numero })),
    { onConflict: "numero" }
  );
  await supabase.from("orders").upsert(
    data.pedidos.map((p) => ({
      id: p.id, mesa: p.mesa, items: p.items, total: p.total, estado: p.estado,
      created_at: new Date(p.createdAt).toISOString(),
    })),
    { onConflict: "id" }
  );
  await supabase.from("resenas").upsert(
    data.resenas.map((r) => ({
      id: r.id, autor: r.autor, rating: r.rating, texto: r.texto,
      created_at: new Date(r.createdAt).toISOString(),
    })),
    { onConflict: "id" }
  );
  await supabase.from("items").upsert(
    data.items.map((i) => ({
      id: i.id, name: i.name, unit: i.unit, stock: i.stock,
      min_stock: i.minStock, cost: i.cost, category: i.category,
    })),
    { onConflict: "id" }
  );
  await supabase.from("movimientos").upsert(
    data.movimientos.map((m) => ({
      id: m.id, item_id: m.itemId, tipo: m.tipo, qty: m.qty, motivo: m.motivo,
      created_at: new Date(m.createdAt).toISOString(),
    })),
    { onConflict: "id" }
  );
  await supabase.from("recipes").upsert(
    data.recipes.map((r) => ({
      id: r.id, dish_id: r.dishId, item_id: r.itemId, qty: r.qty,
    })),
    { onConflict: "id" }
  );
  await supabase.from("gastos").upsert(
    data.gastos.map((g) => ({
      id: g.id, concepto: g.concepto, monto: g.monto, categoria: g.categoria,
      created_at: new Date(g.createdAt).toISOString(),
    })),
    { onConflict: "id" }
  );
  await supabase.from("pagos").upsert(
    data.pagos.map((p) => ({
      id: p.id, pedido_id: p.pedidoId, mesa: p.mesa, metodo: p.metodo,
      monto: p.monto, propina: p.propina, cajero: p.cajero,
      created_at: new Date(p.createdAt).toISOString(),
    })),
    { onConflict: "id" }
  );
}

export function useAdminData() {
  const [data, setData] = useState<AdminData | null>(() => loadData());
  const [remote, setRemote] = useState(false);

  useEffect(() => {
    loadFromSupabase().then((remoteData) => {
      if (remoteData) {
        setData(remoteData);
        setRemote(true);
      }
    });
  }, []);

  const reload = useCallback(() => {
    loadFromSupabase().then((remoteData) => {
      if (remoteData) {
        setData(remoteData);
        setRemote(true);
      }
    });
  }, []);

  const update = useCallback(
    (next: AdminData) => {
      saveData(next);
      setData(next);
      saveToSupabase(next);
    },
    []
  );

  const reset = useCallback(() => {
    const fresh = resetData();
    setData(fresh);
    saveToSupabase(fresh);
  }, []);

  return { data, update, reset, reload, remote };
}
