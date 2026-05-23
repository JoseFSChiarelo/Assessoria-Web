import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { formatDate, formatVisitType } from "../utils/formatters.js";
import { formatDuration } from "../utils/time.js";
import { Button } from "./Button.jsx";
import { StatusBadge } from "./StatusBadge.jsx";

const rowVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.98 },
};

const columns = ["Numero", "Data", "Cliente", "Tecnico", "Tipo", "Horas", "Status", ""];

export function AssessmentTable({
  assessments,
  pageSize = 8,
  showPagination = true,
  emptyMessage = "Nenhuma assessoria encontrada.",
}) {
  const [page, setPage] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const pageCount = Math.max(1, Math.ceil(assessments.length / pageSize));
  const expand = () => setIsExpanded(true);
  const collapse = () => setIsExpanded(false);

  useEffect(() => {
    setPage(1);
  }, [assessments.length, pageSize]);

  const visibleAssessments = useMemo(() => {
    if (!showPagination) return assessments.slice(0, pageSize);
    const start = (page - 1) * pageSize;
    return assessments.slice(start, start + pageSize);
  }, [assessments, page, pageSize, showPagination]);

  return (
    <section
      className={`relative overflow-visible rounded-lg border border-zinc-200 bg-white shadow-soft dark:border-zinc-800 dark:bg-zinc-900 ${
        isExpanded ? "" : "mb-24"
      }`}
    >
      <div className="flex items-center justify-end border-b border-zinc-200 px-4 py-2 dark:border-zinc-800">
        <Button type="button" variant="secondary" size="sm" onClick={isExpanded ? collapse : expand}>
          {isExpanded ? "Recolher" : "Expandir"}
        </Button>
      </div>

      <div
        className={`overflow-x-auto border-b border-zinc-200 dark:border-zinc-800 ${
          isExpanded ? "" : "cursor-pointer"
        }`}
        onClick={!isExpanded ? expand : undefined}
      >
        <table className="min-w-full">
          <thead className="bg-zinc-50 dark:bg-zinc-800">
            <tr>
              {columns.map((heading) => (
                <th
                  key={heading || "actions"}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
        </table>
      </div>

      <div className="overflow-x-auto">
        <AnimatePresence initial={false} mode="wait">
          {isExpanded ? (
            <motion.div
              key="expanded-table"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <table className="min-w-full">
                <motion.tbody
                  layout
                  className="divide-y divide-zinc-100 bg-white dark:divide-zinc-800 dark:bg-zinc-900"
                >
                  <AnimatePresence initial={false}>
                    {visibleAssessments.map((assessment, index) => (
                      <motion.tr
                        key={assessment.id}
                        layout
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.18 + index * 0.03 }}
                        className="hover:bg-zinc-50 dark:hover:bg-zinc-800/70"
                      >
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
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </motion.tbody>
              </table>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <AnimatePresence initial={false}>
        {!isExpanded ? (
          <motion.div
            key="collapsed-stack"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-x-0 top-full z-20 mx-auto mt-3 w-full max-w-xl cursor-pointer px-4"
            onClick={expand}
          >
            <div className="relative mx-auto h-24 w-full">
              <motion.div
                className="absolute left-0 right-0 top-0 mx-auto h-16 w-[92%] rounded-2xl bg-zinc-300/70 dark:bg-zinc-700/70"
                initial={{ y: 0, scale: 1 }}
                animate={{ y: -10, scale: 0.94 }}
                transition={{ duration: 0.25 }}
              />
              <motion.div
                className="absolute left-0 right-0 top-0 mx-auto h-16 w-[96%] rounded-2xl bg-zinc-200/80 dark:bg-zinc-600/80"
                initial={{ y: 0, scale: 1 }}
                animate={{ y: -5, scale: 0.97 }}
                transition={{ duration: 0.25, delay: 0.03 }}
              />
              <motion.div
                className="absolute left-0 right-0 top-0 mx-auto h-16 w-full rounded-2xl bg-white shadow dark:bg-zinc-800"
                initial={{ y: 0, scale: 1 }}
                animate={{ y: 0, scale: 1 }}
                transition={{ duration: 0.25, delay: 0.06 }}
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {!visibleAssessments.length && isExpanded ? (
        <div className="px-4 py-12 text-center">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">{emptyMessage}</p>
        </div>
      ) : null}

      {showPagination && assessments.length > pageSize && isExpanded ? (
        <div className="flex flex-col gap-3 border-t border-zinc-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Pagina {page} de {pageCount} · {assessments.length} registros
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
              Proxima
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
