"use client";

import { useTransition } from "react";
import { eliminarCliente } from "./actions";

export function EliminarBoton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => {
        if (confirm("¿Eliminar este cliente? Esta acción no se puede deshacer.")) {
          startTransition(() => eliminarCliente(id));
        }
      }}
      className="text-red-600 hover:underline disabled:opacity-50 dark:text-red-400"
    >
      Eliminar
    </button>
  );
}
