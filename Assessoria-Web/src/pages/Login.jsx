import { LockKeyhole, LogIn, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import brandMark from "../assets/brand-mark.svg";
import logoexens from "../assets/logo-exens.png";
import { Button } from "../components/Button.jsx";
import { ThemeToggle } from "../components/ThemeToggle.jsx";
import { useAuth } from "../hooks/useAuth.js";

const fieldClass =
  "mt-1 h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:ring-emerald-900/40";

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { authenticated, login } = useAuth();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (authenticated) {
      navigate(from, { replace: true });
    }
  }, [authenticated, from, navigate]);

  const updateField = (field, value) => {
    setCredentials((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const session = await login(credentials);
      toast.success(`Bem-vindo, ${session.name}.`);
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f7f8] px-3 py-8 sm:px-6 lg:px-8 flex items-center justify-center dark:bg-[#0b0f14]">
      <section className="relative flex flex-col rounded-lg border border-zinc-200 bg-white p-8 shadow-soft lg:items-center dark:border-zinc-800 dark:bg-zinc-950">
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-soft sm:p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <img src={brandMark} alt="Assessoria Web" className="h-11 w-11" />
            <div>
              <p className="text-base font-semibold text-zinc-950 dark:text-zinc-100">Assessoria Web</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Acesso da equipe técnica</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase text-emerald-700">Login</p>
            <h2 className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-zinc-100">
              Entrar no sistema
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              Informe seu usuário para lançar e acompanhar assessorias.
            </p>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Usuário</span>
              <div className="relative">
                <UserRound
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
                />
                <input
                  className={`${fieldClass} pl-10`}
                  value={credentials.username}
                  onChange={(event) => updateField("username", event.target.value)}
                  placeholder="Digite seu usuário"
                  autoComplete="username"
                  autoFocus
                />
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Senha</span>
              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
                />
                <input
                  className={`${fieldClass} pl-10`}
                  type="password"
                  value={credentials.password}
                  onChange={(event) => updateField("password", event.target.value)}
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                />
              </div>
            </label>

            <Button type="submit" className="w-full" size="lg">
              <LogIn size={18} />
              Entrar
            </Button>
          </form>
        </div>

        <img
          src={logoexens}
          alt="Ficha digital de assessoria"
          className="mt-10 max-h-72 w-full object-contain"
        />
      </section>
    </main>
  );
}
