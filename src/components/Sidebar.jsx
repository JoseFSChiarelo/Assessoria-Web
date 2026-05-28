import clsx from "clsx";
import { ClipboardList, FilePlus2, History, LayoutDashboard, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import logoexens from "../assets/logo-exens.png";

const navItems = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Nova assessoria", to: "/assessorias/nova", icon: FilePlus2 },
  { label: "Histórico", to: "/assessorias", icon: History },
];

export function Sidebar({ open, onClose }) {
  return (
    <>
      <div
        className={clsx(
          "fixed inset-0 z-30 bg-zinc-950/40 transition lg:hidden no-print dark:bg-black/70",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-zinc-200 bg-white transition-transform lg:translate-x-0 no-print dark:border-zinc-800 dark:bg-zinc-950",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-20 items-center justify-between border-b border-zinc-200 px-5 dark:border-zinc-800">
          <NavLink to="/" className="flex items-center gap-3" onClick={onClose}>
            <img src={logoexens} alt="Assessoria Web" className="h-11 w-11" />
            <div>
              <p className="text-base font-semibold text-zinc-950 dark:text-zinc-100">
                Assessoria Web
              </p>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Visitas técnicas
              </p>
            </div>
          </NavLink>
          <button
            type="button"
            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 lg:hidden dark:text-zinc-400 dark:hover:bg-zinc-800"
            onClick={onClose}
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition",
                  isActive
                    ? "bg-zinc-950 text-white dark:bg-emerald-700"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
                )
              }
            >
              <item.icon size={19} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-zinc-200 p-5 dark:border-zinc-800">
          <div className="rounded-lg bg-zinc-100 p-4 dark:bg-zinc-900">
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              <ClipboardList size={18} />
              ASSESSORIA EXENS
            </div>
            <p className="mt-2 text-sm leading-5 text-zinc-600 dark:text-zinc-400">
              &copy; {new Date().getFullYear()} Exens Assessoria Web
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
