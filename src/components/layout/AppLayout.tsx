import { PropsWithChildren, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { HeaderBar } from './HeaderBar';
import { userLogService } from '@/services/user-log-service';

export function AppLayout({ children }: PropsWithChildren) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    void userLogService.log('page_view', `Membuka halaman ${location.pathname}`);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-950">
      <div className="hidden md:block md:shrink-0">
        <Sidebar />
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="Tutup menu"
            className="absolute inset-0 bg-slate-950/55"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="relative z-10 h-full w-72 max-w-[85vw]">
            <Sidebar onNavigate={() => setIsSidebarOpen(false)} />
          </div>
        </div>
      )}

      <main className="min-w-0 flex-1 p-3 sm:p-4 md:p-6">
        <HeaderBar onToggleSidebar={() => setIsSidebarOpen(true)} />
        {children}
      </main>
    </div>
  );
}
