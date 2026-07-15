import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-50 px-6 text-center dark:bg-black">
      <Image src="/logo.png" alt="Innova App Solutions" width={160} height={160} priority />
      <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
        IAS Tienda
      </h1>
      <p className="max-w-md text-zinc-600 dark:text-zinc-400">
        Base del proyecto lista. Próximo paso: conectar la base de datos.
      </p>
    </div>
  );
}
