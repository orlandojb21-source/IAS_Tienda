import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function VentasPage() {
  const supabase = await createClient();
  const { data: ventas } = await supabase
    .from("ventas")
    .select("id, total, monto_pagado, metodo_pago, creado_en, clientes(nombre), perfiles(nombre)")
    .order("creado_en", { ascending: false })
    .limit(50);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          Ventas
        </h1>
        <Link
          href="/ventas/nueva"
          className="rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 px-5 py-2 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
        >
          + Nueva venta
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        {!ventas || ventas.length === 0 ? (
          <p className="px-6 py-10 text-center text-zinc-500 dark:text-zinc-400">
            Todavía no has registrado ninguna venta.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-400">
                  <th className="px-4 py-3 font-medium">Fecha</th>
                  <th className="px-4 py-3 font-medium">Cliente</th>
                  <th className="px-4 py-3 font-medium">Vendedor</th>
                  <th className="px-4 py-3 font-medium">Método</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {ventas.map((venta) => {
                  const cliente = venta.clientes as unknown as { nombre: string } | null;
                  const vendedor = venta.perfiles as unknown as { nombre: string } | null;
                  const pendiente = venta.monto_pagado < venta.total;
                  return (
                    <tr
                      key={venta.id}
                      className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50 dark:border-zinc-800/60 dark:hover:bg-zinc-800/30"
                    >
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                        {new Date(venta.creado_en).toLocaleString("es")}
                      </td>
                      <td className="px-4 py-3 text-black dark:text-zinc-50">
                        {cliente?.nombre ?? "Cliente ocasional"}
                      </td>
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                        {vendedor?.nombre ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                        {venta.metodo_pago}
                      </td>
                      <td className="px-4 py-3 font-medium text-black dark:text-zinc-50">
                        {venta.total}
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/ventas/${venta.id}`}>
                          {pendiente ? (
                            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700 hover:underline dark:bg-amber-500/10 dark:text-amber-400">
                              Debe {(venta.total - venta.monto_pagado).toFixed(2)}
                            </span>
                          ) : (
                            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:underline dark:bg-emerald-500/10 dark:text-emerald-400">
                              Pagada
                            </span>
                          )}
                        </Link>
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
