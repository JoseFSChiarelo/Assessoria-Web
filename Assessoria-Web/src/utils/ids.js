export function createId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function nextAssessmentNumber(assessments = []) {
  const year = new Date().getFullYear();
  const prefix = `AS-${year}-`;
  const maxSequence = assessments.reduce((max, assessment) => {
    if (!assessment.number?.startsWith(prefix)) return max;
    const sequence = Number(assessment.number.replace(prefix, ""));
    return Number.isNaN(sequence) ? max : Math.max(max, sequence);
  }, 0);

  return `${prefix}${String(maxSequence + 1).padStart(4, "0")}`;
}
