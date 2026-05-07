import toast from "react-hot-toast";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AssessmentForm } from "../components/AssessmentForm.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useAssessments } from "../hooks/useAssessments.js";
import { nextAssessmentNumber } from "../utils/ids.js";

function getCurrentTimeHHMM() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

export function AssessmentCreate() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { assessments, loading, createAssessment } = useAssessments();

  const initialData = useMemo(() => {
    const prefill = location.state?.prefill || {};
    return {
      technician: user?.name || "",
      entryTime: prefill.entryTime || getCurrentTimeHHMM(),
      ...prefill,
    };
  }, [location.state, user?.name]);

  const handleSubmit = async (data) => {
    try {
      const created = await createAssessment(data);
      toast.success(
        data.status === "rascunho"
          ? "Rascunho salvo com sucesso."
          : "Assessoria salva com sucesso."
      );
      navigate(`/assessorias/${created.id}`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  if (loading) {
    return <div className="rounded-lg bg-white p-6 text-zinc-600">Carregando...</div>;
  }

  return (
    <AssessmentForm
      initialData={initialData}
      nextNumber={nextAssessmentNumber(assessments)}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      wizardModal
    />
  );
}
