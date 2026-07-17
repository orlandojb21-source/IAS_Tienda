import { createClient } from "@/lib/supabase/server";
import { getPerfilActual } from "@/lib/perfil";
import { ImprimirBoton } from "../../imprimir-boton";

export default async function ImprimirInventarioPage() {
  const perfil = await getPerfilActual();
  const supabase = await createClient();
  const { data: productos } = await supabase
    .from("productos")
    .select("*")
    .order("nombre");

  return (
    <div className="mx-auto max-w-3xl">
      <div className="print:hidden mb-6">
        <ImprimirBoton />
      </div>

      <h1 className="mb-1 text-xl font-semibold text-black dark:text-zinc-50 print:text-black">
        {perfil?.negocio_nombre}
      </h1>
      <p className="mb-6 text-sm text-zinc-500 print:text-black">
        Reporte de inventario — {new Date().toLocaleDateString("es")}
      </p>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-300 text-xs uppercase tracking-wide text-zinc-500 print:text-black">
            <th className="py-2 pr-4 font-medium">Nombre</th>
            <th className="py-2 pr-4 font-medium">Categoría</th>
            <th className="py-2 pr-4 font-medium">Precio</th>
            <th className="py-2 pr-4 font-medium">Stock</th>
            <th className="py-2 pr-4 font-medium">Estado</th>
          </tr>
        </thead>
        <tbody>
          {(productos ?? []).map((p) => (
            <tr key={p.id} className="border-b border-zinc-200 print:text-black">
              <td className="py-2 pr-4 text-black dark:text-zinc-50 print:text-black">{p.nombre}</td>
              <td className="py-2 pr-4 text-zinc-600 dark:text-zinc-400 print:text-black">
                {p.categoria ?? "—"}
              </td>
              <td className="py-2 pr-4 text-zinc-600 dark:text-zinc-400 print:text-black">
                {p.precio} / {p.unidad_medida}
              </td>
              <td className="py-2 pr-4 text-zinc-600 dark:text-zinc-400 print:text-black">
                {p.stock}
              </td>
              <td className="py-2 pr-4 text-zinc-600 dark:text-zinc-400 print:text-black">
                {p.activo ? "Activo" : "Inactivo"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
