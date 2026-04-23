import { X } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import type { HospitalDashboardRecord } from '../types';

export function HospitalDetailDrawer({ open, record, onClose }: { open: boolean; record: HospitalDashboardRecord | null; onClose: () => void; }) {
  if (!open || !record) return null;
  return (
    <div className="fixed inset-0 z-40 bg-slate-900/30" onClick={onClose}>
      <aside className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white p-5 shadow-2xl dark:bg-slate-900" onClick={(e) => e.stopPropagation()}>
        <button className="ml-auto block rounded-lg border p-1" onClick={onClose}><X className="h-4 w-4" /></button>
        <h3 className="mt-2 text-lg font-semibold">{record.name}</h3>
        <div className="mt-2"><StatusBadge status={record.submitStatus} /></div>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><dt>BOR</dt><dd>{record.bor.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</dd></div>
          <div className="flex justify-between"><dt>Total TT</dt><dd>{record.totalBeds.toLocaleString('id-ID')}</dd></div>
          <div className="flex justify-between"><dt>Wilayah</dt><dd>{record.wilayah}</dd></div>
        </dl>
      </aside>
    </div>
  );
}
