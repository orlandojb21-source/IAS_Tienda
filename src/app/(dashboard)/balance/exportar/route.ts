import { createClient } from "@/lib/supabase/server";
import { resolverPeriodo } from "../rango";
import { celda } from "@/lib/csv";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const params = {
    mes: url.searchParams.get("mes") ?? undefined,
    anio: url.searchParams.get("anio") ?? undefined,
  };
  const { inicio, fin, etiqueta } = resolverPeriodo(params);

  const supabase = await createClient();

  let consultaVentas = supabase.from("ventas").select("id, total, creado_en");
  let consultaGastos = supabase.from("gastos").select("descripcion, monto, categoria, creado_en");
  if (inicio && fin) {
    consultaVentas = consultaVentas.gte("creado_en", inicio).lt("creado_en", fin);
    consultaGastos = consultaGastos.gte("creado_en", inicio).lt("creado_en", fin);
  }

  const [{ data: ventas }, { data: gastos }] = await Promise.all([
    consultaVentas,
    consultaGastos,
  ]);

  const ingresos = (ventas ?? []).reduce((suma, v) => suma + Number(v.total), 0);
  const egresos = (gastos ?? []).reduce((suma, g) => suma + Number(g.monto), 0);

  const filas: string[][] = [
    ["Balance", etiqueta],
    [],
    ["Ingresos", ingresos.toFixed(2)],
    ["Egresos", egresos.toFixed(2)],
    ["Ganancia", (ingresos - egresos).toFixed(2)],
    [],
    ["Ventas del período"],
    ["Fecha", "Total"],
    ...(ventas ?? []).map((v) => [new Date(v.creado_en).toLocaleString("es"), String(v.total)]),
    [],
    ["Gastos del período"],
    ["Fecha", "Descripción", "Categoría", "Monto"],
    ...(gastos ?? []).map((g) => [
      new Date(g.creado_en).toLocaleDateString("es"),
      g.descripcion,
      g.categoria ?? "",
      String(g.monto),
    ]),
  ];

  const csv = filas.map((fila) => fila.map(celda).join(",")).join("\r\n");
  const contenido = "﻿" + csv;

  return new Response(contenido, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="balance.csv"',
    },
  });
}
