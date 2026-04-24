import clsx from "clsx";
import { formatStatus } from "../utils/formatters.js";

const statusClasses = {
  rascunho: "border-zinc-200 bg-zinc-100 text-zinc-700",
  finalizada: "border-cyan-200 bg-cyan-50 text-cyan-800",
  assinada: "border-emerald-200 bg-emerald-50 text-emerald-800",
  impressa: "border-amber-200 bg-amber-50 text-amber-800",
};

export function StatusBadge({ status }) {
  return (
    <span
      className={clsx(
        "inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold",
        statusClasses[status] || statusClasses.rascunho,
      )}
    >
      {formatStatus(status)}
    </span>
  );
}
