export type ReportFrequency = 'bulanan';

export type ReportSubmissionStatus =
  | 'not_started'
  | 'draft'
  | 'submitted'
  | 'revision_needed'
  | 'approved'
  | 'locked';

export type TemplateFieldType =
  | 'text'
  | 'number'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'calculated'
  | 'notes';

export interface ReportType {
  id: string;
  code: string;
  title: string;
  description: string;
  category: string;
  frequency: ReportFrequency;
  is_tabular: boolean;
  is_active: boolean;
  needs_summary: boolean;
  supports_review: boolean;
  restricted_hospital_ids?: string[];
  due_day_of_month: number;
  created_at: string;
  updated_at: string;
}

export interface ReportTemplateValidation {
  required?: boolean;
  min?: number;
  max?: number;
  noNegative?: boolean;
  mustEqualField?: string;
}

export interface ReportTemplateColumn {
  key: string;
  label: string;
  type: Exclude<TemplateFieldType, 'checkbox' | 'radio' | 'notes'>;
  options?: string[];
  validation?: ReportTemplateValidation;
  computed_from?: string[];
}

export interface ReportTemplateField {
  key: string;
  label: string;
  type: TemplateFieldType;
  placeholder?: string;
  options?: string[];
  validation?: ReportTemplateValidation;
}

export interface ReportTemplateSection {
  id: string;
  title: string;
  description?: string;
  fields?: ReportTemplateField[];
  columns?: ReportTemplateColumn[];
  repeatable_rows?: boolean;
  summary_rules?: string[];
}

export interface ReportTemplate {
  id: string;
  report_type_id: string;
  version: number;
  schema: {
    sections: ReportTemplateSection[];
  };
  created_at: string;
  updated_at: string;
}

export interface GenericReportSubmission {
  id: string;
  report_type_id: string;
  hospital_id: string;
  reporting_period_id: string;
  status: ReportSubmissionStatus;
  review_notes: string[];
  created_by: string;
  updated_by: string;
  submitted_at: string | null;
  approved_at: string | null;
  locked_at: string | null;
  due_date: string;
  created_at: string;
  updated_at: string;
}

export interface GenericReportItem {
  id: string;
  submission_id: string;
  row_order: number;
  payload: Record<string, string | number | boolean | null>;
  created_at: string;
  updated_at: string;
}

export interface GenericReportAuditLog {
  id: string;
  submission_id: string;
  action: 'create' | 'update' | 'save_draft' | 'submit' | 'review' | 'request_revision' | 'approve' | 'lock';
  actor: string;
  notes?: string;
  previous_status?: ReportSubmissionStatus;
  next_status?: ReportSubmissionStatus;
  created_at: string;
}

export interface ReportValidationIssue {
  path: string;
  section: string;
  message: string;
}

export interface ReportValidationResult {
  valid: boolean;
  issues: ReportValidationIssue[];
  autoCalculatedItems: GenericReportItem[];
}
