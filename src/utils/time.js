export function calculateTotalHours(entryTime, exitTime) {
  if (!entryTime || !exitTime) return 0;

  const [entryHour, entryMinute] = entryTime.split(":").map(Number);
  const [exitHour, exitMinute] = exitTime.split(":").map(Number);

  if (
    [entryHour, entryMinute, exitHour, exitMinute].some((value) =>
      Number.isNaN(value),
    )
  ) {
    return 0;
  }

  const entryTotal = entryHour * 60 + entryMinute;
  const exitTotal = exitHour * 60 + exitMinute;
  let diff = exitTotal - entryTotal;

  if (diff < 0) {
    diff += 24 * 60;
  }

  return Number((diff / 60).toFixed(2));
}

export function formatDuration(hours) {
  const totalMinutes = Math.round(Number(hours || 0) * 60);
  const wholeHours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (!wholeHours && !minutes) return "0h";
  if (!minutes) return `${wholeHours}h`;
  return `${wholeHours}h ${String(minutes).padStart(2, "0")}min`;
}
