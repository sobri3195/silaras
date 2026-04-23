import { Download, RefreshCw, Satellite } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  periodId: string;
  query: string;
  submitStatus: string;
  freshness: { lastSync: string; latestSubmit: string | null; activePeriod: string };
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
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Sistem Laporan RSAU</p>
          <h1 className="text-2xl font-bold text-[#0E254A] dark:text-cyan-300">Komando Pelaporan Kesehatan</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-300">
            <span className="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-800">Last sync: {new Date(props.freshness.lastSync).toLocaleString('id-ID')}</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-800">Submit terakhir: {props.freshness.latestSubmit ? new Date(props.freshness.latestSubmit).toLocaleString('id-ID') : '-'}</span>
            <span className="rounded-full bg-cyan-100 px-2.5 py-1 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-200">Periode aktif: {props.freshness.activePeriod}</span>
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
          <select className="rounded-xl border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" value={props.periodId} onChange={(e) => props.onPeriodChange(e.target.value)}>
            <option value="2026-Q2">TW II 2026</option>
            <option value="2026-Q1">TW I 2026</option>
          </select>
          <input placeholder="Cari RS" className="rounded-xl border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" value={props.query} onChange={(e) => props.onQueryChange(e.target.value)} />
          <select className="rounded-xl border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" value={props.submitStatus} onChange={(e) => props.onSubmitStatusChange(e.target.value)}>
            <option value="all">Semua status</option><option value="draft">Belum submit</option><option value="submitted">Submitted</option><option value="revision_needed">Perlu revisi</option><option value="approved">Approved</option><option value="locked">Locked</option>
          </select>
          <Button variant="outline" onClick={props.onRefresh}><RefreshCw className="mr-2 h-4 w-4" />Refresh</Button>
          <Button onClick={props.onExport}><Download className="mr-2 h-4 w-4" />Export</Button>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#0E254A]/20 bg-[#0E254A]/5 px-3 py-2 text-xs text-[#0E254A] dark:border-cyan-900 dark:bg-cyan-950/20 dark:text-cyan-200"><Satellite className="h-3.5 w-3.5" />Mode command center aktif — monitoring real-time nasional.</div>
    </section>
  );
}
