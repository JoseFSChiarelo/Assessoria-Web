import { useCallback, useEffect, useState } from "react";
import { assessmentRepository } from "../services/assessmentRepository.js";

export function useAssessments() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setAssessments(assessmentRepository.list());
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createAssessment = useCallback(
    (data) => {
      const created = assessmentRepository.create(data);
      refresh();
      return created;
    },
    [refresh],
  );

  const updateAssessment = useCallback(
    (id, data) => {
      const updated = assessmentRepository.update(id, data);
      refresh();
      return updated;
    },
    [refresh],
  );

  const removeAssessment = useCallback(
    (id) => {
      assessmentRepository.remove(id);
      refresh();
    },
    [refresh],
  );

  const duplicateAssessment = useCallback(
    (id) => {
      const duplicated = assessmentRepository.duplicate(id);
      refresh();
      return duplicated;
    },
    [refresh],
  );

  const markPrinted = useCallback(
    (id) => {
      const updated = assessmentRepository.markPrinted(id);
      refresh();
      return updated;
    },
    [refresh],
  );

  return {
    assessments,
    loading,
    refresh,
    createAssessment,
    updateAssessment,
    removeAssessment,
    duplicateAssessment,
    markPrinted,
  };
}
