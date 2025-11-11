import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type AlertInsert = Database['public']['Tables']['alerts']['Insert'];

export const getAlerts = async (userId: string) => {
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const markAsRead = async (alertId: string) => {
  const { data, error } = await supabase
    .from('alerts')
    .update({ is_read: true })
    .eq('id', alertId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const resolveAlert = async (alertId: string) => {
  const { data, error } = await supabase
    .from('alerts')
    .update({
      is_resolved: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', alertId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const createAlert = async (
  userId: string,
  type: AlertInsert['type'],
  severity: AlertInsert['severity'],
  title: string,
  message: string,
  metadata?: any
) => {
  const alertData: AlertInsert = {
    user_id: userId,
    type,
    severity,
    title,
    message,
    metadata,
  };

  const { data, error } = await supabase
    .from('alerts')
    .insert(alertData)
    .select()
    .single();

  if (error) throw error;
  return data;
};
