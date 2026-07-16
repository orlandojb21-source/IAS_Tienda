"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPerfilActual } from "@/lib/perfil";

type ItemVenta = {
  producto_id: string;
  cantidad: number;
  precio_unitario: number;
};

export async function crearVenta(datos: {
  cliente_id: string | null;
  metodo_pago: string;
  descuento: number;
  montoPagadoAhora: number;
  items: ItemVenta[];
}) {
  const perfil = await getPerfilActual();
  if (!perfil) throw new Error("Cuenta no activada");
  if (datos.items.length === 0) throw new Error("Agrega al menos un producto");

  const supabase = await createClient();

  const subtotal = datos.items.reduce(
    (suma, item) => suma + item.cantidad * item.precio_unitario,
    0,
  );
  const total = Math.max(subtotal - datos.descuento, 0);
  const montoPagadoAhora = Math.min(Math.max(datos.montoPagadoAhora, 0), total);

  if (montoPagadoAhora < total && !datos.cliente_id) {
    throw new Error("Selecciona un cliente para dejar la deuda a su nombre");
  }

  const { data: venta, error: errorVenta } = await supabase
    .from("ventas")
    .insert({
      negocio_id: perfil.negocio_id,
      cliente_id: datos.cliente_id,
      vendedor_id: perfil.id,
      total,
      descuento: datos.descuento,
    })
    .select("id")
    .single();

  if (errorVenta) throw new Error(errorVenta.message);

  const filasItems = datos.items.map((item) => ({
    negocio_id: perfil.negocio_id,
    venta_id: venta.id,
    producto_id: item.producto_id,
    cantidad: item.cantidad,
    precio_unitario: item.precio_unitario,
  }));

  const { error: errorItems } = await supabase.from("venta_items").insert(filasItems);
  if (errorItems) throw new Error(errorItems.message);

  for (const item of datos.items) {
    const { error: errorStock } = await supabase.rpc("descontar_stock", {
      p_producto_id: item.producto_id,
      p_cantidad: item.cantidad,
    });
    if (errorStock) throw new Error(errorStock.message);
  }

  // El pago que dio en el momento (puede ser todo, parte, o nada) es el
  // primer abono. El monto_pagado de la venta lo recalcula solo el
  // trigger de abonos.
  if (montoPagadoAhora > 0) {
    const { error: errorAbono } = await supabase.from("abonos").insert({
      negocio_id: perfil.negocio_id,
      venta_id: venta.id,
      monto: montoPagadoAhora,
      metodo_pago: datos.metodo_pago,
    });
    if (errorAbono) throw new Error(errorAbono.message);
  }

  revalidatePath("/ventas");
  revalidatePath("/productos");
  redirect("/ventas");
}

export async function registrarAbono(ventaId: string, monto: number, metodoPago: string) {
  const perfil = await getPerfilActual();
  if (!perfil) throw new Error("Cuenta no activada");
  if (monto <= 0) throw new Error("El abono debe ser mayor a 0");

  const supabase = await createClient();
  const { error } = await supabase.from("abonos").insert({
    negocio_id: perfil.negocio_id,
    venta_id: ventaId,
    monto,
    metodo_pago: metodoPago,
  });

  if (error) throw new Error(error.message);
  revalidatePath(`/ventas/${ventaId}`);
  revalidatePath("/ventas");
}
