import { LucideIcon } from 'lucide-react';

export function KPIStatCard({ icon: Icon, title, value, note, tone = 'default' }: { icon: LucideIcon; title: string; value: string; note: string; tone?: 'default' | 'success' | 'warning' | 'danger'; }) {
  const toneClass = {
    default: 'from-primary/10 to-cyan-100/60 dark:from-primary/30 dark:to-cyan-900/30',
    success: 'from-emerald-100 to-emerald-50 dark:from-emerald-950/60 dark:to-emerald-900/30',
    warning: 'from-amber-100 to-amber-50 dark:from-amber-950/60 dark:to-amber-900/30',
    danger: 'from-rose-100 to-rose-50 dark:from-rose-950/60 dark:to-rose-900/30',
  }[tone];

  return (
    <article className={`rounded-2xl border border-slate-200/80 bg-gradient-to-br ${toneClass} p-4 shadow-soft dark:border-slate-800`}>
      <div className="mb-3 flex items-center justify-between text-slate-600 dark:text-slate-300">
        <p className="text-xs uppercase tracking-wide">{title}</p>
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{note}</p>
    </article>
  );
}
