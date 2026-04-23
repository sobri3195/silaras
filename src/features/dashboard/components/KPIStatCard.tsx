import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function KPIStatCard({
  icon: Icon,
  title,
  value,
  subtext,
  meta,
  tone = 'default',
}: {
  icon: LucideIcon;
  title: string;
  value: string;
  subtext: string;
  meta: string;
  tone?: 'default' | 'success' | 'warning' | 'danger';
}) {
  const toneClass = {
    default: 'from-[#0E254A]/10 to-cyan-100/60 dark:from-[#0E254A]/40 dark:to-cyan-950/30',
    success: 'from-emerald-100 to-emerald-50 dark:from-emerald-950/60 dark:to-emerald-900/30',
    warning: 'from-amber-100 to-amber-50 dark:from-amber-950/60 dark:to-amber-900/30',
    danger: 'from-rose-100 to-rose-50 dark:from-rose-950/60 dark:to-rose-900/30',
  }[tone];

  return (
    <article className={cn('rounded-2xl border border-slate-200/80 bg-gradient-to-br p-4 shadow-soft dark:border-slate-800', toneClass)}>
      <div className="mb-2 flex items-start justify-between">
        <p className="text-xs uppercase tracking-wide text-slate-600 dark:text-slate-300">{title}</p>
        <span className="rounded-lg bg-white/70 p-2 dark:bg-slate-900/60"><Icon className="h-4 w-4 text-[#0E254A] dark:text-cyan-300" /></span>
      </div>
      <p className="text-3xl font-bold leading-none text-slate-900 dark:text-slate-50">{value}</p>
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{subtext}</p>
      <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">{meta}</p>
    </article>
  );
}
