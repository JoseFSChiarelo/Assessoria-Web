import brandMark from "../assets/brand-mark.svg";
import { formatDate, formatVisitType } from "../utils/formatters.js";
import { formatDuration } from "../utils/time.js";

function Field({ label, value, wide = false }) {
  return (
    <div className={wide ? "col-span-2" : ""}>
      <dt className="text-[9px] font-semibold uppercase text-zinc-500">{label}</dt>
      <dd className="mt-0.5 min-h-4 border-b border-zinc-300 pb-0.5 text-[10px] leading-4 text-zinc-950">
        {value || "-"}
      </dd>
    </div>
  );
}

function SignatureLine({ label, signature }) {
  return (
    <div>
      <div className="flex h-12 items-center justify-center border-b border-zinc-900">
        {signature ? (
          <img src={signature} alt={label} className="max-h-10 max-w-full object-contain" />
        ) : null}
      </div>
      <p className="mt-1 text-center text-[9px] font-semibold text-zinc-700">{label}</p>
    </div>
  );
}

function Copy({ assessment, copyLabel }) {
  return (
    <section className="flex h-[134mm] flex-col overflow-hidden border border-zinc-900 p-[5mm]">
      <header className="flex items-start justify-between gap-4 border-b border-zinc-900 pb-2">
        <div className="flex items-center gap-3">
          <img src={brandMark} alt="Assessoria Web" className="h-10 w-10" />
          <div>
            <h2 className="text-sm font-bold uppercase text-zinc-950">
              Ficha de Assessoria Técnica
            </h2>
            <p className="text-[10px] text-zinc-600">{copyLabel}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-semibold uppercase text-zinc-500">Número</p>
          <p className="text-sm font-bold text-zinc-950">{assessment.number}</p>
        </div>
      </header>

      <dl className="mt-3 grid grid-cols-4 gap-x-3 gap-y-2">
        <Field label="Data" value={formatDate(assessment.date)} />
        <Field label="Tipo" value={formatVisitType(assessment.visitType)} />
        <Field label="Entrada" value={assessment.entryTime} />
        <Field label="Saída" value={assessment.exitTime} />
        <Field label="Cliente" value={assessment.client} wide />
        <Field label="Empresa" value={assessment.company} wide />
        <Field label="Responsável" value={assessment.clientResponsible} wide />
        <Field label="Técnico" value={assessment.technician} wide />
        <Field label="Local" value={assessment.location} wide />
        <Field label="Módulo/Sistema" value={assessment.module} />
        <Field label="Total de horas" value={formatDuration(assessment.totalHours)} />
      </dl>

      <div className="mt-3 flex flex-1 flex-col gap-3 text-[7px] leading-4">
        <div>
          <p className="font-bold uppercase text-zinc-700">Descrição do atendimento</p>
          <p className="mt-1 min-h-8 border border-zinc-300 p-1.5">
            {assessment.detailedDescription || "-"}
          </p>
        </div>
        <div>
          <p className="font-bold uppercase text-zinc-700">Problemas e soluções</p>
          <p className="mt-1 min-h-8 border border-zinc-300 p-1.5">
            {[assessment.problems, assessment.solutions].filter(Boolean).join(" | ") ||
              "-"}
          </p>
        </div>
        <div>
          <p className="font-bold uppercase text-zinc-700">Pendências e próximos passos</p>
          <p className="mt-1 min-h-8 border border-zinc-300 p-1.5">
            {[assessment.pending, assessment.nextSteps].filter(Boolean).join(" | ") ||
              "-"}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-10">
        <SignatureLine label="Assinatura do técnico" signature={assessment.technicianSignature} />
        <SignatureLine label="Assinatura do cliente" signature={assessment.clientSignature} />
      </div>
    </section>
  );
}

export function PrintLayout({ assessment, elementId }) {
  return (
    <div id={elementId} className="print-sheet bg-white p-[8mm] text-zinc-950">
      <Copy assessment={assessment} copyLabel="Via da empresa" />
      <div className="flex h-[13mm] items-center justify-center text-[9px] font-semibold uppercase text-zinc-500">
        Corte aqui · cópia para o cliente
      </div>
      <Copy assessment={assessment} copyLabel="Via do cliente" />
    </div>
  );
}
