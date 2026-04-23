import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { DynamicReportRenderer, splitItems } from './components/DynamicReportRenderer';
import { reportEngineStorage } from '@/services/report-engine-storage';
import { reportWorkflowService } from '@/services/report-workflow-service';
import { getSession } from '@/features/auth/session';

export function MonthlyReportFormPage() {
  reportEngineStorage.init();
  const navigate = useNavigate();
  const { reportTypeCode } = useParams();
  const session = getSession();
  const actor = session?.role ?? 'admin_rs';
  const hospitalId = session?.hospital_id ?? 'RS-001';
  const period = reportEngineStorage.getActivePeriod();

  const reportType = reportEngineStorage.listReportTypes().find((x) => x.code === reportTypeCode);
  const template = reportType ? reportEngineStorage.getTemplateByReportTypeId(reportType.id) : null;
  const submission = reportType && period ? reportWorkflowService.getSubmission(reportType.id, hospitalId, period.id) : null;
  const items = submission ? reportEngineStorage.listItems().filter((x) => x.submission_id === submission.id) : [];

  const parsed = useMemo(() => splitItems(items), [submission?.id]);
  const [sectionPayload, setSectionPayload] = useState<Record<string, string | number | boolean | null>>(parsed.sectionPayload);
  const [rows, setRows] = useState<Array<Record<string, string | number | boolean | null>>>(parsed.rows.length ? parsed.rows : [{}, {}]);
  const [issues, setIssues] = useState<string[]>([]);

  if (!reportType || !template || !period) {
    return <div className="rounded-2xl border bg-white p-5">Template laporan tidak ditemukan.</div>;
  }

  const readOnly = submission?.status === 'submitted' || submission?.status === 'approved' || submission?.status === 'locked' || session?.role !== 'admin_rs';

  const handleSave = (mode: 'draft' | 'submit') => {
    try {
      const result = reportWorkflowService.save({
        reportType,
        template,
        periodId: period.id,
        hospitalId,
        actor,
        sectionPayload,
        rows,
        mode,
      });
      setIssues(result.validation.issues.map((x) => `${x.section}: ${x.message}`));
      navigate(`/reports/monthly/${reportType.code}/${result.submission.id}`);
    } catch (error) {
      setIssues([error instanceof Error ? error.message : 'Gagal menyimpan laporan']);
    }
  };

  return (
    <div className="space-y-4 pb-12">
      <section className="rounded-2xl border bg-white p-5 shadow-soft">
        <p className="text-xs uppercase tracking-wide text-slate-500">Dynamic Report Form</p>
        <h2 className="text-xl font-bold">{reportType.title}</h2>
        <p className="text-sm text-slate-500">Periode: {period.label} • Status: {submission?.status ?? 'not_started'}</p>
      </section>

      {issues.length > 0 ? (
        <section className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold">Validation summary</p>
          <ul className="list-disc pl-5">
            {issues.map((issue) => <li key={issue}>{issue}</li>)}
          </ul>
        </section>
      ) : null}

      <DynamicReportRenderer
        template={template}
        sectionPayload={sectionPayload}
        onSectionPayloadChange={(key, value) => setSectionPayload((prev) => ({ ...prev, [key]: value }))}
        rows={rows}
        onRowsChange={setRows}
        readOnly={readOnly}
      />

      <div className="sticky bottom-3 z-10 flex flex-wrap gap-2 rounded-2xl border bg-white p-3 shadow-soft">
        <Link to="/reports/monthly" className="rounded-xl border px-3 py-2 text-sm">Kembali</Link>
        {!readOnly ? (
          <>
            <button onClick={() => handleSave('draft')} className="rounded-xl border px-3 py-2 text-sm">Save Draft</button>
            <button onClick={() => handleSave('submit')} className="rounded-xl bg-primary px-3 py-2 text-sm text-white">Submit</button>
          </>
        ) : (
          <p className="text-sm text-slate-600">Laporan read-only pada status saat ini.</p>
        )}
      </div>
    </div>
  );
}
