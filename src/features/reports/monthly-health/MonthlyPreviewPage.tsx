import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { monthlyHealthReportStorage } from '@/services/monthly-health-report-storage';
import { MonthlyDynamicFormEngine } from './components/MonthlyDynamicFormEngine';

export function MonthlyPreviewPage() {
  monthlyHealthReportStorage.init();
  const { submissionId } = useParams();
  const allTemplates = monthlyHealthReportStorage.listTemplates();
  const allSubmissions = monthlyHealthReportStorage.listAttachmentSubmissions('RS-WIRIADINATA', 'period-2026-04');
  const submission = allSubmissions.find((x) => x.id === submissionId);
  const template = allTemplates.find((x) => x.code === submission?.attachment_code);
  const rows = useMemo(() => (submission ? monthlyHealthReportStorage.getAttachmentItems(submission.id).map((x) => x.payload) : []), [submission?.id]);

  if (!submission || !template) return <div className="rounded-2xl border bg-white p-4">Preview tidak ditemukan.</div>;

  return (
    <div className="space-y-4 pb-8">
      <section className="rounded-2xl border bg-white p-5 shadow-soft">
        <h2 className="text-xl font-bold">Print Preview Resmi</h2>
        <p className="text-sm text-slate-500">Submission ID: {submission.id}</p>
        <button className="mt-3 rounded-xl border px-3 py-2 text-sm" onClick={() => window.print()}>Print Preview</button>
      </section>
      <MonthlyDynamicFormEngine template={template} rows={rows} onRowsChange={() => {}} mode="print_preview" />
    </div>
  );
}
