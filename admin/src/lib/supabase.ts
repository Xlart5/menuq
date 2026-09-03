"use client";

import { createClient } from "@supabase/supabase-js";

const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://vengiwcaizzknbnohbry.supabase.co";
const anonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlbmdpd2NhaXp6a25ibm9oYnJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MDM4NzMsImV4cCI6MjEwMzk3OTg3M30.UeArvrjWyKiZ0DGBjN4MZ3DQOWKU5Y8pmp7J6M-VqZs";

export const supabase = createClient(url, anonKey);

export const isSupabaseConfigured = true;
