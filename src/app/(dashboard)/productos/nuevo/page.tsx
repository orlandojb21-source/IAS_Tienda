import { ProductoForm } from "../producto-form";
import { crearProducto } from "../actions";

export default function NuevoProductoPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-black dark:text-zinc-50">
        Nuevo producto
      </h1>
      <ProductoForm action={crearProducto} />
    </div>
  );
}
