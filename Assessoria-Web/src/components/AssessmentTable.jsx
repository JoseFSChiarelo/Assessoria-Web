import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { formatDate, formatVisitType } from "../utils/formatters.js";
import { formatDuration } from "../utils/time.js";
import { Button } from "./Button.jsx";
import { StatusBadge } from "./StatusBadge.jsx";

export function AssessmentTable({
  assessments,
  pageSize = 8,
  showPagination = true,
  emptyMessage = "Nenhuma assessoria encontrada.",
}) {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(assessments.length / pageSize));

  useEffect(() => {
    setPage(1);
  }, [assessments.length, pageSize]);

  const visibleAssessments = useMemo(() => {
    if (!showPagination) return assessments.slice(0, pageSize);
    const start = (page - 1) * pageSize;
    return assessments.slice(start, start + pageSize);
  }, [assessments, page, pageSize, showPagination]);

  return (
    <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-soft dark:border-zinc-800 dark:bg-zinc-900">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
          <thead className="bg-zinc-50 dark:bg-zinc-800">
            <tr>
              {["Número", "Data", "Cliente", "Técnico", "Tipo", "Horas", "Status", ""].map(
                (heading) => (
                  <th
                    key={heading}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400"
                  >
                    {heading}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 bg-white dark:divide-zinc-800 dark:bg-zinc-900">
            {visibleAssessments.map((assessment) => (
              <tr key={assessment.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/70">
                <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-zinc-950 dark:text-zinc-100">
                  {assessment.number}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-sm text-zinc-600 dark:text-zinc-300">
                  {formatDate(assessment.date)}
                </td>
                <td className="min-w-52 px-4 py-4">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {assessment.client}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {assessment.company}
                  </p>
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-sm text-zinc-600 dark:text-zinc-300">
                  {assessment.technician}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-sm text-zinc-600 dark:text-zinc-300">
                  {formatVisitType(assessment.visitType)}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {formatDuration(assessment.totalHours)}
                </td>
                <td className="whitespace-nowrap px-4 py-4">
                  <StatusBadge status={assessment.status} />
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-right">
                  <Button as={Link} to={`/assessorias/${assessment.id}`} variant="ghost">
                    <Eye size={16} />
                    Ver
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!visibleAssessments.length ? (
        <div className="px-4 py-12 text-center">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">{emptyMessage}</p>
        </div>
      ) : null}

      {showPagination && assessments.length > pageSize ? (
        <div className="flex flex-col gap-3 border-t border-zinc-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Página {page} de {pageCount} · {assessments.length} registros
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              <ChevronLeft size={16} />
              Anterior
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={page === pageCount}
              onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
            >
              Próxima
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
