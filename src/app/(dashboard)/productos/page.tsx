import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { EliminarBoton } from "./eliminar-boton";

export default async function ProductosPage() {
  const supabase = await createClient();
  const { data: productos } = await supabase
    .from("productos")
    .select("*")
    .order("nombre");

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          Inventario
        </h1>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/productos/exportar"
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700"
          >
            Exportar a Excel
          </Link>
          <Link
            href="/productos/imprimir"
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700"
          >
            Exportar a PDF
          </Link>
          <Link
            href="/productos/nuevo"
            className="rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 px-5 py-2 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
          >
            + Nuevo producto
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        {!productos || productos.length === 0 ? (
          <p className="px-6 py-10 text-center text-zinc-500 dark:text-zinc-400">
            Todavía no tienes productos. Crea el primero con el botón de arriba.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-400">
                  <th className="px-4 py-3 font-medium">Nombre</th>
                  <th className="px-4 py-3 font-medium">Categoría</th>
                  <th className="px-4 py-3 font-medium">Precio</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => {
                  const stockBajo = producto.stock <= producto.stock_minimo;
                  return (
                    <tr
                      key={producto.id}
                      className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50 dark:border-zinc-800/60 dark:hover:bg-zinc-800/30"
                    >
                      <td className="px-4 py-3 font-medium text-black dark:text-zinc-50">
                        {producto.nombre}
                      </td>
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                        {producto.categoria ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                        {producto.precio} / {producto.unidad_medida}
                      </td>
                      <td className="px-4 py-3">
                        {stockBajo ? (
                          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                            {producto.stock} — stock bajo
                          </span>
                        ) : (
                          <span className="text-zinc-600 dark:text-zinc-400">
                            {producto.stock}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {producto.activo ? (
                          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                            Activo
                          </span>
                        ) : (
                          <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                            Inactivo
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-3">
                          <Link
                            href={`/productos/${producto.id}/editar`}
                            className="text-zinc-600 hover:underline dark:text-zinc-300"
                          >
                            Editar
                          </Link>
                          <EliminarBoton id={producto.id} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
