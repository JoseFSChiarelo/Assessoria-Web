import { Copy, Download, Edit3, FileText, Printer, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/Button.jsx";
import { ConfirmModal } from "../components/ConfirmModal.jsx";
import { PrintLayout } from "../components/PrintLayout.jsx";
import { StatusBadge } from "../components/StatusBadge.jsx";
import { useAssessments } from "../hooks/useAssessments.js";
import { formatDate, formatDateTime, formatVisitType } from "../utils/formatters.js";
import { exportElementToPdf } from "../utils/pdf.js";
import { formatDuration } from "../utils/time.js";

function DetailItem({ label, value }) {
  return (
    <div>
      <dt className="text-sm font-medium text-zinc-500">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-zinc-950">{value || "-"}</dd>
    </div>
  );
}

function TextBlock({ title, value }) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5">
      <h3 className="text-sm font-semibold uppercase text-zinc-500">{title}</h3>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-700">{value || "-"}</p>
    </section>
  );
}

function SignaturePreview({ label, signature }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-zinc-950">{label}</h3>
      <div className="mt-4 flex h-32 items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50">
        {signature ? (
          <img src={signature} alt={label} className="max-h-24 max-w-full object-contain" />
        ) : (
          <span className="text-sm text-zinc-500">Assinatura pendente</span>
        )}
      </div>
    </div>
  );
}

export function AssessmentView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { assessments, loading, duplicateAssessment, markPrinted, removeAssessment } = useAssessments();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const assessment = assessments.find((item) => item.id === id);

  if (loading) return <div className="rounded-lg bg-white p-6 text-zinc-600">Carregando...</div>;
  if (!assessment) return <Navigate to="/404" replace />;

  const printElementId = `print-layout-${assessment.id}`;

  const handleDuplicate = async () => {
    try {
      const duplicated = await duplicateAssessment(assessment.id);
      if (!duplicated) return;
      toast.success("Assessoria duplicada como rascunho.");
      navigate(`/assessorias/${duplicated.id}/editar`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async () => {
    try {
      await removeAssessment(assessment.id);
      toast.success("Assessoria excluida.");
      navigate("/assessorias");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handlePrint = async () => {
    try {
      await markPrinted(assessment.id);
      toast.success("Ficha marcada como impressa.");
      window.setTimeout(() => window.print(), 150);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handlePdf = () => {
    toast.promise(exportElementToPdf(printElementId, `${assessment.number || "assessoria"}.pdf`), {
      loading: "Gerando PDF...",
      success: "PDF gerado.",
      error: "Nao foi possivel gerar o PDF."
    });
  };

  return (
    <>
      <div className="space-y-6 no-print">
        <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-soft">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm font-semibold uppercase text-emerald-700">{assessment.number}</p>
                <StatusBadge status={assessment.status} />
              </div>
              <h2 className="mt-3 text-2xl font-semibold text-zinc-950">{assessment.client}</h2>
              <p className="mt-1 text-sm text-zinc-500">{assessment.company}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button as={Link} to={`/assessorias/${assessment.id}/editar`} variant="secondary">
                <Edit3 size={17} />
                Editar
              </Button>
              <Button type="button" variant="secondary" onClick={handleDuplicate}>
                <Copy size={17} />
                Duplicar
              </Button>
              <Button type="button" variant="secondary" onClick={handlePrint}>
                <Printer size={17} />
                Imprimir
              </Button>
              <Button type="button" variant="secondary" onClick={handlePdf}>
                <Download size={17} />
                PDF
              </Button>
              <Button type="button" variant="danger" onClick={() => setConfirmOpen(true)}>
                <Trash2 size={17} />
                Excluir
              </Button>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-soft">
          <div className="mb-5 flex items-center gap-2">
            <FileText size={19} className="text-emerald-700" />
            <h3 className="text-lg font-semibold text-zinc-950">Dados do atendimento</h3>
          </div>
          <dl className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <DetailItem label="Data" value={formatDate(assessment.date)} />
            <DetailItem label="Tipo de atendimento" value={formatVisitType(assessment.visitType)} />
            <DetailItem label="Entrada" value={assessment.entryTime} />
            <DetailItem label="Saida" value={assessment.exitTime} />
            <DetailItem label="Total de horas" value={formatDuration(assessment.totalHours)} />
            <DetailItem label="Local" value={assessment.location} />
            <DetailItem label="Modulo/Sistema" value={assessment.module} />
            <DetailItem label="Tecnico responsavel" value={assessment.technician} />
            <DetailItem label="Responsavel no cliente" value={assessment.clientResponsible} />
            <DetailItem label="Criado em" value={formatDateTime(assessment.createdAt)} />
            <DetailItem label="Atualizado em" value={formatDateTime(assessment.updatedAt)} />
          </dl>
        </section>

        <div className="grid gap-4 lg:grid-cols-2">
          <TextBlock title="Treinamento realizado" value={assessment.trainingDone} />
          <TextBlock title="Descricao detalhada do que foi feito" value={assessment.detailedDescription} />
          <TextBlock title="Problemas encontrados" value={assessment.problems} />
          <TextBlock title="Solucoes aplicadas" value={assessment.solutions} />
          <TextBlock title="Pendencias" value={assessment.pending} />
          <TextBlock title="Proximos passos" value={assessment.nextSteps} />
          <div className="lg:col-span-2">
            <TextBlock title="Observacoes gerais" value={assessment.notes} />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <SignaturePreview label="Assinatura do tecnico" signature={assessment.technicianSignature} />
          <SignaturePreview label="Assinatura do cliente" signature={assessment.clientSignature} />
        </div>
      </div>

      <div className="print-only">
        <PrintLayout assessment={assessment} elementId={printElementId} />
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Excluir assessoria"
        description="Este registro sera removido do banco. A acao nao podera ser desfeita."
        confirmLabel="Excluir"
        onConfirm={handleDelete}
        onClose={() => setConfirmOpen(false)}
      />
    </>
  );
}
