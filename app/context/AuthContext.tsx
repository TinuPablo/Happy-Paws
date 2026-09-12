"use client";

import { createContext, useContext, ReactNode } from "react";
import type { UiRole } from "@/lib/session";

type AuthState = {
  loggedIn: boolean;
  role: UiRole | null;
  nombre: string;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

// La sesión se resuelve en el servidor (cookie firmada, ver lib/session.ts)
// y se pasa acá como snapshot de solo lectura — el rol ya no se puede
// falsificar editando localStorage. Para loguearse/desloguearse se usan los
// server actions de app/actions/auth.ts, no este contexto.
export function AuthProvider({
  children,
  session,
}: {
  children: ReactNode;
  session: AuthState;
}) {
  return <AuthContext.Provider value={session}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
