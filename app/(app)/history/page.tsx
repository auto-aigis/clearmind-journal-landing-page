'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { entriesApi } from '../../_lib/api';
import { useAuth } from '../../_components/AuthProvider';
import { useRouter } from 'next/navigation';

interface Entry {
  id: string;
  content: string;
  micro_insight: string;
  emotional_tone: string;
  created_at: string;
  tags: string[];
}

export default function HistoryPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!user) return;
    if (!user.onboarding_complete) {
      router.replace('/onboarding');
    }
  }, [user, router]);

  const loadEntries = async (offset: number) => {
    setLoading(true);
    try {
      const data = await entriesApi.list(20, offset);
      if (offset === 0) setEntries(data.entries);
      else setEntries((prev) => [...prev, ...data.entries]);
      setHasMore(data.entries.length === 20);
      setPage(offset / 20);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEntries(0); }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const toneColors: Record<string, string> = { positive: 'bg-green-100 text-green-700', neutral: 'bg-gray-100 text-gray-700', negative: 'bg-red-100 text-red-700' };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Entry History</h1>
      <p className="text-gray-500 mb-6">Review your past journal entries and insights.</p>

      <div className="space-y-4">
        {entries.length === 0 && !loading ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              No entries yet. Start writing in the Journal tab.
            </CardContent>
          </Card>
        ) : (
          entries.map((entry) => (
            <Card key={entry.id} className="overflow-hidden">
              <button onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)} className="w-full text-left p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{formatDate(entry.created_at)}</span>
                  <Badge className={toneColors[entry.emotional_tone] || 'bg-gray-100'}>{entry.emotional_tone}</Badge>
                </div>
                <p className="mt-2 text-gray-900 line-clamp-2">{entry.content}</p>
                {expandedId !== entry.id && <p className="mt-2 text-sm text-gray-500 line-clamp-1">{entry.micro_insight}</p>}
                {expandedId === entry.id ? <ChevronUp className="w-4 h-4 mx-auto mt-2 text-gray-400" /> : <ChevronDown className="w-4 h-4 mx-auto mt-2 text-gray-400" />}
              </button>
              {expandedId === entry.id && (
                <div className="px-4 pb-4 border-t border-gray-100">
                  <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                    <p className="text-sm font-medium text-amber-800">Insight</p>
                    <p className="text-sm text-amber-700 mt-1">{entry.micro_insight}</p>
                  </div>
                  {entry.tags.length > 0 && (
                    <div className="mt-3 flex gap-2 flex-wrap">
                      {entry.tags.map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))
        )}
        {loading && <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>}
        {!loading && hasMore && <Button variant="outline" onClick={() => loadEntries((page + 1) * 20)} className="w-full">Load More</Button>}
      </div>
    </div>
  );
}