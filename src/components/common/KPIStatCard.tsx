import { LucideIcon } from 'lucide-react';

export function KPIStatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: LucideIcon;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-2 flex items-center justify-between text-slate-500 dark:text-slate-300">
        <p className="text-sm">{title}</p>
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-2xl font-bold text-primary dark:text-cyan-300">{value}</p>
    </article>
  );
}
