"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

import { reviews as staticReviews } from "@/data/restaurant";

type Review = {
  id: string;
  autor: string;
  rating: number;
  texto: string;
};

const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://vengiwcaizzknbnohbry.supabase.co";
const anonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlbmdpd2NhaXp6a25ibm9oYnJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MDM4NzMsImV4cCI6MjEwMzk3OTg3M30.UeArvrjWyKiZ0DGBjN4MZ3DQOWKU5Y8pmp7J6M-VqZs";
const supabase = createClient(url, anonKey);

const fallbackReviews: Review[] = staticReviews.map((r, i) => ({
  id: `static-${i}`,
  autor: r.name,
  rating: r.rating,
  texto: r.text,
}));

export function ReviewsLive() {
  const [reviews, setReviews] = useState<Review[]>(fallbackReviews);

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from("resenas")
      .select("id, autor, rating, texto")
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setReviews(data as Review[]);
        }
      });
  }, []);

  return (
    <>
      {reviews.slice(0, 6).map((r) => (
        <figure
          key={r.id}
          className="rounded-3xl border border-white/10 bg-zinc-900 p-6"
        >
          <p className="text-amber-400">
            {"★".repeat(r.rating)}
            <span className="text-zinc-700">
              {"★".repeat(Math.max(0, 5 - r.rating))}
            </span>
          </p>
          <blockquote className="mt-3 text-sm text-zinc-300">
            “{r.texto}”
          </blockquote>
          <figcaption className="mt-4 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/15 text-sm font-black text-amber-400">
              {r.autor.charAt(0)}
            </span>
            <span className="font-bold text-white">{r.autor}</span>
          </figcaption>
        </figure>
      ))}
    </>
  );
}
