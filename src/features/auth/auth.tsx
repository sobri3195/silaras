import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import type { UserRole } from '@/types/domain';
import { userLogService } from '@/services/user-log-service';

const demoRole = (localStorage.getItem('silaras_role') as UserRole | null) ?? 'admin_puskesau';

export function LoginPage() {
  const loginAs = (role: UserRole) => {
    localStorage.setItem('silaras_role', role);
    void userLogService.log('login', `User login sebagai ${role}`, { role });
    window.location.href = role === 'admin_rs' ? '/dashboard/rs' : '/dashboard/puskesau';
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-50 p-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-soft">
        <h1 className="mb-2 text-2xl font-bold text-primary">SiLaras</h1>
        <p className="mb-6 text-sm text-slate-500">Masuk ke Sistem Laporan RSAU</p>
        <div className="space-y-3">
          <button onClick={() => loginAs('admin_puskesau')} className="w-full rounded-xl bg-primary px-4 py-3 text-white">Login sebagai Admin Puskesau</button>
          <button onClick={() => loginAs('admin_rs')} className="w-full rounded-xl border px-4 py-3">Login sebagai Admin RS</button>
        </div>
      </div>
    </div>
  );
}

export function ProtectedRoute() {
  const role = localStorage.getItem('silaras_role');

  useEffect(() => {
    if (role) {
      void userLogService.log('session_start', 'Sesi user aktif');
    }
  }, [role]);

  return role ? <Outlet /> : <Navigate to="/login" replace />;
}

export function RoleGuard({ allow }: { allow: UserRole[] }) {
  const role = (localStorage.getItem('silaras_role') as UserRole | null) ?? demoRole;
  return allow.includes(role) ? <Outlet /> : <Navigate to="/dashboard/rs" replace />;
}
