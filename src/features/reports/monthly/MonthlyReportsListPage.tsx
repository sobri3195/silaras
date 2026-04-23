import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { reportEngineStorage } from '@/services/report-engine-storage';
import type { ReportSubmissionStatus } from '@/types/report-engine';

const statusClass: Record<ReportSubmissionStatus | 'not_started', string> = {
  not_started: 'bg-slate-100 text-slate-700',
  draft: 'bg-cyan-100 text-cyan-700',
  submitted: 'bg-blue-100 text-blue-700',
  revision_needed: 'bg-amber-100 text-amber-800',
  approved: 'bg-emerald-100 text-emerald-700',
  locked: 'bg-primary text-white',
};

export function MonthlyReportsListPage() {
  reportEngineStorage.init();
  const hospitalId = localStorage.getItem('silaras_hospital_id') ?? 'RS-001';
  const activePeriod = reportEngineStorage.getActivePeriod();
  const types = reportEngineStorage.listReportTypes();
  const submissions = reportEngineStorage.listSubmissions().filter((x) => x.hospital_id === hospitalId && x.reporting_period_id === activePeriod?.id);
  const [category, setCategory] = useState('all');

  const rows = useMemo(() => types
    .filter((type) => category === 'all' || type.category === category)
    .map((type) => {
      const sub = submissions.find((s) => s.report_type_id === type.id);
      const status = sub?.status ?? 'not_started';
      return { type, submissionId: sub?.id, status };
    }), [types, submissions, category]);

  const completed = rows.filter((row) => ['submitted', 'approved', 'locked'].includes(row.status)).length;
  const progress = rows.length ? Math.round((completed / rows.length) * 100) : 0;

  return (
    <div className="space-y-4 pb-8">
      <section className="rounded-2xl border bg-white p-5 shadow-soft">
        <p className="text-xs uppercase tracking-wide text-slate-500">Demo Local Mode</p>
        <h2 className="text-xl font-bold">Laporan Bulanan Lampiran RS/Faskes</h2>
        <p className="mt-1 text-sm text-slate-600">Periode aktif: {activePeriod?.label ?? '-'} • Progress {progress}%</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-xl border px-3 py-2 text-sm">
            <option value="all">Semua kategori</option>
            <option value="pelayanan_kesehatan">Pelayanan Kesehatan</option>
          </select>
          <Link to="/master/report-types" className="rounded-xl border px-3 py-2 text-sm">Master Report Types</Link>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((row) => (
          <article key={row.type.id} className="rounded-2xl border bg-white p-4 shadow-soft">
            <div className="mb-2 flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold leading-snug">{row.type.title}</h3>
              <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClass[row.status]}`}>{row.status}</span>
            </div>
            <p className="mb-4 line-clamp-2 text-xs text-slate-500">{row.type.description}</p>
            <div className="flex gap-2">
              <Link to={`/reports/monthly/${row.type.code}`} className="rounded-xl bg-primary px-3 py-2 text-xs text-white">{row.submissionId ? 'Edit / Lanjutkan' : 'Isi Laporan'}</Link>
              {row.submissionId ? <Link to={`/reports/monthly/${row.type.code}/${row.submissionId}`} className="rounded-xl border px-3 py-2 text-xs">Detail</Link> : null}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
