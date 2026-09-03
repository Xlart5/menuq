const mem = new Map<string, string>();

function hasLocalStorage() {
  try {
    return typeof localStorage !== "undefined";
  } catch {
    return false;
  }
}

export function storageGet(key: string): string | null {
  if (hasLocalStorage()) {
    try {
      return localStorage.getItem(key);
    } catch {
      // continuar con memoria
    }
  }
  return mem.get(key) ?? null;
}

export function storageSet(key: string, value: string) {
  if (hasLocalStorage()) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // continuar con memoria
    }
  }
  mem.set(key, value);
}

export function storageRemove(key: string) {
  if (hasLocalStorage()) {
    try {
      localStorage.removeItem(key);
    } catch {
      // continuar con memoria
    }
  }
  mem.delete(key);
}

let listeners: (() => void)[] = [];

export function storageSubscribe(cb: () => void) {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
}

export function storageNotify() {
  const current = listeners.slice();
  for (const cb of current) {
    try {
      cb();
    } catch {
      // ignorar
    }
  }
}

if (hasLocalStorage()) {
  try {
    window.addEventListener("storage", storageNotify);
  } catch {
    // continuar
  }
}
