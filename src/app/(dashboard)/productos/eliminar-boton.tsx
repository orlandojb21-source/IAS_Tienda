"use client";

import { useTransition } from "react";
import { eliminarProducto } from "./actions";

export function EliminarBoton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => {
        if (confirm("¿Eliminar este producto? Esta acción no se puede deshacer.")) {
          startTransition(() => eliminarProducto(id));
        }
      }}
      className="text-red-600 hover:underline disabled:opacity-50 dark:text-red-400"
    >
      Eliminar
    </button>
  );
}
