import type { MonthlyAttachmentTemplate, MonthlyFormMode } from '@/types/monthly-health-report';

type Row = Record<string, string | number | boolean | null>;

interface Props {
  template: MonthlyAttachmentTemplate;
  rows: Row[];
  onRowsChange: (rows: Row[]) => void;
  mode?: MonthlyFormMode;
}

function asNumber(v: unknown) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export function computeCalculatedRows(template: MonthlyAttachmentTemplate, rows: Row[]) {
  return rows.map((row) => {
    const next = { ...row };
    template.fields.forEach((field) => {
      if (field.type === 'calculated' && field.formula?.sum?.length) {
        next[field.key] = field.formula.sum.reduce((acc, key) => acc + asNumber(next[key]), 0);
      }
    });
    return next;
  });
}

export function MonthlyDynamicFormEngine({ template, rows, onRowsChange, mode = 'table' }: Props) {
  const readOnly = mode === 'read_only' || mode === 'print_preview';
  const normalized = computeCalculatedRows(template, rows);

  const updateCell = (index: number, key: string, value: string | number) => {
    const copy = [...normalized];
    copy[index] = { ...copy[index], [key]: value };
    onRowsChange(computeCalculatedRows(template, copy));
  };

  const addRow = () => onRowsChange([...normalized, {}]);
  const copyRow = (index: number) => onRowsChange([...normalized, { ...normalized[index] }]);
  const clearRow = (index: number) => {
    const cleared = template.fields.reduce<Row>((acc, field) => {
      acc[field.key] = field.type === 'number' || field.type === 'percentage' || field.type === 'calculated' ? 0 : '';
      return acc;
    }, {});
    const copy = [...normalized];
    copy[index] = cleared;
    onRowsChange(copy);
  };

  const totals = template.total_fields?.reduce<Record<string, number>>((acc, key) => {
    acc[key] = normalized.reduce((sum, row) => sum + asNumber(row[key]), 0);
    return acc;
  }, {});

  return (
    <div className="space-y-3 overflow-x-auto rounded-2xl border bg-white p-4 shadow-soft">
      <h3 className="text-base font-semibold">{template.code} - {template.title}</h3>
      <p className="text-sm text-slate-500">{template.description}</p>
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr>
            {template.fields.map((field) => <th key={field.key} className="border bg-slate-50 px-2 py-2 text-left">{field.label}</th>)}
            {!readOnly ? <th className="border bg-slate-50 px-2 py-2">Aksi</th> : null}
          </tr>
        </thead>
        <tbody>
          {normalized.map((row, idx) => (
            <tr key={idx}>
              {template.fields.map((field) => (
                <td className="border px-2 py-1" key={field.key}>
                  {field.type === 'select' ? (
                    <select className="w-full rounded-lg border px-2 py-1" disabled={readOnly || field.readonly} value={String(row[field.key] ?? '')} onChange={(e) => updateCell(idx, field.key, e.target.value)}>
                      <option value="">Pilih</option>
                      {field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  ) : field.type === 'textarea' || field.type === 'notes' ? (
                    <textarea className="w-full rounded-lg border px-2 py-1" rows={2} disabled={readOnly || field.readonly} value={String(row[field.key] ?? '')} onChange={(e) => updateCell(idx, field.key, e.target.value)} />
                  ) : (
                    <input className="w-full rounded-lg border px-2 py-1" type={field.type === 'number' || field.type === 'percentage' || field.type === 'calculated' ? 'number' : 'text'} disabled={readOnly || field.readonly || field.type === 'calculated'} value={String(row[field.key] ?? '')} onChange={(e) => updateCell(idx, field.key, field.type === 'number' || field.type === 'percentage' || field.type === 'calculated' ? Number(e.target.value) : e.target.value)} />
                  )}
                </td>
              ))}
              {!readOnly ? (
                <td className="border px-2 py-1">
                  <div className="flex gap-1">
                    {template.supports_copy_row ? <button className="rounded border px-2 py-1 text-xs" onClick={() => copyRow(idx)} type="button">Copy</button> : null}
                    <button className="rounded border px-2 py-1 text-xs" onClick={() => clearRow(idx)} type="button">Clear</button>
                  </div>
                </td>
              ) : null}
            </tr>
          ))}
          {totals ? (
            <tr className="bg-slate-50 font-semibold">
              {template.fields.map((field, fieldIdx) => (
                <td key={field.key} className="border px-2 py-2">
                  {fieldIdx === 0 ? 'TOTAL' : totals[field.key] ?? ''}
                </td>
              ))}
              {!readOnly ? <td className="border" /> : null}
            </tr>
          ) : null}
        </tbody>
      </table>
      {!readOnly && template.repeatable_rows ? <button type="button" className="rounded-xl border px-3 py-2 text-sm" onClick={addRow}>Tambah Baris</button> : null}
    </div>
  );
}
