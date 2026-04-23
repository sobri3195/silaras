import { getHighestBorHospital, getLowestBorHospital, getRiskFlags } from './helpers';

const sample = [
  { name: 'RSAU dr. M. Sutomo', bor: 71.79 },
  { name: 'RSAU dr. Soemitro', bor: 0.1 },
];

export function AnalyticsPage() {
  const highest = getHighestBorHospital(sample);
  const lowest = getLowestBorHospital(sample);

  return (
    <div className="space-y-4">
      <article className="rounded-2xl border bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-2 font-semibold">Insight Otomatis</h3>
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
          <li>{highest.name} memiliki BOR tertinggi periode ini ({highest.bor}%).</li>
          <li>{lowest.name} memiliki BOR terendah periode ini ({lowest.bor}%).</li>
          <li>Klasifikasi risiko tertinggi saat ini: {getRiskFlags(highest.bor)}.</li>
          <li>Terdapat variasi penamaan penyakit yang perlu normalisasi.</li>
        </ul>
      </article>
    </div>
  );
}
