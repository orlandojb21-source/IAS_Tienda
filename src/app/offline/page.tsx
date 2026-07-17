export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 px-6 text-center dark:bg-black">
      {/* <img> a proposito: esta pagina la sirve el service worker sin red,
          y next/image pediria /_next/image (requiere red) para optimizarla. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="" className="h-24 w-24 rounded-lg" />
      <h1 className="text-xl font-semibold text-black dark:text-zinc-50">Sin conexión</h1>
      <p className="max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
        No se pudo cargar esta página. Revisa tu conexión a internet e intenta de nuevo.
      </p>
    </main>
  );
}
