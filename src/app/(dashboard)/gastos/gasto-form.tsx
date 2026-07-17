"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function GastoForm({
  action,
  valoresIniciales,
}: {
  action: (formData: FormData) => Promise<void>;
  valoresIniciales?: { descripcion: string; monto: number; categoria: string | null };
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData) =>
        startTransition(async () => {
          await action(formData);
          router.push("/gastos");
        })
      }
      className="flex max-w-md flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <label className="flex flex-col gap-1 text-sm">
        Descripción
        <input
          name="descripcion"
          defaultValue={valoresIniciales?.descripcion}
          required
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-950"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Monto
        <input
          type="number"
          step="0.01"
          min={0}
          name="monto"
          defaultValue={valoresIniciales?.monto}
          required
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-950"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Categoría
        <input
          name="categoria"
          defaultValue={valoresIniciales?.categoria ?? ""}
          placeholder="Ej. Alquiler, Servicios, Compras"
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
          onClick={() => router.push("/gastos")}
          className="rounded-full border border-zinc-300 px-5 py-2 text-sm dark:border-zinc-700"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
