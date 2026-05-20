import { randomUUID } from "node:crypto";
import { pool } from "../../config/database.js";

function normalize(row) {
  return {
    id: row.id,
    number: row.number,
    date: row.date ? new Date(row.date).toISOString().slice(0, 10) : "",
    client: row.client_name_join || row.client || "",
    clientId: row.client_id ?? "",
    company: row.company,
    clientResponsible: row.client_responsible,
    technician: row.technician,
    visitType: row.visit_type,
    entryTime: row.entry_time ?? "",
    exitTime: row.exit_time ?? "",
    totalHours: Number(row.total_hours ?? 0),
    location: row.location ?? "",
    module: row.module,
    trainingDone: row.training_done ?? "",
    detailedDescription: row.detailed_description ?? "",
    problems: row.problems ?? "",
    solutions: row.solutions ?? "",
    pending: row.pending ?? "",
    nextSteps: row.next_steps ?? "",
    notes: row.notes ?? "",
    technicianSignature: row.technician_signature ?? "",
    clientSignature: row.client_signature ?? "",
    status: row.status,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString()
  };
}

async function findAll() {
  const [rows] = await pool.query(
    `SELECT a.*, c.name AS client_name_join
     FROM assessments a
     LEFT JOIN clients c ON c.id = a.client_id
     ORDER BY a.created_at DESC`
  );
  return rows.map(normalize);
}

async function findById(id) {
  const [rows] = await pool.query(
    `SELECT a.*, c.name AS client_name_join
     FROM assessments a
     LEFT JOIN clients c ON c.id = a.client_id
     WHERE a.id = ?
     LIMIT 1`,
    [id]
  );
  if (rows.length === 0) return null;
  return normalize(rows[0]);
}

async function create(data) {
  const id = randomUUID();
  const now = new Date();

  await pool.query(
    `INSERT INTO assessments
    (id, number, date, client, client_id, company, client_responsible, technician, visit_type, entry_time, exit_time, total_hours, location, module, training_done, detailed_description, problems, solutions, pending, next_steps, notes, technician_signature, client_signature, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.number,
      data.date,
      data.client,
      data.clientId || null,
      data.company,
      data.clientResponsible,
      data.technician,
      data.visitType,
      data.entryTime || null,
      data.exitTime || null,
      data.totalHours ?? 0,
      data.location || null,
      data.module,
      data.trainingDone || null,
      data.detailedDescription,
      data.problems || null,
      data.solutions || null,
      data.pending || null,
      data.nextSteps || null,
      data.notes || null,
      data.technicianSignature || null,
      data.clientSignature || null,
      data.status,
      now,
      now
    ]
  );

  return findById(id);
}

async function update(id, data) {
  const current = await findById(id);
  if (!current) return null;

  const nextRecord = { ...current, ...data };

  await pool.query(
    `UPDATE assessments SET
      number = ?,
      date = ?,
      client = ?,
      client_id = ?,
      company = ?,
      client_responsible = ?,
      technician = ?,
      visit_type = ?,
      entry_time = ?,
      exit_time = ?,
      total_hours = ?,
      location = ?,
      module = ?,
      training_done = ?,
      detailed_description = ?,
      problems = ?,
      solutions = ?,
      pending = ?,
      next_steps = ?,
      notes = ?,
      technician_signature = ?,
      client_signature = ?,
      status = ?,
      updated_at = ?
    WHERE id = ?`,
    [
      nextRecord.number,
      nextRecord.date,
      nextRecord.client,
      nextRecord.clientId || null,
      nextRecord.company,
      nextRecord.clientResponsible,
      nextRecord.technician,
      nextRecord.visitType,
      nextRecord.entryTime || null,
      nextRecord.exitTime || null,
      nextRecord.totalHours ?? 0,
      nextRecord.location || null,
      nextRecord.module,
      nextRecord.trainingDone || null,
      nextRecord.detailedDescription,
      nextRecord.problems || null,
      nextRecord.solutions || null,
      nextRecord.pending || null,
      nextRecord.nextSteps || null,
      nextRecord.notes || null,
      nextRecord.technicianSignature || null,
      nextRecord.clientSignature || null,
      nextRecord.status,
      new Date(),
      id
    ]
  );

  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query("DELETE FROM assessments WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

export const assessmentRepository = { findAll, findById, create, update, remove };
