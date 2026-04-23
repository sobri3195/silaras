import { cn } from '@/lib/utils';
import type { AlertSeverity } from '../types';

const tone: Record<AlertSeverity, string> = {
  tinggi: 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-200',
  sedang: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-200',
  rendah: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-200',
};

export function SeverityBadge({ severity }: { severity: AlertSeverity }) {
  return <span className={cn('rounded-full px-2.5 py-1 text-xs font-semibold capitalize', tone[severity])}>{severity}</span>;
}
