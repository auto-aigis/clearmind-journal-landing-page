'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Check, Sparkles, Crown, Zap } from 'lucide-react';
import { paymentsApi } from '../../_lib/api';
import { useAuth } from '../../_components/AuthProvider';
import { Loader2 } from 'lucide-react';

declare global {
  interface Window {
    Paddle: {
      Environment: { set: (env: string) => void };
      Initialize: (options: { token: string; environment?: string }) => void;
      Checkout: {
        open: (options: {
          items: Array<{ priceId: string; quantity: number }>;
          customData?: Record<string, unknown>;
          settings?: { displayMode: string };
          successUrl?: string;
        }) => void;
        close: () => void;
      };
    };
  }
}

const tiers = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    icon: Sparkles,
    features: [
      'Unlimited journal entries',
      'Immediate micro-insights',
      'Basic weekly summary',
      '14-day lookback',
    ],
    missing: ['Cognitive distortion detection', 'Extended lookback', 'Data export', 'Priority support'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$7',
    yearlyPrice: '$67',
    period: 'month',
    icon: Crown,
    features: [
      'Everything in Free',
      'Full cognitive distortion detection',
      '8-week lookback',
      'Mood trajectory & heatmap',
      'Trigger identification',
      'CSV data export',
      'Priority email support',
    ],
  },
  {
    id: 'plus',
    name: 'Plus',
    price: '$14',
    yearlyPrice: '$134',
    period: 'month',
    icon: Zap,
    features: [
      'Everything in Pro',
      '16-week extended lookback',
      'Weekly email digest',
      'Insights API access',
      'Early access features',
      '24-hour support SLA',
    ],
  },
];

export default function PricingPage() {
  const router = useRouter();
  const { user, subscription, refresh } = useAuth();
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (!user.onboarding_complete) {
      router.push('/onboarding');
    }
  }, [user, router]);

  useEffect(() => {
    const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    if (clientToken && !window.Paddle) {
      const script = document.createElement('script');
      script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
      script.async = true;
      script.onload = () => {
        if (window.Paddle) {
          window.Paddle.Environment.set('sandbox');
          window.Paddle.Initialize({ token: clientToken });
        }
      };
      document.body.appendChild(script);
    }
  }, []);

  const handleSubscribe = async (tierId: string) => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (tierId === 'free') return;

    setLoading(tierId);
    try {
      const { price_id } = await paymentsApi.checkout(tierId, billingInterval);
      const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
      if (clientToken && window.Paddle) {
        window.Paddle.Checkout.open({
          items: [{ priceId: price_id, quantity: 1 }],
          customData: { user_id: user.id },
          settings: { displayMode: 'overlay' },
        });
      } else {
        console.error('Paddle not initialized');
      }
    } catch (err) {
      console.error('Checkout failed:', err);
    } finally {
      setLoading(null);
    }
  };

  const currentTier = subscription?.tier || 'free';

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Choose Your Plan</h1>
        <p className="text-gray-500 mb-6">Unlock deeper insights into your patterns and thinking.</p>

        <div className="inline-flex items-center p-1 bg-gray-100 rounded-lg">
          <button onClick={() => setBillingInterval('monthly')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${billingInterval === 'monthly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>
            Monthly
          </button>
          <button onClick={() => setBillingInterval('yearly')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${billingInterval === 'yearly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>
            Yearly (Save 20%)
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {tiers.map((tier) => {
          const Icon = tier.icon;
          const isCurrent = currentTier === tier.id;
          const isProPlus = tier.id === 'pro' || tier.id === 'plus';
          const displayPrice = billingInterval === 'yearly' && tier.yearlyPrice ? tier.yearlyPrice : tier.price;

          return (
            <Card key={tier.id} className={isProPlus ? 'border-blue-300 shadow-lg' : ''}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${isProPlus ? 'text-blue-600' : 'text-gray-500'}`} />
                  <CardTitle>{tier.name}</CardTitle>
                </div>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-900">{displayPrice}</span>
                  <span className="text-gray-500">/{tier.period}</span>
                </div>
                <CardDescription>
                  {isCurrent ? 'Current plan' : tier.id === 'free' ? 'Forever free' : 'Unlock full insights'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
                {tier.missing?.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="w-4 h-4" />
                    <span>{feature}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                {isCurrent ? (
                  <Button variant="outline" className="w-full" disabled>
                    Current Plan
                  </Button>
                ) : tier.id === 'free' ? (
                  <Button variant="outline" className="w-full" disabled>
                    Get Started
                  </Button>
                ) : (
                  <Button className="w-full" onClick={() => handleSubscribe(tier.id)} disabled={!!loading}>
                    {loading === tier.id ? <Loader2 className="w-4 h-4 animate-spin" /> : `Upgrade to ${tier.name}`}
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-gray-50 text-gray-500 text-sm rounded-lg text-center">
        All plans include a 14-day money-back guarantee. Cancel anytime.
      </div>
    </div>
  );
}