import clsx from "clsx";

const variants = {
  primary: "bg-emerald-700 text-white hover:bg-emerald-800 focus:ring-emerald-200",
  secondary:
    "border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 dark:focus:ring-zinc-700",
  danger: "bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-200",
  ghost:
    "text-zinc-700 hover:bg-zinc-100 focus:ring-zinc-200 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:focus:ring-zinc-700",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
};

export function Button({
  as: Component = "button",
  variant = "primary",
  size = "md",
  className,
  ...props
}) {
  return (
    <Component
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
