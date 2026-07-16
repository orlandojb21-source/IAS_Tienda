import { createClient } from "@/lib/supabase/server";
import { getPerfilActual } from "@/lib/perfil";
import { DatosTiendaForm } from "./datos-tienda-form";

export default async function ConfiguracionPage() {
  const perfil = await getPerfilActual();
  const supabase = await createClient();
  const { data: negocio } = await supabase
    .from("negocios")
    .select("nombre, telefono, direccion, logo_url")
    .eq("id", perfil!.negocio_id)
    .single();

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-2xl font-semibold text-black dark:text-zinc-50">
        Datos de la tienda
      </h1>

      {perfil?.rol !== "admin" ? (
        <p className="text-zinc-600 dark:text-zinc-400">
          Solo un administrador puede editar los datos de la tienda.
        </p>
      ) : (
        <DatosTiendaForm
          nombre={negocio?.nombre ?? ""}
          telefono={negocio?.telefono ?? null}
          direccion={negocio?.direccion ?? null}
          logoUrl={negocio?.logo_url ?? null}
        />
      )}
    </div>
  );
}
