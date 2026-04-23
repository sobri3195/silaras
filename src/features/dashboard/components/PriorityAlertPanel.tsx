import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { HospitalDashboardRecord } from '../types';

function Panel({ title, tone, rows }: { title: string; tone: string; rows: HospitalDashboardRecord[] }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${tone}`}>{rows.length}</span>
      </div>
      <div className="space-y-2">
        {rows.slice(0, 5).map((row) => (
          <div key={row.id} className="rounded-xl border border-slate-100 bg-slate-50 p-2 text-sm dark:border-slate-800 dark:bg-slate-950/40">
            <p className="font-medium">{row.name}</p>
            <p className="text-xs text-slate-500">BOR {row.bor.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</p>
          </div>
        ))}
      </div>
      <Button variant="outline" className="mt-3 w-full">Lihat detail <ChevronRight className="ml-1 h-4 w-4" /></Button>
    </article>
  );
}

export function PriorityAlertPanel({ notSubmitted, highBor, lowBor }: { notSubmitted: HospitalDashboardRecord[]; highBor: HospitalDashboardRecord[]; lowBor: HospitalDashboardRecord[]; }) {
  return (
    <section className="grid gap-3 xl:grid-cols-3">
      <Panel title="Rumah sakit belum submit" tone="bg-amber-100 text-amber-700" rows={notSubmitted} />
      <Panel title="BOR tinggi / critical" tone="bg-rose-100 text-rose-700" rows={highBor} />
      <Panel title="BOR sangat rendah" tone="bg-cyan-100 text-cyan-700" rows={lowBor} />
    </section>
  );
}
