"use client";

export function ImprimirBoton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print:hidden rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 px-5 py-2 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
    >
      Imprimir / Guardar como PDF
    </button>
  );
}
