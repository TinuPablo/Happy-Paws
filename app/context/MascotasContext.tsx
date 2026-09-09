"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { mockMascotas, MascotaMock } from "@/data/mock-mascotas";

type MascotasContextType = {
  mascotas: MascotaMock[];
  addMascota: (mascota: Omit<MascotaMock, "id">) => void;
};

const MascotasContext = createContext<MascotasContextType | undefined>(undefined);
const STORAGE_KEY = "happy_paws_mock_mascotas";

export function MascotasProvider({ children }: { children: ReactNode }) {
  const [mascotas, setMascotas] = useState<MascotaMock[]>(mockMascotas);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setMascotas(JSON.parse(saved));
    }
  }, []);

  function addMascota(nueva: Omit<MascotaMock, "id">) {
    setMascotas((prev) => {
      const next = [...prev, { ...nueva, id: String(Date.now()) }];
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(next.map(({ mediaUrl, mediaType, ...resto }) => resto))
      );
      return next;
    });
  }

  return (
    <MascotasContext.Provider value={{ mascotas, addMascota }}>
      {children}
    </MascotasContext.Provider>
  );
}

export function useMascotas() {
  const ctx = useContext(MascotasContext);
  if (!ctx) throw new Error("useMascotas debe usarse dentro de MascotasProvider");
  return ctx;
}

// MOCK: vive en localStorage. Se reemplaza por datos reales de MySQL
// (tabla Mascota) cuando conectemos el backend.
