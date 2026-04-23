import { ExternalLink, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from './StatusBadge';
import type { HospitalDashboardRecord } from '../types';

export function HospitalDetailDrawer({ open, record, onClose }: { open: boolean; record: HospitalDashboardRecord | null; onClose: () => void }) {
  if (!open || !record) return null;
  const topDiseases = [...record.diseaseItems].sort((a, b) => b.total - a.total).slice(0, 3);

  return (
    <div className="fixed inset-0 z-40 bg-slate-900/30" onClick={onClose}>
      <aside className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white p-5 shadow-2xl dark:bg-slate-900" onClick={(e) => e.stopPropagation()}>
        <button className="ml-auto block rounded-lg border p-1" onClick={onClose}><X className="h-4 w-4" /></button>
        <h3 className="mt-2 text-lg font-semibold">{record.name}</h3>
        <p className="text-xs text-slate-500">{record.jenis} · {record.tingkat} · {record.wilayah}</p>
        <div className="mt-2"><StatusBadge status={record.submitStatus} /></div>

        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><dt>Nilai BOR</dt><dd className="font-semibold">{record.bor.toFixed(2)}%</dd></div>
          <div className="flex justify-between"><dt>Total TT</dt><dd>{record.totalBeds.toLocaleString('id-ID')}</dd></div>
          <div className="flex justify-between"><dt>Status Laporan</dt><dd>{record.reviewStatus}</dd></div>
          <div className="flex justify-between"><dt>Last Submit</dt><dd>{record.lastSubmit ? new Date(record.lastSubmit).toLocaleString('id-ID') : '-'}</dd></div>
        </dl>

        <div className="mt-4 rounded-xl border p-3">
          <h4 className="mb-2 text-sm font-semibold">Top 3 Penyakit</h4>
          {topDiseases.length ? topDiseases.map((d) => <p key={d.name} className="text-xs text-slate-600 dark:text-slate-300">• {d.normalizedName ?? d.name} ({d.total} kasus)</p>) : <p className="text-xs text-slate-500">Belum ada data penyakit.</p>}
        </div>

        <div className="mt-4 rounded-xl border p-3">
          <h4 className="mb-1 text-sm font-semibold">Review Notes Terakhir</h4>
          <p className="text-xs text-slate-500">Perlu verifikasi konsistensi angka BOR dengan komposisi kasus dan tren historis.</p>
        </div>

        <Button className="mt-4 w-full">Buka Detail <ExternalLink className="ml-1 h-4 w-4" /></Button>
      </aside>
    </div>
  );
}
