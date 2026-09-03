import { useSyncExternalStore } from "react";

export type Staff = {
  nombre: string;
};

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}

export function useStaff() {
  const raw = useSyncExternalStore(
    subscribe,
    () => localStorage.getItem("menuq-staff"),
    () => null
  );

  let staff: Staff | null = null;
  try {
    staff = raw ? (JSON.parse(raw) as Staff) : null;
  } catch {
    staff = null;
  }

  const setStaff = (value: Staff | null) => {
    if (value) {
      localStorage.setItem("menuq-staff", JSON.stringify(value));
    } else {
      localStorage.removeItem("menuq-staff");
    }
    window.dispatchEvent(new Event("storage"));
  };

  return { staff, setStaff };
}
