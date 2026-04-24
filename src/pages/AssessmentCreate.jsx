import toast from "react-hot-toast";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AssessmentForm } from "../components/AssessmentForm.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useAssessments } from "../hooks/useAssessments.js";
import { nextAssessmentNumber } from "../utils/ids.js";

export function AssessmentCreate() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { assessments, loading, createAssessment } = useAssessments();
  const initialData = useMemo(
    () => ({
      technician: user?.name || "",
    }),
    [user?.name],
  );

  const handleSubmit = (data) => {
    const created = createAssessment(data);
    toast.success(
      data.status === "rascunho"
        ? "Rascunho salvo com sucesso."
        : "Assessoria salva com sucesso.",
    );
    navigate(`/assessorias/${created.id}`);
  };

  if (loading) {
    return <div className="rounded-lg bg-white p-6 text-zinc-600">Carregando...</div>;
  }

  return (
    <AssessmentForm
      initialData={initialData}
      nextNumber={nextAssessmentNumber(assessments)}
      onSubmit={handleSubmit}
    />
  );
}
