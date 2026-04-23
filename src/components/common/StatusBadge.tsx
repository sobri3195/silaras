import { ReportStatus } from '@/types/domain';
import { cn } from '@/lib/utils';

const map: Record<ReportStatus, string> = {
  draft: 'bg-slate-200 text-slate-700',
  submitted: 'bg-blue-100 text-blue-700',
  revision_needed: 'bg-amber-100 text-amber-700',
  approved: 'bg-emerald-100 text-emerald-700',
  locked: 'bg-primary text-white',
};

export function StatusBadge({ status }: { status: ReportStatus }) {
  return <span className={cn('rounded-full px-3 py-1 text-xs font-semibold', map[status])}>{status}</span>;
}
