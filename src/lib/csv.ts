// Convierte un valor en una celda de CSV segura para abrir en Excel/Sheets.
// Si el texto empieza con =, +, - o @, Excel lo interpreta como formula al
// abrir el archivo (CSV/formula injection) -- se antepone una comilla para
// neutralizarlo sin cambiar lo que ve el usuario.
export function celda(valor: unknown) {
  let texto = String(valor ?? "");
  if (/^[=+\-@]/.test(texto)) texto = "'" + texto;
  if (/[",\n]/.test(texto)) {
    return `"${texto.replace(/"/g, '""')}"`;
  }
  return texto;
}
