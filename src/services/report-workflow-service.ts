import { reportEngineStorage } from '@/services/report-engine-storage';
import { validateReportItems } from '@/services/report-validator';
import type {
  GenericReportAuditLog,
  GenericReportItem,
  GenericReportSubmission,
  ReportSubmissionStatus,
  ReportTemplate,
  ReportType,
  ReportValidationResult,
} from '@/types/report-engine';

interface SavePayload {
  reportType: ReportType;
  template: ReportTemplate;
  periodId: string;
  hospitalId: string;
  actor: string;
  sectionPayload: Record<string, string | number | boolean | null>;
  rows: Array<Record<string, string | number | boolean | null>>;
  mode: 'draft' | 'submit';
}

function nowIso() {
  return new Date().toISOString();
}

function makeAudit(submissionId: string, actor: string, action: GenericReportAuditLog['action'], previous?: ReportSubmissionStatus, next?: ReportSubmissionStatus, notes?: string): GenericReportAuditLog {
  return {
    id: crypto.randomUUID(),
    submission_id: submissionId,
    action,
    actor,
    notes,
    previous_status: previous,
    next_status: next,
    created_at: nowIso(),
  };
}

export const reportWorkflowService = {
  getSubmission(reportTypeId: string, hospitalId: string, periodId: string) {
    return reportEngineStorage
      .listSubmissions()
      .find((x) => x.report_type_id === reportTypeId && x.hospital_id === hospitalId && x.reporting_period_id === periodId) ?? null;
  },

  save(payload: SavePayload): { submission: GenericReportSubmission; validation: ReportValidationResult } {
    const existing = this.getSubmission(payload.reportType.id, payload.hospitalId, payload.periodId);
    const validationInput: GenericReportItem[] = payload.rows.map((row, rowIndex) => ({
      id: crypto.randomUUID(),
      submission_id: existing?.id ?? 'pending',
      row_order: rowIndex + 1,
      payload: row,
      created_at: nowIso(),
      updated_at: nowIso(),
    }));

    const validation = validateReportItems(payload.template, validationInput);
    const now = nowIso();
    const nextStatus: ReportSubmissionStatus = payload.mode === 'submit' ? 'submitted' : 'draft';

    const submission: GenericReportSubmission = existing
      ? {
          ...existing,
          status: nextStatus,
          updated_by: payload.actor,
          updated_at: now,
          submitted_at: payload.mode === 'submit' ? now : existing.submitted_at,
        }
      : {
          id: crypto.randomUUID(),
          report_type_id: payload.reportType.id,
          hospital_id: payload.hospitalId,
          reporting_period_id: payload.periodId,
          status: nextStatus,
          review_notes: [],
          created_by: payload.actor,
          updated_by: payload.actor,
          submitted_at: payload.mode === 'submit' ? now : null,
          approved_at: null,
          locked_at: null,
          due_date: `${payload.periodId.slice(7)}-05`,
          created_at: now,
          updated_at: now,
        };

    if (!validation.valid && payload.mode === 'submit') {
      throw new Error(`Validasi gagal: ${validation.issues.map((x) => x.message).join(', ')}`);
    }

    const baseItem: GenericReportItem = {
      id: `section-${submission.id}`,
      submission_id: submission.id,
      row_order: 0,
      payload: payload.sectionPayload,
      created_at: now,
      updated_at: now,
    };

    const rows = validation.autoCalculatedItems.map((item, idx) => ({
      ...item,
      id: item.id || crypto.randomUUID(),
      submission_id: submission.id,
      row_order: idx + 1,
      updated_at: now,
    }));

    reportEngineStorage.upsertSubmission(submission);
    reportEngineStorage.replaceItems(submission.id, [baseItem, ...rows]);
    reportEngineStorage.appendAudit(
      makeAudit(submission.id, payload.actor, payload.mode === 'submit' ? 'submit' : 'save_draft', existing?.status, nextStatus),
    );

    return { submission, validation };
  },

  transition(submissionId: string, actor: string, action: 'request_revision' | 'approve' | 'lock', notes?: string) {
    if (actor !== 'admin_pusat') {
      throw new Error('Hanya admin pusat yang dapat melakukan review, approve, atau lock.');
    }
    const all = reportEngineStorage.listSubmissions();
    const target = all.find((x) => x.id === submissionId);
    if (!target) throw new Error('Submission tidak ditemukan');

    const prev = target.status;
    const now = nowIso();

    if (action === 'request_revision') {
      target.status = 'revision_needed';
      if (notes) target.review_notes = [...target.review_notes, notes];
    } else if (action === 'approve') {
      target.status = 'approved';
      target.approved_at = now;
      if (notes) target.review_notes = [...target.review_notes, notes];
    } else {
      target.status = 'locked';
      target.locked_at = now;
    }

    target.updated_by = actor;
    target.updated_at = now;
    reportEngineStorage.upsertSubmission(target);
    reportEngineStorage.appendAudit(makeAudit(submissionId, actor, action, prev, target.status, notes));
    return target;
  },
};
