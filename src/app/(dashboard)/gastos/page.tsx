import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { EliminarBoton } from "./eliminar-boton";

export default async function GastosPage() {
  const supabase = await createClient();
  const { data: gastos } = await supabase
    .from("gastos")
    .select("*")
    .order("creado_en", { ascending: false });

  const total = (gastos ?? []).reduce((suma, g) => suma + Number(g.monto), 0);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          Gastos
        </h1>
        <Link
          href="/gastos/nuevo"
          className="rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 px-5 py-2 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
        >
          + Nuevo gasto
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        {!gastos || gastos.length === 0 ? (
          <p className="px-6 py-10 text-center text-zinc-500 dark:text-zinc-400">
            Todavía no has registrado ningún gasto.
          </p>
        ) : (
          <>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-400">
                  <th className="px-4 py-3 font-medium">Fecha</th>
                  <th className="px-4 py-3 font-medium">Descripción</th>
                  <th className="px-4 py-3 font-medium">Categoría</th>
                  <th className="px-4 py-3 font-medium">Monto</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {gastos.map((gasto) => (
                  <tr
                    key={gasto.id}
                    className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50 dark:border-zinc-800/60 dark:hover:bg-zinc-800/30"
                  >
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {new Date(gasto.creado_en).toLocaleDateString("es")}
                    </td>
                    <td className="px-4 py-3 text-black dark:text-zinc-50">
                      {gasto.descripcion}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {gasto.categoria ?? "—"}
                    </td>
                    <td className="px-4 py-3 font-medium text-black dark:text-zinc-50">
                      {gasto.monto}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <Link
                          href={`/gastos/${gasto.id}/editar`}
                          className="text-zinc-600 hover:underline dark:text-zinc-300"
                        >
                          Editar
                        </Link>
                        <EliminarBoton id={gasto.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between border-t border-zinc-200 px-4 py-3 text-sm dark:border-zinc-800">
              <span className="text-zinc-500 dark:text-zinc-400">Total gastado</span>
              <span className="font-semibold text-black dark:text-zinc-50">
                {total.toFixed(2)}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
