import { useEffect, useState } from "react";

import {
  categories as demoCategories,
  dishes as demoDishes,
  Category,
  Dish,
} from "@/data/menu";
import { supabase } from "@/lib/supabase";

type MenuData = {
  categories: Category[];
  dishes: Dish[];
  source: "demo" | "supabase";
};

async function loadFromSupabase(): Promise<{ categories: Category[]; dishes: Dish[] }> {
  const cats = await supabase!
    .from("categories")
    .select("id, name, emoji, sort_order")
    .order("sort_order");
  if (cats.error || !cats.data) throw cats.error;

  const dsh = await supabase!
    .from("dishes")
    .select("id, name, description, price, emoji, category_id, popular");
  if (dsh.error || !dsh.data) throw dsh.error;

  const categories: Category[] = cats.data.map((c) => ({
    id: c.id,
    name: c.name,
    emoji: c.emoji,
  }));

  const dishes: Dish[] = dsh.data.map((d) => ({
    id: d.id,
    name: d.name,
    description: d.description ?? "",
    price: Number(d.price),
    emoji: d.emoji,
    categoryId: d.category_id,
    popular: d.popular ?? false,
  }));

  return { categories, dishes };
}

export function useMenu(): MenuData {
  const [state, setState] = useState<MenuData>({
    categories: demoCategories,
    dishes: demoDishes,
    source: "demo",
  });

  useEffect(() => {
    if (!supabase) return;
    loadFromSupabase()
      .then((data) => setState({ ...data, source: "supabase" }))
      .catch(() => {
        // Sin conexión o sin datos: se mantiene la demo local.
      });
  }, []);

  return state;
}
