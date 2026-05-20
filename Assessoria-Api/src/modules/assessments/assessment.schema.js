import { z } from "zod";

const optionalClientId = z.preprocess(
  (value) => {
    if (value === "") return undefined;
    return value;
  },
  z.string().uuid("Cliente invalido").optional()
);

const assessmentBody = z.object({
  number: z.string().min(1, "Numero obrigatorio"),
  date: z.string().min(1, "Data obrigatoria"),
  client: z.string().min(1, "Cliente obrigatorio"),
  clientId: optionalClientId,
  company: z.string().min(1, "Empresa obrigatoria"),
  clientResponsible: z.string().min(1, "Responsavel obrigatorio"),
  technician: z.string().min(1, "Tecnico obrigatorio"),
  visitType: z.string().min(1, "Tipo de atendimento obrigatorio"),
  entryTime: z.string().optional().default(""),
  exitTime: z.string().optional().default(""),
  totalHours: z.coerce.number().optional().default(0),
  location: z.string().optional().default(""),
  module: z.string().min(1, "Modulo obrigatorio"),
  trainingDone: z.string().optional().default(""),
  detailedDescription: z.string().min(1, "Descricao obrigatoria"),
  problems: z.string().optional().default(""),
  solutions: z.string().optional().default(""),
  pending: z.string().optional().default(""),
  nextSteps: z.string().optional().default(""),
  notes: z.string().max(2000).optional().default(""),
  technicianSignature: z.string().optional().default(""),
  clientSignature: z.string().optional().default(""),
  status: z.enum(["rascunho", "finalizada", "assinada", "impressa"]).default("rascunho")
});

const createAssessmentSchema = z.object({
  body: assessmentBody,
  params: z.object({}).optional().default({}),
  query: z.object({}).optional().default({})
});

const updateAssessmentSchema = z.object({
  body: assessmentBody.partial(),
  params: z.object({
    id: z.string().uuid("ID invalido")
  }),
  query: z.object({}).optional().default({})
});

const getByIdSchema = z.object({
  body: z.object({}).optional().default({}),
  params: z.object({
    id: z.string().uuid("ID invalido")
  }),
  query: z.object({}).optional().default({})
});

export { createAssessmentSchema, updateAssessmentSchema, getByIdSchema };
