import type { UserRole } from '@/types/domain';

export interface UserSession {
  email: string;
  role: UserRole;
  hospital_id: string | null;
  name: string;
  login_at: string;
}

interface DemoUser {
  email: string;
  password: string;
  role: UserRole;
  hospital_id: string | null;
  name: string;
}

export const DEMO_USERS: DemoUser[] = [
  {
    email: 'pusat@silaras.local',
    password: 'admin123',
    role: 'admin_pusat',
    hospital_id: null,
    name: 'Admin Pusat SiLaras',
  },
  {
    email: 'hardjolukito@silaras.local',
    password: 'admin123',
    role: 'admin_rs',
    hospital_id: 'RS-001',
    name: 'Admin RS Hardjolukito',
  },
];

const SESSION_KEY = 'silaras_session';

export function authenticateDemoUser(email: string, password: string): UserSession | null {
  const found = DEMO_USERS.find((user) => user.email === email.trim().toLowerCase() && user.password === password);
  if (!found) return null;

  return {
    email: found.email,
    role: found.role,
    hospital_id: found.hospital_id,
    name: found.name,
    login_at: new Date().toISOString(),
  };
}

export function saveSession(session: UserSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  localStorage.setItem('silaras_role', session.role);
  if (session.hospital_id) {
    localStorage.setItem('silaras_hospital_id', session.hospital_id);
  } else {
    localStorage.removeItem('silaras_hospital_id');
  }
}

export function getSession(): UserSession | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as UserSession;
    if (parsed.role === 'admin_rs' && !parsed.hospital_id) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem('silaras_role');
  localStorage.removeItem('silaras_hospital_id');
}

export function resolveLandingByRole(role: UserRole) {
  return role === 'admin_pusat' ? '/dashboard/pusat' : '/dashboard/rs';
}
