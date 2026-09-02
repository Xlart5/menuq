"use client";

import { useSyncExternalStore } from "react";

import { loadData, resetData, saveData } from "@/lib/data";
import { AdminData } from "@/lib/types";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function useAdminData() {
  const data = useSyncExternalStore<AdminData | null>(
    subscribe,
    () => loadData(),
    () => null
  );

  const update = (next: AdminData) => {
    saveData(next);
    window.dispatchEvent(new Event("storage"));
  };

  const reset = () => {
    resetData();
    window.dispatchEvent(new Event("storage"));
  };

  return { data, update, reset };
}
