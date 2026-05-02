import { ClipboardList, Clock3, FileSignature, Plus, UsersRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AssessmentTable } from "../components/AssessmentTable.jsx";
import { Button } from "../components/Button.jsx";
import { SummaryCard } from "../components/SummaryCard.jsx";
import { statusOptions, visitTypes } from "../data/options.js";
import { useAuth } from "../hooks/useAuth.js";
import { useAssessments } from "../hooks/useAssessments.js";
import { sortAssessmentsByDate } from "../utils/filters.js";
import { nextAssessmentNumber } from "../utils/ids.js";
import { formatDuration } from "../utils/time.js";

const fieldClass =
  "mt-1 h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

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
  const [showGeneralDataStep, setShowGeneralDataStep] = useState(false);
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

  const updateGeneralData = (field, value) => {
    setGeneralData((current) => ({ ...current, [field]: value }));
  };

  const startFirstStep = () => {
    setShowLaunchPrompt(false);
    setGeneralData((current) => ({
      ...current,
      entryTime: current.entryTime || getAssessmentTimeStartHHMM(),
    }));
    setShowGeneralDataStep(true);
  };

  const continueToForm = () => {
    const entryTime = generalData.entryTime || getAssessmentTimeStartHHMM();

    navigate("/assessorias/nova", {
      state: {
        prefill: {
          ...generalData,
          entryTime,
        },
      },
    });
  };


  if (loading) {
    return <div className="rounded-lg bg-white p-6 text-zinc-600">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      {showLaunchPrompt ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/45 px-4">
          <section className="w-full max-w-md rounded-xl border border-emerald-200 bg-white p-6 shadow-2xl">
            <p className="text-base font-semibold text-zinc-900">Lançar assessoria?</p>
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

      {showGeneralDataStep ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/45 p-4">
          <section className="max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-xl border border-zinc-200 bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-6 max-w-3xl">
              <h2 className="text-lg font-semibold text-zinc-950">Dados gerais</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Identificação da assessoria, cliente, empresa e responsável.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <label className="block">
                <span className="text-sm font-medium text-zinc-700">Número da assessoria</span>
                <input
                  className={fieldClass}
                  value={generalData.number}
                  onChange={(event) => updateGeneralData("number", event.target.value)}
                  placeholder="AS-2026-0005"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-zinc-700">Data</span>
                <input
                  className={fieldClass}
                  type="date"
                  value={generalData.date}
                  onChange={(event) => updateGeneralData("date", event.target.value)}
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-zinc-700">Cliente</span>
                <input
                  className={fieldClass}
                  value={generalData.client}
                  onChange={(event) => updateGeneralData("client", event.target.value)}
                  placeholder="Nome do cliente"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-zinc-700">Empresa</span>
                <input
                  className={fieldClass}
                  value={generalData.company}
                  onChange={(event) => updateGeneralData("company", event.target.value)}
                  placeholder="Razão social ou unidade"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-zinc-700">Responsável no cliente</span>
                <input
                  className={fieldClass}
                  value={generalData.clientResponsible}
                  onChange={(event) => updateGeneralData("clientResponsible", event.target.value)}
                  placeholder="Nome do responsável"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-zinc-700">Técnico responsável</span>
                <input
                  className={fieldClass}
                  value={generalData.technician}
                  onChange={(event) => updateGeneralData("technician", event.target.value)}
                  placeholder="Nome do técnico"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-zinc-700">Tipo de atendimento</span>
                <select
                  className={fieldClass}
                  value={generalData.visitType}
                  onChange={(event) => updateGeneralData("visitType", event.target.value)}
                >
                  {visitTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-zinc-700">Status</span>
                <select
                  className={fieldClass}
                  value={generalData.status}
                  onChange={(event) => updateGeneralData("status", event.target.value)}
                >
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-zinc-200 pt-4">
              <Button
                variant="secondary"
                type="button"
                onClick={() => {
                  setShowGeneralDataStep(false);
                  setShowLaunchPrompt(true);
                }}
              >
                Voltar
              </Button>
              <Button type="button" onClick={continueToForm}>
                Continuar
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
