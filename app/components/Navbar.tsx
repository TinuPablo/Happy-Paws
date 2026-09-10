"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Inicio" },
  { href: "/mascotas", label: "Mascotas" },
  { href: "/protectoras", label: "Protectoras" },
  { href: "/guias", label: "Guías" },
  { href: "/perfil", label: "Perfil" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <nav className="sticky top-0 z-50 bg-brown-dark/95 text-brown-lightest shadow-md backdrop-blur supports-[backdrop-filter]:bg-brown-dark/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link
          href="/"
          className="flex items-center gap-2 font-heading text-lg font-semibold"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/assets/logo.jpg"
            alt="Happy Paws"
            width={36}
            height={36}
            priority
            className="h-9 w-9 shrink-0 rounded-full bg-white object-cover"
          />
          Happy Paws
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
                isActive(item.href)
                  ? "bg-white/15 text-brown-lightest"
                  : "text-brown-lightest/70 hover:bg-white/10 hover:text-brown-lightest"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-brown-lightest md:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div
        className={cn(
          "grid overflow-hidden border-brown-darker transition-all duration-300 ease-out md:hidden",
          open ? "grid-rows-[1fr] border-t opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="flex flex-col gap-1 overflow-hidden px-6 py-3">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-brown-darker text-brown-lightest"
                  : "text-brown-lightest/70"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
