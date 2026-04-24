import { ClipboardList, Clock3, FileSignature, Plus, UsersRound } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import dashboardVisit from "../assets/dashboard-visit.svg";
import { AssessmentTable } from "../components/AssessmentTable.jsx";
import { Button } from "../components/Button.jsx";
import { FilterBar } from "../components/FilterBar.jsx";
import { SummaryCard } from "../components/SummaryCard.jsx";
import { useAssessments } from "../hooks/useAssessments.js";
import {
  applyAssessmentFilters,
  sortAssessmentsByDate,
  uniqueValues,
} from "../utils/filters.js";
import { formatDuration } from "../utils/time.js";

const initialFilters = {
  search: "",
  client: "",
  technician: "",
  dateFrom: "",
  dateTo: "",
  status: "",
  visitType: "",
};

export function Dashboard() {
  const { assessments, loading } = useAssessments();
  const [filters, setFilters] = useState(initialFilters);

  const clients = useMemo(() => uniqueValues(assessments, "client"), [assessments]);
  const technicians = useMemo(
    () => uniqueValues(assessments, "technician"),
    [assessments],
  );

  const filteredAssessments = useMemo(
    () => sortAssessmentsByDate(applyAssessmentFilters(assessments, filters)),
    [assessments, filters],
  );

  const totalHours = filteredAssessments.reduce(
    (sum, assessment) => sum + Number(assessment.totalHours || 0),
    0,
  );
  const attendedClients = new Set(filteredAssessments.map((item) => item.client)).size;
  const pendingSignatures = filteredAssessments.filter(
    (item) =>
      item.status !== "rascunho" &&
      (!item.technicianSignature || !item.clientSignature),
  ).length;

  if (loading) {
    return <div className="rounded-lg bg-white p-6 text-zinc-600">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-emerald-700">
            Assessoria técnica digital
          </p>
          <h2 className="mt-2 text-xl font-semibold text-zinc-950">
            Resumo operacional
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button as={Link} to="/assessorias/nova">
            <Plus size={18} />
            Nova assessoria
          </Button>
          <Button as={Link} to="/assessorias" variant="secondary">
            Ver histórico
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total de assessorias"
          value={filteredAssessments.length}
          caption="Registros conforme os filtros aplicados"
          icon={<ClipboardList size={24} />}
          tone="zinc"
        />
        <SummaryCard
          title="Horas totais lançadas"
          value={formatDuration(totalHours)}
          caption="Somatório do período selecionado"
          icon={<Clock3 size={24} />}
          tone="emerald"
        />
        <SummaryCard
          title="Clientes atendidos"
          value={attendedClients}
          caption="Clientes únicos encontrados"
          icon={<UsersRound size={24} />}
          tone="cyan"
        />
        <SummaryCard
          title="Pendentes de assinatura"
          value={pendingSignatures}
          caption="Finalizadas sem uma das assinaturas"
          icon={<FileSignature size={24} />}
          tone="amber"
        />
      </div>

      <FilterBar
        filters={filters}
        onChange={setFilters}
        clients={clients}
        technicians={technicians}
      />

      <section className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-soft">
          <h2 className="text-lg font-semibold text-zinc-950">
            Registros para fechamento
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Acompanhe assinaturas, pendências e horas antes de imprimir a ficha final.
          </p>
        </div>
        <div className="hidden rounded-lg border border-zinc-200 bg-white p-4 shadow-soft lg:block">
          <img
            src={dashboardVisit}
            alt="Registro digital de visita técnica"
            className="h-32 w-full object-contain"
          />
        </div>
      </section>

      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-950">Assessorias recentes</h2>
          <p className="mt-1 text-sm text-zinc-500">Últimos registros encontrados.</p>
        </div>
      </div>

      <AssessmentTable
        assessments={filteredAssessments}
        pageSize={6}
        showPagination={false}
        emptyMessage="Nenhuma assessoria recente encontrada."
      />
    </div>
  );
}
