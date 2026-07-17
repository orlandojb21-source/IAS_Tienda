import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const meses = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export default async function VentasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; mes?: string; anio?: string }>;
}) {
  const { q, mes, anio } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("ventas")
    .select(
      q
        ? "id, total, monto_pagado, creado_en, clientes!inner(nombre), perfiles(nombre)"
        : "id, total, monto_pagado, creado_en, clientes(nombre), perfiles(nombre)",
    )
    .order("creado_en", { ascending: false })
    .limit(100);

  if (q) query = query.ilike("clientes.nombre", `%${q}%`);

  if (anio) {
    const mesInicio = mes ? Number(mes) - 1 : 0;
    const mesFin = mes ? Number(mes) : 12;
    const inicio = new Date(Number(anio), mesInicio, 1).toISOString();
    const fin = new Date(Number(anio), mesFin, 1).toISOString();
    query = query.gte("creado_en", inicio).lt("creado_en", fin);
  }

  const { data: ventas } = await query;

  const anioActual = new Date().getFullYear();
  const anios = [anioActual, anioActual - 1, anioActual - 2];
  const hayFiltros = Boolean(q || mes || anio);

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

      <form className="mb-6 flex flex-wrap items-end gap-3" action="/ventas">
        <label className="flex flex-col gap-1 text-sm">
          Buscar cliente
          <input
            type="text"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Nombre del cliente"
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-950"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Mes
          <select
            name="mes"
            defaultValue={mes ?? ""}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-950"
          >
            <option value="">Todos</option>
            {meses.map((nombre, i) => (
              <option key={i} value={i + 1}>
                {nombre}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Año
          <select
            name="anio"
            defaultValue={anio ?? ""}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-950"
          >
            <option value="">Todos</option>
            {anios.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="rounded-full border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700"
        >
          Filtrar
        </button>
        {hayFiltros && (
          <Link href="/ventas" className="text-sm text-zinc-500 hover:underline dark:text-zinc-400">
            Limpiar
          </Link>
        )}
      </form>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        {!ventas || ventas.length === 0 ? (
          <p className="px-6 py-10 text-center text-zinc-500 dark:text-zinc-400">
            {hayFiltros
              ? "No hay ventas que coincidan con ese filtro."
              : "Todavía no has registrado ninguna venta."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-400">
                  <th className="px-4 py-3 font-medium">Fecha</th>
                  <th className="px-4 py-3 font-medium">Cliente</th>
                  <th className="px-4 py-3 font-medium">Vendedor</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3 font-medium">Recibo</th>
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
                      <td className="px-4 py-3">
                        <Link
                          href={`/ventas/${venta.id}/recibo`}
                          className="text-sky-600 hover:underline dark:text-sky-400"
                        >
                          Ver recibo
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
