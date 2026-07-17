"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getPerfilActual } from "@/lib/perfil";

export async function crearGasto(formData: FormData) {
  const perfil = await getPerfilActual();
  if (!perfil) throw new Error("Cuenta no activada");

  const supabase = await createClient();
  const { error } = await supabase.from("gastos").insert({
    negocio_id: perfil.negocio_id,
    descripcion: formData.get("descripcion") as string,
    monto: Number(formData.get("monto")),
    categoria: (formData.get("categoria") as string) || null,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/gastos");
}

export async function actualizarGasto(id: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("gastos")
    .update({
      descripcion: formData.get("descripcion") as string,
      monto: Number(formData.get("monto")),
      categoria: (formData.get("categoria") as string) || null,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/gastos");
}

export async function eliminarGasto(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("gastos").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/gastos");
}
