"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "../logout-button";

const enlaces = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/clientes", label: "Clientes" },
  { href: "/ventas", label: "Ventas" },
  { href: "/gastos", label: "Gastos" },
];

export function Nav({ negocioNombre }: { negocioNombre: string }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <Image src="/logo.png" alt="" width={28} height={28} className="rounded-md" />
          <span className="font-semibold text-black dark:text-zinc-50">
            {negocioNombre}
          </span>
          <nav className="ml-2 flex flex-wrap gap-1 text-sm">
            {enlaces.map((enlace) => {
              const activo = pathname === enlace.href;
              return (
                <Link
                  key={enlace.href}
                  href={enlace.href}
                  className={
                    activo
                      ? "rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 px-3 py-1.5 font-medium text-white"
                      : "rounded-full px-3 py-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-black dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
                  }
                >
                  {enlace.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <LogoutButton />
      </div>
    </header>
  );
}
