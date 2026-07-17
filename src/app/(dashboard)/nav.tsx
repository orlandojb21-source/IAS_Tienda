"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "../logout-button";
import { NegocioLogo } from "./negocio-logo";

const enlaces = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Inventario" },
  { href: "/clientes", label: "Clientes" },
  { href: "/ventas", label: "Ventas" },
  { href: "/gastos", label: "Gastos" },
  { href: "/balance", label: "Balance" },
  { href: "/configuracion", label: "Perfil" },
];

function EnlaceNav({
  href,
  label,
  activo,
}: {
  href: string;
  label: string;
  activo: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        activo
          ? "rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 px-3 py-1.5 font-medium text-white"
          : "rounded-full px-3 py-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-black dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
      }
    >
      {label}
    </Link>
  );
}

export function Nav({
  negocioNombre,
  negocioLogoUrl,
}: {
  negocioNombre: string;
  negocioLogoUrl: string | null;
}) {
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
        <div className="flex items-center justify-between gap-4 px-6 py-3">
          <div className="flex items-center gap-3">
            <NegocioLogo nombre={negocioNombre} logoUrl={negocioLogoUrl} />
            <span className="font-semibold text-black dark:text-zinc-50">
              {negocioNombre}
            </span>
            {/* En escritorio el menu va aqui, en linea. En movil se mueve a
                la barra fija de abajo (ver mas adelante). */}
            <nav className="ml-2 hidden flex-wrap gap-1 text-sm sm:flex">
              {enlaces.map((enlace) => (
                <EnlaceNav
                  key={enlace.href}
                  href={enlace.href}
                  label={enlace.label}
                  activo={pathname === enlace.href}
                />
              ))}
            </nav>
          </div>

          {/* En movil: logo de Innova y Cerrar sesion apilados debajo.
              En escritorio: en una sola fila, como siempre. */}
          <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-4">
            <Image src="/logo.png" alt="Innova App Solutions" width={60} height={60} className="rounded-md" />
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Barra de menu fija abajo, solo en movil */}
      <nav className="fixed inset-x-0 bottom-0 z-10 flex flex-wrap justify-center gap-1 border-t border-zinc-200 bg-white/95 px-2 py-2 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95 sm:hidden">
        {enlaces.map((enlace) => (
          <EnlaceNav
            key={enlace.href}
            href={enlace.href}
            label={enlace.label}
            activo={pathname === enlace.href}
          />
        ))}
      </nav>
    </>
  );
}
