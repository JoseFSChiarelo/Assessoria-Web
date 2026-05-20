import { Save, Send } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { visitTypes } from "../data/options.js";
import { calculateTotalHours } from "../utils/time.js";
import { Button } from "./Button.jsx";
import { SignatureBlock } from "./SignatureBlock.jsx";

const fieldClass =
  "mt-1 h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:ring-emerald-900/40";

const textareaClass =
  "mt-1 min-h-28 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:ring-emerald-900/40";

function today() {
  return new Date().toISOString().slice(0, 10);
}

function getCurrentTimeHHMM() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function emptyAssessment(number) {
  return {
    number: number || "",
    date: today(),
    company: "",
    clientResponsible: "",
    technician: "",
    visitType: "implantacao",
    entryTime: "",
    exitTime: "",
    totalHours: 0,
    location: "",
    detailedDescription: "",
    problems: "",
    pending: "",
    technicianSignature: "",
    clientSignature: "",
    status: "rascunho",
  };
}

function normalizeInitialData(initialData, nextNumber) {
  return {
    ...emptyAssessment(nextNumber),
    ...(initialData || {}),
  };
}

function validate(form, strict) {
  if (!strict) return {};

  const requiredFields = {
    number: "Informe o numero da assessoria.",
    date: "Informe a data.",
    company: "Informe a empresa.",
    clientResponsible: "Informe o responsavel no cliente.",
    technician: "Informe o tecnico responsavel.",
    visitType: "Informe o tipo de atendimento.",
    entryTime: "Informe o horario de entrada.",
    detailedDescription: "Descreva o que foi feito.",
  };

  return Object.entries(requiredFields).reduce((errors, [field, message]) => {
    if (!String(form[field] || "").trim()) {
      errors[field] = message;
    }
    return errors;
  }, {});
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs text-rose-600">{error}</span> : null}
    </label>
  );
}

function Input({ label, error, ...props }) {
  return (
    <Field label={label} error={error}>
      <input className={fieldClass} {...props} />
    </Field>
  );
}

function Select({ label, error, children, ...props }) {
  return (
    <Field label={label} error={error}>
      <select className={fieldClass} {...props}>
        {children}
      </select>
    </Field>
  );
}

function Textarea({ label, error, ...props }) {
  return (
    <Field label={label} error={error}>
      <textarea className={textareaClass} {...props} />
    </Field>
  );
}

