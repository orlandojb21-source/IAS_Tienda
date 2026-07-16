"use client";

import { useState, useTransition } from "react";
import { registrarAbono } from "../actions";

export function AbonoForm({ ventaId, saldo }: { ventaId: string; saldo: number }) {
  const [monto, setMonto] = useState(saldo);
  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-3">
        <input
          type="number"
          step="0.01"
          min={0.01}
          max={saldo}
          value={monto}
          onChange={(e) => setMonto(Number(e.target.value))}
          className="w-32 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-950"
        />
        <select
          value={metodoPago}
          onChange={(e) => setMetodoPago(e.target.value)}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-950"
        >
          <option value="Efectivo">Efectivo</option>
          <option value="Tarjeta">Tarjeta</option>
          <option value="Transferencia">Transferencia</option>
          <option value="Yappy">Yappy</option>
        </select>
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            setError(null);
            startTransition(async () => {
              try {
                await registrarAbono(ventaId, monto, metodoPago);
              } catch (e) {
                setError(e instanceof Error ? e.message : "Ocurrió un error");
              }
            });
          }}
          className="rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Guardando..." : "Registrar abono"}
        </button>
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
