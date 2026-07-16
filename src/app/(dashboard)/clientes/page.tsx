import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { EliminarBoton } from "./eliminar-boton";

export default async function ClientesPage() {
  const supabase = await createClient();
  const { data: clientes } = await supabase
    .from("clientes")
    .select("*")
    .order("nombre");

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          Clientes
        </h1>
        <Link
          href="/clientes/nuevo"
          className="rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 px-5 py-2 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
        >
          + Nuevo cliente
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        {!clientes || clientes.length === 0 ? (
          <p className="px-6 py-10 text-center text-zinc-500 dark:text-zinc-400">
            Todavía no tienes clientes. Crea el primero con el botón de arriba.
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-400">
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Teléfono</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr
                  key={cliente.id}
                  className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50 dark:border-zinc-800/60 dark:hover:bg-zinc-800/30"
                >
                  <td className="px-4 py-3 font-medium text-black dark:text-zinc-50">
                    {cliente.nombre}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {cliente.telefono ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <Link
                        href={`/clientes/${cliente.id}/editar`}
                        className="text-zinc-600 hover:underline dark:text-zinc-300"
                      >
                        Editar
                      </Link>
                      <EliminarBoton id={cliente.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
