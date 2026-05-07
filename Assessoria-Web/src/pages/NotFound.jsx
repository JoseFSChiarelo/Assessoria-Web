import { Link } from "react-router-dom";
import { Button } from "../components/Button.jsx";

export function NotFound() {
  return (
    <div className="mx-auto max-w-xl rounded-lg border border-zinc-200 bg-white p-8 text-center shadow-soft">
      <p className="text-sm font-semibold uppercase text-emerald-700">404</p>
      <h2 className="mt-3 text-2xl font-semibold text-zinc-950">
        Página não encontrada
      </h2>
      <p className="mt-3 text-sm leading-6 text-zinc-600">
        A assessoria ou rota acessada não existe mais neste ambiente.
      </p>
      <div className="mt-6">
        <Button as={Link} to="/">
          Voltar ao dashboard
        </Button>
      </div>
    </div>
  );
}
