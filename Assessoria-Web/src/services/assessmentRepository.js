import { api } from "./api.js";
import { nextAssessmentNumber } from "../utils/ids.js";

export const assessmentRepository = {
  async list() {
    return api.request("/assessments", { auth: true });
  },

  async getById(id) {
    return api.request(`/assessments/${id}`, { auth: true });
  },

  async create(data) {
    return api.request("/assessments", {
      method: "POST",
      body: data,
      auth: true
    });
  },

  async update(id, data) {
    return api.request(`/assessments/${id}`, {
      method: "PUT",
      body: data,
      auth: true
    });
  },

  async remove(id) {
    return api.request(`/assessments/${id}`, {
      method: "DELETE",
      auth: true
    });
  },

  async duplicate(id) {
    const source = await this.getById(id);
    const assessments = await this.list();
    const payload = {
      ...source,
      id: undefined,
      number: nextAssessmentNumber(assessments),
      status: "rascunho",
      technicianSignature: "",
      clientSignature: ""
    };
    return this.create(payload);
  },

  async markPrinted(id) {
    return this.update(id, { status: "impressa" });
  }
};
