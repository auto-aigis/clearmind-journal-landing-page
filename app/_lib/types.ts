export interface User {
  id: string;
  email: string;
  display_name: string | null;
  is_verified: boolean;
  onboarding_complete: boolean;
  created_at: string;
}

export interface Subscription {
  status: 'active' | 'inactive';
  tier: 'free' | 'pro' | 'plus';
  current_period_end: string | null;
  price_id: string | null;
}

export interface OnboardingProfile {
  role: 'engineer' | 'pm' | 'designer' | 'other' | null;
  work_style: 'remote' | 'hybrid' | 'in-office' | null;
  tracking_goal: 'stress' | 'overthinking' | 'burnout' | 'all' | null;
}

export interface JournalEntry {
  id: string;
  content: string;
  micro_insight: string;
  emotional_tone: 'positive' | 'neutral' | 'negative';
  distortion_signals: string[] | null;
  created_at: string;
  tags: string[];
}

export interface WeeklyInsights {
  entry_count: number;
  top_themes: string[];
  mood_trend: 'positive' | 'neutral' | 'negative';
  distortion_labels: string[] | null;
  trigger_callouts: string[] | null;
  trajectory_data: Record<string, unknown> | null;
  tier_gated: boolean;
  gated_content: string | null;
}

export interface SettingsData {
  user: User;
  subscription: Subscription;
}

export interface CheckoutRequest {
  tier: 'pro' | 'plus';
  billing_interval: 'monthly' | 'yearly';
}

export interface CheckoutResponse {
  price_id: string;
  client_token: string;
}

export interface AuthState {
  user: User | null;
  subscription: Subscription | null;
  loading: boolean;
}