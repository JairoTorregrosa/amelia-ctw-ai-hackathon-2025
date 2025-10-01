'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/user-avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Brain, HelpCircle, Megaphone } from 'lucide-react';
import { AuthGuard } from '@/components/auth-guard';
import { useAuth } from '@/contexts/auth-context';
import { InsightCharts } from '@/components/insight-charts';
import { DateRangePicker } from '@/components/date-range-picker';
import { LoadingSpinner } from '@/components/loading-spinner';
import { useQuery } from '@tanstack/react-query';
import { Messages } from '@/models/messages';
import { ConversationInsights } from '@/models/conversation_insights';
import { Conversations } from '@/models/conversations';
import { addWeeks, format, parseISO, subWeeks } from 'date-fns';
import { es } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Link from 'next/link';
import type { MoodClassificationRow, CrisisClassificationRow } from '@/types/insights';
import { MessageSender } from '@/types/constants';

export default function DashboardPage() {
  const { logout, user } = useAuth();
  const selectedPatientId = user?.id || null;
  // Inicializa el rango predeterminado: una semana antes y una semana después de hoy
  const [dateRange, setDateRange] = useState(() => {
    const today = new Date();
    return {
      from: format(subWeeks(today, 1), 'yyyy-MM-dd'),
      to: format(addWeeks(today, 1), 'yyyy-MM-dd'),
    };
  });
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [engagementHelpOpen, setEngagementHelpOpen] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);

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

  // Minimal inline markdown formatter for **bold** segments used in key_insights
  const formatInlineMarkdown = (text: string): string => {
    return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  };

  return (
    <AuthGuard>
      <div className="bg-background flex min-h-screen">
        <Dialog open={showWelcomeModal} onOpenChange={setShowWelcomeModal}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Bienvenido al panel de Amelia</DialogTitle>
              <DialogDescription>
                Explora un resumen de tus conversaciones recientes, tendencias emocionales y la
                participación registrada en el periodo seleccionado.
              </DialogDescription>
            </DialogHeader>
            <div className="text-muted-foreground text-sm space-y-3">
              <p>
                Usa los widgets y gráficos para identificar oportunidades de seguimiento rápido y
                detectar señales relevantes. Cambia el rango de fechas para profundizar en periodos
                específicos.
              </p>
              <p>
                ¿Nos cuentas qué tal te fue? Tu retroalimentación nos ayuda a priorizar mejoras y
                nuevas funcionalidades.
              </p>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setShowWelcomeModal(false)}>
                Quizás después
              </Button>
              <Button asChild onClick={() => setShowWelcomeModal(false)}>
                <Link
                  href="https://docs.google.com/forms/d/e/1FAIpQLSeNlN0jajjVxZCxsIhD5oZ000RcW-3_pWzNSyiEGynfWyex3w/viewform"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Compartir feedback
                </Link>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* PatientSidebar removed for this demo; page shows data for the authenticated user */}

        {/* Main Content Area */}
        <div className="flex-1 p-6">
          {/* Encabezado superior */}
          <Alert className="border-psychology-blue/40 bg-psychology-blue/10 mb-6">
            <Megaphone className="h-5 w-5 text-psychology-blue" />
            <AlertDescription className="text-sm text-slate-700 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span>
                Gracias por probar Amelia. Cuéntanos cómo te fue para ayudarnos a priorizar mejoras y nuevas funcionalidades.
              </span>
              <Button asChild variant="secondary" size="sm" className="whitespace-nowrap">
                <Link
                  href="https://docs.google.com/forms/d/e/1FAIpQLSeNlN0jajjVxZCxsIhD5oZ000RcW-3_pWzNSyiEGynfWyex3w/viewform"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Compartir feedback
                </Link>
              </Button>
            </AlertDescription>
          </Alert>

          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-foreground text-2xl font-semibold">Resumen</h1>
            </div>

            {/* Perfil del profesional */}
            <div className="flex items-center gap-3">
              <UserAvatar src={user?.profile_picture_url ?? undefined} alt={user?.full_name} />
              <span className="text-sm font-medium">{user?.full_name || 'Usuario'}</span>
              <Button variant="outline" size="sm" onClick={logout}>
                Salir
              </Button>
            </div>
          </div>

          {/* Selector de rango de fechas */}
          <div className="mb-6">
            <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
          </div>

          {/* Cuadrícula de insights */}
          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Tarjeta de resumen - ancho completo */}
            <Card className="bg-card border-border lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="text-primary h-5 w-5" />
                  Resumen del paciente (
                  {format(parseISO(dateRange.from), "d 'de' MMMM 'de' yyyy", { locale: es })} -{' '}
                  {format(parseISO(dateRange.to), "d 'de' MMMM 'de' yyyy", { locale: es })})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingSummary ? (
                  <div className="py-8">
                    <LoadingSpinner size="lg" text="Cargando resumen del paciente..." />
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                      <div className="bg-primary/10 rounded-lg p-4 text-center">
                        <div className="text-primary text-2xl font-bold">
                          {totalConversations ?? 0}
                        </div>
                        <div className="text-muted-foreground text-sm">Conversaciones totales</div>
                      </div>
                      <div className="bg-secondary/10 rounded-lg p-4 text-center">
                        <div className="text-secondary text-2xl font-bold">{crisisCount ?? 0}</div>
                        <div className="text-muted-foreground text-sm">Eventos de crisis</div>
                      </div>
                      <div className="bg-accent/10 rounded-lg p-4 text-center">
                        <div className="text-accent text-2xl font-bold">{avgMood ?? '—'}</div>
                        <div className="text-muted-foreground text-sm">Estado de ánimo promedio</div>
                      </div>
                      <div className="rounded-lg bg-green-100 p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {engagementPct ?? 0}%
                        </div>
                        <div className="text-muted-foreground flex items-center justify-center gap-1 text-sm">
                          Tasa de participación
                          <Popover open={engagementHelpOpen} onOpenChange={setEngagementHelpOpen}>
                            <PopoverTrigger
                              aria-label="¿Qué es la tasa de participación?"
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
                              Porcentaje de días del periodo seleccionado en los que el paciente envió al
                              menos un mensaje al bot.
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>
                    <div className="bg-muted mt-4 space-y-2 rounded-lg p-4">
                      <div className="text-sm font-medium">Insights clave</div>
                      {loadingGeneralSummary ? (
                        <div className="flex items-center gap-3">
                          <LoadingSpinner size="sm" />
                          <div className="text-muted-foreground text-xs">
                            Generando insights... Puede tomar hasta un minuto. Permanece en esta
                            página.
                          </div>
                        </div>
                      ) : generalSummaryError ? (
                        <div className="text-xs text-red-600">
                          No se pudo cargar el resumen.{' '}
                          <button className="underline" onClick={() => refetchGeneralSummary()}>
                            Intentar de nuevo
                          </button>
                        </div>
                      ) : generalSummary ? (
                        <div className="space-y-3">
                          {Array.isArray(generalSummary) && generalSummary.length > 0 ? (
                            <div>
                              <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-xs">
                                {generalSummary.map((k, i) => {
                                  const html = formatInlineMarkdown(k);
                                  return <li key={i} dangerouslySetInnerHTML={{ __html: html }} />;
                                })}
                              </ul>
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm">No hay resumen disponible.</p>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Cuadrícula de gráficos */}
          <InsightCharts
            isLoading={isLoadingSummary}
            patientId={selectedPatientId ?? undefined}
            dateRange={{ from: dateRange.from, to: dateRange.to }}
          />
        </div>
      </div>
    </AuthGuard>
  );
}
