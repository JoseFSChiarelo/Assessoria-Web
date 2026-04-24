import { mockAssessments } from "../data/mockAssessments.js";
import { createId, nextAssessmentNumber } from "../utils/ids.js";

const STORAGE_KEY = "assessoria_web_records_v1";

function getStorage() {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

function readAssessments() {
  const storage = getStorage();
  if (!storage) return [];

  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAssessments(assessments) {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(STORAGE_KEY, JSON.stringify(assessments));
}

function ensureSeedData() {
  const storage = getStorage();
  if (!storage) return;

  if (!storage.getItem(STORAGE_KEY)) {
    writeAssessments(mockAssessments);
  }
}

function withTimestamps(data, existing) {
  const now = new Date().toISOString();
  return {
    ...data,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };
}

export const assessmentRepository = {
  list() {
    ensureSeedData();
    return readAssessments();
  },

  getById(id) {
    return this.list().find((assessment) => assessment.id === id) || null;
  },

  create(data) {
    const assessments = this.list();
    const assessment = withTimestamps({
      ...data,
      id: createId(),
      number: data.number || nextAssessmentNumber(assessments),
    });

    writeAssessments([assessment, ...assessments]);
    return assessment;
  },

  update(id, data) {
    const assessments = this.list();
    const existing = assessments.find((assessment) => assessment.id === id);
    const updated = withTimestamps({ ...existing, ...data, id }, existing);
    const next = assessments.map((assessment) =>
      assessment.id === id ? updated : assessment,
    );

    writeAssessments(next);
    return updated;
  },

  remove(id) {
    const assessments = this.list().filter((assessment) => assessment.id !== id);
    writeAssessments(assessments);
  },

  duplicate(id) {
    const assessments = this.list();
    const source = assessments.find((assessment) => assessment.id === id);

    if (!source) return null;

    const duplicated = withTimestamps({
      ...source,
      id: createId(),
      number: nextAssessmentNumber(assessments),
      status: "rascunho",
      technicianSignature: "",
      clientSignature: "",
    });

    writeAssessments([duplicated, ...assessments]);
    return duplicated;
  },

  markPrinted(id) {
    return this.update(id, { status: "impressa" });
  },
};
