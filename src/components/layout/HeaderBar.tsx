import { CalendarDays, Menu, Search } from 'lucide-react';

type HeaderBarProps = {
  onToggleSidebar?: () => void;
};

export function HeaderBar({ onToggleSidebar }: HeaderBarProps) {
  return (
    <header className="sticky top-0 z-10 mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-white px-4 py-3 shadow-soft dark:border-slate-800 dark:bg-slate-900 sm:mb-6 sm:px-5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border text-slate-700 md:hidden"
          aria-label="Buka menu navigasi"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <p className="text-xs uppercase text-slate-500">Sistem Laporan RSAU</p>
          <h2 className="font-semibold">Komando Pelaporan Kesehatan</h2>
        </div>
      </div>

      <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:gap-3">
        <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm sm:flex-none">
          <CalendarDays className="h-4 w-4" />
          TW I 2026
        </button>
        <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm sm:flex-none">
          <Search className="h-4 w-4" />
          Cari RS
        </button>
      </div>
    </header>
  );
}
