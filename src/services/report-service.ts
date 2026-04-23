import { supabase } from '@/lib/supabase';

export const reportService = {
  async getBorReports(periodId: string) {
    return supabase.from('bor_reports').select('*, hospitals(nama_rs)').eq('reporting_period_id', periodId);
  },
  async saveBorDraft(payload: Record<string, unknown>) {
    return supabase.from('bor_reports').upsert(payload, { onConflict: 'hospital_id,reporting_period_id' });
  },
};
