'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Lightbulb, Loader2, Sparkles } from 'lucide-react';
import { entriesApi } from '../../_lib/api';
import { useAuth } from '../../_components/AuthProvider';

const prompts = [
  'How did work feel today? What\'s on your mind?',
  'What\'s one thing that went well today?',
  'What\'s one thing that stressed you out today?',
  'How are you feeling about your workload right now?',
  'Any thoughts about your recent meetings or collaborations?',
];

export default function JournalPage() {
  const router = useRouter();
  const { user, refresh } = useAuth();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<{ text: string; tone: string } | null>(null);
  const [error, setError] = useState('');
  const [promptIndex, setPromptIndex] = useState(0);

  useEffect(() => {
    if (!user) return;
    if (!user.onboarding_complete) {
      router.replace('/onboarding');
    }
  }, [user, router]);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setError('');
    try {
      const entry = await entriesApi.create(content);
      setInsight({ text: entry.micro_insight, tone: entry.emotional_tone });
      setContent('');
      setPromptIndex(Math.floor(Math.random() * prompts.length));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save entry');
    } finally {
      setLoading(false);
    }
  };

  const dismissInsight = () => setInsight(null);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Today&apos;s Entry</h1>
      <p className="text-gray-500 mb-6">Take a moment to reflect on your day.</p>

      {insight && (
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800">Micro-Insight</p>
                <p className="text-amber-700 mt-1">{insight.text}</p>
                <p className="text-xs text-amber-600 mt-2">Detected tone: {insight.tone}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={dismissInsight} className="mt-3 text-amber-700">
              Dismiss
            </Button>
          </CardContent>
        </Card>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 text-sm text-red-600 bg-red-50 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            {prompts[promptIndex]}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your thoughts here..."
            className="min-h-[200px] resize-none"
          />
          <Button onClick={handleSubmit} disabled={!content.trim() || loading} className="w-full">
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analyzing...</> : 'Submit Entry'}
          </Button>
        </CardContent>
      </Card>

      <div className="mt-6 p-3 bg-blue-50 text-blue-700 text-xs rounded-lg text-center">
        ClearMind is a personal reflection tool, not a substitute for professional mental health care.
      </div>
    </div>
  );
}