import { differenceInDays } from 'date-fns';

export const getAverageBor = (values: number[]) => values.reduce((a, b) => a + b, 0) / (values.length || 1);
export const getHighestBorHospital = (items: { name: string; bor: number }[]) =>
  items.reduce((prev, curr) => (curr.bor > prev.bor ? curr : prev));
export const getLowestBorHospital = (items: { name: string; bor: number }[]) =>
  items.reduce((prev, curr) => (curr.bor < prev.bor ? curr : prev));
export const getSubmissionSummary = (total: number, submitted: number) => ({ total, submitted, pending: total - submitted });
export const getOverdueHospitals = (dueDate: Date, notSubmitted: string[]) =>
  differenceInDays(dueDate, new Date()) <= 5 ? notSubmitted : [];
export const aggregateDiseaseCountsRaw = (items: { name: string; total: number }[]) => items;
export const aggregateDiseaseCountsNormalized = (items: { normalized: string; total: number }[]) => items;
export const getPatientComposition = (input: { tni: number; pns: number; kel: number }) => input;
export const getRiskFlags = (bor: number) => {
  if (bor >= 85) return 'high critical';
  if (bor >= 60) return 'high watch';
  if (bor >= 40) return 'normal band';
  return 'low utilization';
};
