import { AlertTriangle } from "lucide-react";
import { Button } from "./Button.jsx";

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  onConfirm,
  onClose,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/45 p-4 no-print dark:bg-black/70">
      <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-soft dark:bg-zinc-900">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-100">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{description}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
