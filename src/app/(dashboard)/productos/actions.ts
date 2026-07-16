"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getPerfilActual } from "@/lib/perfil";

function numeroDe(formData: FormData, campo: string) {
  const valor = formData.get(campo);
  return valor ? Number(valor) : 0;
}

export async function crearProducto(formData: FormData) {
  const perfil = await getPerfilActual();
  if (!perfil) throw new Error("Cuenta no activada");

  const supabase = await createClient();
  const { error } = await supabase.from("productos").insert({
    negocio_id: perfil.negocio_id,
    nombre: formData.get("nombre") as string,
    precio: numeroDe(formData, "precio"),
    costo: numeroDe(formData, "costo"),
    stock: numeroDe(formData, "stock"),
    stock_minimo: numeroDe(formData, "stock_minimo"),
    unidad_medida: (formData.get("unidad_medida") as string) || "unidad",
    categoria: (formData.get("categoria") as string) || null,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/productos");
}

export async function actualizarProducto(id: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("productos")
    .update({
      nombre: formData.get("nombre") as string,
      precio: numeroDe(formData, "precio"),
      costo: numeroDe(formData, "costo"),
      stock: numeroDe(formData, "stock"),
      stock_minimo: numeroDe(formData, "stock_minimo"),
      unidad_medida: (formData.get("unidad_medida") as string) || "unidad",
      categoria: (formData.get("categoria") as string) || null,
      activo: formData.get("activo") === "on",
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/productos");
}

export async function eliminarProducto(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("productos").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/productos");
}
