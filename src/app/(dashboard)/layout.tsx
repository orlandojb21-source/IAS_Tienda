import Image from "next/image";
import { getPerfilActual } from "@/lib/perfil";
import { LogoutButton } from "../logout-button";
import { Nav } from "./nav";
import { Footer } from "./footer";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const perfil = await getPerfilActual();

  if (!perfil) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-50 px-6 text-center dark:bg-black">
        <Image src="/logo.png" alt="Innova App Solutions" width={140} height={140} priority />
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          Cuenta pendiente de activación
        </h1>
        <p className="max-w-md text-zinc-600 dark:text-zinc-400">
          Tu inicio de sesión funcionó, pero tu tienda todavía no ha sido
          activada. Contacta a Innova App Solutions para activarla.
        </p>
        <LogoutButton />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black print:bg-white">
      <div className="print:hidden">
        <Nav negocioNombre={perfil.negocio_nombre} negocioLogoUrl={perfil.negocio_logo_url} />
      </div>
      <main className="flex-1 px-6 pt-32 pb-28 sm:pt-8 sm:pb-8 print:p-0">{children}</main>
      <div className="hidden print:hidden sm:block">
        <Footer />
      </div>
    </div>
  );
}
