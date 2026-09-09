"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PawPrint, Building2, BookOpen, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "Inicio" },
  { href: "/mascotas", icon: PawPrint, label: "Mascotas" },
  { href: "/protectoras", icon: Building2, label: "Protectoras" },
  { href: "/guias", icon: BookOpen, label: "Guías" },
  { href: "/perfil", icon: User, label: "Perfil" },
];

export function BottomNav() {
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/registro") return null;

  return (
    <nav className="flex shrink-0 border-t-2 border-brown-darker bg-brown-dark h-[70px] z-50">
      {NAV_ITEMS.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 text-[10px] transition-colors",
              active ? "text-brown-lightest" : "text-brown-lightest/55"
            )}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
