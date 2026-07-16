import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("nombre, rol, negocios(nombre)")
    .eq("id", user!.id)
    .maybeSingle();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-50 px-6 text-center dark:bg-black">
      <Image src="/logo.png" alt="Innova App Solutions" width={140} height={140} priority />

      {perfil ? (
        <>
          <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
            {(perfil.negocios as unknown as { nombre: string } | null)?.nombre}
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Hola {perfil.nombre} ({perfil.rol}) — el resto de la app viene pronto.
          </p>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
            Cuenta pendiente de activación
          </h1>
          <p className="max-w-md text-zinc-600 dark:text-zinc-400">
            Tu inicio de sesión funcionó, pero tu tienda todavía no ha sido
            activada. Contacta a Innova App Solutions para activarla.
          </p>
        </>
      )}

      <LogoutButton />
    </div>
  );
}
