import clsx from "clsx";

const tones = {
  emerald: "bg-emerald-50 text-emerald-700",
  cyan: "bg-cyan-50 text-cyan-700",
  amber: "bg-amber-50 text-amber-700",
  zinc: "bg-zinc-100 text-zinc-700",
};

export function SummaryCard({ title, value, caption, icon, tone = "emerald" }) {
  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-500">{title}</p>
          <strong className="mt-3 block text-3xl font-semibold text-zinc-950">
            {value}
          </strong>
        </div>
        <div className={clsx("rounded-lg p-3", tones[tone])}>{icon}</div>
      </div>
      {caption ? <p className="mt-4 text-sm text-zinc-500">{caption}</p> : null}
    </article>
  );
}
