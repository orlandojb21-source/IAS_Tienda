import { ClienteForm } from "../cliente-form";
import { crearCliente } from "../actions";

export default function NuevoClientePage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-black dark:text-zinc-50">
        Nuevo cliente
      </h1>
      <ClienteForm action={crearCliente} />
    </div>
  );
}
