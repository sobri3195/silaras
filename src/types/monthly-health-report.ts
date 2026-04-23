export type MonthlyReportStatus = 'draft' | 'submitted' | 'in_review' | 'revision_needed' | 'approved' | 'locked';

export type MonthlyFieldType = 'text' | 'number' | 'textarea' | 'select' | 'percentage' | 'calculated' | 'notes';

export type MonthlyFormMode = 'table' | 'narrative' | 'read_only' | 'print_preview';

export interface MonthlyNarrativeSection {
  key: string;
  title: string;
  helper?: string;
  placeholder?: string;
  required?: boolean;
}

export interface MonthlyNarrativeReport {
  id: string;
  hospital_id: string;
  reporting_period_id: string;
  title: string;
  status: MonthlyReportStatus;
  introduction: string;
  legal_basis: string;
  activities_summary: string;
  facilities_summary: string;
  personnel_summary: string;
  issues_and_constraints: string;
  mitigation: string;
  conclusion: string;
  suggestions: string;
  closing_note: string;
  sections: Record<string, string>;
  created_by: string;
  updated_by: string;
  submitted_at: string | null;
  reviewed_at: string | null;
  approved_at: string | null;
  locked_at: string | null;
  review_notes: string[];
  created_at: string;
  updated_at: string;
}

export interface MonthlyAttachmentField {
  key: string;
  label: string;
  type: MonthlyFieldType;
  options?: string[];
  placeholder?: string;
  required?: boolean;
  readonly?: boolean;
  formula?: { sum: string[] };
}

export interface MonthlyAttachmentGroupedHeader {
  label: string;
  columns: string[];
}

export interface MonthlyAttachmentTemplate {
  id: string;
  code: string;
  title: string;
  description: string;
  mode: 'table' | 'narrative';
  supports_copy_row?: boolean;
  fields: MonthlyAttachmentField[];
  grouped_headers?: MonthlyAttachmentGroupedHeader[];
  repeatable_rows: boolean;
  subtotal_fields?: string[];
  total_fields?: string[];
  default_rows: Record<string, string | number>[];
  notes_placeholder?: string;
}

export interface MonthlyAttachmentSubmission {
  id: string;
  attachment_code: string;
  attachment_title: string;
  hospital_id: string;
  reporting_period_id: string;
  status: MonthlyReportStatus;
  metadata: Record<string, string | number | boolean | null>;
  created_by: string;
  updated_by: string;
  submitted_at: string | null;
  reviewed_at: string | null;
  approved_at: string | null;
  locked_at: string | null;
  review_notes: string[];
  created_at: string;
  updated_at: string;
}

export interface MonthlyAttachmentItem {
  id: string;
  submission_id: string;
  row_order: number;
  payload: Record<string, string | number | boolean | null>;
  created_at: string;
  updated_at: string;
}

export interface MonthlyAttachmentAuditLog {
  id: string;
  submission_id: string;
  action: 'create' | 'autosave' | 'save_draft' | 'submit' | 'review' | 'request_revision' | 'approve' | 'lock';
  actor: string;
  notes?: string;
  previous_status?: MonthlyReportStatus;
  next_status?: MonthlyReportStatus;
  created_at: string;
}

export interface MonthlyHospitalOption {
  id: string;
  name: string;
}

export interface MonthlyPeriodOption {
  id: string;
  label: string;
}
