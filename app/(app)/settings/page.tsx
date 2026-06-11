'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Download, Trash2, Key, Loader2, CreditCard, Shield, Check, Copy } from 'lucide-react';
import { settingsApi, paymentsApi, authApi } from '../../_lib/api';
import { useAuth } from '../../_components/AuthProvider';

type SettingsTab = 'account' | 'billing' | 'export' | 'api';

export default function SettingsPage() {
  const router = useRouter();
  const { user, subscription, refresh } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  const [settings, setSettings] = useState<{
    user: { email: string; display_name: string | null; is_verified: boolean; created_at: string };
    subscription: { status: string; tier: string; current_period_end: string | null };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [apiKeys, setApiKeys] = useState<Array<{ service_name: string; created_at: string; last_used_at: string | null }>>([]);

  useEffect(() => {
    if (!user) return;
    if (!user.onboarding_complete) {
      router.replace('/onboarding');
    }
  }, [user, router]);

  const loadSettings = async () => {
    try {
      const data = await settingsApi.get();
      setSettings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadSettings();
  }, [user]);

  useEffect(() => {
    if (activeTab === 'api' && subscription?.tier === 'plus') {
      settingsApi.listApiKeys().then(setApiKeys).catch(console.error);
    }
  }, [activeTab, subscription]);

  const handleExport = async () => {
    if (!settings) return;
    const tier = settings.subscription.tier;
    if (tier === 'free') return;
    setExporting(true);
    try {
      const { csv } = await settingsApi.exportEntries();
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `clearmind-entries-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async () => {
    if (deleteConfirm !== 'DELETE') return;
    setDeleting(true);
    try {
      await settingsApi.deleteAccount();
      router.push('/login');
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const handlePortal = async () => {
    try {
      const { url } = await paymentsApi.portalUrl();
      window.location.href = url;
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateApiKey = async () => {
    try {
      const { key } = await settingsApi.createApiKey('insights');
      await loadSettings();
      alert(`Your API key: ${key}`);
      setApiKeys((prev) => [...prev, { service_name: 'insights', created_at: new Date().toISOString(), last_used_at: null }]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRevokeApiKey = async () => {
    try {
      await settingsApi.revokeApiKey('insights');
      setApiKeys((prev) => prev.filter((k) => k.service_name !== 'insights'));
    } catch (err) {
      console.error(err);
    }
  };

  if (!user || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const tier = settings?.subscription.tier || 'free';
  const canExport = tier === 'pro' || tier === 'plus';
  const isPlus = tier === 'plus';

  const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: 'account', label: 'Account', icon: <Shield className="w-4 h-4" /> },
    { id: 'billing', label: 'Billing', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'export', label: 'Data Export', icon: <Download className="w-4 h-4" /> },
  ];
  if (isPlus) tabs.push({ id: 'api', label: 'API Keys', icon: <Key className="w-4 h-4" /> });

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Settings</h1>
      <p className="text-gray-500 mb-6">Manage your account and subscription.</p>

      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'account' && (
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input value={settings?.user.email || ''} disabled />
            </div>
            <div className="grid gap-2">
              <Label>Joined</Label>
              <Input value={settings?.user.created_at ? new Date(settings.user.created_at).toLocaleDateString() : ''} disabled />
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={settings?.user.is_verified ? 'default' : 'destructive'}>
                {settings?.user.is_verified ? 'Verified' : 'Unverified'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'billing' && (
        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>Manage your subscription and billing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 capitalize">{tier} Plan</p>
                <p className="text-sm text-gray-500">
                  {settings?.subscription.current_period_end
                    ? `Renews ${new Date(settings.subscription.current_period_end).toLocaleDateString()}`
                    : tier === 'free' ? 'Free forever' : 'No active subscription'}
                </p>
              </div>
              {tier !== 'free' && (
                <Link href="/pricing">
                  <Button variant="outline" size="sm">Change Plan</Button>
                </Link>
              )}
            </div>
            {tier !== 'free' && (
              <Button variant="outline" onClick={handlePortal} className="w-full">
                Manage Billing in Paddle
              </Button>
            )}
            {tier === 'free' && (
              <Link href="/pricing">
                <Button className="w-full">Upgrade to Pro</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'export' && (
        <Card>
          <CardHeader>
            <CardTitle>Data Export</CardTitle>
            <CardDescription>Download your journal entries</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Export all your journal entries as a CSV file.</p>
            </div>
            {canExport ? (
              <Button onClick={handleExport} disabled={exporting} className="w-full">
                {exporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                Export as CSV
              </Button>
            ) : (
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">Export requires Pro or Plus</p>
                <Link href="/pricing">
                  <Button variant="outline">Upgrade to Pro</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'api' && isPlus && (
        <Card>
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>Manage your personal API access</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Use your API key to access your insights data programmatically.</p>
            </div>
            {apiKeys.length > 0 ? (
              <div className="space-y-2">
                {apiKeys.map((key) => (
                  <div key={key.service_name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{key.service_name}</p>
                      <p className="text-xs text-gray-500">Created {new Date(key.created_at).toLocaleDateString()}</p>
                    </div>
                    <Button variant="destructive" size="sm" onClick={handleRevokeApiKey}>Revoke</Button>
                  </div>
                ))}
              </div>
            ) : (
              <Button onClick={handleCreateApiKey} className="w-full">Generate API Key</Button>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="mt-6 border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>Permanently delete your account and all data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              This will permanently delete all your journal entries, insights, and account data. This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <Input
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="Type DELETE to confirm"
              />
              <Button variant="destructive" onClick={handleDelete} disabled={deleteConfirm !== 'DELETE' || deleting}>
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 p-4 bg-blue-50 text-blue-700 text-sm rounded-lg text-center">
        ClearMind is a personal reflection tool, not a substitute for professional mental health care.
      </div>
    </div>
  );
}