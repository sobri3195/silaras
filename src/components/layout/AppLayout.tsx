import { PropsWithChildren } from 'react';
import { Sidebar } from './Sidebar';
import { HeaderBar } from './HeaderBar';

export function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-950">
      <Sidebar />
      <main className="flex-1 p-6">
        <HeaderBar />
        {children}
      </main>
    </div>
  );
}
