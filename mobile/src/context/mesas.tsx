import { createContext, useCallback, useContext, useMemo, useState } from "react";

export type Mesa = {
  numero: number;
};

type MesasContextValue = {
  mesas: Mesa[];
  addMesa: () => void;
  removeMesa: (numero: number) => void;
};

const MesasContext = createContext<MesasContextValue | null>(null);

const seed: Mesa[] = [1, 2, 3, 4, 5].map((n) => ({ numero: n }));

export function MesasProvider({ children }: { children: React.ReactNode }) {
  const [mesas, setMesas] = useState<Mesa[]>(seed);

  const addMesa = useCallback(() => {
    setMesas((prev) => {
      const nextNumero = prev.reduce((max, m) => Math.max(max, m.numero), 0) + 1;
      return [...prev, { numero: nextNumero }];
    });
  }, []);

  const removeMesa = useCallback((numero: number) => {
    setMesas((prev) => prev.filter((m) => m.numero !== numero));
  }, []);

  const value = useMemo(
    () => ({ mesas, addMesa, removeMesa }),
    [mesas, addMesa, removeMesa]
  );

  return <MesasContext.Provider value={value}>{children}</MesasContext.Provider>;
}

export function useMesas() {
  const ctx = useContext(MesasContext);
  if (!ctx) throw new Error("useMesas debe usarse dentro de MesasProvider");
  return ctx;
}
