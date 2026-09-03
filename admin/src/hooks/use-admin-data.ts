"use client";

import { useEffect, useState } from "react";

import { loadData, resetData, saveData } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { AdminData, Pedido } from "@/lib/types";

async function loadFromSupabase(): Promise<AdminData | null> {
  try {
    const [catRes, dishRes, mesaRes, orderRes, resenaRes] = await Promise.all([
      supabase!.from("categories").select("*").order("sort_order"),
      supabase!.from("dishes").select("*"),
      supabase!.from("mesas").select("*").order("numero"),
      supabase!.from("orders").select("*").order("created_at", { ascending: false }),
      supabase!.from("resenas").select("*").order("created_at", { ascending: false }),
    ]);

    if (
      catRes.error || dishRes.error || mesaRes.error ||
      orderRes.error || resenaRes.error
    ) {
      return null;
    }

    const pedidos: Pedido[] = (orderRes.data ?? []).map((o) => ({
      id: o.id,
      mesa: o.mesa,
      items: o.items ?? [],
      total: Number(o.total),
      estado: o.estado,
      createdAt: new Date(o.created_at).getTime(),
    }));

    return {
      categories: catRes.data ?? [],
      dishes: (dishRes.data ?? []).map((d) => ({
        id: d.id,
        name: d.name,
        description: d.description ?? "",
        price: Number(d.price),
        emoji: d.emoji ?? "🍽️",
        categoryId: d.category_id,
        popular: d.popular ?? false,
      })),
      mesas: mesaRes.data ?? [],
      pedidos,
      resenas: (resenaRes.data ?? []).map((r) => ({
        id: r.id,
        autor: r.autor,
        rating: r.rating,
        texto: r.texto,
        createdAt: new Date(r.created_at).getTime(),
      })),
    };
  } catch {
    return null;
  }
}

async function saveToSupabase(data: AdminData) {
  if (!supabase) return;
  await supabase.from("categories").upsert(
    data.categories.map((c, i) => ({
      id: c.id, name: c.name, emoji: c.emoji, sort_order: i + 1,
    })),
    { onConflict: "id" }
  );
  await supabase.from("dishes").upsert(
    data.dishes.map((d) => ({
      id: d.id, name: d.name, description: d.description,
      price: d.price, emoji: d.emoji, category_id: d.categoryId,
      popular: d.popular ?? false,
    })),
    { onConflict: "id" }
  );
  await supabase.from("mesas").upsert(
    data.mesas.map((m) => ({ numero: m.numero })),
    { onConflict: "numero" }
  );
  await supabase.from("orders").upsert(
    data.pedidos.map((p) => ({
      id: p.id, mesa: p.mesa, items: p.items, total: p.total,
      estado: p.estado, created_at: new Date(p.createdAt).toISOString(),
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
}

export function useAdminData() {
  const [data, setData] = useState<AdminData | null>(() =>
    supabase ? null : loadData()
  );
  const [remote, setRemote] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    loadFromSupabase().then((remoteData) => {
      setData(remoteData ?? loadData());
      setRemote(remoteData !== null);
    });
  }, []);

  const reload = () => {
    if (!supabase) return;
    loadFromSupabase().then((remoteData) => {
      if (remoteData) {
        setData(remoteData);
        setRemote(true);
      }
    });
  };

  const update = (next: AdminData) => {
    saveData(next);
    setData(next);
    saveToSupabase(next);
  };

  const reset = () => {
    setData(resetData());
    saveToSupabase(resetData());
  };

  return { data, update, reset, reload, remote };
}
