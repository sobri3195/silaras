import { Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  periodId: string;
  query: string;
  submitStatus: string;
  onPeriodChange: (value: string) => void;
  onQueryChange: (value: string) => void;
  onSubmitStatusChange: (value: string) => void;
  onRefresh: () => void;
  onExport: () => void;
}

export function DashboardHeader(props: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary dark:text-cyan-300">Dashboard Puskesau</h1>
          <p className="text-sm text-slate-500 dark:text-slate-300">Periode aktif pemantauan pelaporan rumah sakit TNI AU.</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
          <select className="rounded-xl border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" value={props.periodId} onChange={(e) => props.onPeriodChange(e.target.value)}>
            <option value="2026-Q2">Triwulan II 2026</option>
            <option value="2026-Q1">Triwulan I 2026</option>
          </select>
          <input placeholder="Cari rumah sakit..." className="rounded-xl border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" value={props.query} onChange={(e) => props.onQueryChange(e.target.value)} />
          <select className="rounded-xl border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" value={props.submitStatus} onChange={(e) => props.onSubmitStatusChange(e.target.value)}>
            <option value="all">Semua status</option>
            <option value="draft">Belum submit</option>
            <option value="submitted">Submitted</option>
            <option value="revision_needed">Perlu revisi</option>
            <option value="approved">Approved</option>
            <option value="locked">Locked</option>
          </select>
          <Button variant="outline" onClick={props.onRefresh}><RefreshCw className="mr-2 h-4 w-4" />Refresh</Button>
          <Button onClick={props.onExport}><Download className="mr-2 h-4 w-4" />Export</Button>
        </div>
      </div>
    </section>
  );
}
