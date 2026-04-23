import type { GenericReportItem, ReportTemplate } from '@/types/report-engine';

type Props = {
  template: ReportTemplate;
  sectionPayload: Record<string, string | number | boolean | null>;
  onSectionPayloadChange: (key: string, value: string | number | boolean | null) => void;
  rows: Array<Record<string, string | number | boolean | null>>;
  onRowsChange: (next: Array<Record<string, string | number | boolean | null>>) => void;
  readOnly?: boolean;
};

function valueAsString(value: unknown) {
  if (value === null || value === undefined) return '';
  return String(value);
}

export function DynamicReportRenderer({ template, sectionPayload, onSectionPayloadChange, rows, onRowsChange, readOnly }: Props) {
  const addRow = () => {
    onRowsChange([...rows, {}]);
  };

  const updateRow = (index: number, key: string, value: string | number | boolean | null) => {
    const copy = [...rows];
    copy[index] = { ...copy[index], [key]: value };
    onRowsChange(copy);
  };

  return (
    <div className="space-y-5">
      {template.schema.sections.map((section) => (
        <section key={section.id} className="rounded-2xl border bg-white p-5 shadow-soft">
          <h3 className="text-base font-semibold">{section.title}</h3>
          {section.description ? <p className="mt-1 text-sm text-slate-500">{section.description}</p> : null}

          {section.fields?.length ? (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {section.fields.map((field) => (
                <label key={field.key} className="flex flex-col gap-1 text-sm">
                  <span className="font-medium text-slate-700">{field.label}</span>
                  {field.type === 'textarea' || field.type === 'notes' ? (
                    <textarea
                      disabled={readOnly}
                      rows={field.type === 'notes' ? 4 : 3}
                      value={valueAsString(sectionPayload[field.key])}
                      onChange={(e) => onSectionPayloadChange(field.key, e.target.value)}
                      className="rounded-xl border p-2"
                    />
                  ) : field.type === 'radio' && field.options ? (
                    <div className="flex gap-3 rounded-xl border p-2">
                      {field.options.map((opt) => (
                        <label key={opt} className="inline-flex items-center gap-1">
                          <input
                            disabled={readOnly}
                            type="radio"
                            name={field.key}
                            value={opt}
                            checked={sectionPayload[field.key] === opt}
                            onChange={() => onSectionPayloadChange(field.key, opt)}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      disabled={readOnly}
                      type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                      value={valueAsString(sectionPayload[field.key])}
                      onChange={(e) => onSectionPayloadChange(field.key, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                      className="rounded-xl border p-2"
                    />
                  )}
                </label>
              ))}
            </div>
          ) : null}

          {section.columns?.length ? (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left">
                    {section.columns.map((col) => (
                      <th key={col.key} className="border px-3 py-2 font-semibold">{col.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr key={idx}>
                      {section.columns?.map((col) => (
                        <td key={col.key} className="border px-2 py-1">
                          <input
                            disabled={readOnly || col.type === 'calculated'}
                            type={col.type === 'number' || col.type === 'calculated' ? 'number' : 'text'}
                            className="w-full rounded-lg border px-2 py-1"
                            value={valueAsString(row[col.key])}
                            onChange={(e) => updateRow(idx, col.key, col.type === 'number' || col.type === 'calculated' ? Number(e.target.value) : e.target.value)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {!readOnly ? (
                <button type="button" className="mt-3 rounded-xl border px-3 py-2 text-sm" onClick={addRow}>
                  Tambah Baris
                </button>
              ) : null}
            </div>
          ) : null}
        </section>
      ))}
    </div>
  );
}

export function splitItems(items: GenericReportItem[]) {
  return {
    sectionPayload: (items.find((item) => item.row_order === 0)?.payload ?? {}) as Record<string, string | number | boolean | null>,
    rows: items
      .filter((item) => item.row_order > 0)
      .sort((a, b) => a.row_order - b.row_order)
      .map((item) => item.payload),
  };
}
