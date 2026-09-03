import { useSyncExternalStore } from "react";

import {
  storageGet,
  storageNotify,
  storageRemove,
  storageSet,
  storageSubscribe,
} from "@/lib/safe-storage";

export type Staff = {
  nombre: string;
};

export function useStaff() {
  const raw = useSyncExternalStore(
    storageSubscribe,
    () => storageGet("menuq-staff"),
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
      storageSet("menuq-staff", JSON.stringify(value));
    } else {
      storageRemove("menuq-staff");
    }
    storageNotify();
  };

  return { staff, setStaff };
}
