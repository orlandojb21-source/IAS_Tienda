export const meses = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export function resolverPeriodo(params: { mes?: string; anio?: string }) {
  const ahora = new Date();
  const esPrimeraCarga = params.anio === undefined;

  const anioTexto = esPrimeraCarga ? String(ahora.getFullYear()) : params.anio;
  const mesTexto = esPrimeraCarga ? String(ahora.getMonth() + 1) : params.mes;

  const anio = anioTexto ? Number(anioTexto) : null;
  const mes = anio && mesTexto ? Number(mesTexto) : null;

  let inicio: string | null = null;
  let fin: string | null = null;
  let etiqueta = "Todo el tiempo";

  if (anio) {
    const mesInicio = mes ? mes - 1 : 0;
    const mesFin = mes ? mes : 12;
    inicio = new Date(anio, mesInicio, 1).toISOString();
    fin = new Date(anio, mesFin, 1).toISOString();
    etiqueta = mes ? `${meses[mes - 1]} ${anio}` : `Todo ${anio}`;
  }

  return { anioTexto: anioTexto ?? "", mesTexto: mesTexto ?? "", inicio, fin, etiqueta };
}
