import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getPerfilActual } from "@/lib/perfil";
import { meses, resolverPeriodo } from "./rango";
import { BalanceAcciones } from "./balance-acciones";

export default async function BalancePage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string; anio?: string }>;
}) {
  const params = await searchParams;
  const { anioTexto, mesTexto, inicio, fin, etiqueta } = resolverPeriodo(params);
  const perfil = await getPerfilActual();
  const supabase = await createClient();

  let consultaVentas = supabase.from("ventas").select("id, total");
  let consultaGastos = supabase.from("gastos").select("monto, categoria");
  if (inicio && fin) {
    consultaVentas = consultaVentas.gte("creado_en", inicio).lt("creado_en", fin);
    consultaGastos = consultaGastos.gte("creado_en", inicio).lt("creado_en", fin);
  }

  const [{ data: ventas }, { data: gastos }, { data: todasLasVentas }] = await Promise.all([
    consultaVentas,
    consultaGastos,
    supabase.from("ventas").select("total, monto_pagado"),
  ]);

  const idsVentas = (ventas ?? []).map((v) => v.id);
  const { data: items } = idsVentas.length
    ? await supabase
        .from("venta_items")
        .select("cantidad, productos(costo)")
        .in("venta_id", idsVentas)
    : { data: [] as { cantidad: number; productos: { costo: number } | null }[] };

  const ingresos = (ventas ?? []).reduce((suma, v) => suma + Number(v.total), 0);
  const egresos = (gastos ?? []).reduce((suma, g) => suma + Number(g.monto), 0);
  const costoVendido = (items ?? []).reduce((suma, item) => {
    const producto = item.productos as unknown as { costo: number } | null;
    return suma + item.cantidad * Number(producto?.costo ?? 0);
  }, 0);
  const gananciaBruta = ingresos - costoVendido;
  const gananciaNeta = gananciaBruta - egresos;

  const totalPorCobrar = (todasLasVentas ?? []).reduce(
    (suma, v) => suma + Math.max(Number(v.total) - Number(v.monto_pagado), 0),
    0,
  );

  const gastosPorCategoria = (gastos ?? []).reduce<Record<string, number>>((acc, g) => {
    const categoria = g.categoria ?? "Sin categoría";
    acc[categoria] = (acc[categoria] ?? 0) + Number(g.monto);
    return acc;
  }, {});

  const anioActual = new Date().getFullYear();
  const anios = [anioActual, anioActual - 1, anioActual - 2];

  const textoParaCompartir = [
    perfil?.negocio_nombre,
    `Balance — ${etiqueta}`,
    "",
    `Ingresos: ${ingresos.toFixed(2)}`,
    `Costo de mercancía vendida: ${costoVendido.toFixed(2)}`,
    `Ganancia bruta: ${gananciaBruta.toFixed(2)}`,
    `Egresos: ${egresos.toFixed(2)}`,
    `Ganancia neta: ${gananciaNeta.toFixed(2)}`,
    "",
    `Total por cobrar (todas las tiendas fiadas): ${totalPorCobrar.toFixed(2)}`,
  ].join("\n");

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-black dark:text-zinc-50 print:text-black">
            Balance
          </h1>
          <p className="text-sm text-zinc-500 print:text-black">{etiqueta}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/balance/exportar?mes=${mesTexto}&anio=${anioTexto}`}
            className="print:hidden rounded-full border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700"
          >
            Exportar a Excel
          </Link>
          <BalanceAcciones textoParaCompartir={textoParaCompartir} />
        </div>
      </div>

      <form className="print:hidden mb-6 flex flex-wrap items-end gap-3" action="/balance">
        <label className="flex flex-col gap-1 text-sm">
          Mes
          <select
            name="mes"
            defaultValue={mesTexto}
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
            defaultValue={anioTexto}
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
      </form>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 print:border-zinc-300">
          <p className="text-xs text-zinc-500 print:text-black">Ingresos</p>
          <p className="text-lg font-semibold text-black dark:text-zinc-50 print:text-black">
            {ingresos.toFixed(2)}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 print:border-zinc-300">
          <p className="text-xs text-zinc-500 print:text-black">Costo de lo vendido</p>
          <p className="text-lg font-semibold text-black dark:text-zinc-50 print:text-black">
            {costoVendido.toFixed(2)}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 print:border-zinc-300">
          <p className="text-xs text-zinc-500 print:text-black">Ganancia bruta</p>
          <p className="text-lg font-semibold text-black dark:text-zinc-50 print:text-black">
            {gananciaBruta.toFixed(2)}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 print:border-zinc-300">
          <p className="text-xs text-zinc-500 print:text-black">Egresos</p>
          <p className="text-lg font-semibold text-black dark:text-zinc-50 print:text-black">
            {egresos.toFixed(2)}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 print:border-zinc-300">
          <p className="text-xs text-zinc-500 print:text-black">Ganancia neta</p>
          <p
            className={`text-lg font-semibold print:text-black ${
              gananciaNeta >= 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {gananciaNeta.toFixed(2)}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 print:border-zinc-300">
          <p className="text-xs text-zinc-500 print:text-black">Total por cobrar (fiado)</p>
          <p className="text-lg font-semibold text-amber-600 dark:text-amber-400 print:text-black">
            {totalPorCobrar.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 print:border-zinc-300">
        <h2 className="mb-4 font-medium text-black dark:text-zinc-50 print:text-black">
          Gastos por categoría — {etiqueta}
        </h2>
        {Object.keys(gastosPorCategoria).length === 0 ? (
          <p className="text-sm text-zinc-500 print:text-black">
            No hay gastos registrados en este período.
          </p>
        ) : (
          <ul className="flex flex-col gap-2 text-sm">
            {Object.entries(gastosPorCategoria).map(([categoria, monto]) => (
              <li key={categoria} className="flex justify-between text-zinc-600 dark:text-zinc-400 print:text-black">
                <span>{categoria}</span>
                <span className="font-medium text-black dark:text-zinc-50 print:text-black">
                  {monto.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
