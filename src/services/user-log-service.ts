import { supabase } from '@/lib/supabase';

export type UserLogAction =
  | 'login'
  | 'session_start'
  | 'page_view'
  | 'logout'
  | 'create'
  | 'update'
  | 'delete'
  | 'submit';

export interface UserActivityLog {
  id: string;
  action: UserLogAction;
  userRole: string;
  path: string;
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

const STORAGE_KEY = 'silaras_user_logs';
const MAX_LOGS = 200;

function readLogs(): UserActivityLog[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as UserActivityLog[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLogs(logs: UserActivityLog[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs.slice(0, MAX_LOGS)));
}

function currentRole() {
  return localStorage.getItem('silaras_role') ?? 'guest';
}

export const userLogService = {
  getLogs(): UserActivityLog[] {
    return readLogs();
  },

  clearLogs() {
    localStorage.removeItem(STORAGE_KEY);
  },

  async log(action: UserLogAction, description: string, metadata?: Record<string, unknown>) {
    const newLog: UserActivityLog = {
      id: crypto.randomUUID(),
      action,
      userRole: currentRole(),
      path: window.location.pathname,
      description,
      metadata,
      createdAt: new Date().toISOString(),
    };

    const existing = readLogs();
    writeLogs([newLog, ...existing]);

    // Best effort mirror ke Supabase jika backend aktif.
    void supabase.from('activity_logs').insert({
      action,
      entity_type: 'user_activity',
      entity_id: null,
      description,
      metadata: {
        ...metadata,
        path: newLog.path,
        role: newLog.userRole,
      },
    });
  },
};
