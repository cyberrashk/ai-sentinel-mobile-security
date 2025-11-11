import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type AlertInsert = Database['public']['Tables']['alerts']['Insert'];
type ScanInsert = Database['public']['Tables']['antivirus_scans']['Insert'];

export type ScanType = 'quick' | 'full' | 'custom';

export const startScan = async (scanType: ScanType, userId: string) => {
  const scanData: ScanInsert = {
    user_id: userId,
    scan_type: scanType,
    status: 'running',
    started_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('antivirus_scans')
    .insert(scanData)
    .select()
    .single();

  if (error) throw error;

  // Simulate scan completion
  setTimeout(async () => {
    const itemsScanned = scanType === 'quick' ? 1000 : scanType === 'full' ? 10000 : 5000;
    const threatsFound = Math.floor(Math.random() * 5);
    const duration = scanType === 'quick' ? 60 : scanType === 'full' ? 300 : 180;

    await supabase
      .from('antivirus_scans')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        items_scanned: itemsScanned,
        threats_found: threatsFound,
        duration_seconds: duration,
      })
      .eq('id', data.id);

    // Create threats if found
    if (threatsFound > 0) {
      const severities: Array<'low' | 'medium' | 'high' | 'critical'> = ['low', 'medium', 'high', 'critical'];
      const threats = Array.from({ length: threatsFound }, (_, i) => ({
        user_id: userId,
        scan_id: data.id,
        name: `Threat-${Date.now()}-${i}`,
        type: ['virus', 'malware', 'trojan', 'spyware'][Math.floor(Math.random() * 4)],
        severity: severities[Math.floor(Math.random() * 4)],
        file_path: `/system/file${i}.exe`,
        status: 'detected' as const,
      }));

      await supabase.from('threats').insert(threats);

      // Create alert
      const alertData: AlertInsert = {
        user_id: userId,
        type: 'antivirus',
        severity: 'critical',
        title: 'Threats Detected',
        message: `Found ${threatsFound} threat(s) during ${scanType} scan`,
      };
      await supabase.from('alerts').insert(alertData);
    }
  }, 3000);

  return data;
};

export const getScanStatus = async (scanId: string) => {
  const { data, error } = await supabase
    .from('antivirus_scans')
    .select('*')
    .eq('id', scanId)
    .single();

  if (error) throw error;
  return data;
};

export const getRecentScans = async (userId: string, limit = 10) => {
  const { data, error } = await supabase
    .from('antivirus_scans')
    .select('*')
    .eq('user_id', userId)
    .order('started_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};

export const getThreats = async (userId: string) => {
  const { data, error } = await supabase
    .from('threats')
    .select('*')
    .eq('user_id', userId)
    .order('detected_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const handleThreat = async (threatId: string, action: 'quarantine' | 'remove' | 'allow') => {
  const status = action === 'allow' ? 'allowed' : action === 'quarantine' ? 'quarantined' : 'removed';
  
  const { data, error } = await supabase
    .from('threats')
    .update({
      status,
      resolved_at: new Date().toISOString(),
    })
    .eq('id', threatId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
