"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getPerfilActual } from "@/lib/perfil";

export async function actualizarDatosTienda(formData: FormData) {
  const perfil = await getPerfilActual();
  if (!perfil) throw new Error("Cuenta no activada");
  if (perfil.rol !== "admin") throw new Error("Solo un admin puede editar estos datos");

  const supabase = await createClient();

  const datos: Record<string, string | null> = {
    nombre: formData.get("nombre") as string,
    telefono: (formData.get("telefono") as string) || null,
    direccion: (formData.get("direccion") as string) || null,
  };

  const archivo = formData.get("logo") as File | null;
  if (archivo && archivo.size > 0) {
    const extension = archivo.name.split(".").pop() || "png";
    const ruta = `${perfil.negocio_id}/logo.${extension}`;

    const { error: errorSubida } = await supabase.storage
      .from("logos")
      .upload(ruta, archivo, { upsert: true });

    if (errorSubida) throw new Error(errorSubida.message);

    const { data: publica } = supabase.storage.from("logos").getPublicUrl(ruta);
    datos.logo_url = `${publica.publicUrl}?v=${Date.now()}`;
  }

  const { error } = await supabase
    .from("negocios")
    .update(datos)
    .eq("id", perfil.negocio_id);

  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
}
