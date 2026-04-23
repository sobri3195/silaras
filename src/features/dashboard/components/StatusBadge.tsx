import { cn } from '@/lib/utils';
import type { ReportStatus } from '@/types/domain';

const statusMap: Record<ReportStatus, { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200' },
  submitted: { label: 'Submitted', className: 'bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-200' },
  revision_needed: { label: 'Revisi', className: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-200' },
  approved: { label: 'Approved', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-200' },
  locked: { label: 'Locked', className: 'bg-primary text-white' },
};

export function StatusBadge({ status }: { status: ReportStatus }) {
  const meta = statusMap[status];
  return <span className={cn('rounded-full px-2.5 py-1 text-xs font-semibold', meta.className)}>{meta.label}</span>;
}
