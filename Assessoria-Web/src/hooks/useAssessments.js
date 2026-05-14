import { useCallback, useEffect, useState } from "react";
import { assessmentRepository } from "../services/assessmentRepository.js";

export function useAssessments() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await assessmentRepository.list();
    setAssessments(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh().catch(() => setLoading(false));
  }, [refresh]);

  const createAssessment = useCallback(
    async (data) => {
      const created = await assessmentRepository.create(data);
      await refresh();
      return created;
    },
    [refresh]
  );

  const updateAssessment = useCallback(
    async (id, data) => {
      const updated = await assessmentRepository.update(id, data);
      await refresh();
      return updated;
    },
    [refresh]
  );

  const removeAssessment = useCallback(
    async (id) => {
      await assessmentRepository.remove(id);
      await refresh();
    },
    [refresh]
  );

  const duplicateAssessment = useCallback(
    async (id) => {
      const duplicated = await assessmentRepository.duplicate(id);
      await refresh();
      return duplicated;
    },
    [refresh]
  );

  const markPrinted = useCallback(
    async (id) => {
      const updated = await assessmentRepository.markPrinted(id);
      await refresh();
      return updated;
    },
    [refresh]
  );

  return {
    assessments,
    loading,
    refresh,
    createAssessment,
    updateAssessment,
    removeAssessment,
    duplicateAssessment,
    markPrinted
  };
}
