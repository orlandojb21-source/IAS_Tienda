"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

type ValoresProducto = {
  nombre: string;
  precio: number;
  costo: number;
  stock: number;
  stock_minimo: number;
  unidad_medida: string;
  categoria: string | null;
  activo: boolean;
};

export function ProductoForm({
  action,
  valoresIniciales,
  mostrarActivo = false,
}: {
  action: (formData: FormData) => Promise<void>;
  valoresIniciales?: ValoresProducto;
  mostrarActivo?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const v = valoresIniciales;

  return (
    <form
      action={(formData) =>
        startTransition(async () => {
          await action(formData);
          router.push("/productos");
        })
      }
      className="flex max-w-md flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <label className="flex flex-col gap-1 text-sm">
        Nombre
        <input
          name="nombre"
          defaultValue={v?.nombre}
          required
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-950"
        />
      </label>

      <div className="flex gap-4">
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Precio de venta
          <input
            type="number"
            step="0.01"
            name="precio"
            defaultValue={v?.precio}
            required
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-950"
          />
        </label>
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Costo
          <input
            type="number"
            step="0.01"
            name="costo"
            defaultValue={v?.costo}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-950"
          />
        </label>
      </div>

      <div className="flex gap-4">
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Stock actual
          <input
            type="number"
            name="stock"
            defaultValue={v?.stock}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-950"
          />
        </label>
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Avisar cuando quede menos de
          <input
            type="number"
            name="stock_minimo"
            defaultValue={v?.stock_minimo}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-950"
          />
        </label>
      </div>

      <div className="flex gap-4">
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Unidad
          <select
            name="unidad_medida"
            defaultValue={v?.unidad_medida ?? "unidad"}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-950"
          >
            <option value="unidad">Unidad</option>
            <option value="kg">Kilo</option>
            <option value="lt">Litro</option>
          </select>
        </label>
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Categoría
          <input
            name="categoria"
            defaultValue={v?.categoria ?? ""}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-950"
          />
        </label>
      </div>

      {mostrarActivo && (
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="activo" defaultChecked={v?.activo ?? true} />
          Producto activo (visible para vender)
        </label>
      )}

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
          onClick={() => router.push("/productos")}
          className="rounded-full border border-zinc-300 px-5 py-2 text-sm dark:border-zinc-700"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
