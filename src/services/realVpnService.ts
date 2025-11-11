import { supabase } from '@/integrations/supabase/client';

export interface VpnServer {
  id: string;
  name: string;
  country: string;
  ping: string;
  premium: boolean;
}

export const vpnServers: VpnServer[] = [
  { id: 'us-ny-1', name: 'New York', country: 'United States', ping: '15ms', premium: false },
  { id: 'uk-ld-1', name: 'London', country: 'United Kingdom', ping: '25ms', premium: false },
  { id: 'jp-tk-1', name: 'Tokyo', country: 'Japan', ping: '120ms', premium: true },
  { id: 'de-be-1', name: 'Berlin', country: 'Germany', ping: '30ms', premium: false },
  { id: 'au-sy-1', name: 'Sydney', country: 'Australia', ping: '180ms', premium: true },
];

export const connectVpn = async (serverId: string, userId: string) => {
  const server = vpnServers.find(s => s.id === serverId);
  if (!server) throw new Error('Server not found');

  // Check if premium required
  if (server.premium) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', userId)
      .single();

    if (!profile || profile.subscription_tier === 'free') {
      throw new Error('Premium subscription required for this server');
    }
  }

  // Create VPN session
  const { data, error } = await supabase
    .from('vpn_sessions')
    .insert({
      user_id: userId,
      server_id: server.id,
      server_name: server.name,
      server_country: server.country,
      ip_address: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      is_active: true,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const disconnectVpn = async (sessionId: string) => {
  const { data, error } = await supabase
    .from('vpn_sessions')
    .update({
      is_active: false,
      disconnected_at: new Date().toISOString(),
    })
    .eq('id', sessionId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getActiveSession = async (userId: string) => {
  const { data, error } = await supabase
    .from('vpn_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('connected_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const getAvailableServers = async (userId: string) => {
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier')
    .eq('id', userId)
    .single();

  const isPremium = profile && profile.subscription_tier !== 'free';
  return vpnServers.filter(server => !server.premium || isPremium);
};
