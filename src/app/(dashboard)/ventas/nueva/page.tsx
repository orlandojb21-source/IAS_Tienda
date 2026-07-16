import { createClient } from "@/lib/supabase/server";
import { NuevaVentaForm } from "../nueva-venta-form";

export default async function NuevaVentaPage() {
  const supabase = await createClient();

  const [{ data: productos }, { data: clientes }] = await Promise.all([
    supabase
      .from("productos")
      .select("id, nombre, precio, unidad_medida")
      .eq("activo", true)
      .order("nombre"),
    supabase.from("clientes").select("id, nombre").order("nombre"),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-black dark:text-zinc-50">
        Nueva venta
      </h1>

      {!productos || productos.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-400">
          Todavía no tienes productos activos. Crea uno primero en la sección
          de Productos.
        </p>
      ) : (
        <NuevaVentaForm productos={productos} clientes={clientes ?? []} />
      )}
    </div>
  );
}
