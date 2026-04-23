import { useEffect, useMemo, useState } from 'react';
import { monthlyHealthReportStorage } from '@/services/monthly-health-report-storage';
import { exportNarrativeToPdf } from './export-utils';

export function MonthlyNarrativePage() {
  monthlyHealthReportStorage.init();
  const hospitals = monthlyHealthReportStorage.listHospitals();
  const periods = monthlyHealthReportStorage.listPeriods();
  const [hospitalId, setHospitalId] = useState('RS-WIRIADINATA');
  const [periodId, setPeriodId] = useState('period-2026-04');

  const narrative = monthlyHealthReportStorage.getNarrative(hospitalId, periodId);
  const [sections, setSections] = useState<Record<string, string>>(narrative?.sections ?? {});
  const sectionDefs = monthlyHealthReportStorage.getNarrativeTemplateSections();
  const [notice, setNotice] = useState('');

  useEffect(() => {
    setSections(narrative?.sections ?? {});
  }, [narrative?.id]);

  useEffect(() => {
    if (!narrative) return;
    const timer = setTimeout(() => {
      monthlyHealthReportStorage.saveNarrative({ ...narrative, sections }, 'admin_rs', 'autosave');
      setNotice('Autosave draft tersimpan.');
    }, 800);
    return () => clearTimeout(timer);
  }, [sections]);

  const completed = useMemo(() => sectionDefs.filter((x) => (sections[x.key] ?? '').trim().length > 0).length, [sectionDefs, sections]);

  if (!narrative) return <div className="rounded-2xl border bg-white p-4">Naratif belum tersedia.</div>;

  const save = (mode: 'draft' | 'submit') => {
    monthlyHealthReportStorage.saveNarrative({ ...narrative, sections }, 'admin_rs', mode);
    setNotice(mode === 'submit' ? 'Laporan naratif disubmit.' : 'Draft naratif disimpan.');
  };

  return (
    <div className="space-y-4 pb-14">
      <section className="rounded-2xl border bg-white p-5 shadow-soft">
        <h2 className="text-xl font-bold">Laporan Bulanan Satkes - Naratif</h2>
        <p className="text-sm text-slate-500">Template resmi untuk pendahuluan sampai penutup.</p>
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <select value={hospitalId} onChange={(e) => setHospitalId(e.target.value)} className="rounded-xl border px-3 py-2 text-sm">{hospitals.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select>
          <select value={periodId} onChange={(e) => setPeriodId(e.target.value)} className="rounded-xl border px-3 py-2 text-sm">{periods.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}</select>
          <div className="rounded-xl border px-3 py-2 text-sm">Progress section: {completed}/{sectionDefs.length}</div>
        </div>
      </section>

      <section className="grid gap-3 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-2xl border bg-white p-4 shadow-soft">
          <p className="mb-2 text-sm font-semibold">Progress Sidebar</p>
          <ul className="space-y-1 text-xs">
            {sectionDefs.map((section) => <li key={section.key} className="flex justify-between"><span>{section.title}</span><span>{(sections[section.key] ?? '').trim() ? '✅' : '⏳'}</span></li>)}
          </ul>
        </aside>

        <div className="space-y-3">
          {sectionDefs.map((section) => (
            <article key={section.key} className="rounded-2xl border bg-white p-4 shadow-soft">
              <p className="font-semibold">{section.title}</p>
              {section.helper ? <p className="text-xs text-slate-500">{section.helper}</p> : null}
              <textarea rows={4} value={sections[section.key] ?? ''} onChange={(e) => setSections((prev) => ({ ...prev, [section.key]: e.target.value }))} placeholder={section.placeholder ?? `Isi bagian ${section.title}...`} className="mt-2 w-full rounded-xl border p-3 text-sm" />
            </article>
          ))}
        </div>
      </section>

      <div className="sticky bottom-3 z-10 flex flex-wrap gap-2 rounded-2xl border bg-white p-3 shadow-soft">
        <button className="rounded-xl border px-3 py-2 text-sm" onClick={() => save('draft')}>Save Draft</button>
        <button className="rounded-xl bg-primary px-3 py-2 text-sm text-white" onClick={() => save('submit')}>Submit Naratif</button>
        <button className="rounded-xl border px-3 py-2 text-sm" onClick={() => exportNarrativeToPdf(narrative.title, sections)}>Export PDF</button>
        {notice ? <p className="text-sm text-emerald-700">{notice}</p> : null}
      </div>
    </div>
  );
}
