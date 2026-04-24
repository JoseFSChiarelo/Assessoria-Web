import { LogOut, Menu, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

function resolveTitle(pathname) {
  if (pathname === "/") return "Dashboard";
  if (pathname === "/assessorias") return "Histórico de assessorias";
  if (pathname === "/assessorias/nova") return "Nova assessoria";
  if (pathname.endsWith("/editar")) return "Editar assessoria";
  if (pathname.startsWith("/assessorias/")) return "Visualizar assessoria";
  return "Assessoria Web";
}

export function Header({ onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const today = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const handleLogout = () => {
    logout();
    toast.success("Sessão encerrada.");
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/95 backdrop-blur no-print">
      <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-lg border border-zinc-200 bg-white p-2 text-zinc-700 lg:hidden"
            aria-label="Abrir menu"
          >
            <Menu size={21} />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-semibold text-zinc-950 sm:text-2xl">
              {resolveTitle(location.pathname)}
            </h1>
            <p className="mt-1 truncate text-sm text-zinc-500">{today}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 sm:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-emerald-700">
              <UserRound size={18} />
            </div>
            <div className="max-w-44">
              <p className="truncate text-sm font-semibold text-zinc-950">
                {user?.name || "Usuário"}
              </p>
              <p className="truncate text-xs text-zinc-500">{user?.role || "Equipe"}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
          >
            <LogOut size={17} />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
}
