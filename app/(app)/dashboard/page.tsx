'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, TrendingUp, TrendingDown, Minus, AlertTriangle, Sparkles, Lock } from 'lucide-react';
import { insightsApi, paymentsApi } from '../../_lib/api';
import { useAuth } from '../../_components/AuthProvider';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, subscription, refresh } = useAuth();
  const [insights, setInsights] = useState<{
    entry_count: number;
    top_themes: string[];
    mood_trend: string;
    distortion_labels: string[] | null;
    trigger_callouts: string[] | null;
    tier_gated: boolean;
    gated_content: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (!user.onboarding_complete) {
      router.replace('/onboarding');
      return;
    }
    loadInsights();
  }, [user, router]);

  useEffect(() => {
    const checkout = searchParams.get('checkout');
    const txnId = searchParams.get('transaction_id');
    if (checkout === 'success' && txnId) {
      handleVerifyTransaction(txnId);
    }
  }, [searchParams]);

  const loadInsights = async () => {
    try {
      const data = await insightsApi.weekly();
      setInsights(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyTransaction = async (txnId: string) => {
    setProcessingPayment(true);
    try {
      const result = await paymentsApi.verifyTransaction(txnId);
      if (result.status === 'active') {
        await refresh();
        loadInsights();
      }
    } catch (err) {
      console.error('Payment verification failed:', err);
    } finally {
      setProcessingPayment(false);
      router.replace('/dashboard');
    }
  };

  const moodColors: Record<string, string> = {
    positive: 'text-green-600',
    neutral: 'text-gray-600',
    negative: 'text-red-600',
  };

  const MoodIcon = ({ trend }: { trend: string }) => {
    if (trend === 'positive') return <TrendingUp className="w-5 h-5 text-green-600" />;
    if (trend === 'negative') return <TrendingDown className="w-5 h-5 text-red-600" />;
    return <Minus className="w-5 h-5 text-gray-600" />;
  };

  if (!user || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (processingPayment) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-600" />
            <p className="mt-4 text-gray-600">Processing payment... please wait</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isFree = subscription?.tier === 'free';

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Your Insights</h1>
      <p className="text-gray-500 mb-6">Patterns and trends from your journal entries.</p>

      {insights && insights.entry_count < 3 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Sparkles className="w-12 h-12 mx-auto text-gray-300" />
            <p className="mt-4 text-gray-600">Write {3 - insights.entry_count} more entries to see your weekly insights.</p>
            <Link href="/journal">
              <Button className="mt-4">Write an Entry</Button>
            </Link>
          </CardContent>
        </Card>
      ) : insights ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">This Week&apos;s Summary</CardTitle>
              <CardDescription>Based on {insights.entry_count} entries</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Mood Trend</span>
                <div className={`flex items-center gap-2 font-medium ${moodColors[insights.mood_trend]}`}>
                  <MoodIcon trend={insights.mood_trend} />
                  {insights.mood_trend.charAt(0).toUpperCase() + insights.mood_trend.slice(1)}
                </div>
              </div>
              {insights.top_themes.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Top Themes</p>
                  <div className="flex flex-wrap gap-2">
                    {insights.top_themes.map((theme) => (
                      <Badge key={theme} variant="secondary">{theme}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {insights.trigger_callouts && insights.trigger_callouts.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Identified Triggers</p>
                  <div className="space-y-2">
                    {insights.trigger_callouts.map((trigger) => (
                      <div key={trigger} className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg text-amber-700">
                        <AlertTriangle className="w-4 h-4" />
                        {trigger}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {(insights.distortion_labels && insights.distortion_labels.length > 0) ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cognitive Distortions Detected</CardTitle>
                <CardDescription>Patterns that may be affecting your thinking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {insights.distortion_labels.map((label) => (
                    <Badge key={label} variant="outline" className="border-red-300 text-red-700 bg-red-50">
                      {label}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : isFree ? (
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10" />
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Cognitive Distortion Detection
                </CardTitle>
                <CardDescription>Unlock with Pro to see patterns like rumination and catastrophizing</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/pricing">
                  <Button>Upgrade to Pro</Button>
                </Link>
              </CardContent>
            </Card>
          ) : null}
        </div>
      ) : null}

      <div className="mt-8 p-4 bg-blue-50 text-blue-700 text-sm rounded-lg text-center">
        ClearMind is a personal reflection tool, not a substitute for professional mental health care.
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
      <DashboardContent />
    </Suspense>
  );
}