import { useEffect, useMemo, useState } from 'react';
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom';
import type { UserRole } from '@/types/domain';
import { userLogService } from '@/services/user-log-service';
import { ACCESS_SUMMARY, ROLE_LABEL } from '@/features/auth/access-control';
import { authenticateDemoUser, DEMO_USERS, getSession, resolveLandingByRole, saveSession } from '@/features/auth/session';
import { reportEngineStorage } from '@/services/report-engine-storage';

export function LoginPage() {
  const [email, setEmail] = useState(DEMO_USERS[0].email);
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const activeSession = getSession();

  const login = async () => {
    const session = authenticateDemoUser(email, password);
    if (!session) {
      setError('Email atau password tidak valid.');
      return;
    }

    saveSession(session);
    await userLogService.log('login', `Login berhasil sebagai ${session.role}`, {
      email: session.email,
      hospital_id: session.hospital_id,
    });
    window.location.href = resolveLandingByRole(session.role);
  };

  if (activeSession) {
    return <Navigate to={resolveLandingByRole(activeSession.role)} replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-50 p-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-soft">
        <h1 className="mb-2 text-2xl font-bold text-primary">SiLaras</h1>
        <p className="mb-6 text-sm text-slate-500">Masuk ke Sistem Laporan RSAU</p>

        <div className="space-y-3">
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border px-3 py-2 text-sm" placeholder="Email" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border px-3 py-2 text-sm" placeholder="Password" type="password" />
          {error ? <p className="text-xs text-rose-600">{error}</p> : null}
          <button onClick={() => void login()} className="w-full rounded-xl bg-primary px-4 py-3 text-white">Login</button>
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h2 className="text-sm font-semibold text-slate-700">Akun Demo</h2>
          <ul className="mt-2 space-y-1 text-xs text-slate-600">
            {DEMO_USERS.map((user) => (
              <li key={user.email}>{user.email} / {user.password} — {ROLE_LABEL[user.role]}</li>
            ))}
          </ul>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h2 className="text-sm font-semibold text-slate-700">Ringkasan Akses</h2>
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
  const session = getSession();

  useEffect(() => {
    if (session) {
      void userLogService.log('session_start', 'Sesi user aktif', { role: session.role, hospital_id: session.hospital_id });
    }
  }, [session?.email]);

  return session ? <Outlet /> : <Navigate to="/login" replace />;
}

export function RoleGuard({ allow }: { allow: UserRole[] }) {
  const session = getSession();
  if (!session) return <Navigate to="/login" replace />;
  return allow.includes(session.role) ? <Outlet /> : <Navigate to="/forbidden" replace />;
}

export function HospitalScopeGuard() {
  const session = getSession();
  const location = useLocation();
  const params = useParams();

  const allowed = useMemo(() => {
    if (!session) return false;
    if (session.role === 'admin_pusat') return true;
    if (!session.hospital_id) return false;

    const routeHospitalId = params.hospitalId;
    if (routeHospitalId) return routeHospitalId === session.hospital_id;

    const submissionId = params.submissionId;
    if (submissionId) {
      reportEngineStorage.init();
      const submission = reportEngineStorage.listSubmissions().find((item) => item.id === submissionId);
      return Boolean(submission && submission.hospital_id === session.hospital_id);
    }

    return true;
  }, [session, params.hospitalId, params.submissionId]);

  useEffect(() => {
    if (!allowed && session) {
      void userLogService.log('forbidden', 'Akses ditolak oleh HospitalScopeGuard', {
        path: location.pathname,
        role: session.role,
        hospital_id: session.hospital_id,
      });
    }
  }, [allowed, location.pathname, session?.email]);

  return allowed ? <Outlet /> : <Navigate to="/forbidden" replace />;
}

export function UnauthorizedPage() {
  return <div className="rounded-2xl border bg-white p-6 shadow-soft">401 Unauthorized. Silakan login.</div>;
}

export function ForbiddenPage() {
  return <div className="rounded-2xl border bg-white p-6 shadow-soft">403 Forbidden. Anda tidak memiliki akses ke halaman ini.</div>;
}
