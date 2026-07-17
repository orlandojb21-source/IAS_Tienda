import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GastoForm } from "../../gasto-form";
import { actualizarGasto } from "../../actions";

export default async function EditarGastoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: gasto } = await supabase
    .from("gastos")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!gasto) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-black dark:text-zinc-50">
        Editar gasto
      </h1>
      <GastoForm action={actualizarGasto.bind(null, id)} valoresIniciales={gasto} />
    </div>
  );
}
