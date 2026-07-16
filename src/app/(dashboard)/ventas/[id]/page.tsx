import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AbonoForm } from "./abono-form";

export default async function VentaDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: venta }, { data: items }, { data: abonos }] = await Promise.all([
    supabase
      .from("ventas")
      .select("*, clientes(nombre), perfiles(nombre)")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("venta_items")
      .select("cantidad, precio_unitario, productos(nombre)")
      .eq("venta_id", id),
    supabase
      .from("abonos")
      .select("*")
      .eq("venta_id", id)
      .order("creado_en"),
  ]);

  if (!venta) notFound();

  const cliente = venta.clientes as unknown as { nombre: string } | null;
  const vendedor = venta.perfiles as unknown as { nombre: string } | null;
  const saldo = Number(venta.total) - Number(venta.monto_pagado);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-semibold text-black dark:text-zinc-50">
        Venta del {new Date(venta.creado_en).toLocaleString("es")}
      </h1>

      <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 grid grid-cols-2 gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <p>Cliente: {cliente?.nombre ?? "Cliente ocasional"}</p>
          <p>Vendedor: {vendedor?.nombre ?? "—"}</p>
          <p>Descuento: {venta.descuento}</p>
        </div>

        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              <th className="py-2 pr-4 font-medium">Producto</th>
              <th className="py-2 pr-4 font-medium">Cantidad</th>
              <th className="py-2 pr-4 font-medium">Precio</th>
              <th className="py-2 pr-4 font-medium">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items?.map((item, i) => {
              const producto = item.productos as unknown as { nombre: string } | null;
              return (
                <tr key={i} className="border-b border-zinc-100 last:border-0 dark:border-zinc-800/60">
                  <td className="py-2 pr-4 text-black dark:text-zinc-50">{producto?.nombre}</td>
                  <td className="py-2 pr-4 text-zinc-600 dark:text-zinc-400">{item.cantidad}</td>
                  <td className="py-2 pr-4 text-zinc-600 dark:text-zinc-400">{item.precio_unitario}</td>
                  <td className="py-2 pr-4 text-zinc-600 dark:text-zinc-400">
                    {(item.cantidad * item.precio_unitario).toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            Pagado: {venta.monto_pagado} de {venta.total}
          </span>
          <span className="text-xl font-semibold text-black dark:text-zinc-50">
            {saldo > 0 ? `Saldo: ${saldo.toFixed(2)}` : "Pagada"}
          </span>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-4 font-medium text-black dark:text-zinc-50">Historial de abonos</h2>
        {!abonos || abonos.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Todavía no hay abonos registrados.</p>
        ) : (
          <ul className="flex flex-col gap-2 text-sm">
            {abonos.map((abono) => (
              <li key={abono.id} className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>
                  {new Date(abono.creado_en).toLocaleString("es")} — {abono.metodo_pago}
                </span>
                <span className="font-medium text-black dark:text-zinc-50">{abono.monto}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {saldo > 0 && (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 font-medium text-black dark:text-zinc-50">Registrar un abono</h2>
          <AbonoForm ventaId={venta.id} saldo={saldo} />
        </div>
      )}
    </div>
  );
}
