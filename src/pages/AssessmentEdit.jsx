import toast from "react-hot-toast";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { AssessmentForm } from "../components/AssessmentForm.jsx";
import { Button } from "../components/Button.jsx";
import { useAssessments } from "../hooks/useAssessments.js";

export function AssessmentEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { assessments, loading, updateAssessment } = useAssessments();
  const assessment = assessments.find((item) => item.id === id);

  const handleSubmit = async (data) => {
    try {
      const updated = await updateAssessment(id, data);
      toast.success(
        data.status === "rascunho"
          ? "Rascunho atualizado com sucesso."
          : "Assessoria atualizada com sucesso."
      );
      navigate(`/assessorias/${updated.id}`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return <div className="rounded-lg bg-white p-6 text-zinc-600">Carregando...</div>;
  }

  if (!assessment) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button as={Link} to={`/assessorias/${assessment.id}`} variant="secondary">
          Voltar para visualização
        </Button>
      </div>
      <AssessmentForm initialData={assessment} onSubmit={handleSubmit} />
    </div>
  );
}
