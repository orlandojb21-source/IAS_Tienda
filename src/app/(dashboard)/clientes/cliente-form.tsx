"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function ClienteForm({
  action,
  valoresIniciales,
}: {
  action: (formData: FormData) => Promise<void>;
  valoresIniciales?: { nombre: string; telefono: string | null };
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData) =>
        startTransition(async () => {
          await action(formData);
          router.push("/clientes");
        })
      }
      className="flex max-w-md flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <label className="flex flex-col gap-1 text-sm">
        Nombre
        <input
          name="nombre"
          defaultValue={valoresIniciales?.nombre}
          required
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-950"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Teléfono
        <input
          name="telefono"
          defaultValue={valoresIniciales?.telefono ?? ""}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-950"
        />
      </label>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 px-5 py-2 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Guardando..." : "Guardar"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/clientes")}
          className="rounded-full border border-zinc-300 px-5 py-2 text-sm dark:border-zinc-700"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
