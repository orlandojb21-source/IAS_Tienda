import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type PerfilActual = {
  id: string;
  nombre: string;
  rol: "admin" | "vendedor";
  negocio_id: string;
  negocio_nombre: string;
};

export async function getPerfilActual(): Promise<PerfilActual | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("id, nombre, rol, negocio_id, negocios(nombre)")
    .eq("id", user.id)
    .maybeSingle();

  if (!perfil) return null;

  const negocio = perfil.negocios as unknown as { nombre: string } | null;

  return {
    id: perfil.id,
    nombre: perfil.nombre,
    rol: perfil.rol,
    negocio_id: perfil.negocio_id,
    negocio_nombre: negocio?.nombre ?? "",
  };
}
