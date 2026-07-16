"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { actualizarDatosTienda } from "./actions";

type Props = {
  nombre: string;
  telefono: string | null;
  direccion: string | null;
  logoUrl: string | null;
};

export function DatosTiendaForm({ nombre, telefono, direccion, logoUrl }: Props) {
  const [pending, startTransition] = useTransition();
  const [preview, setPreview] = useState<string | null>(logoUrl);
  const [guardado, setGuardado] = useState(false);

  return (
    <form
      action={(formData) =>
        startTransition(async () => {
          await actualizarDatosTienda(formData);
          setGuardado(true);
        })
      }
      className="flex max-w-md flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="flex items-center gap-4">
        {preview ? (
          <Image
            src={preview}
            alt="Logo de la tienda"
            width={64}
            height={64}
            className="rounded-lg object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-zinc-100 text-xs text-zinc-400 dark:bg-zinc-800">
            Sin logo
          </div>
        )}
        <label className="flex flex-col gap-1 text-sm">
          Logo de tu tienda
          <input
            type="file"
            name="logo"
            accept="image/*"
            onChange={(e) => {
              const archivo = e.target.files?.[0];
              if (archivo) setPreview(URL.createObjectURL(archivo));
            }}
            className="text-sm"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        Nombre de la tienda
        <input
          name="nombre"
          defaultValue={nombre}
          required
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-950"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Teléfono
        <input
          name="telefono"
          defaultValue={telefono ?? ""}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-950"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Dirección
        <input
          name="direccion"
          defaultValue={direccion ?? ""}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-950"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 px-5 py-2 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Guardando..." : "Guardar"}
      </button>

      {guardado && !pending && (
        <p className="text-sm text-emerald-600 dark:text-emerald-400">
          Datos guardados. Refresca la página para verlos en el menú.
        </p>
      )}
    </form>
  );
}