function Section({ title, description, children }) {
  return (
    <section className="border-b border-zinc-200 p-5 last:border-b-0 sm:p-6 dark:border-zinc-800">
      <div className="mb-5 max-w-3xl">
        <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-100">{title}</h2>
        {description ? <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function AssessmentForm({ initialData, nextNumber, onSubmit, wizardModal = false, onCancel }) {
  const [form, setForm] = useState(() => normalizeInitialData(initialData, nextNumber));
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);

  useEffect(() => {
    setForm(normalizeInitialData(initialData, nextNumber));
  }, [initialData, nextNumber]);

  useEffect(() => {
    if (!wizardModal || !onCancel) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [wizardModal, onCancel]);

  const updateField = (field, value) => {
    setForm((current) => {
      const next = { ...current, [field]: value };
      if (field === "entryTime" || field === "exitTime") {
        next.totalHours = calculateTotalHours(next.entryTime, next.exitTime);
      }
      return next;
    });
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const validateStep = (currentStep) => {
    const stepRules = {
      1: {
        number: "Informe o numero da assessoria.",
        date: "Informe a data.",
        entryTime: "Informe o horario.",
        technician: "Informe o tecnico responsavel.",
        visitType: "Informe o tipo de atendimento.",
      },
      2: {
        company: "Informe a empresa.",
        clientResponsible: "Informe o responsavel do cliente.",
      },
      3: {
        detailedDescription: "Descreva o que foi feito.",
      },
      4: {},
    };

    const rules = stepRules[currentStep] || {};
    const validationErrors = Object.entries(rules).reduce((acc, [field, message]) => {
      if (!String(form[field] || "").trim()) {
        acc[field] = message;
      }
      return acc;
    }, {});

    if (Object.keys(validationErrors).length) {
      setErrors((current) => ({ ...current, ...validationErrors }));
      toast.error("Preencha os campos obrigatorios deste passo.");
      return false;
    }

    return true;
  };

  const nextStep = () => {
    if (!validateStep(step)) return;
    setStep((current) => Math.min(4, current + 1));
  };

  const submit = (targetStatus, overrides = {}) => {
    const payload = { ...form, ...overrides };
    const strict = targetStatus !== "rascunho";
    const validationErrors = validate(payload, strict);

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      toast.error("Revise os campos obrigatorios.");
      return;
    }

    const signed = Boolean(payload.technicianSignature) && Boolean(payload.clientSignature);
    const status = targetStatus === "rascunho" ? "rascunho" : signed ? "assinada" : targetStatus;
    const calculatedTotalHours = calculateTotalHours(payload.entryTime, payload.exitTime);

    onSubmit({
      ...payload,
      totalHours: calculatedTotalHours,
      status,
    });
  };

  const submitWithAutoExitTime = (targetStatus) => {
    const exitTime = getCurrentTimeHHMM();
    updateField("exitTime", exitTime);
    submit(targetStatus, { exitTime });
  };

  const formContent = (
    <form className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-soft dark:border-zinc-800 dark:bg-zinc-900">
      <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-4 sm:px-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Passo {step} de 4</p>
          {onCancel ? (
            <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
              Sair
            </Button>
          ) : null}
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-700">
          <div
            className="h-2 rounded-full bg-emerald-600 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {step === 1 ? (
        <Section
          title="Dados gerais"
          description="Identificacao da assessoria, data, horario, tecnicos e tipo."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Input
              label="Numero da assessoria"
              value={form.number}
              onChange={(event) => updateField("number", event.target.value)}
              error={errors.number}
              placeholder="AS-2026-0005"
            />
            <Input
              label="Data"
              type="date"
              value={form.date}
              onChange={(event) => updateField("date", event.target.value)}
              error={errors.date}
            />
            <Input
              label="Horario"
              type="time"
              value={form.entryTime}
              onChange={(event) => updateField("entryTime", event.target.value)}
              error={errors.entryTime}
            />
            <Input
              label="Tecnicos"
              value={form.technician}
              onChange={(event) => updateField("technician", event.target.value)}
              error={errors.technician}
              placeholder="Nome do tecnico"
            />
            <Select
              label="Tipo de atendimento"
              value={form.visitType}
              onChange={(event) => updateField("visitType", event.target.value)}
              error={errors.visitType}
            >
              {visitTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
          </div>
        </Section>
      ) : null}

      {step === 2 ? (
        <Section
          title="Dados da visita"
          description="Empresa, local da visita e responsavel do cliente."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Input
              label="Empresa"
              value={form.company}
              onChange={(event) => updateField("company", event.target.value)}
              error={errors.company}
              placeholder="Razao social ou unidade"
            />
            <Input
              label="Local da visita"
              value={form.location}
              onChange={(event) => updateField("location", event.target.value)}
              error={errors.location}
              placeholder="Cidade, unidade ou endereco"
            />
            <Input
              label="Responsavel do cliente"
              value={form.clientResponsible}
              onChange={(event) => updateField("clientResponsible", event.target.value)}
              error={errors.clientResponsible}
              placeholder="Nome do responsavel"
            />
          </div>
        </Section>
      ) : null}

      {step === 3 ? (
        <Section
          title="Conteudo da visita"
          description="Registre descricao detalhada, problemas encontrados e pendencias."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <Textarea
              label="Descricao detalhada do que foi feito"
              value={form.detailedDescription}
              onChange={(event) => updateField("detailedDescription", event.target.value)}
              error={errors.detailedDescription}
              placeholder="Atividades executadas durante a visita"
            />
            <Textarea
              label="Problemas encontrados"
              value={form.problems}
              onChange={(event) => updateField("problems", event.target.value)}
              error={errors.problems}
              placeholder="Dificuldades, falhas ou bloqueios identificados"
            />
            <Textarea
              label="Pendencias"
              value={form.pending}
              onChange={(event) => updateField("pending", event.target.value)}
              error={errors.pending}
              placeholder="Itens que dependem do cliente ou da equipe"
            />
          </div>
        </Section>
      ) : null}

      {step === 4 ? (
        <Section
          title="Assinaturas"
          description="Use mouse, touchpad ou toque na tela para coletar as assinaturas."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <SignatureBlock
              label="Assinatura do tecnico"
              helper="Confirmacao da equipe responsavel pelo atendimento."
              value={form.technicianSignature}
              onChange={(value) => updateField("technicianSignature", value)}
            />
            <SignatureBlock
              label="Assinatura do cliente"
              helper="Confirmacao do responsavel no cliente."
              value={form.clientSignature}
              onChange={(value) => updateField("clientSignature", value)}
            />
          </div>
        </Section>
      ) : null}

      <div className="flex flex-col gap-3 border-t border-zinc-200 bg-zinc-50 p-5 sm:flex-row sm:justify-end dark:border-zinc-800 dark:bg-zinc-900">
        {step > 1 ? (
          <Button type="button" variant="secondary" onClick={() => setStep((s) => Math.max(1, s - 1))}>
            Voltar
          </Button>
        ) : null}

        {step < 4 ? (
          <>
            <Button type="button" variant="secondary" onClick={() => submitWithAutoExitTime("rascunho")}>
              <Save size={18} />
              Salvar rascunho
            </Button>
            <Button type="button" onClick={nextStep}>
              Proximo
            </Button>
          </>
        ) : (
          <>
            <Button type="button" variant="secondary" onClick={() => submitWithAutoExitTime("rascunho")}>
              <Save size={18} />
              Salvar rascunho
            </Button>
            <Button type="button" onClick={() => submitWithAutoExitTime("finalizada")}>
              <Send size={18} />
              Finalizar atendimento
            </Button>
          </>
        )}
      </div>
    </form>
  );

  if (!wizardModal) {
    return formContent;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/45 p-4 dark:bg-black/70">
      <div className="max-h-[94vh] w-full max-w-6xl overflow-y-auto">{formContent}</div>
    </div>
  );
}
