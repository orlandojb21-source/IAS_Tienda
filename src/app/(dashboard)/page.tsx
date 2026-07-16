import Link from "next/link";
import { getPerfilActual } from "@/lib/perfil";
import { NegocioLogo } from "./negocio-logo";

const accesos = [
  { href: "/productos", label: "Productos", descripcion: "Inventario y precios" },
  { href: "/clientes", label: "Clientes", descripcion: "Contactos y fiado" },
  { href: "/ventas", label: "Ventas", descripcion: "Registra una venta" },
  { href: "/gastos", label: "Gastos", descripcion: "Ingresos vs egresos" },
];

export default async function InicioPage() {
  const perfil = await getPerfilActual();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <NegocioLogo nombre={perfil?.negocio_nombre ?? ""} logoUrl={perfil?.negocio_logo_url ?? null} size={48} />
        <div>
          <h1 className="text-xl font-semibold text-black dark:text-zinc-50">
            Hola, {perfil?.nombre}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Bienvenido a {perfil?.negocio_nombre}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {accesos.map((acceso) => (
          <Link
            key={acceso.href}
            href={acceso.href}
            className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="font-medium text-black dark:text-zinc-50">{acceso.label}</p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              {acceso.descripcion}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
