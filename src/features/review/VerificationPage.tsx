import { StatusBadge } from '@/components/common/StatusBadge';

export function VerificationPage() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <section className="rounded-2xl border bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
        <h3 className="mb-2 text-lg font-semibold">Review Laporan - RSAU dr. M. Salamun</h3>
        <p className="mb-4 text-sm text-slate-500">Submitted 20 April 2026 oleh admin.rs@silaras.mil.id</p>
        <div className="mb-4 flex gap-2"><StatusBadge status="submitted" /></div>
        <div className="space-y-2 text-sm">
          <p>BOR: <strong>63.80%</strong></p>
          <p>Jumlah TT: <strong>250</strong></p>
        </div>
      </section>
      <aside className="rounded-2xl border bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h4 className="mb-3 font-semibold">Aksi Verifikasi</h4>
        <textarea className="mb-3 w-full rounded-xl border p-2" rows={4} placeholder="Catatan wajib jika minta revisi" />
        <div className="grid gap-2">
          <button className="rounded-xl bg-emerald-600 px-3 py-2 text-white">Approve</button>
          <button className="rounded-xl bg-amber-500 px-3 py-2 text-white">Minta Revisi</button>
          <button className="rounded-xl bg-primary px-3 py-2 text-white">Lock Final</button>
        </div>
      </aside>
    </div>
  );
}
