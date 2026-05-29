import { RotateCcw, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "./Button.jsx";
import { useTheme } from "../hooks/useTheme.jsx";

export function SignatureBlock({ label, value, onChange, helper }) {
  const padRef = useRef(null);
  const [drawing, setDrawing] = useState(!value);
  const { isDark } = useTheme();

  useEffect(() => {
    setDrawing(!value);
  }, [value]);

  const clear = () => {
    padRef.current?.clear();
    onChange("");
    setDrawing(true);
  };

  const syncSignature = () => {
    const pad = padRef.current;
    if (!pad || pad.isEmpty()) return;
    onChange(pad.getTrimmedCanvas().toDataURL("image/png"));
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-zinc-950 dark:text-zinc-100">{label}</h3>
          {helper ? <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{helper}</p> : null}
        </div>
        {value ? (
          <Button type="button" variant="secondary" size="sm" onClick={clear}>
            <Trash2 size={15} />
            Limpar
          </Button>
        ) : null}
      </div>

      {value && !drawing ? (
        <div className="flex h-44 items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
          <img src={value} alt={label} className="max-h-36 max-w-full object-contain" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-dashed border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900">
          <SignatureCanvas
            ref={padRef}
            penColor={isDark ? "#d4d4d8" : "#18181b"}
            onEnd={syncSignature}
            canvasProps={{
              className: "h-44 w-full touch-none bg-white dark:bg-zinc-900",
              "aria-label": label,
            }}
          />
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        {value && !drawing ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              onChange("");
              setDrawing(true);
            }}
          >
            <RotateCcw size={15} />
            Refazer
          </Button>
        ) : (
          <Button type="button" variant="secondary" size="sm" onClick={clear}>
            <RotateCcw size={15} />
            Limpar área
          </Button>
        )}
      </div>
    </div>
  );
}
