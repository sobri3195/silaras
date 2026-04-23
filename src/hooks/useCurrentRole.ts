import type { UserRole } from '@/types/domain';
import { getSession } from '@/features/auth/session';

export function useCurrentRole(): UserRole {
  return getSession()?.role ?? 'admin_rs';
}
