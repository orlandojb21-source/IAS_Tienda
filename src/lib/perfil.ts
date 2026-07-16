import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type PerfilActual = {
  id: string;
  nombre: string;
  rol: "admin" | "vendedor";
  negocio_id: string;
  negocio_nombre: string;
  negocio_logo_url: string | null;
};

export async function getPerfilActual(): Promise<PerfilActual | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("id, nombre, rol, negocio_id, negocios(nombre, logo_url)")
    .eq("id", user.id)
    .maybeSingle();

  if (!perfil) return null;

  const negocio = perfil.negocios as unknown as {
    nombre: string;
    logo_url: string | null;
  } | null;

  return {
    id: perfil.id,
    nombre: perfil.nombre,
    rol: perfil.rol,
    negocio_id: perfil.negocio_id,
    negocio_nombre: negocio?.nombre ?? "",
    negocio_logo_url: negocio?.logo_url ?? null,
  };
}
