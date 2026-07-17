"use client";

import { useState } from "react";
import { ImprimirBoton } from "../imprimir-boton";

export function BalanceAcciones({ textoParaCompartir }: { textoParaCompartir: string }) {
  const [copiado, setCopiado] = useState(false);

  async function compartir() {
    if (navigator.share) {
      try {
        await navigator.share({ text: textoParaCompartir });
      } catch {
        // el usuario cancelo el dialogo de compartir, no hacemos nada
      }
    } else {
      await navigator.clipboard.writeText(textoParaCompartir);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  }

  return (
    <div className="print:hidden flex flex-wrap gap-3">
      <ImprimirBoton />
      <button
        type="button"
        onClick={compartir}
        className="rounded-full border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700"
      >
        {copiado ? "¡Copiado!" : "Compartir"}
      </button>
    </div>
  );
}
