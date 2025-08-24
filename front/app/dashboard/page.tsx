'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/user-avatar';
import { Brain, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { PatientSidebar } from '@/components/patient-sidebar';
import { InsightCharts } from '@/components/insight-charts';
import { DateRangePicker } from '@/components/date-range-picker';
import { LoadingSpinner } from '@/components/loading-spinner';
import { useQuery } from '@tanstack/react-query';
import { PatientContext, Profiles } from '@/models';
import { Messages } from '@/models/messages';
import { ConversationInsights } from '@/models/conversation_insights';
import { Conversations } from '@/models/conversations';
import type { Profile } from '@/models/profiles';
import type { TriageInfo } from '@/models/patient_context';
import { format, parseISO } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock } from 'lucide-react';
import type { MoodClassificationRow, CrisisClassificationRow } from '@/types/insights';
import { MessageSender } from '@/types/constants';

export default function DashboardPage() {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    from: '2025-08-15',
    to: '2025-08-29',
  });
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [engagementHelpOpen, setEngagementHelpOpen] = useState(false);

  const { data: patients, isLoading: loadingPatients } = useQuery({
    queryKey: ['patients'],
    queryFn: () =>
      Profiles.list({
        filters: { role: 'patient' },
        order: { column: 'full_name', ascending: true },
      }),
  });

  const { data: therapist } = useQuery({
    queryKey: ['therapist'],
    queryFn: async () => {
      const result = await Profiles.list({ filters: { role: 'therapist' }, limit: 1 });
      return result[0] ?? null;
    },
  });

  useEffect(() => {
    if (!selectedPatientId && patients && patients.length > 0) {
      setSelectedPatientId(patients[0].id);
    }
  }, [patients, selectedPatientId]);

  const selectedPatient: Profile | undefined = patients?.find((p) => p.id === selectedPatientId);

  const { data: patientContext, isLoading: loadingPatientContext } = useQuery({
    queryKey: ['patientContext', selectedPatientId],
    enabled: !!selectedPatientId,
    queryFn: async () => {
      const result = await PatientContext.list({
        filters: { patient_id: selectedPatientId as string },
        limit: 1,
      });
      return result[0] ?? null;
    },
  });

  const triageInfo: TriageInfo | null =
    (patientContext?.triage_info as unknown as TriageInfo) || null;
  const lastUpdatedIso = patientContext?.last_updated_at ?? null;

  const isLoadingPatientData = loadingPatients || loadingPatientContext;

  const { data: engagementPct } = useQuery({
    queryKey: ['engagement', selectedPatientId, dateRange.from, dateRange.to],
    enabled: Boolean(selectedPatientId),
    queryFn: async () => {
      const timestamps = await Messages.fetchTimestampsByPatientRange({
        patientId: selectedPatientId as string,
        fromIso: `${dateRange.from}T00:00:00`,
        toIso: `${dateRange.to}T23:59:59`,
        sender: MessageSender.Patient,
      });
      const days = new Set(
        timestamps.map((iso) => iso.slice(0, 10)), // YYYY-MM-DD
      );
      const start = new Date(`${dateRange.from}T00:00:00`);
      const end = new Date(`${dateRange.to}T00:00:00`);
      const diffDays = Math.max(
        1,
        Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1,
      );
      const pct = Math.round((days.size / diffDays) * 100);
      return pct;
    },
  });

  const { data: avgMood } = useQuery({
    queryKey: ['avgMood', selectedPatientId, dateRange.from, dateRange.to],
    enabled: Boolean(selectedPatientId),
    queryFn: async () => {
      const rows = await ConversationInsights.fetchMoodClassificationByPatientRange({
        patientId: selectedPatientId as string,
        fromIso: `${dateRange.from}T00:00:00`,
        toIso: `${dateRange.to}T23:59:59`,
      });
      const scores = rows
        .map((row: MoodClassificationRow) => row?.content?.mood_score)
        .filter((n: number | undefined): n is number => typeof n === 'number' && n >= 0 && n <= 10);
      if (scores.length === 0) return null;
      const avg = scores.reduce((a, n) => a + n, 0) / scores.length;
      return Math.round(avg * 10) / 10;
    },
  });

  const { data: crisisCount } = useQuery({
    queryKey: ['crisisCount', selectedPatientId, dateRange.from, dateRange.to],
    enabled: Boolean(selectedPatientId),
    queryFn: async () => {
      const rows = await ConversationInsights.fetchCrisisClassificationByPatientRange({
        patientId: selectedPatientId as string,
        fromIso: `${dateRange.from}T00:00:00`,
        toIso: `${dateRange.to}T23:59:59`,
      });
      return rows.filter((r: CrisisClassificationRow) => Boolean(r?.content?.is_crisis)).length;
    },
  });

  const { data: totalConversations } = useQuery({
    queryKey: ['totalConversations', selectedPatientId, dateRange.from, dateRange.to],
    enabled: Boolean(selectedPatientId),
    queryFn: async () => {
      const convos = await Conversations.fetchByPatientRange({
        patientId: selectedPatientId as string,
        fromIso: `${dateRange.from}T00:00:00`,
        toIso: `${dateRange.to}T23:59:59`,
      });
      return convos.length;
    },
  });

  const {
    data: generalSummary,
    isLoading: loadingGeneralSummary,
    error: generalSummaryError,
    refetch: refetchGeneralSummary,
  } = useQuery({
    queryKey: ['generalSummary', selectedPatientId, dateRange.from, dateRange.to],
    enabled: Boolean(selectedPatientId),
    queryFn: async () => {
      const qs = new URLSearchParams({
        start_date: `${dateRange.from}T00:00:00`,
        end_date: `${dateRange.to}T23:59:59`,
        patient_id: selectedPatientId as string,
      });
      const res = await fetch(
        `https://imontoyah05.app.n8n.cloud/webhook/general-summary?${qs.toString()}`,
        {
          method: 'GET',
          cache: 'no-store',
        },
      );
      if (!res.ok) throw new Error('Failed to fetch summary');
      const json = await res.json();
      return (json.key_insights ?? null) as string[] | null;
    },
    retry: 0,
  });

  const handlePatientChange = (patientId: string) => {
    setSelectedPatientId(patientId);
    setIsLoadingSummary(true);
    // Simulate summary recompute
    setTimeout(() => setIsLoadingSummary(false), 800);
  };

  // Minimal inline markdown formatter for **bold** segments used in key_insights
  const formatInlineMarkdown = (text: string): string => {
    return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  }

  return (
    <div className="bg-background flex min-h-screen">
      {/* Left Sidebar - Patient Info */}
      {selectedPatient ? (
        <PatientSidebar
          profile={selectedPatient}
          triageInfo={triageInfo}
          lastUpdatedIso={lastUpdatedIso}
          isLoading={isLoadingPatientData}
          patients={patients || []}
          selectedPatientId={selectedPatientId}
          onPatientChange={handlePatientChange}
        />
      ) : (
        <PatientSidebar
          profile={{
            id: '',
            created_at: '',
            updated_at: null,
            email: '',
            full_name: 'Loading...',
            phone: null,
            profile_picture_url: null,
            role: 'patient',
          }}
          isLoading={true}
          patients={patients || []}
          selectedPatientId={selectedPatientId}
          onPatientChange={handlePatientChange}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 p-6">
        {/* Top Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-foreground text-2xl font-semibold">Insights</h1>
          </div>

          {/* Psychologist Profile */}
          <div className="flex items-center gap-3">
            <UserAvatar src={therapist?.profile_picture_url ?? undefined} alt={therapist?.full_name} />
            <span className="text-sm font-medium">{therapist?.full_name || 'Therapist'}</span>
            <Button asChild variant="outline" size="sm">
              <Link href="/">Logout</Link>
            </Button>
          </div>
        </div>

        {/* Date Range Picker */}
        <div className="mb-6">
          <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
        </div>

        {/* Report Generation Notice */}
        <div className="mb-6">
          <Alert className="border-blue-200 bg-blue-50">
            <Clock className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Note:</strong> Reports and insights may take up to 10 minutes to be generated and become viewable in the dashboard after a conversation is finished.
            </AlertDescription>
          </Alert>
        </div>

        {/* Insights Grid */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Summary Card - Full Width */}
          <Card className="bg-card border-border lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="text-primary h-5 w-5" />
                Patient Summary ({format(parseISO(dateRange.from), 'MMM d, yyyy')} -{' '}
                {format(parseISO(dateRange.to), 'MMM d, yyyy')})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingSummary ? (
                <div className="py-8">
                  <LoadingSpinner size="lg" text="Loading patient summary..." />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <div className="bg-primary/10 rounded-lg p-4 text-center">
                      <div className="text-primary text-2xl font-bold">
                        {totalConversations ?? 0}
                      </div>
                      <div className="text-muted-foreground text-sm">Total Conversations</div>
                    </div>
                    <div className="bg-secondary/10 rounded-lg p-4 text-center">
                      <div className="text-secondary text-2xl font-bold">{crisisCount ?? 0}</div>
                      <div className="text-muted-foreground text-sm">Crisis Events</div>
                    </div>
                    <div className="bg-accent/10 rounded-lg p-4 text-center">
                      <div className="text-accent text-2xl font-bold">{avgMood ?? '—'}</div>
                      <div className="text-muted-foreground text-sm">Average Mood</div>
                    </div>
                    <div className="rounded-lg bg-green-100 p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">{engagementPct ?? 0}%</div>
                      <div className="text-muted-foreground flex items-center justify-center gap-1 text-sm">
                        Engagement Rate
                        <Popover open={engagementHelpOpen} onOpenChange={setEngagementHelpOpen}>
                          <PopoverTrigger
                            aria-label="What is engagement rate?"
                            className="text-muted-foreground hover:text-foreground inline-flex items-center"
                            onMouseEnter={() => setEngagementHelpOpen(true)}
                            onMouseLeave={() => setEngagementHelpOpen(false)}
                          >
                            <HelpCircle className="h-4 w-4" />
                          </PopoverTrigger>
                          <PopoverContent
                            side="top"
                            align="center"
                            className="w-72 text-left text-xs"
                            onMouseEnter={() => setEngagementHelpOpen(true)}
                            onMouseLeave={() => setEngagementHelpOpen(false)}
                          >
                            Percentage of days in the selected period when the patient sent at least
                            one message to the bot.
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                  <div className="bg-muted mt-4 space-y-2 rounded-lg p-4">
                    <div className="text-sm font-medium">Key Insights</div>
                    {loadingGeneralSummary ? (
                      <div className="flex items-center gap-3">
                        <LoadingSpinner size="sm" />
                        <div className="text-muted-foreground text-xs">
                          Generating insights... This may take up to a minute. Please stay on this
                          page.
                        </div>
                      </div>
                    ) : generalSummaryError ? (
                      <div className="text-xs text-red-600">
                        Failed to load summary.{' '}
                        <button className="underline" onClick={() => refetchGeneralSummary()}>
                          Try again
                        </button>
                      </div>
                    ) : generalSummary ? (
                      <div className="space-y-3">
                        {Array.isArray(generalSummary) && generalSummary.length > 0 ? (
                          <div>
                            <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-xs">
                              {generalSummary.map((k, i) => {
                                const html = formatInlineMarkdown(k)
                                return <li key={i} dangerouslySetInnerHTML={{ __html: html }} />
                              })}
                            </ul>
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">No summary available.</p>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <InsightCharts
          isLoading={isLoadingSummary}
          patientId={selectedPatientId ?? undefined}
          dateRange={{ from: dateRange.from, to: dateRange.to }}
        />
      </div>
    </div>
  );
}
