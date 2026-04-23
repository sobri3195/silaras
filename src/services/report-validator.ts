import type { GenericReportItem, ReportTemplate, ReportValidationResult } from '@/types/report-engine';

function toNumber(value: unknown) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.trim() !== '') return Number(value);
  return 0;
}

export function validateReportItems(template: ReportTemplate, items: GenericReportItem[]): ReportValidationResult {
  const issues: ReportValidationResult['issues'] = [];
  const tableSections = template.schema.sections.filter((section) => section.columns && section.repeatable_rows);

  const autoCalculatedItems = items.map((item) => ({ ...item, payload: { ...item.payload } }));

  tableSections.forEach((section) => {
    const columns = section.columns ?? [];
    const keyFields = columns.filter((col) => col.validation?.required).map((col) => col.key);

    autoCalculatedItems.forEach((item, rowIndex) => {
      keyFields.forEach((key) => {
        if (item.payload[key] === null || item.payload[key] === undefined || item.payload[key] === '') {
          issues.push({ section: section.title, path: `${section.id}.${rowIndex}.${key}`, message: `${key} wajib diisi` });
        }
      });

      columns.forEach((col) => {
        if (col.type === 'calculated' && col.computed_from?.length) {
          const total = col.computed_from.reduce((acc, key) => acc + toNumber(item.payload[key]), 0);
          item.payload[col.key] = total;
        }

        if (col.type === 'number' || col.type === 'calculated') {
          const n = toNumber(item.payload[col.key]);
          if (col.validation?.noNegative && n < 0) {
            issues.push({ section: section.title, path: `${section.id}.${rowIndex}.${col.key}`, message: `${col.label} tidak boleh negatif` });
          }
          if (typeof col.validation?.min === 'number' && n < col.validation.min) {
            issues.push({ section: section.title, path: `${section.id}.${rowIndex}.${col.key}`, message: `${col.label} minimal ${col.validation.min}` });
          }
          if (typeof col.validation?.max === 'number' && n > col.validation.max) {
            issues.push({ section: section.title, path: `${section.id}.${rowIndex}.${col.key}`, message: `${col.label} maksimal ${col.validation.max}` });
          }
        }
      });
    });

    const nameCol = columns.find((col) => col.key === 'indikator' || col.key === 'jabatan');
    if (nameCol) {
      const seen = new Set<string>();
      autoCalculatedItems.forEach((item, rowIndex) => {
        const key = String(item.payload[nameCol.key] ?? '').trim().toLowerCase();
        if (!key) return;
        if (seen.has(key)) {
          issues.push({ section: section.title, path: `${section.id}.${rowIndex}.${nameCol.key}`, message: `${nameCol.label} duplikat` });
        }
        seen.add(key);
      });
    }
  });

  return {
    valid: issues.length === 0,
    issues,
    autoCalculatedItems,
  };
}
