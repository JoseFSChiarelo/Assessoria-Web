import { statusOptions, visitTypes } from "../data/options.js";

export function formatDate(date) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(
    new Date(`${date}T00:00:00Z`),
  );
}

export function formatDateTime(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatCurrencyNumber(value) {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

export function labelFromOptions(options, value) {
  return options.find((item) => item.value === value)?.label || value || "-";
}

export function formatStatus(value) {
  return labelFromOptions(statusOptions, value);
}

export function formatVisitType(value) {
  return labelFromOptions(visitTypes, value);
}
