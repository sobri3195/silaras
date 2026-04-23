import { StatusBadge } from '@/components/common/StatusBadge';

export function RsDashboardPage() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <article className="rounded-2xl border bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
        <h3 className="mb-2 text-lg font-semibold">RSAU dr. Esnawan Antariksa</h3>
        <p className="mb-4 text-sm text-slate-500">Periode aktif: TW I 2026 (deadline 30 April 2026)</p>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl border p-3">
            <span>Laporan BOR</span>
            <StatusBadge status="revision_needed" />
          </div>
          <div className="flex items-center justify-between rounded-xl border p-3">
            <span>Laporan 10 Penyakit</span>
            <StatusBadge status="submitted" />
          </div>
        </div>
      </article>
      <article className="rounded-2xl border bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-3 font-semibold">Catatan Revisi Terbaru</h3>
        <p className="text-sm text-slate-600">Mohon verifikasi ulang BOR karena tren menurun tajam dibanding TW IV 2025.</p>
      </article>
    </div>
  );
}
