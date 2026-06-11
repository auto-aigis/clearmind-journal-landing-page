import { API_URL } from './constants';

function getOptions(method: string, body?: unknown): RequestInit {
  const options: RequestInit = {
    method,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) options.body = JSON.stringify(body);
  return options;
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    let msg = `API error: ${res.status}`;
    try {
      const err = await res.json();
      const d = err.detail;
      if (typeof d === 'string') msg = d;
      else if (Array.isArray(d)) msg = d.map((e: { msg: string }) => e.msg).join(', ');
      else if (err.error) msg = err.error;
      else if (err.message) msg = err.message;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export const authApi = {
  register: (email: string, password: string, displayName?: string) =>
    apiFetch<{ status: string; email: string }>('/api/auth/register', getOptions('POST', { email, password, display_name: displayName })),

  login: (email: string, password: string) =>
    apiFetch<{
      id: string;
      email: string;
      display_name: string;
      is_verified: boolean;
      onboarding_complete: boolean;
      created_at: string;
    }>('/api/auth/login', getOptions('POST', { email, password })),

  logout: () => apiFetch<{ status: string }>('/api/auth/logout', getOptions('POST')),

  me: () => apiFetch<{
    id: string;
    email: string;
    display_name: string | null;
    is_verified: boolean;
    onboarding_complete: boolean;
    created_at: string;
  }>('/api/auth/me'),

  subscription: () => apiFetch<{ status: string; tier: string; current_period_end: string | null; price_id: string | null }>('/api/auth/subscription'),

  forgotPassword: (email: string) =>
    apiFetch<{ status: string }>('/api/auth/forgot-password', getOptions('POST', { email })),

  resetPassword: (token: string, newPassword: string) =>
    apiFetch<{ status: string }>('/api/auth/reset-password', getOptions('POST', { token, new_password: newPassword })),

  verifyEmail: (token: string) =>
    apiFetch<{ status: string }>('/api/auth/verify-email', getOptions('POST', { token })),

  resendVerification: (email: string) =>
    apiFetch<{ status: string }>('/api/auth/resend-verification', getOptions('POST', { email })),
};

export const onboardingApi = {
  get: () => apiFetch<{ role: string | null; work_style: string | null; tracking_goal: string | null }>('/api/onboarding'),
  save: (role: string, workStyle: string, trackingGoal: string) =>
    apiFetch<{ status: string }>('/api/onboarding', getOptions('POST', { role, work_style: workStyle, tracking_goal: trackingGoal })),
};

export const entriesApi = {
  create: (content: string) =>
    apiFetch<{
      id: string;
      content: string;
      micro_insight: string;
      emotional_tone: string;
      distortion_signals: string[] | null;
      created_at: string;
      tags: string[];
    }>('/api/entries', getOptions('POST', { content })),

  list: (limit = 50, offset = 0) =>
    apiFetch<{
      entries: Array<{
        id: string;
        content: string;
        micro_insight: string;
        emotional_tone: string;
        distortion_signals: string[] | null;
        created_at: string;
        tags: string[];
      }>;
      total: number;
    }>(`/api/entries?limit=${limit}&offset=${offset}`),

  get: (id: string) =>
    apiFetch<{
      id: string;
      content: string;
      micro_insight: string;
      emotional_tone: string;
      distortion_signals: string[] | null;
      created_at: string;
      tags: string[];
    }>(`/api/entries/${id}`),

  updateTags: (id: string, tags: string[]) =>
    apiFetch<{ status: string; tags: string[] }>(`/api/entries/${id}/tags`, getOptions('PATCH', { tags })),
};

export const insightsApi = {
  weekly: () =>
    apiFetch<{
      entry_count: number;
      top_themes: string[];
      mood_trend: string;
      distortion_labels: string[] | null;
      trigger_callouts: string[] | null;
      trajectory_data: Record<string, unknown> | null;
      tier_gated: boolean;
      gated_content: string | null;
    }>('/api/insights/weekly'),

  generate: () =>
    apiFetch<{ status: string; insights: Record<string, unknown> }>('/api/insights/generate', getOptions('POST')),

  export: () =>
    apiFetch<{ insights: Array<Record<string, unknown>> }>('/api/insights/export'),
};

export const paymentsApi = {
  checkout: (tier: string, billingInterval: string) =>
    apiFetch<{ price_id: string; client_token: string }>('/api/payments/checkout', getOptions('POST', { tier, billing_interval: billingInterval })),

  portalUrl: () => apiFetch<{ url: string }>('/api/payments/portal-url'),

  verifyTransaction: (transactionId: string) =>
    apiFetch<{ status: string }>('/api/paddle/verify-transaction', getOptions('POST', { transaction_id: transactionId })),
};

export const settingsApi = {
  get: () =>
    apiFetch<{
      user: {
        email: string;
        display_name: string | null;
        is_verified: boolean;
        onboarding_complete: boolean;
        created_at: string;
      };
      subscription: {
        status: string;
        tier: string;
        current_period_end: string | null;
      };
    }>('/api/settings'),

  exportEntries: () =>
    apiFetch<{ csv: string }>('/api/settings/export/entries'),

  deleteAccount: () =>
    apiFetch<{ status: string }>('/api/settings/account', getOptions('DELETE')),

  createApiKey: (serviceName: string) =>
    apiFetch<{ status: string; key: string }>(`/api/settings/keys/${serviceName}`, getOptions('PUT', {})),

  revokeApiKey: (serviceName: string) =>
    apiFetch<{ status: string }>(`/api/settings/keys/${serviceName}`, getOptions('DELETE')),

  listApiKeys: () =>
    apiFetch<Array<{ service_name: string; created_at: string; last_used_at: string | null }>>('/api/settings/keys'),
};