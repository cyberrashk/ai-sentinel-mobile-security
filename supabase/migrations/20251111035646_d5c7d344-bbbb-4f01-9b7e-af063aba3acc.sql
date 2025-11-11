-- Create enum types
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.subscription_tier AS ENUM ('free', 'premium', 'pro');
CREATE TYPE public.scan_type AS ENUM ('quick', 'full', 'custom');
CREATE TYPE public.scan_status AS ENUM ('pending', 'running', 'completed', 'cancelled', 'failed');
CREATE TYPE public.threat_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE public.threat_status AS ENUM ('detected', 'quarantined', 'removed', 'allowed');
CREATE TYPE public.alert_type AS ENUM ('security', 'vpn', 'antivirus', 'dark_web', 'system');
CREATE TYPE public.alert_severity AS ENUM ('info', 'warning', 'critical');

-- ============================================
-- USER PROFILES TABLE
-- ============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier subscription_tier DEFAULT 'free' NOT NULL,
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- USER ROLES TABLE (SECURITY CRITICAL)
-- ============================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- User Roles RLS Policies
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- ============================================
-- VPN SESSIONS TABLE
-- ============================================
CREATE TABLE public.vpn_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  server_id TEXT NOT NULL,
  server_name TEXT NOT NULL,
  server_country TEXT NOT NULL,
  ip_address TEXT,
  connected_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  disconnected_at TIMESTAMPTZ,
  data_sent BIGINT DEFAULT 0,
  data_received BIGINT DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

ALTER TABLE public.vpn_sessions ENABLE ROW LEVEL SECURITY;

-- VPN Sessions RLS Policies
CREATE POLICY "Users can view their own VPN sessions"
  ON public.vpn_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own VPN sessions"
  ON public.vpn_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own VPN sessions"
  ON public.vpn_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- ANTIVIRUS SCANS TABLE
-- ============================================
CREATE TABLE public.antivirus_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  scan_type scan_type NOT NULL,
  status scan_status DEFAULT 'pending' NOT NULL,
  started_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  completed_at TIMESTAMPTZ,
  items_scanned INTEGER DEFAULT 0,
  threats_found INTEGER DEFAULT 0,
  duration_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.antivirus_scans ENABLE ROW LEVEL SECURITY;

-- Antivirus Scans RLS Policies
CREATE POLICY "Users can view their own scans"
  ON public.antivirus_scans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scans"
  ON public.antivirus_scans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scans"
  ON public.antivirus_scans FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- THREATS TABLE
-- ============================================
CREATE TABLE public.threats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  scan_id UUID REFERENCES public.antivirus_scans(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  file_path TEXT,
  severity threat_severity NOT NULL,
  status threat_status DEFAULT 'detected' NOT NULL,
  detected_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.threats ENABLE ROW LEVEL SECURITY;

-- Threats RLS Policies
CREATE POLICY "Users can view their own threats"
  ON public.threats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own threats"
  ON public.threats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own threats"
  ON public.threats FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- DARK WEB SCANS TABLE
-- ============================================
CREATE TABLE public.dark_web_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  status scan_status DEFAULT 'pending' NOT NULL,
  breaches_found INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.dark_web_scans ENABLE ROW LEVEL SECURITY;

-- Dark Web Scans RLS Policies
CREATE POLICY "Users can view their own dark web scans"
  ON public.dark_web_scans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own dark web scans"
  ON public.dark_web_scans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own dark web scans"
  ON public.dark_web_scans FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- LEAKED CREDENTIALS TABLE
-- ============================================
CREATE TABLE public.leaked_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  scan_id UUID REFERENCES public.dark_web_scans(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  breach_name TEXT NOT NULL,
  breach_date DATE,
  leaked_data TEXT[],
  severity threat_severity NOT NULL,
  discovered_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.leaked_credentials ENABLE ROW LEVEL SECURITY;

-- Leaked Credentials RLS Policies
CREATE POLICY "Users can view their own leaked credentials"
  ON public.leaked_credentials FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own leaked credentials"
  ON public.leaked_credentials FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- ALERTS TABLE
-- ============================================
CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type alert_type NOT NULL,
  severity alert_severity NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  is_resolved BOOLEAN DEFAULT false,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Alerts RLS Policies
CREATE POLICY "Users can view their own alerts"
  ON public.alerts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own alerts"
  ON public.alerts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own alerts"
  ON public.alerts FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- PAYMENT TRANSACTIONS TABLE
-- ============================================
CREATE TABLE public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_id TEXT NOT NULL,
  transaction_id TEXT,
  plan_type subscription_tier NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  completed_at TIMESTAMPTZ
);

ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- Payment Transactions RLS Policies
CREATE POLICY "Users can view their own transactions"
  ON public.payment_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
  ON public.payment_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for alerts
CREATE TRIGGER update_alerts_updated_at
  BEFORE UPDATE ON public.alerts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  
  -- Assign default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_vpn_sessions_user_id ON public.vpn_sessions(user_id);
CREATE INDEX idx_vpn_sessions_active ON public.vpn_sessions(user_id, is_active);
CREATE INDEX idx_antivirus_scans_user_id ON public.antivirus_scans(user_id);
CREATE INDEX idx_threats_user_id ON public.threats(user_id);
CREATE INDEX idx_threats_scan_id ON public.threats(scan_id);
CREATE INDEX idx_dark_web_scans_user_id ON public.dark_web_scans(user_id);
CREATE INDEX idx_leaked_credentials_user_id ON public.leaked_credentials(user_id);
CREATE INDEX idx_alerts_user_id ON public.alerts(user_id);
CREATE INDEX idx_alerts_unread ON public.alerts(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_payment_transactions_user_id ON public.payment_transactions(user_id);