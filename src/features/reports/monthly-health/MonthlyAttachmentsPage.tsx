import { Link } from 'react-router-dom';
import { monthlyHealthReportStorage } from '@/services/monthly-health-report-storage';

export function MonthlyAttachmentsPage() {
  monthlyHealthReportStorage.init();
  const hospitalId = 'RS-WIRIADINATA';
  const periodId = 'period-2026-04';
  const templates = monthlyHealthReportStorage.listTemplates();
  const submissions = monthlyHealthReportStorage.listAttachmentSubmissions(hospitalId, periodId);

  const done = submissions.filter((x) => ['submitted', 'approved', 'locked'].includes(x.status)).length;
  const missing = templates.filter((t) => !submissions.some((x) => x.attachment_code === t.code)).map((x) => x.code);

  return (
    <div className="space-y-4 pb-8">
      <section className="rounded-2xl border bg-white p-5 shadow-soft">
        <h2 className="text-xl font-bold">Laporan Bulanan Satkes - Lampiran Tabular</h2>
        <p className="text-sm text-slate-500">Tab per lampiran KES/A-xx/BL dan laporan perkembangan kasus.</p>
        <p className="mt-2 text-sm">Progress pengisian lampiran: {done}/{templates.length}</p>
        {missing.length > 0 ? <p className="text-xs text-amber-700">Belum diisi: {missing.join(', ')}</p> : <p className="text-xs text-emerald-700">Semua lampiran sudah memiliki draft.</p>}
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {templates.map((template) => {
          const sub = submissions.find((x) => x.attachment_code === template.code);
          return (
            <article key={template.code} className="rounded-2xl border bg-white p-4 shadow-soft">
              <p className="text-xs uppercase text-slate-500">{template.code}</p>
              <h3 className="text-sm font-semibold">{template.title}</h3>
              <p className="mt-1 text-xs text-slate-500">{template.description}</p>
              <p className="mt-2 text-xs">Status: <span className="font-semibold">{sub?.status ?? 'draft'}</span></p>
              <Link to={`/reports/monthly/attachments/${encodeURIComponent(template.code)}`} className="mt-3 inline-flex rounded-xl bg-primary px-3 py-2 text-xs text-white">Buka lampiran</Link>
            </article>
          );
        })}
      </section>
    </div>
  );
}
