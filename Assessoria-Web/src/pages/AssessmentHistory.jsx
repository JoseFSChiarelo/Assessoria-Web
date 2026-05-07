import { ArrowDownWideNarrow, ArrowUpWideNarrow, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AssessmentTable } from "../components/AssessmentTable.jsx";
import { Button } from "../components/Button.jsx";
import { FilterBar } from "../components/FilterBar.jsx";
import { useAssessments } from "../hooks/useAssessments.js";
import {
  applyAssessmentFilters,
  sortAssessmentsByDate,
  uniqueValues,
} from "../utils/filters.js";

const initialFilters = {
  search: "",
  client: "",
  technician: "",
  dateFrom: "",
  dateTo: "",
  status: "",
  visitType: "",
};

export function AssessmentHistory() {
  const { assessments, loading } = useAssessments();
  const [filters, setFilters] = useState(initialFilters);
  const [sortDirection, setSortDirection] = useState("desc");

  const clients = useMemo(() => uniqueValues(assessments, "client"), [assessments]);
  const technicians = useMemo(
    () => uniqueValues(assessments, "technician"),
    [assessments],
  );

  const filteredAssessments = useMemo(
    () =>
      sortAssessmentsByDate(
        applyAssessmentFilters(assessments, filters),
        sortDirection,
      ),
    [assessments, filters, sortDirection],
  );

  if (loading) {
    return <div className="rounded-lg bg-white p-6 text-zinc-600">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-zinc-950">Todas as assessorias</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Busque, filtre e ordene os atendimentos registrados.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              setSortDirection((current) => (current === "desc" ? "asc" : "desc"))
            }
          >
            {sortDirection === "desc" ? (
              <ArrowDownWideNarrow size={18} />
            ) : (
              <ArrowUpWideNarrow size={18} />
            )}
            Data {sortDirection === "desc" ? "mais recente" : "mais antiga"}
          </Button>
          <Button as={Link} to="/assessorias/nova">
            <Plus size={18} />
            Nova assessoria
          </Button>
        </div>
      </div>

      <FilterBar
        filters={filters}
        onChange={setFilters}
        clients={clients}
        technicians={technicians}
      />

      <AssessmentTable assessments={filteredAssessments} pageSize={10} />
    </div>
  );
}
