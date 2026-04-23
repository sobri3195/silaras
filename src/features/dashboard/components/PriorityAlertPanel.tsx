import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SeverityBadge } from './SeverityBadge';
import type { PriorityAlert } from '../types';

export function PriorityAlertsPanel({ alerts, onOpenHospital }: { alerts: PriorityAlert[]; onOpenHospital: (hospitalId: string) => void }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold">Peringatan Prioritas</h3>
        <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-950/50 dark:text-rose-200">{alerts.length} alerts</span>
      </div>
      <div className="space-y-2">
        {alerts.slice(0, 6).map((alert) => (
          <article key={alert.id} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-sm font-semibold">{alert.hospitalName}</p>
              <SeverityBadge severity={alert.severity} />
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">Kategori: <strong>{alert.category}</strong> · {alert.period}</p>
            <p className="mt-1 text-xs text-slate-500">{alert.note}</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">{new Date(alert.timestamp).toLocaleString('id-ID')}</span>
              <Button variant="outline" onClick={() => onOpenHospital(alert.hospitalId)}>{alert.cta} <ChevronRight className="ml-1 h-3 w-3" /></Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
