export function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

export function applyAssessmentFilters(assessments, filters = {}) {
  const search = normalizeText(filters.search);

  return assessments.filter((assessment) => {
    const searchable = normalizeText(
      [
        assessment.number,
        assessment.client,
        assessment.company,
        assessment.clientResponsible,
        assessment.technician,
        assessment.location,
        assessment.module,
        assessment.detailedDescription,
      ].join(" "),
    );

    const matchesSearch = !search || searchable.includes(search);
    const matchesClient = !filters.client || assessment.client === filters.client;
    const matchesTechnician =
      !filters.technician || assessment.technician === filters.technician;
    const matchesStatus = !filters.status || assessment.status === filters.status;
    const matchesVisitType =
      !filters.visitType || assessment.visitType === filters.visitType;
    const matchesDateFrom = !filters.dateFrom || assessment.date >= filters.dateFrom;
    const matchesDateTo = !filters.dateTo || assessment.date <= filters.dateTo;

    return (
      matchesSearch &&
      matchesClient &&
      matchesTechnician &&
      matchesStatus &&
      matchesVisitType &&
      matchesDateFrom &&
      matchesDateTo
    );
  });
}

export function sortAssessmentsByDate(assessments, direction = "desc") {
  return [...assessments].sort((a, b) => {
    const diff = new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime();
    return direction === "asc" ? diff : -diff;
  });
}

export function uniqueValues(assessments, field) {
  return [...new Set(assessments.map((item) => item[field]).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b, "pt-BR"),
  );
}
