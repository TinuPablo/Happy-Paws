"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Role = "adoptante" | "protectora" | null;

type AuthState = {
  loggedIn: boolean;
  role: Role;
  nombre: string;
};

type AuthContextType = AuthState & {
  login: (nombre: string, role: "adoptante" | "protectora") => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "happy_paws_mock_session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    loggedIn: false,
    role: null,
    nombre: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setState(JSON.parse(saved));
    }
  }, []);

  function login(nombre: string, role: "adoptante" | "protectora") {
    const next = { loggedIn: true, role, nombre };
    setState(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function logout() {
    const next = { loggedIn: false, role: null, nombre: "" };
    setState(next);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}

// MOCK: esta sesión vive en localStorage del navegador, no en un backend
// real. Se reemplaza por sesión/JWT real cuando conectemos MySQL + auth.
