"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { crearVenta } from "./actions";

type Producto = {
  id: string;
  nombre: string;
  precio: number;
  unidad_medida: string;
};

type Cliente = {
  id: string;
  nombre: string;
};

type Fila = {
  producto_id: string;
  cantidad: number;
  precio_unitario: number;
};

export function NuevaVentaForm({
  productos,
  clientes,
}: {
  productos: Producto[];
  clientes: Cliente[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [clienteId, setClienteId] = useState("");
  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [descuento, setDescuento] = useState(0);
  const [filas, setFilas] = useState<Fila[]>([]);

  const [productoSeleccionado, setProductoSeleccionado] = useState(
    productos[0]?.id ?? "",
  );
  const [cantidadSeleccionada, setCantidadSeleccionada] = useState(1);

  const subtotal = useMemo(
    () => filas.reduce((suma, fila) => suma + fila.cantidad * fila.precio_unitario, 0),
    [filas],
  );
  const total = Math.max(subtotal - descuento, 0);

  function agregarProducto() {
    const producto = productos.find((p) => p.id === productoSeleccionado);
    if (!producto || cantidadSeleccionada <= 0) return;

    setFilas((actual) => {
      const existente = actual.find((f) => f.producto_id === producto.id);
      if (existente) {
        return actual.map((f) =>
          f.producto_id === producto.id
            ? { ...f, cantidad: f.cantidad + cantidadSeleccionada }
            : f,
        );
      }
      return [
        ...actual,
        {
          producto_id: producto.id,
          cantidad: cantidadSeleccionada,
          precio_unitario: producto.precio,
        },
      ];
    });
    setCantidadSeleccionada(1);
  }

  function quitarFila(producto_id: string) {
    setFilas((actual) => actual.filter((f) => f.producto_id !== producto_id));
  }

  function guardarVenta() {
    setError(null);
    startTransition(async () => {
      try {
        await crearVenta({
          cliente_id: clienteId || null,
          metodo_pago: metodoPago,
          descuento,
          totalmentePagada: metodoPago !== "Fiado",
          items: filas,
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Ocurrió un error");
      }
    });
  }

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-4 font-medium text-black dark:text-zinc-50">Agregar producto</h2>
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-1 min-w-[180px] flex-col gap-1 text-sm">
            Producto
            <select
              value={productoSeleccionado}
              onChange={(e) => setProductoSeleccionado(e.target.value)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-950"
            >
              {productos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} — {p.precio}/{p.unidad_medida}
                </option>
              ))}
            </select>
          </label>
          <label className="flex w-24 flex-col gap-1 text-sm">
            Cantidad
            <input
              type="number"
              min={1}
              value={cantidadSeleccionada}
              onChange={(e) => setCantidadSeleccionada(Number(e.target.value))}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-950"
            />
          </label>
          <button
            type="button"
            onClick={agregarProducto}
            disabled={!productoSeleccionado}
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700"
          >
            + Agregar
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        {filas.length === 0 ? (
          <p className="px-6 py-8 text-center text-zinc-500 dark:text-zinc-400">
            Todavía no has agregado productos a esta venta.
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-400">
                <th className="px-4 py-3 font-medium">Producto</th>
                <th className="px-4 py-3 font-medium">Cantidad</th>
                <th className="px-4 py-3 font-medium">Precio</th>
                <th className="px-4 py-3 font-medium">Subtotal</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filas.map((fila) => {
                const producto = productos.find((p) => p.id === fila.producto_id);
                return (
                  <tr
                    key={fila.producto_id}
                    className="border-b border-zinc-100 last:border-0 dark:border-zinc-800/60"
                  >
                    <td className="px-4 py-3 text-black dark:text-zinc-50">
                      {producto?.nombre}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {fila.cantidad}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {fila.precio_unitario}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {(fila.cantidad * fila.precio_unitario).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => quitarFila(fila.producto_id)}
                        className="text-red-600 hover:underline dark:text-red-400"
                      >
                        Quitar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1 text-sm">
            Cliente (opcional)
            <select
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-950"
            >
              <option value="">Cliente ocasional</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Método de pago
            <select
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-950"
            >
              <option value="Efectivo">Efectivo</option>
              <option value="Tarjeta">Tarjeta</option>
              <option value="Transferencia">Transferencia</option>
              <option value="Fiado">Fiado (queda debiendo)</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Descuento
            <input
              type="number"
              step="0.01"
              min={0}
              value={descuento}
              onChange={(e) => setDescuento(Number(e.target.value))}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-950"
            />
          </label>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            Subtotal: {subtotal.toFixed(2)} — Descuento: {descuento}
          </span>
          <span className="text-xl font-semibold text-black dark:text-zinc-50">
            Total: {total.toFixed(2)}
          </span>
        </div>

        {metodoPago === "Fiado" && clienteId === "" && (
          <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
            Para vender fiado, selecciona un cliente (si no, no vas a poder cobrarle después).
          </p>
        )}

        {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={guardarVenta}
            disabled={pending || filas.length === 0 || (metodoPago === "Fiado" && clienteId === "")}
            className="rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 px-5 py-2 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {pending ? "Guardando..." : "Registrar venta"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/ventas")}
            className="rounded-full border border-zinc-300 px-5 py-2 text-sm dark:border-zinc-700"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
