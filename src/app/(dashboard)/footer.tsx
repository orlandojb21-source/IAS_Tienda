import Image from "next/image";

export function Footer() {
  return (
    <footer className="flex items-center justify-center gap-2 border-t border-zinc-200 px-6 py-4 text-xs text-zinc-400 dark:border-zinc-800 dark:text-zinc-600">
      <Image src="/logo.png" alt="" width={16} height={16} className="rounded opacity-70" />
      Impulsado por Innova App Solutions
    </footer>
  );
}
