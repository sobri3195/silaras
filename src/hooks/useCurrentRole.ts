import type { UserRole } from '@/types/domain';

export function useCurrentRole(): UserRole {
  return (localStorage.getItem('silaras_role') as UserRole | null) ?? 'admin_puskesau';
}
