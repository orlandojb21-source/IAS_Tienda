import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductoForm } from "../../producto-form";
import { actualizarProducto } from "../../actions";

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: producto } = await supabase
    .from("productos")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!producto) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-black dark:text-zinc-50">
        Editar producto
      </h1>
      <ProductoForm
        action={actualizarProducto.bind(null, id)}
        valoresIniciales={producto}
        mostrarActivo
      />
    </div>
  );
}
