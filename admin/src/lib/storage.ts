"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function useStorageString(key: string, fallback: string) {
  const value = useSyncExternalStore(
    subscribe,
    () => localStorage.getItem(key) ?? fallback,
    () => fallback
  );

  const setValue = (next: string) => {
    localStorage.setItem(key, next);
    window.dispatchEvent(new Event("storage"));
  };

  return [value, setValue] as const;
}

export function useStorageAuth() {
  return useSyncExternalStore(
    subscribe,
    () => localStorage.getItem("menuq-auth") !== null,
    () => false
  );
}

export function setAuth(email: string, t: number) {
  localStorage.setItem("menuq-auth", JSON.stringify({ email, t }));
  window.dispatchEvent(new Event("storage"));
}

export function clearAuth() {
  localStorage.removeItem("menuq-auth");
  window.dispatchEvent(new Event("storage"));
}
