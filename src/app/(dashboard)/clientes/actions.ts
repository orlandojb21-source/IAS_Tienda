"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getPerfilActual } from "@/lib/perfil";

export async function crearCliente(formData: FormData) {
  const perfil = await getPerfilActual();
  if (!perfil) throw new Error("Cuenta no activada");

  const supabase = await createClient();
  const { error } = await supabase.from("clientes").insert({
    negocio_id: perfil.negocio_id,
    nombre: formData.get("nombre") as string,
    telefono: (formData.get("telefono") as string) || null,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/clientes");
}

export async function actualizarCliente(id: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("clientes")
    .update({
      nombre: formData.get("nombre") as string,
      telefono: (formData.get("telefono") as string) || null,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/clientes");
}

export async function eliminarCliente(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("clientes").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/clientes");
}
