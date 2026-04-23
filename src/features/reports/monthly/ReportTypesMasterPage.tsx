import { useState } from 'react';
import { reportEngineStorage } from '@/services/report-engine-storage';
import { userLogService } from '@/services/user-log-service';

export function ReportTypesMasterPage() {
  reportEngineStorage.init();
  const [types, setTypes] = useState(reportEngineStorage.listReportTypes());
  const [importValue, setImportValue] = useState('');

  const toggleActive = (id: string) => {
    const next = types.map((type) => (type.id === id ? { ...type, is_active: !type.is_active, updated_at: new Date().toISOString() } : type));
    setTypes(next);
    reportEngineStorage.saveReportTypes(next);
    void userLogService.log('master_data_update', `Toggle report type ${id}`);
  };

  const doExport = () => {
    const blob = new Blob([reportEngineStorage.exportJson()], { type: 'application/json' });
    void userLogService.log('master_data_update', 'Export master report type JSON');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'silaras-report-engine-export.json';
    link.click();
  };

  return (
    <div className="space-y-4 pb-8">
      <section className="rounded-2xl border bg-white p-5 shadow-soft">
        <p className="text-xs uppercase tracking-wide text-slate-500">Demo Local Mode</p>
        <h2 className="text-xl font-bold">Master Report Types</h2>
        <p className="text-sm text-slate-500">Kelola aktif/nonaktif, reset template/submission, export/import JSON, dan dev panel localStorage.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="rounded-xl border px-3 py-2 text-sm" onClick={() => { reportEngineStorage.resetTemplates(); setTypes(reportEngineStorage.listReportTypes()); void userLogService.log('master_data_update', 'Reset templates'); }}>Reset Templates</button>
          <button className="rounded-xl border px-3 py-2 text-sm" onClick={() => { reportEngineStorage.resetSubmissions(); void userLogService.log('master_data_update', 'Reset submissions'); }}>Reset Submissions</button>
          <button className="rounded-xl border px-3 py-2 text-sm" onClick={doExport}>Export JSON</button>
        </div>
      </section>

      <section className="rounded-2xl border bg-white p-4 shadow-soft">
        <h3 className="mb-2 font-semibold">Daftar Jenis Laporan</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-left">
                <th className="px-3 py-2">Kode</th>
                <th className="px-3 py-2">Judul</th>
                <th className="px-3 py-2">Kategori</th>
                <th className="px-3 py-2">Aktif</th>
                <th className="px-3 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {types.map((type) => (
                <tr key={type.id} className="border-b">
                  <td className="px-3 py-2 font-mono text-xs">{type.code}</td>
                  <td className="px-3 py-2">{type.title}</td>
                  <td className="px-3 py-2">{type.category}</td>
                  <td className="px-3 py-2">{type.is_active ? 'Ya' : 'Tidak'}</td>
                  <td className="px-3 py-2"><button onClick={() => toggleActive(type.id)} className="rounded-lg border px-2 py-1 text-xs">Toggle</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border bg-white p-4 shadow-soft">
        <h3 className="font-semibold">Import JSON</h3>
        <textarea className="mt-2 h-36 w-full rounded-xl border p-2 font-mono text-xs" value={importValue} onChange={(e) => setImportValue(e.target.value)} />
        <button
          className="mt-2 rounded-xl bg-primary px-3 py-2 text-sm text-white"
          onClick={() => {
            if (!importValue.trim()) return;
            reportEngineStorage.importJson(importValue);
            setTypes(reportEngineStorage.listReportTypes());
            void userLogService.log('master_data_update', 'Import master report type JSON');
          }}
        >
          Import
        </button>
      </section>

      <section className="rounded-2xl border bg-slate-950 p-4 text-xs text-slate-100 shadow-soft">
        <h3 className="mb-2 font-semibold">Dev Panel localStorage</h3>
        <pre className="max-h-96 overflow-auto">{reportEngineStorage.exportJson()}</pre>
      </section>
    </div>
  );
}
