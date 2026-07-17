import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPerfilActual } from "@/lib/perfil";
import { ReciboAcciones } from "./recibo-acciones";

export default async function ReciboPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const perfil = await getPerfilActual();
  const supabase = await createClient();

  const [{ data: negocio }, { data: venta }, { data: items }] = await Promise.all([
    supabase
      .from("negocios")
      .select("nombre, telefono, direccion")
      .eq("id", perfil!.negocio_id)
      .single(),
    supabase
      .from("ventas")
      .select("*, clientes(nombre)")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("venta_items")
      .select("cantidad, precio_unitario, productos(nombre)")
      .eq("venta_id", id),
  ]);

  if (!venta) notFound();

  const cliente = venta.clientes as unknown as { nombre: string } | null;
  const saldo = Number(venta.total) - Number(venta.monto_pagado);
  const fecha = new Date(venta.creado_en).toLocaleString("es");

  const lineasTexto = (items ?? []).map((item) => {
    const producto = item.productos as unknown as { nombre: string } | null;
    return `${item.cantidad} x ${producto?.nombre} — ${(item.cantidad * item.precio_unitario).toFixed(2)}`;
  });

  const textoParaCompartir = [
    negocio?.nombre,
    `Recibo del ${fecha}`,
    cliente ? `Cliente: ${cliente.nombre}` : null,
    "",
    ...lineasTexto,
    "",
    `Total: ${venta.total}`,
    saldo > 0 ? `Saldo pendiente: ${saldo.toFixed(2)}` : "Pagado completo",
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <div className="mx-auto max-w-md">
      <ReciboAcciones textoParaCompartir={textoParaCompartir} />

      <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm print:border-0 print:shadow-none dark:border-zinc-800 dark:bg-zinc-900 print:dark:bg-white print:dark:text-black">
        <div className="mb-6 text-center">
          <h1 className="text-lg font-semibold text-black dark:text-zinc-50 print:text-black">
            {negocio?.nombre}
          </h1>
          {negocio?.telefono && (
            <p className="text-sm text-zinc-500 print:text-black">{negocio.telefono}</p>
          )}
          {negocio?.direccion && (
            <p className="text-sm text-zinc-500 print:text-black">{negocio.direccion}</p>
          )}
        </div>

        <div className="mb-4 flex justify-between text-sm text-zinc-500 print:text-black">
          <span>{fecha}</span>
          <span>{cliente?.nombre ?? "Cliente ocasional"}</span>
        </div>

        <table className="w-full text-left text-sm">
          <tbody>
            {items?.map((item, i) => {
              const producto = item.productos as unknown as { nombre: string } | null;
              return (
                <tr key={i} className="border-b border-dashed border-zinc-200 dark:border-zinc-800 print:border-zinc-300">
                  <td className="py-2 text-black dark:text-zinc-50 print:text-black">
                    {item.cantidad} x {producto?.nombre}
                  </td>
                  <td className="py-2 text-right text-black dark:text-zinc-50 print:text-black">
                    {(item.cantidad * item.precio_unitario).toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="mt-4 flex flex-col gap-1 border-t border-zinc-200 pt-4 text-sm dark:border-zinc-800 print:border-zinc-300 print:text-black">
          <div className="flex justify-between text-zinc-500 print:text-black">
            <span>Descuento</span>
            <span>{venta.descuento}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold text-black dark:text-zinc-50 print:text-black">
            <span>Total</span>
            <span>{venta.total}</span>
          </div>
          {saldo > 0 ? (
            <div className="flex justify-between font-medium text-amber-600 dark:text-amber-400 print:text-black">
              <span>Saldo pendiente</span>
              <span>{saldo.toFixed(2)}</span>
            </div>
          ) : (
            <p className="text-center text-emerald-600 dark:text-emerald-400 print:text-black">Pagado completo</p>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-zinc-400 print:text-black">
          Gracias por su compra
        </p>
      </div>
    </div>
  );
}
