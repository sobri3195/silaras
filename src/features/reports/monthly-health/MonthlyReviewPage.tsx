import { Link } from 'react-router-dom';
import { monthlyHealthReportStorage } from '@/services/monthly-health-report-storage';

export function MonthlyReviewPage() {
  monthlyHealthReportStorage.init();
  const actor = (localStorage.getItem('silaras_role') ?? 'reviewer_kotama').toString();
  const hospitalId = 'RS-WIRIADINATA';
  const periodId = 'period-2026-04';
  const submissions = monthlyHealthReportStorage.listAttachmentSubmissions(hospitalId, periodId);

  const transition = (id: string, action: 'review' | 'request_revision' | 'approve' | 'lock') => {
    monthlyHealthReportStorage.transitionSubmission(id, actor, action, action === 'request_revision' ? 'Mohon rapikan kolom jumlah dan catatan.' : undefined);
    window.location.reload();
  };

  const incompleteUnits = submissions.filter((s) => !['approved', 'locked'].includes(s.status)).length;

  return (
    <div className="space-y-4 pb-8">
      <section className="rounded-2xl border bg-white p-5 shadow-soft">
        <h2 className="text-xl font-bold">Review Laporan Bulanan Satkes</h2>
        <p className="text-sm text-slate-500">Ringkasan submission bulanan, unit belum lengkap, dan status review per lampiran.</p>
        <p className="mt-2 text-sm">Unit belum lengkap: {incompleteUnits}</p>
      </section>

      <section className="space-y-3">
        {submissions.map((sub) => (
          <article key={sub.id} className="rounded-2xl border bg-white p-4 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs text-slate-500">{sub.attachment_code}</p>
                <h3 className="font-semibold">{sub.attachment_title}</h3>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">{sub.status}</span>
            </div>
            {sub.review_notes.length > 0 ? <p className="mt-2 text-xs text-amber-700">Review notes: {sub.review_notes.join(' | ')}</p> : null}
            <div className="mt-3 flex flex-wrap gap-2">
              <button className="rounded-xl border px-3 py-2 text-xs" onClick={() => transition(sub.id, 'review')}>Review</button>
              <button className="rounded-xl border px-3 py-2 text-xs" onClick={() => transition(sub.id, 'request_revision')}>Revisi</button>
              <button className="rounded-xl border px-3 py-2 text-xs" onClick={() => transition(sub.id, 'approve')}>Approve</button>
              <button className="rounded-xl border px-3 py-2 text-xs" onClick={() => transition(sub.id, 'lock')}>Lock</button>
              <Link to={`/reports/monthly/preview/${sub.id}`} className="rounded-xl bg-primary px-3 py-2 text-xs text-white">Preview</Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
