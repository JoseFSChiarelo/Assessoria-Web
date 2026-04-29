import { ClipboardList, Clock3, FileSignature, Plus, UsersRound } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { AssessmentTable } from "../components/AssessmentTable.jsx";
import { Button } from "../components/Button.jsx";
import { SummaryCard } from "../components/SummaryCard.jsx";
import { useAssessments } from "../hooks/useAssessments.js";
import { sortAssessmentsByDate } from "../utils/filters.js";
import { formatDuration } from "../utils/time.js";

export function Dashboard() {
  const { assessments, loading } = useAssessments();
  const filteredAssessments = useMemo(() => sortAssessmentsByDate(assessments), [assessments]);

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
          caption="Total de registros cadastrados"
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

      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-950">Ultimas assessorias realizadas</h2> 
        </div>
      </div>

      <AssessmentTable
        assessments={filteredAssessments}
        pageSize={5}
        showPagination={false}
        emptyMessage="Nenhuma assessoria recente encontrada."
      />
    </div>
  );
}
