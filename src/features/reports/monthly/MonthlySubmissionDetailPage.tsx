import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { reportEngineStorage } from '@/services/report-engine-storage';
import { reportWorkflowService } from '@/services/report-workflow-service';
import { getSession } from '@/features/auth/session';
import { userLogService } from '@/services/user-log-service';

export function MonthlySubmissionDetailPage() {
  reportEngineStorage.init();
  const navigate = useNavigate();
  const session = getSession();
  const actor = session?.role ?? 'admin_rs';
  const { reportTypeCode, submissionId } = useParams();

  const reportType = reportEngineStorage.listReportTypes().find((x) => x.code === reportTypeCode);
  const submission = reportEngineStorage.listSubmissions().find((x) => x.id === submissionId);
  const items = reportEngineStorage.listItems().filter((x) => x.submission_id === submissionId).sort((a, b) => a.row_order - b.row_order);
  const logs = reportEngineStorage.listAuditLogs().filter((x) => x.submission_id === submissionId).sort((a, b) => a.created_at.localeCompare(b.created_at));
  const [note, setNote] = useState('');

  const rows = useMemo(() => items.filter((x) => x.row_order > 0), [items]);

  if (!reportType || !submission) {
    return <div className="rounded-2xl border bg-white p-5">Submission tidak ditemukan.</div>;
  }

  const canReview = session?.role === 'admin_pusat';

  const doAction = (action: 'request_revision' | 'approve' | 'lock') => {
    if (!canReview) return;
    reportWorkflowService.transition(submission.id, actor, action, note || undefined);
    void userLogService.log(action, `Aksi ${action} untuk submission ${submission.id}`, { submission_id: submission.id, hospital_id: submission.hospital_id });
    navigate(0);
  };

  return (
    <div className="grid gap-4 pb-8 lg:grid-cols-3">
      <section className="space-y-4 lg:col-span-2">
        <article className="rounded-2xl border bg-white p-5 shadow-soft">
          <h2 className="text-xl font-bold">{reportType.title}</h2>
          <p className="text-sm text-slate-500">Status: {submission.status} • Rumah sakit: {submission.hospital_id}</p>
          <p className="mt-2 text-sm">Review notes:</p>
          <ul className="list-disc pl-5 text-sm text-slate-700">
            {submission.review_notes.length ? submission.review_notes.map((n) => <li key={n}>{n}</li>) : <li>-</li>}
          </ul>
        </article>

        <article className="rounded-2xl border bg-white p-5 shadow-soft">
          <h3 className="mb-2 font-semibold">Detail Item</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b align-top">
                    <td className="px-2 py-2 font-medium">Row {row.row_order}</td>
                    <td className="px-2 py-2">
                      <pre className="overflow-auto rounded bg-slate-50 p-2 text-xs">{JSON.stringify(row.payload, null, 2)}</pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <aside className="space-y-4">
        <article className="rounded-2xl border bg-white p-5 shadow-soft">
          <h4 className="font-semibold">Review Workflow</h4>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} placeholder="Catatan reviewer" className="mt-3 w-full rounded-xl border p-2 text-sm" />
          {canReview ? (
            <div className="mt-3 grid gap-2">
              <button onClick={() => doAction('request_revision')} className="rounded-xl bg-amber-500 px-3 py-2 text-sm text-white">Request Revision</button>
              <button onClick={() => doAction('approve')} className="rounded-xl bg-emerald-600 px-3 py-2 text-sm text-white">Approve</button>
              <button onClick={() => doAction('lock')} className="rounded-xl bg-primary px-3 py-2 text-sm text-white">Lock</button>
              <Link to={`/reports/monthly/${reportType.code}`} className="rounded-xl border px-3 py-2 text-center text-sm">Buka Form</Link>
            </div>
          ) : (
            <p className="mt-3 text-xs text-slate-500">Admin RS hanya dapat melihat detail dan menindaklanjuti revisi melalui form.</p>
          )}
        </article>

        <article className="rounded-2xl border bg-white p-5 shadow-soft">
          <h4 className="font-semibold">Activity Timeline</h4>
          <ul className="mt-3 space-y-2 text-sm">
            {logs.map((log) => (
              <li key={log.id} className="rounded-xl border p-2">
                <p className="font-medium">{log.action}</p>
                <p className="text-xs text-slate-500">{new Date(log.created_at).toLocaleString('id-ID')}</p>
                <p className="text-xs text-slate-600">{log.notes ?? '-'}</p>
              </li>
            ))}
          </ul>
        </article>
      </aside>
    </div>
  );
}
