import { createClient } from "@/lib/supabase/server";

function celda(valor: unknown) {
  const texto = String(valor ?? "");
  if (/[",\n]/.test(texto)) {
    return `"${texto.replace(/"/g, '""')}"`;
  }
  return texto;
}

export async function GET() {
  const supabase = await createClient();
  const { data: productos } = await supabase
    .from("productos")
    .select("*")
    .order("nombre");

  const encabezados = [
    "Nombre",
    "Categoria",
    "Precio",
    "Costo",
    "Stock",
    "Stock minimo",
    "Unidad",
    "Estado",
  ];

  const filas = (productos ?? []).map((p) => [
    p.nombre,
    p.categoria ?? "",
    p.precio,
    p.costo,
    p.stock,
    p.stock_minimo,
    p.unidad_medida,
    p.activo ? "Activo" : "Inactivo",
  ]);

  const csv = [encabezados, ...filas]
    .map((fila) => fila.map(celda).join(","))
    .join("\r\n");

  // BOM al inicio (﻿) para que Excel reconozca los acentos correctamente
  const contenido = "﻿" + csv;

  return new Response(contenido, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="inventario.csv"',
    },
  });
}
