import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import type { UserRole } from '@/types/domain';
import { userLogService } from '@/services/user-log-service';
import { ACCESS_SUMMARY, ROLE_LABEL } from '@/features/auth/access-control';

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
          <button onClick={() => loginAs('reviewer_kotama')} className="w-full rounded-xl border px-4 py-3">Login sebagai Reviewer Kotama</button>
          <button onClick={() => loginAs('viewer_pimpinan')} className="w-full rounded-xl border px-4 py-3">Login sebagai Viewer Pimpinan</button>
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h2 className="text-sm font-semibold text-slate-700">Level Akses</h2>
          <div className="mt-3 space-y-3 text-xs text-slate-600">
            {Object.entries(ACCESS_SUMMARY).map(([role, permissions]) => (
              <div key={role}>
                <p className="font-semibold text-slate-800">{ROLE_LABEL[role as UserRole]}</p>
                <ul className="ml-4 list-disc space-y-1">
                  {permissions.map((permission) => (
                    <li key={permission}>{permission}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
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
