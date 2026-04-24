import { Save, Send } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { statusOptions, systemModules, visitTypes } from "../data/options.js";
import { calculateTotalHours, formatDuration } from "../utils/time.js";
import { Button } from "./Button.jsx";
import { SignatureBlock } from "./SignatureBlock.jsx";

const fieldClass =
  "mt-1 h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

const textareaClass =
  "mt-1 min-h-28 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

function today() {
  return new Date().toISOString().slice(0, 10);
}

function emptyAssessment(number) {
  return {
    number: number || "",
    date: today(),
    client: "",
    company: "",
    clientResponsible: "",
    technician: "",
    visitType: "implantacao",
    entryTime: "",
    exitTime: "",
    totalHours: 0,
    location: "",
    module: "",
    trainingDone: "",
    detailedDescription: "",
    problems: "",
    solutions: "",
    pending: "",
    nextSteps: "",
    notes: "",
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
    number: "Informe o número da assessoria.",
    date: "Informe a data.",
    client: "Informe o cliente.",
    company: "Informe a empresa.",
    clientResponsible: "Informe o responsável no cliente.",
    technician: "Informe o técnico responsável.",
    visitType: "Informe o tipo de atendimento.",
    entryTime: "Informe o horário de entrada.",
    exitTime: "Informe o horário de saída.",
    module: "Informe o módulo ou sistema abordado.",
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
      <span className="text-sm font-medium text-zinc-700">{label}</span>
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
    <section className="border-b border-zinc-200 p-5 last:border-b-0 sm:p-6">
      <div className="mb-5 max-w-3xl">
        <h2 className="text-lg font-semibold text-zinc-950">{title}</h2>
        {description ? <p className="mt-1 text-sm text-zinc-500">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function AssessmentForm({ initialData, nextNumber, onSubmit }) {
  const [form, setForm] = useState(() => normalizeInitialData(initialData, nextNumber));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(normalizeInitialData(initialData, nextNumber));
  }, [initialData, nextNumber]);

  const totalHours = useMemo(
    () => calculateTotalHours(form.entryTime, form.exitTime),
    [form.entryTime, form.exitTime],
  );

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

  const submit = (targetStatus) => {
    const strict = targetStatus !== "rascunho";
    const validationErrors = validate(form, strict);

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      toast.error("Revise os campos obrigatórios.");
      return;
    }

    const signed =
      Boolean(form.technicianSignature) && Boolean(form.clientSignature);
    const status = targetStatus === "rascunho" ? "rascunho" : signed ? "assinada" : targetStatus;

    onSubmit({
      ...form,
      totalHours,
      status,
    });
  };

  return (
    <form className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-soft">
      <Section
        title="Dados gerais"
        description="Identificação da assessoria, cliente, empresa e responsável."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Input
            label="Número da assessoria"
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
            label="Cliente"
            value={form.client}
            onChange={(event) => updateField("client", event.target.value)}
            error={errors.client}
            placeholder="Nome do cliente"
          />
          <Input
            label="Empresa"
            value={form.company}
            onChange={(event) => updateField("company", event.target.value)}
            error={errors.company}
            placeholder="Razão social ou unidade"
          />
          <Input
            label="Responsável no cliente"
            value={form.clientResponsible}
            onChange={(event) => updateField("clientResponsible", event.target.value)}
            error={errors.clientResponsible}
            placeholder="Nome do responsável"
          />
          <Input
            label="Técnico responsável"
            value={form.technician}
            onChange={(event) => updateField("technician", event.target.value)}
            error={errors.technician}
            placeholder="Nome do técnico"
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
          <Select
            label="Status"
            value={form.status}
            onChange={(event) => updateField("status", event.target.value)}
          >
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </Select>
        </div>
      </Section>

      <Section
        title="Horários e local"
        description="O total de horas é calculado automaticamente pela entrada e saída."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <Input
            label="Horário de entrada"
            type="time"
            value={form.entryTime}
            onChange={(event) => updateField("entryTime", event.target.value)}
            error={errors.entryTime}
          />
          <Input
            label="Horário de saída"
            type="time"
            value={form.exitTime}
            onChange={(event) => updateField("exitTime", event.target.value)}
            error={errors.exitTime}
          />
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
            <span className="text-sm font-medium text-zinc-500">Total calculado</span>
            <strong className="mt-2 block text-2xl font-semibold text-zinc-950">
              {formatDuration(totalHours)}
            </strong>
          </div>
          <Input
            label="Local da visita"
            value={form.location}
            onChange={(event) => updateField("location", event.target.value)}
            placeholder="Cidade, unidade ou endereço"
          />
          <Field label="Módulo/Sistema abordado" error={errors.module}>
            <input
              className={fieldClass}
              list="system-modules"
              value={form.module}
              onChange={(event) => updateField("module", event.target.value)}
              placeholder="Selecione ou digite"
            />
            <datalist id="system-modules">
              {systemModules.map((module) => (
                <option key={module} value={module} />
              ))}
            </datalist>
          </Field>
        </div>
      </Section>

      <Section
        title="Conteúdo da visita"
        description="Registre o que foi realizado, treinamentos, problemas e soluções."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <Textarea
            label="Treinamento realizado"
            value={form.trainingDone}
            onChange={(event) => updateField("trainingDone", event.target.value)}
            placeholder="Treinamentos passados ao cliente"
          />
          <Textarea
            label="Descrição detalhada do que foi feito"
            value={form.detailedDescription}
            onChange={(event) => updateField("detailedDescription", event.target.value)}
            error={errors.detailedDescription}
            placeholder="Atividades executadas durante a visita"
          />
          <Textarea
            label="Problemas encontrados"
            value={form.problems}
            onChange={(event) => updateField("problems", event.target.value)}
            placeholder="Dificuldades, falhas ou bloqueios identificados"
          />
          <Textarea
            label="Soluções aplicadas"
            value={form.solutions}
            onChange={(event) => updateField("solutions", event.target.value)}
            placeholder="Correções, parametrizações ou orientações"
          />
          <Textarea
            label="Pendências"
            value={form.pending}
            onChange={(event) => updateField("pending", event.target.value)}
            placeholder="Itens que dependem do cliente ou da equipe"
          />
          <Textarea
            label="Próximos passos"
            value={form.nextSteps}
            onChange={(event) => updateField("nextSteps", event.target.value)}
            placeholder="Plano para continuidade"
          />
          <div className="lg:col-span-2">
            <Textarea
              label="Observações gerais"
              value={form.notes}
              onChange={(event) => updateField("notes", event.target.value)}
              placeholder="Informações complementares"
            />
          </div>
        </div>
      </Section>

      <Section
        title="Assinaturas"
        description="Use mouse, touchpad ou toque na tela para coletar as assinaturas."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <SignatureBlock
            label="Assinatura do técnico"
            helper="Confirmação da equipe responsável pelo atendimento."
            value={form.technicianSignature}
            onChange={(value) => updateField("technicianSignature", value)}
          />
          <SignatureBlock
            label="Assinatura do cliente"
            helper="Confirmação do responsável no cliente."
            value={form.clientSignature}
            onChange={(value) => updateField("clientSignature", value)}
          />
        </div>
      </Section>

      <div className="flex flex-col gap-3 border-t border-zinc-200 bg-zinc-50 p-5 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={() => submit("rascunho")}>
          <Save size={18} />
          Salvar rascunho
        </Button>
        <Button type="button" onClick={() => submit("finalizada")}>
          <Send size={18} />
          Finalizar atendimento
        </Button>
      </div>
    </form>
  );
}
