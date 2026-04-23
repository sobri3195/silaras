import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { monthlyHealthReportStorage } from '@/services/monthly-health-report-storage';
import { MonthlyDynamicFormEngine } from './components/MonthlyDynamicFormEngine';
import { exportAttachmentToExcel, exportAttachmentToPdf } from './export-utils';

export function MonthlyAttachmentDetailPage() {
  monthlyHealthReportStorage.init();
  const params = useParams();
  const code = decodeURIComponent(params.code ?? '');
  const hospitalId = 'RS-WIRIADINATA';
  const periodId = 'period-2026-04';
  const template = monthlyHealthReportStorage.getTemplateByCode(code);
  const submission = monthlyHealthReportStorage.getAttachmentSubmission(hospitalId, periodId, code);
  const [rows, setRows] = useState<Record<string, string | number | boolean | null>[]>([]);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!submission) return;
    setRows(monthlyHealthReportStorage.getAttachmentItems(submission.id).map((x) => x.payload));
  }, [submission?.id]);

  useEffect(() => {
    if (!submission) return;
    const timer = setTimeout(() => {
      monthlyHealthReportStorage.saveAttachmentRows(submission.id, rows, 'admin_rs', 'autosave');
      setNotice('Autosave draft lampiran tersimpan.');
    }, 900);
    return () => clearTimeout(timer);
  }, [rows]);

  if (!template || !submission) return <div className="rounded-2xl border bg-white p-5">Lampiran tidak ditemukan.</div>;

  const readOnly = ['approved', 'locked', 'submitted'].includes(submission.status);

  const save = (mode: 'draft' | 'submit') => {
    monthlyHealthReportStorage.saveAttachmentRows(submission.id, rows, 'admin_rs', mode);
    setNotice(mode === 'submit' ? 'Lampiran disubmit.' : 'Draft lampiran disimpan.');
  };

  return (
    <div className="space-y-4 pb-14">
      <section className="rounded-2xl border bg-white p-5 shadow-soft">
        <p className="text-xs uppercase text-slate-500">Lampiran Bulanan Satkes</p>
        <h2 className="text-xl font-bold">{template.code} - {template.title}</h2>
        <p className="text-sm text-slate-500">Status: {submission.status}</p>
      </section>

      <MonthlyDynamicFormEngine template={template} rows={rows} onRowsChange={setRows} mode={readOnly ? 'read_only' : 'table'} />

      <div className="sticky bottom-3 z-10 flex flex-wrap gap-2 rounded-2xl border bg-white p-3 shadow-soft">
        <Link to="/reports/monthly/attachments" className="rounded-xl border px-3 py-2 text-sm">Kembali</Link>
        {!readOnly ? (
          <>
            <button className="rounded-xl border px-3 py-2 text-sm" onClick={() => save('draft')}>Save Draft</button>
            <button className="rounded-xl bg-primary px-3 py-2 text-sm text-white" onClick={() => save('submit')}>Submit</button>
          </>
        ) : <p className="text-sm text-slate-600">Read only karena status {submission.status}.</p>}
        <button className="rounded-xl border px-3 py-2 text-sm" onClick={() => exportAttachmentToPdf(template, rows)}>Export PDF</button>
        <button className="rounded-xl border px-3 py-2 text-sm" onClick={() => exportAttachmentToExcel(template, rows)}>Export Excel</button>
        {notice ? <p className="text-sm text-emerald-700">{notice}</p> : null}
      </div>
    </div>
  );
}
