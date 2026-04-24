import { Search, X } from "lucide-react";
import { statusOptions, visitTypes } from "../data/options.js";
import { Button } from "./Button.jsx";

const fieldClass =
  "h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

export function FilterBar({ filters, onChange, clients = [], technicians = [] }) {
  const update = (field, value) => onChange({ ...filters, [field]: value });

  const reset = () =>
    onChange({
      search: "",
      client: "",
      technician: "",
      dateFrom: "",
      dateTo: "",
      status: "",
      visitType: "",
    });

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-soft">
      <div className="grid gap-3 lg:grid-cols-[1.3fr_1fr_1fr] xl:grid-cols-[1.4fr_1fr_1fr_0.9fr_0.9fr_1fr_1fr_auto]">
        <label className="relative block">
          <span className="sr-only">Buscar</span>
          <Search
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            className={`${fieldClass} pl-10`}
            value={filters.search || ""}
            onChange={(event) => update("search", event.target.value)}
            placeholder="Buscar por cliente, número, técnico..."
          />
        </label>

        <select
          className={fieldClass}
          value={filters.client || ""}
          onChange={(event) => update("client", event.target.value)}
          aria-label="Filtrar por cliente"
        >
          <option value="">Todos os clientes</option>
          {clients.map((client) => (
            <option key={client} value={client}>
              {client}
            </option>
          ))}
        </select>

        <select
          className={fieldClass}
          value={filters.technician || ""}
          onChange={(event) => update("technician", event.target.value)}
          aria-label="Filtrar por técnico"
        >
          <option value="">Todos os técnicos</option>
          {technicians.map((technician) => (
            <option key={technician} value={technician}>
              {technician}
            </option>
          ))}
        </select>

        <input
          className={fieldClass}
          type="date"
          value={filters.dateFrom || ""}
          onChange={(event) => update("dateFrom", event.target.value)}
          aria-label="Data inicial"
        />

        <input
          className={fieldClass}
          type="date"
          value={filters.dateTo || ""}
          onChange={(event) => update("dateTo", event.target.value)}
          aria-label="Data final"
        />

        <select
          className={fieldClass}
          value={filters.status || ""}
          onChange={(event) => update("status", event.target.value)}
          aria-label="Filtrar por status"
        >
          <option value="">Todos os status</option>
          {statusOptions.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>

        <select
          className={fieldClass}
          value={filters.visitType || ""}
          onChange={(event) => update("visitType", event.target.value)}
          aria-label="Filtrar por tipo de visita"
        >
          <option value="">Todos os tipos</option>
          {visitTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>

        <Button type="button" variant="secondary" onClick={reset} className="w-full">
          <X size={16} />
          Limpar
        </Button>
      </div>
    </section>
  );
}
