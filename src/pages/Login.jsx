import { LockKeyhole, LogIn, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import brandMark from "../assets/brand-mark.svg";
import dashboardVisit from "../assets/dashboard-visit.svg";
import { Button } from "../components/Button.jsx";
import { users } from "../data/users.js";
import { useAuth } from "../hooks/useAuth.js";

const fieldClass =
  "mt-1 h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

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

  const handleSubmit = (event) => {
    event.preventDefault();

    try {
      const session = login(credentials);
      toast.success(`Bem-vindo, ${session.name}.`);
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const useDemoUser = (user) => {
    setCredentials({ username: user.username, password: user.password });
  };

  return (
    <main className="min-h-screen bg-[#f6f7f8] px-4 py-8 sm:px-6 lg:grid lg:grid-cols-[1fr_470px] lg:gap-8 lg:px-8">
      <section className="hidden rounded-lg border border-zinc-200 bg-white p-8 shadow-soft lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <img src={brandMark} alt="Assessoria Web" className="h-12 w-12" />
            <div>
              <p className="text-lg font-semibold text-zinc-950">Assessoria Web</p>
              <p className="text-sm text-zinc-500">Acesso da equipe técnica</p>
            </div>
          </div>

          <div className="mt-12 max-w-2xl">
            <p className="text-sm font-semibold uppercase text-emerald-700">
              Registro de campo
            </p>
            <h1 className="mt-3 text-4xl font-semibold text-zinc-950">
              Lance assessorias com o seu usuário.
            </h1>
            <p className="mt-4 text-base leading-7 text-zinc-600">
              Cada técnico entra com o próprio acesso para registrar visitas,
              treinamentos, horas e assinaturas do atendimento.
            </p>
          </div>
        </div>

        <img
          src={dashboardVisit}
          alt="Ficha digital de assessoria"
          className="mt-10 max-h-72 w-full object-contain"
        />
      </section>

      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col justify-center">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-soft sm:p-8">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <img src={brandMark} alt="Assessoria Web" className="h-11 w-11" />
            <div>
              <p className="text-base font-semibold text-zinc-950">Assessoria Web</p>
              <p className="text-xs text-zinc-500">Acesso da equipe técnica</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase text-emerald-700">Login</p>
            <h2 className="mt-2 text-2xl font-semibold text-zinc-950">
              Entrar no sistema
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Informe seu usuário para lançar e acompanhar assessorias.
            </p>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-medium text-zinc-700">Usuário</span>
              <div className="relative">
                <UserRound
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
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
              <span className="text-sm font-medium text-zinc-700">Senha</span>
              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
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

        <div className="mt-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-soft">
          <p className="text-sm font-semibold text-zinc-950">Usuários iniciais</p>
          <div className="mt-3 grid gap-2">
            {users.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => useDemoUser(user)}
                className="flex items-center justify-between rounded-lg border border-zinc-200 px-3 py-2 text-left text-sm transition hover:bg-zinc-50"
              >
                <span>
                  <span className="font-medium text-zinc-900">{user.name}</span>
                  <span className="ml-2 text-zinc-500">@{user.username}</span>
                </span>
                <span className="text-xs font-medium text-zinc-500">{user.role}</span>
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-zinc-500">
            Senha dos técnicos: 123456 · admin: admin123
          </p>
        </div>
      </section>
    </main>
  );
}
