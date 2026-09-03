import { supabase } from "@/lib/supabase";

export async function insertReview(autor: string, rating: number, texto: string) {
  const { error } = await supabase.from("resenas").insert({
    id: `r-${Date.now()}`,
    autor: autor.trim() || "Cliente de La Estancia",
    rating: Math.min(5, Math.max(1, rating)),
    texto: texto.trim(),
    created_at: new Date().toISOString(),
  });
  return error ? false : true;
}
