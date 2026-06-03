import Logo from "../assets/logo-pequena.png";
import { formatDate, formatVisitType } from "../utils/formatters.js";
import { formatDuration } from "../utils/time.js";

function hasText(value) {
  return Boolean(String(value || "").trim());
}

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

function TextSection({ title, value }) {
  return (
    <div className="print-section">
      <p className="font-bold uppercase text-zinc-700">{title}</p>
      <div className="mt-1 min-h-[16mm] whitespace-pre-wrap break-words border border-zinc-300 p-1.5 text-[9px] leading-4">
        {value}
      </div>
    </div>
  );
}

function Copy({ assessment, copyLabel }) {
  const problemsAndSolutions = [assessment.problems, assessment.solutions]
    .filter(hasText)
    .join("\n\n");
  const pendingAndNextSteps = [assessment.pending, assessment.nextSteps]
    .filter(hasText)
    .join("\n\n");
  const sections = [
    {
      title: "Descrição do atendimento",
      value: assessment.detailedDescription
    },
    {
      title: "Problemas e soluções",
      value: problemsAndSolutions
    },
    {
      title: "Pendências e próximos passos",
      value: pendingAndNextSteps
    }
  ].filter((section) => hasText(section.value));

  return (
    <section className="assessment-copy flex flex-col border border-zinc-900 p-[5mm]">
      <header className="print-section flex items-start justify-between gap-4 border-b border-zinc-900 pb-2">
        <div className="flex items-center gap-3">
          <img src={Logo} alt="Assessoria Web" className="h-10 w-10" />
          <div>
            <h2 className="text-sm font-bold uppercase text-zinc-950">
              Ficha de Assessoria
            </h2>
            <p className="text-[10px] text-zinc-600">{copyLabel}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-semibold uppercase text-zinc-500">Número</p>
          <p className="text-sm font-bold text-zinc-950">{assessment.number}</p>
        </div>
      </header>

      <dl className="print-section mt-3 grid grid-cols-4 gap-x-3 gap-y-2">
        <Field label="Data" value={formatDate(assessment.date)} />
        <Field label="Tipo" value={formatVisitType(assessment.visitType)} />
        <Field label="Entrada" value={assessment.entryTime} />
        <Field label="Saída" value={assessment.exitTime} />
        <Field label="Empresa" value={assessment.company} wide />
        <Field label="Responsável" value={assessment.clientResponsible} wide />
        <Field label="Técnico" value={assessment.technician} wide />
        <Field label="Total de horas" value={formatDuration(assessment.totalHours)} />
      </dl>

      {sections.length > 0 ? (
        <div className="mt-3 flex flex-col gap-3 text-[7px] leading-4">
          {sections.map((section) => (
            <TextSection
              key={section.title}
              title={section.title}
              value={section.value}
            />
          ))}
        </div>
      ) : null}

      <div className="signature-block grid grid-cols-2 gap-10 pt-4">
        <SignatureLine label="Assinatura do técnico" signature={assessment.technicianSignature} />
        <SignatureLine label="Assinatura do cliente" signature={assessment.clientSignature} />
      </div>
    </section>
  );
}

export function PrintLayout({ assessment, elementId }) {
  return (
    <div id={elementId} className="print-sheet bg-white p-[8mm] text-zinc-950">
      <Copy assessment={assessment} copyLabel="Via única" />
    </div>
  );
}

export function BatchPrintLayout({ assessments, elementId }) {
  return (
    <div id={elementId} className="print-sheet bg-white p-[8mm] text-zinc-950">
      {assessments.map((assessment) => (
        <div key={assessment.id} className="print-page">
          <Copy assessment={assessment} copyLabel="Via única" />
        </div>
      ))}
    </div>
  );
}
