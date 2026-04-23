import type { DashboardFilters } from '../types';

export function FilterToolbar({ filters, onChange, wilayahOptions }: { filters: DashboardFilters; onChange: (patch: Partial<DashboardFilters>) => void; wilayahOptions: string[]; }) {
  return (
    <div className="sticky top-2 z-20 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-soft backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
      <div className="flex flex-wrap gap-2 text-sm">
        <select className="rounded-lg border px-3 py-1.5 dark:border-slate-700 dark:bg-slate-800" value={filters.reviewStatus} onChange={(e) => onChange({ reviewStatus: e.target.value as any })}><option value="all">Review: Semua</option><option value="pending">Pending</option><option value="reviewed">Reviewed</option><option value="need_attention">Need attention</option></select>
        <select className="rounded-lg border px-3 py-1.5 dark:border-slate-700 dark:bg-slate-800" value={filters.borRange} onChange={(e) => onChange({ borRange: e.target.value as any })}><option value="all">BOR: Semua</option><option value="critical">Critical ≥85%</option><option value="warning">Warning 60-84.99%</option><option value="normal">Normal 40-59.99%</option><option value="low">Low {'<'}40%</option></select>
        <select className="rounded-lg border px-3 py-1.5 dark:border-slate-700 dark:bg-slate-800" value={filters.wilayah} onChange={(e) => onChange({ wilayah: e.target.value })}>{wilayahOptions.map((opt) => <option key={opt} value={opt}>{opt === 'all' ? 'Wilayah: Semua' : opt}</option>)}</select>
        <button className="rounded-lg border px-3 py-1.5 dark:border-slate-700" onClick={() => onChange({ diseaseMode: filters.diseaseMode === 'normalized' ? 'raw' : 'normalized' })}>{filters.diseaseMode === 'normalized' ? 'Mode Penyakit: Normalized' : 'Mode Penyakit: Raw'}</button>
      </div>
    </div>
  );
}
