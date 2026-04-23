import { CalendarDays, Search } from 'lucide-react';

export function HeaderBar() {
  return (
    <header className="sticky top-0 z-10 mb-6 flex items-center justify-between rounded-2xl border bg-white px-5 py-3 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div>
        <p className="text-xs uppercase text-slate-500">Sistem Laporan RSAU</p>
        <h2 className="font-semibold">Komando Pelaporan Kesehatan</h2>
      </div>
      <div className="flex items-center gap-3">
        <button className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm">
          <CalendarDays className="h-4 w-4" /> TW I 2026
        </button>
        <button className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm">
          <Search className="h-4 w-4" /> Cari RS
        </button>
      </div>
    </header>
  );
}
