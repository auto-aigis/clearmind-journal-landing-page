'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { onboardingApi, authApi } from '../../_lib/api';
import { Shield, Monitor, Target, ChevronRight, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../_components/AuthProvider';

const roles = [{ value: 'engineer', label: 'Software Engineer', icon: '💻' }, { value: 'pm', label: 'Product Manager', icon: '📊' }, { value: 'designer', label: 'Designer', icon: '🎨' }, { value: 'other', label: 'Other', icon: '👤' }];
const workStyles = [{ value: 'remote', label: 'Fully Remote', icon: '🏠' }, { value: 'hybrid', label: 'Hybrid', icon: '🏢' }, { value: 'in-office', label: 'In-Office', icon: '🏬' }];
const goals = [{ value: 'stress', label: 'Manage Stress', icon: '😰' }, { value: 'overthinking', label: 'Stop Overthinking', icon: '🧠' }, { value: 'burnout', label: 'Prevent Burnout', icon: '🔥' }, { value: 'all', label: 'All of the above', icon: '✨' }];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, refresh } = useAuth();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [workStyle, setWorkStyle] = useState('');
  const [trackingGoal, setTrackingGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.onboarding_complete) {
      router.replace('/dashboard');
    }
  }, [user, router]);

  const canProceed = step === 1 ? !!role : step === 2 ? !!workStyle : !!trackingGoal;

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onboardingApi.save(role, workStyle, trackingGoal);
      await refresh();
      router.push('/journal');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, title: 'Your Role', options: roles, value: role, setValue: setRole },
    { num: 2, title: 'Work Style', options: workStyles, value: workStyle, setValue: setWorkStyle },
    { num: 3, title: 'Your Goals', options: goals, value: trackingGoal, setValue: setTrackingGoal },
  ];
  const current = steps[step - 1];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Step {step} of 3</span>
            <span className="text-sm text-gray-500">{Math.round((step / 3) * 100)}%</span>
          </div>
          <Progress value={(step / 3) * 100} className="h-2" />
          <CardTitle className="mt-4 text-xl">{current.title}</CardTitle>
          <CardDescription>This helps us personalize your insights</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>}
          <div className="grid grid-cols-2 gap-3">
            {current.options.map((opt) => (
              <button key={opt.value} onClick={() => current.setValue(opt.value)} className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left ${current.value === opt.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <span className="text-2xl">{opt.icon}</span>
                <span className="font-medium text-gray-900">{opt.label}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 text-sm rounded-lg mt-4">
            <Shield className="w-4 h-4 flex-shrink-0" />
            <span>Your entries are private and never shared or sold. <a href="/privacy" className="underline">Privacy Policy</a></span>
          </div>
          <div className="flex gap-3">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} disabled={loading}>
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>
            )}
            <Button className="flex-1" onClick={handleNext} disabled={!canProceed || loading}>
              {loading ? 'Saving...' : step === 3 ? 'Complete Setup' : <>Next <ChevronRight className="w-4 h-4 ml-1" /></>}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}