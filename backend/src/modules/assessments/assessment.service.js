import { assessmentRepository } from "./assessment.repository.js";
import { ApiError } from "../../utils/api-error.js";

async function list() {
  return assessmentRepository.findAll();
}

async function getById(id) {
  const item = await assessmentRepository.findById(id);
  if (!item) throw new ApiError(404, "Assessoria nao encontrada");
  return item;
}

async function create(data) {
  return assessmentRepository.create(data);
}

async function update(id, data) {
  const updated = await assessmentRepository.update(id, data);
  if (!updated) throw new ApiError(404, "Assessoria nao encontrada");
  return updated;
}

async function remove(id) {
  const deleted = await assessmentRepository.remove(id);
  if (!deleted) throw new ApiError(404, "Assessoria nao encontrada");
}

export const assessmentService = { list, getById, create, update, remove };
