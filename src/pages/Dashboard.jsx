import { ClipboardList, Clock3, FileSignature, Plus, UsersRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AssessmentTable } from "../components/AssessmentTable.jsx";
import { Button } from "../components/Button.jsx";
import { SummaryCard } from "../components/SummaryCard.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useAssessments } from "../hooks/useAssessments.js";
import { sortAssessmentsByDate } from "../utils/filters.js";
import { nextAssessmentNumber } from "../utils/ids.js";
import { formatDuration } from "../utils/time.js";

function today() {
  return new Date().toISOString().slice(0, 10);
}

function getAssessmentTimeStartHHMM() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { assessments, loading } = useAssessments();
  const [showLaunchPrompt, setShowLaunchPrompt] = useState(false);
  const filteredAssessments = useMemo(() => sortAssessmentsByDate(assessments), [assessments]);
  const [generalData, setGeneralData] = useState({
    number: "",
    date: today(),
    client: "",
    company: "",
    clientResponsible: "",
    technician: "",
    visitType: "implantacao",
    status: "rascunho",
    entryTime: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => setShowLaunchPrompt(true), 120);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      setGeneralData((current) => ({
        ...current,
        number: current.number || nextAssessmentNumber(assessments),
        technician: current.technician || user?.name || "",
      }));
    }
  }, [assessments, loading, user?.name]);

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

  const startFirstStep = () => {
    setShowLaunchPrompt(false);
    navigate("/assessorias/nova", {
      state: {
        prefill: {
          ...generalData,
          entryTime: generalData.entryTime || getAssessmentTimeStartHHMM(),
        },
      },
    });
  };


  if (loading) {
    return <div className="rounded-lg bg-white p-6 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      {showLaunchPrompt ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/45 px-4 dark:bg-black/70">
          <section className="w-full max-w-md rounded-xl border border-emerald-200 bg-white p-6 shadow-2xl dark:border-emerald-900 dark:bg-zinc-900">
            <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Lançar assessoria?</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="secondary"
                size="sm"
                type="button"
                onClick={() => setShowLaunchPrompt(false)}
              >
                Não
              </Button>
              <Button type="button" size="sm" onClick={startFirstStep}>
                Sim
              </Button>
            </div>
          </section>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-emerald-700">
            Assessoria técnica digital
          </p>
          <h2 className="mt-2 text-xl font-semibold text-zinc-950 dark:text-zinc-100">
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
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-100">Ultimas assessorias realizadas</h2>
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
