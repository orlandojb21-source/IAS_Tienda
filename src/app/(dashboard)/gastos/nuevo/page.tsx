import { GastoForm } from "../gasto-form";
import { crearGasto } from "../actions";

export default function NuevoGastoPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-black dark:text-zinc-50">
        Nuevo gasto
      </h1>
      <GastoForm action={crearGasto} />
    </div>
  );
}
