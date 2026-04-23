import { isAfter, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

export function DeadlineBadge({ dueDate, text }: { dueDate: string; text: string }) {
  const overdue = isAfter(new Date(), parseISO(dueDate));
  return (
    <span className={cn('rounded-full px-2.5 py-1 text-xs font-medium', overdue ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-200' : 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-200')}>
      {overdue ? 'Overdue · ' : ''}
      {text}
    </span>
  );
}
