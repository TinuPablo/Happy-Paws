"use client";

import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

export function HeroCTA() {
  const { loggedIn } = useAuth();

  if (loggedIn) return null;

  return (
    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
      <Link href="/mascotas" className="btn-primary">
        Quiero adoptar 🐶
      </Link>
      <Link href="/registro" className="btn-secondary">
        Soy una protectora
      </Link>
    </div>
  );
}
