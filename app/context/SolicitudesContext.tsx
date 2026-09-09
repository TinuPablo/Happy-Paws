"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type SolicitudMock = {
  id: string;
  mascotaId: string;
  mascotaNombre: string;
  adoptanteNombre: string;
  estado: "PENDIENTE" | "APROBADA" | "RECHAZADA";
  fecha: string;
};

type SolicitudesContextType = {
  solicitudes: SolicitudMock[];
  addSolicitud: (s: Omit<SolicitudMock, "id" | "estado" | "fecha">) => void;
  actualizarEstado: (id: string, estado: "APROBADA" | "RECHAZADA") => void;
};

const SolicitudesContext = createContext<SolicitudesContextType | undefined>(undefined);
const STORAGE_KEY = "happy_paws_mock_solicitudes";

export function SolicitudesProvider({ children }: { children: ReactNode }) {
  const [solicitudes, setSolicitudes] = useState<SolicitudMock[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setSolicitudes(JSON.parse(saved));
  }, []);

  function persist(next: SolicitudMock[]) {
    setSolicitudes(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function addSolicitud(s: Omit<SolicitudMock, "id" | "estado" | "fecha">) {
    const nueva: SolicitudMock = {
      ...s,
      id: String(Date.now()),
      estado: "PENDIENTE",
      fecha: new Date().toLocaleDateString("es-AR"),
    };
    persist([...solicitudes, nueva]);
  }

  function actualizarEstado(id: string, estado: "APROBADA" | "RECHAZADA") {
    persist(
      solicitudes.map((s) => (s.id === id ? { ...s, estado } : s))
    );
  }

  return (
    <SolicitudesContext.Provider value={{ solicitudes, addSolicitud, actualizarEstado }}>
      {children}
    </SolicitudesContext.Provider>
  );
}

export function useSolicitudes() {
  const ctx = useContext(SolicitudesContext);
  if (!ctx) throw new Error("useSolicitudes debe usarse dentro de SolicitudesProvider");
  return ctx;
}

// MOCK: vive en localStorage. Se reemplaza por la tabla SolicitudAdopcion
// real de MySQL cuando conectemos el backend.
