import { ArrowDownWideNarrow, ArrowUpWideNarrow, Plus, Printer } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { AssessmentTable } from "../components/AssessmentTable.jsx";
import { Button } from "../components/Button.jsx";
import { FilterBar } from "../components/FilterBar.jsx";
import { BatchPrintLayout } from "../components/PrintLayout.jsx";
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
  const { assessments, loading, markManyPrinted } = useAssessments();
  const [filters, setFilters] = useState(initialFilters);
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedIds, setSelectedIds] = useState([]);
  const batchPrintElementId = "batch-print-layout";

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
  const selectedAssessments = useMemo(() => {
    const assessmentsById = new Map(
      assessments.map((assessment) => [assessment.id, assessment])
    );
    return selectedIds
      .map((id) => assessmentsById.get(id))
      .filter(Boolean);
  }, [assessments, selectedIds]);

  const toggleSelection = (id) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id]
    );
  };

  const toggleVisibleSelection = (ids, shouldSelect) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      ids.forEach((id) => {
        if (shouldSelect) {
          next.add(id);
        } else {
          next.delete(id);
        }
      });
      return Array.from(next);
    });
  };

  const handlePrintSelected = () => {
    if (!selectedAssessments.length) {
      toast.error("Selecione ao menos uma assessoria para imprimir.");
      return;
    }

    const idsToMark = selectedAssessments.map((assessment) => assessment.id);
    toast.dismiss();
    window.addEventListener(
      "afterprint",
      async () => {
        try {
          await markManyPrinted(idsToMark);
          setSelectedIds([]);
          toast.success(`${idsToMark.length} assessoria(s) marcada(s) como impressa(s).`);
        } catch (error) {
          toast.error(error.message);
        }
      },
      { once: true }
    );
    window.print();
  };

  if (loading) {
    return <div className="rounded-lg bg-white p-6 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">Carregando...</div>;
  }

  return (
    <>
    <div className="space-y-6 no-print">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-zinc-950 dark:text-zinc-100">Todas as assessorias</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Busque, filtre e ordene os atendimentos registrados.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            disabled={!selectedAssessments.length}
            onClick={handlePrintSelected}
          >
            <Printer size={18} />
            Imprimir selecionadas ({selectedAssessments.length})
          </Button>
          {selectedAssessments.length ? (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setSelectedIds([])}
            >
              Limpar seleção
            </Button>
          ) : null}
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

      <AssessmentTable
        assessments={filteredAssessments}
        pageSize={10}
        selectable
        selectedIds={selectedIds}
        onToggleSelection={toggleSelection}
        onToggleVisibleSelection={toggleVisibleSelection}
      />
    </div>
    {selectedAssessments.length ? (
      <div className="print-only">
        <BatchPrintLayout
          assessments={selectedAssessments}
          elementId={batchPrintElementId}
        />
      </div>
    ) : null}
    </>
  );
}
