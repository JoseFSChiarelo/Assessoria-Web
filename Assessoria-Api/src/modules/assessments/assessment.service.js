import { assessmentRepository } from "./assessment.repository.js";
import { ApiError } from "../../utils/api-error.js";
import { pool } from "../../config/database.js";

async function list() {
  return assessmentRepository.findAll();
}

async function getById(id) {
  const item = await assessmentRepository.findById(id);
  if (!item) throw new ApiError(404, "Assessoria nao encontrada");
  return item;
}

async function create(data) {
  await ensureClientExists(data.clientId);
  return assessmentRepository.create(data);
}

async function update(id, data) {
  if (Object.prototype.hasOwnProperty.call(data, "clientId")) {
    await ensureClientExists(data.clientId);
  }

  const updated = await assessmentRepository.update(id, data);
  if (!updated) throw new ApiError(404, "Assessoria nao encontrada");
  return updated;
}

async function remove(id) {
  const deleted = await assessmentRepository.remove(id);
  if (!deleted) throw new ApiError(404, "Assessoria nao encontrada");
}

export const assessmentService = { list, getById, create, update, remove };

async function ensureClientExists(clientId) {
  if (!clientId) return;

  const [rows] = await pool.query("SELECT id FROM clients WHERE id = ? LIMIT 1", [clientId]);
  if (rows.length === 0) {
    throw new ApiError(400, "Cliente informado nao existe");
  }
}
