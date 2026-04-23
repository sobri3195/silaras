import { Link } from 'react-router-dom';
import { reportEngineStorage } from '@/services/report-engine-storage';

export function MonthlyVerificationPage() {
  reportEngineStorage.init();
  const submissions = reportEngineStorage.listSubmissions();
  const types = reportEngineStorage.listReportTypes();

  return (
    <div className="space-y-4 pb-8">
      <section className="rounded-2xl border bg-white p-5 shadow-soft">
        <h2 className="text-xl font-bold">Verification Dashboard - Bulanan</h2>
        <p className="text-sm text-slate-500">Admin Puskesau dapat memfilter, review, revisi, approve, dan lock laporan.</p>
      </section>

      <section className="rounded-2xl border bg-white p-4 shadow-soft">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-left">
                <th className="px-3 py-2">Jenis Laporan</th>
                <th className="px-3 py-2">Rumah Sakit</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub) => {
                const type = types.find((x) => x.id === sub.report_type_id);
                return (
                  <tr key={sub.id} className="border-b">
                    <td className="px-3 py-2">{type?.title ?? sub.report_type_id}</td>
                    <td className="px-3 py-2">{sub.hospital_id}</td>
                    <td className="px-3 py-2">{sub.status}</td>
                    <td className="px-3 py-2">
                      <Link to={`/reports/monthly/${type?.code}/${sub.id}`} className="rounded-lg border px-2 py-1 text-xs">Review</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
