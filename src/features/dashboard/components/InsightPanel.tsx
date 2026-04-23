import { Lightbulb } from 'lucide-react';

export function InsightPanel({ items }: { items: string[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-3 flex items-center gap-2 font-semibold"><Lightbulb className="h-4 w-4 text-amber-500" /> Insight Otomatis</h3>
      <ul className="space-y-2 text-sm">{items.map((item, i) => <li key={i} className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/60">{item}</li>)}</ul>
    </section>
  );
}
