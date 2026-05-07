import { assessmentService } from "./assessment.service.js";

async function list(_req, res, next) {
  try {
    const data = await assessmentService.list();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const data = await assessmentService.getById(req.params.id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const data = await assessmentService.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const data = await assessmentService.update(req.params.id, req.body);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    await assessmentService.remove(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export const assessmentController = { list, getById, create, update, remove };
