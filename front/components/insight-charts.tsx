'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, MessageSquare, AlertTriangle, Activity } from 'lucide-react';
import { ChartLoadingSkeleton } from './chart-loading-skeleton';
import { useQuery } from '@tanstack/react-query';
import { ConversationInsights } from '@/models/conversation_insights';
import type {
  PrimaryEmotionItem,
  AggregatedEmotion,
  CrisisClassificationRow,
} from '@/types/insights';
import { EMOTION_COLORS } from '@/types/constants';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Conversations } from '@/models/conversations';
import { format, eachDayOfInterval } from 'date-fns';

interface InsightChartsProps {
  isLoading?: boolean;
  patientId?: string;
  dateRange?: { from: string; to: string };
}

// AggregatedEmotion type moved to @/types/insights

// EMOTION_COLORS moved to @/types/constants

const ALLOWED_EMOTIONS = new Set(['joy', 'sadness', 'anger', 'fear', 'surprise', 'disgust']);

export function InsightCharts({ isLoading = false, patientId, dateRange }: InsightChartsProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'emotion' | 'crisis-classification'>('emotion');
  const [modalData, setModalData] = useState<CrisisClassificationRow | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<AggregatedEmotion | null>(null);

  const handleCrisisClassificationClick = (item: CrisisClassificationRow) => {
    setModalType('crisis-classification');
    setModalData(item);
    setModalOpen(true);
  };

  const handleEmotionClick = (emotionName: string) => {
    const agg = aggregatedEmotions.find((e) => e.name.toLowerCase() === emotionName.toLowerCase());
    if (agg) {
      setModalType('emotion');
      setSelectedEmotion(agg);
      setModalOpen(true);
    }
  };

  const { data: primaryEmotionContents, isLoading: loadingPrimaryEmotions } = useQuery({
    queryKey: ['primaryEmotions', patientId, dateRange?.from, dateRange?.to],
    enabled: Boolean(patientId && dateRange?.from && dateRange?.to),
    queryFn: async () => {
      return ConversationInsights.fetchPrimaryEmotionsByPatient({
        patientId: patientId as string,
        fromIso: `${dateRange!.from}T00:00:00`,
        toIso: `${dateRange!.to}T23:59:59`,
      });
    },
  });

  const { data: moodRows } = useQuery({
    queryKey: ['moodClassification', patientId, dateRange?.from, dateRange?.to],
    enabled: Boolean(patientId && dateRange?.from && dateRange?.to),
    queryFn: async () => {
      return ConversationInsights.fetchMoodClassificationByPatientRange({
        patientId: patientId as string,
        fromIso: `${dateRange!.from}T00:00:00`,
        toIso: `${dateRange!.to}T23:59:59`,
      });
    },
  });

  const moodDaily = useMemo(() => {
    // Build list of valid mood scores keyed by day, preferring conversations.started_at over created_at
    const items: { dateKey: string; score: number }[] = [];
    for (const row of moodRows || []) {
      const content = row?.content as
        | { mood_score?: number; classification_type?: string }
        | undefined;
      if (!content) continue;

      const classificationType = content.classification_type;
      if (classificationType !== 'explicit' && classificationType !== 'inferred') continue;

      const rawScore = content.mood_score;
      const isValidScore = typeof rawScore === 'number' && Number.isFinite(rawScore);
      if (!isValidScore || rawScore < 0 || rawScore > 10) continue;

      const startedAt: string | undefined = (row as any)?.conversations?.started_at;
      const createdAt: string | undefined = (row as any)?.created_at;
      const isoDate = (startedAt || createdAt || '').slice(0, 10);
      if (!isoDate) continue;

      items.push({ dateKey: isoDate, score: rawScore });
    }

    const byDay = new Map<string, number[]>();
    for (const it of items) {
      if (!byDay.has(it.dateKey)) byDay.set(it.dateKey, []);
      byDay.get(it.dateKey)!.push(it.score);
    }

    const days = eachDayOfInterval({
      start: new Date(`${dateRange!.from}T00:00:00`),
      end: new Date(`${dateRange!.to}T00:00:00`),
    });
    return days.map((d) => {
      const key = format(d, 'yyyy-MM-dd');
      const arr = byDay.get(key) || [];
      const avg = arr.length ? arr.reduce((a, n) => a + n, 0) / arr.length : null;
      return { date: format(d, 'MM/dd'), mood: avg };
    });
  }, [moodRows, dateRange]);

  const { data: dailyConversations } = useQuery({
    queryKey: ['dailyConversations', patientId, dateRange?.from, dateRange?.to],
    enabled: Boolean(patientId && dateRange?.from && dateRange?.to),
    queryFn: async () => {
      const convos = await Conversations.fetchByPatientRange({
        patientId: patientId as string,
        fromIso: `${dateRange!.from}T00:00:00`,
        toIso: `${dateRange!.to}T23:59:59`,
      });

      const byDay = new Map<string, number>();
      for (const c of convos) {
        const startedDay = (c.started_at || '').slice(0, 10);
        if (!startedDay) continue;
        byDay.set(startedDay, (byDay.get(startedDay) || 0) + 1);
      }

      const days = eachDayOfInterval({
        start: new Date(`${dateRange!.from}T00:00:00`),
        end: new Date(`${dateRange!.to}T00:00:00`),
      });
      return days.map((d) => {
        const key = format(d, 'yyyy-MM-dd');
        return {
          day: format(d, 'EEE'),
          date: format(d, 'MM/dd'),
          sessions: byDay.get(key) || 0,
        };
      });
    },
  });

  const aggregatedEmotions: AggregatedEmotion[] = useMemo(() => {
    const allItems: PrimaryEmotionItem[] = [];
    for (const content of primaryEmotionContents || []) {
      const list = content?.primary_emotions || [];
      for (const item of list) {
        if (item && item.emotion) {
          const normalized = String(item.emotion).toLowerCase();
          if (ALLOWED_EMOTIONS.has(normalized)) {
            allItems.push({ ...item, emotion: normalized });
          }
        }
      }
    }
    if (allItems.length === 0) return [];

    const byEmotion = new Map<
      string,
      { total: number; intensities: number[]; triggers: string[]; contexts: string[] }
    >();
    for (const item of allItems) {
      const key = (item.emotion || 'unknown').toLowerCase();
      if (!byEmotion.has(key))
        byEmotion.set(key, { total: 0, intensities: [], triggers: [], contexts: [] });
      const bucket = byEmotion.get(key)!;
      bucket.total += 1;
      if (typeof item.intensity === 'number') bucket.intensities.push(item.intensity);
      if (item.trigger) bucket.triggers.push(item.trigger);
      if (item.context) bucket.contexts.push(item.context);
    }

    const palette = ['#A5E3D0', '#6CAEDD', '#C7B7E8', '#F97316', '#EF4444', '#10B981'];
    let i = 0;

    return Array.from(byEmotion.entries()).map(([name, b]) => {
      const avg = b.intensities.length
        ? b.intensities.reduce((a, n) => a + n, 0) / b.intensities.length
        : null;
      const color = EMOTION_COLORS[name] || palette[i++ % palette.length];
      // Deduplicate keeping first occurrences
      const dedupe = (arr: string[]) => Array.from(new Set(arr)).slice(0, 5);
      const displayName = name.charAt(0).toUpperCase() + name.slice(1);
      return {
        name: displayName,
        count: b.total,
        avgIntensity: avg,
        triggers: dedupe(b.triggers),
        contexts: dedupe(b.contexts),
        color,
      };
    });
  }, [primaryEmotionContents]);

  const { data: crisisRows } = useQuery({
    queryKey: ['crisisClassification', patientId, dateRange?.from, dateRange?.to],
    enabled: Boolean(patientId && dateRange?.from && dateRange?.to),
    queryFn: async () => {
      return ConversationInsights.fetchCrisisClassificationByPatientRange({
        patientId: patientId as string,
        fromIso: `${dateRange!.from}T00:00:00`,
        toIso: `${dateRange!.to}T23:59:59`,
      });
    },
  });

  const crisisItems = useMemo(() => {
    const list = (crisisRows || [])
      .filter((r: CrisisClassificationRow) => Boolean(r.content?.is_crisis))
      .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
    return list;
  }, [crisisRows]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartLoadingSkeleton
          title="Mood & Anxiety Trends"
          icon={<TrendingUp className="text-primary h-5 w-5" />}
        />
        <ChartLoadingSkeleton
          title="Weekly Session Activity"
          icon={<MessageSquare className="text-secondary h-5 w-5" />}
        />
        <ChartLoadingSkeleton
          title="Emotion Distribution"
          icon={<Activity className="text-accent h-5 w-5" />}
        />
        <ChartLoadingSkeleton
          title="Crisis Events"
          icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
          height={200}
        />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Daily Mood (Average per day) */}
        <Card className="bg-card border-border">
          <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="text-primary h-5 w-5" />
              Daily Average Mood
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-4 pt-0 sm:px-6 sm:pb-6">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={moodDaily} margin={{ top: 16, right: 8, bottom: 0, left: -12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                <YAxis width={32} stroke="#6b7280" fontSize={12} domain={[0, 10]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="mood"
                  connectNulls
                  stroke="#6CAEDD"
                  strokeWidth={3}
                  dot={{ fill: '#6CAEDD', strokeWidth: 2, r: 4 }}
                  name="Avg Mood"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Daily Conversation Activity */}
        <Card className="bg-card border-border">
          <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="text-secondary h-5 w-5" />
              Daily Conversation Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-4 pt-0 sm:px-6 sm:pb-6">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={dailyConversations || []}
                margin={{ top: 16, right: 8, bottom: 0, left: -12 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                <YAxis width={32} stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="sessions" fill="#A5E3D0" radius={[4, 4, 0, 0]} name="Conversations" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Emotion Distribution (Primary Emotions from Insights) */}
        <Card className="bg-card border-border">
          <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
            <CardTitle className="flex items-center gap-2">
              <Activity className="text-accent h-5 w-5" />
              Emotion Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-4 pt-0 sm:px-6 sm:pb-6">
            {loadingPrimaryEmotions ? (
              <div className="text-muted-foreground flex h-[250px] items-center justify-center text-sm">
                Loading emotions…
              </div>
            ) : aggregatedEmotions.length === 0 ? (
              <div className="text-muted-foreground flex h-[250px] items-center justify-center text-sm">
                No emotion data in range
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart margin={{ top: 16, right: 12, bottom: 0, left: 12 }}>
                    <Pie
                      data={aggregatedEmotions.map((e) => ({
                        name: e.name,
                        value: e.count,
                        color: e.color,
                      }))}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      onClick={(data) => {
                        if (data && data.name) {
                          handleEmotionClick(data.name as string);
                        }
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      {aggregatedEmotions.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 flex flex-wrap gap-3">
                  {aggregatedEmotions.map((emotion, index) => (
                    <div
                      key={index}
                      className="hover:bg-muted flex cursor-pointer items-center gap-2 rounded p-1 transition-colors"
                      onClick={() => handleEmotionClick(emotion.name)}
                    >
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: emotion.color }}
                      />
                      <span className="text-muted-foreground text-xs">
                        {emotion.name} ({emotion.count})
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Crisis Classifications */}
        <Card className="bg-card border-border">
          <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Crisis Classifications
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0 sm:px-6 sm:pb-6">
            {crisisItems.length === 0 ? (
              <div className="text-muted-foreground text-sm">
                No crisis detected in the selected period.
              </div>
            ) : (
              <div className="space-y-3">
                {crisisItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="cursor-pointer rounded-lg border p-3 transition-colors hover:bg-red-50"
                    onClick={() => handleCrisisClassificationClick(item)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">
                        {format(new Date(item.created_at), 'MMM d, yyyy HH:mm')}
                      </div>
                      <div className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-700">
                        {item.content?.crisis_severity || 'unspecified'}
                      </div>
                    </div>
                    <div className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                      {item.content?.context}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Primary Emotion Details Modal */}
      <Dialog open={modalOpen && modalType === 'emotion'} onOpenChange={() => setModalOpen(false)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" style={{ color: selectedEmotion?.color }} />
              {selectedEmotion?.name} Details
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-muted-foreground text-xs">Occurrences</div>
                <div className="font-semibold">{selectedEmotion?.count ?? 0}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs">Avg Intensity</div>
                <div className="font-semibold">
                  {selectedEmotion?.avgIntensity != null
                    ? selectedEmotion?.avgIntensity.toFixed(1)
                    : '—'}
                </div>
              </div>
            </div>
            <div>
              <div className="mb-1 text-sm font-medium">Common Triggers</div>
              <div className="flex flex-wrap gap-2">
                {(selectedEmotion?.triggers || []).map((t, i) => (
                  <span key={i} className="bg-muted rounded px-2 py-1 text-xs">
                    {t}
                  </span>
                ))}
                {(!selectedEmotion || selectedEmotion.triggers.length === 0) && (
                  <span className="text-muted-foreground text-xs">No triggers</span>
                )}
              </div>
            </div>
            <div>
              <div className="mb-1 text-sm font-medium">Contexts</div>
              <ul className="max-h-40 list-disc space-y-1 overflow-y-auto pl-5">
                {(selectedEmotion?.contexts || []).map((c, i) => (
                  <li key={i} className="text-sm">
                    {c}
                  </li>
                ))}
                {(!selectedEmotion || selectedEmotion.contexts.length === 0) && (
                  <span className="text-muted-foreground text-xs">No contexts</span>
                )}
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Crisis Classification Details Modal */}
      <Dialog
        open={modalOpen && modalType === 'crisis-classification'}
        onOpenChange={() => setModalOpen(false)}
      >
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Crisis Classification
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground text-xs">Detected At</div>
                <div className="font-medium">
                  {modalData?.created_at ? format(new Date(modalData.created_at), 'PPpp') : '—'}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs">Severity</div>
                <div className="font-medium capitalize">
                  {modalData?.content?.crisis_severity || 'unspecified'}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs">Is Crisis</div>
                <div className="font-medium">{modalData?.content?.is_crisis ? 'Yes' : 'No'}</div>
              </div>
            </div>
            {modalData?.content?.activator ? (
              <div>
                <div className="text-sm font-medium">Activator</div>
                <div className="text-muted-foreground text-sm">{modalData.content.activator}</div>
              </div>
            ) : null}
            {modalData?.content?.belief ? (
              <div>
                <div className="text-sm font-medium">Belief</div>
                <div className="text-muted-foreground text-sm">{modalData.content.belief}</div>
              </div>
            ) : null}
            {modalData?.content?.consequence ? (
              <div>
                <div className="text-sm font-medium">Consequence</div>
                <div className="text-muted-foreground text-sm">{modalData.content.consequence}</div>
              </div>
            ) : null}
            <div>
              <div className="text-sm font-medium">Context</div>
              <div className="text-muted-foreground text-sm whitespace-pre-wrap">
                {modalData?.content?.context || '—'}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
