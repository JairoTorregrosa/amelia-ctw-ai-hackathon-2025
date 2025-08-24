"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
} from "recharts"
import { TrendingUp, MessageSquare, AlertTriangle, Activity } from "lucide-react"
import { ChartLoadingSkeleton } from "./chart-loading-skeleton"
import { CrisisEmotionModal, getCrisisDetails } from "./crisis-emotion-modal"
import { useQuery } from "@tanstack/react-query"
import { fetchPrimaryEmotionInsightsByPatient, type PrimaryEmotionItem } from "@/models/conversation_insights"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Mock data for charts
const moodData = [
  { date: "07/15", mood: 6.2, anxiety: 7.1 },
  { date: "07/16", mood: 6.8, anxiety: 6.5 },
  { date: "07/17", mood: 7.2, anxiety: 6.0 },
  { date: "07/18", mood: 6.9, anxiety: 6.8 },
  { date: "07/19", mood: 7.5, anxiety: 5.5 },
  { date: "07/20", mood: 7.8, anxiety: 5.2 },
  { date: "07/21", mood: 7.3, anxiety: 5.8 },
  { date: "07/22", mood: 7.6, anxiety: 5.1 },
]

const sessionData = [
  { day: "Mon", sessions: 2, engagement: 85 },
  { day: "Tue", sessions: 1, engagement: 92 },
  { day: "Wed", sessions: 3, engagement: 78 },
  { day: "Thu", sessions: 2, engagement: 88 },
  { day: "Fri", sessions: 1, engagement: 95 },
  { day: "Sat", sessions: 0, engagement: 0 },
  { day: "Sun", sessions: 1, engagement: 82 },
]

const crisisData = [
  { time: "09:30", intensity: 8, duration: 15 },
  { time: "14:20", intensity: 6, duration: 8 },
  { time: "19:45", intensity: 9, duration: 22 },
]

interface InsightChartsProps {
  isLoading?: boolean
  patientId?: string
  dateRange?: { from: string; to: string }
}

type AggregatedEmotion = {
  name: string
  count: number
  avgIntensity: number | null
  triggers: string[]
  contexts: string[]
  color: string
}

const EMOTION_COLORS: Record<string, string> = {
  joy: "#A5E3D0",
  sadness: "#6CAEDD",
  anger: "#EF4444",
  fear: "#F59E0B",
  disgust: "#10B981",
  surprise: "#C7B7E8",
}

const ALLOWED_EMOTIONS = new Set(["joy", "sadness", "anger", "fear", "surprise", "disgust"])

export function InsightCharts({ isLoading = false, patientId, dateRange }: InsightChartsProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<"crisis" | "emotion">("crisis")
  const [modalData, setModalData] = useState<any>(null)
  const [selectedEmotion, setSelectedEmotion] = useState<AggregatedEmotion | null>(null)

  const handleCrisisClick = (crisisIndex: number) => {
    const crisisDetails = getCrisisDetails(crisisIndex)
    if (crisisDetails) {
      setModalType("crisis")
      setModalData(crisisDetails)
      setModalOpen(true)
    }
  }

  const handleEmotionClick = (emotionName: string) => {
    const agg = aggregatedEmotions.find((e) => e.name.toLowerCase() === emotionName.toLowerCase())
    if (agg) {
      setModalType("emotion")
      setSelectedEmotion(agg)
      setModalOpen(true)
    }
  }

  const { data: primaryEmotionContents, isLoading: loadingPrimaryEmotions } = useQuery({
    queryKey: ["primaryEmotions", patientId, dateRange?.from, dateRange?.to],
    enabled: Boolean(patientId && dateRange?.from && dateRange?.to),
    queryFn: async () => {
      return fetchPrimaryEmotionInsightsByPatient({
        patientId: patientId as string,
        fromIso: `${dateRange!.from}T00:00:00`,
        toIso: `${dateRange!.to}T23:59:59`,
      })
    },
  })

  const aggregatedEmotions: AggregatedEmotion[] = useMemo(() => {
    const allItems: PrimaryEmotionItem[] = []
    for (const content of primaryEmotionContents || []) {
      const list = content?.primary_emotions || []
      for (const item of list) {
        if (item && item.emotion) {
          const normalized = String(item.emotion).toLowerCase()
          if (ALLOWED_EMOTIONS.has(normalized)) {
            allItems.push({ ...item, emotion: normalized })
          }
        }
      }
    }
    if (allItems.length === 0) return []

    const byEmotion = new Map<string, { total: number; intensities: number[]; triggers: string[]; contexts: string[] }>()
    for (const item of allItems) {
      const key = (item.emotion || "unknown").toLowerCase()
      if (!byEmotion.has(key)) byEmotion.set(key, { total: 0, intensities: [], triggers: [], contexts: [] })
      const bucket = byEmotion.get(key)!
      bucket.total += 1
      if (typeof item.intensity === 'number') bucket.intensities.push(item.intensity)
      if (item.trigger) bucket.triggers.push(item.trigger)
      if (item.context) bucket.contexts.push(item.context)
    }

    const palette = ["#A5E3D0", "#6CAEDD", "#C7B7E8", "#F97316", "#EF4444", "#10B981"]
    let i = 0

    return Array.from(byEmotion.entries()).map(([name, b]) => {
      const avg = b.intensities.length ? b.intensities.reduce((a, n) => a + n, 0) / b.intensities.length : null
      const color = EMOTION_COLORS[name] || palette[i++ % palette.length]
      // Deduplicate keeping first occurrences
      const dedupe = (arr: string[]) => Array.from(new Set(arr)).slice(0, 5)
      const displayName = name.charAt(0).toUpperCase() + name.slice(1)
      return {
        name: displayName,
        count: b.total,
        avgIntensity: avg,
        triggers: dedupe(b.triggers),
        contexts: dedupe(b.contexts),
        color,
      }
    })
  }, [primaryEmotionContents])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartLoadingSkeleton title="Mood & Anxiety Trends" icon={<TrendingUp className="h-5 w-5 text-primary" />} />
        <ChartLoadingSkeleton
          title="Weekly Session Activity"
          icon={<MessageSquare className="h-5 w-5 text-secondary" />}
        />
        <ChartLoadingSkeleton title="Emotion Distribution" icon={<Activity className="h-5 w-5 text-accent" />} />
        <ChartLoadingSkeleton
          title="Crisis Events"
          icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
          height={200}
        />
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Trends Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Mood & Anxiety Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={moodData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="#6CAEDD"
                  strokeWidth={3}
                  dot={{ fill: "#6CAEDD", strokeWidth: 2, r: 4 }}
                  name="Mood Score"
                />
                <Line
                  type="monotone"
                  dataKey="anxiety"
                  stroke="#A5E3D0"
                  strokeWidth={3}
                  dot={{ fill: "#A5E3D0", strokeWidth: 2, r: 4 }}
                  name="Anxiety Level"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Session Activity Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-secondary" />
              Weekly Session Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={sessionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="sessions" fill="#A5E3D0" radius={[4, 4, 0, 0]} name="Sessions" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Emotion Distribution (Primary Emotions from Insights) */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-accent" />
              Emotion Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingPrimaryEmotions ? (
              <div className="h-[250px] flex items-center justify-center text-sm text-muted-foreground">Loading emotions…</div>
            ) : aggregatedEmotions.length === 0 ? (
              <div className="h-[250px] flex items-center justify-center text-sm text-muted-foreground">No emotion data in range</div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={aggregatedEmotions.map((e) => ({ name: e.name, value: e.count, color: e.color }))}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      onClick={(data) => {
                        if (data && data.name) {
                          handleEmotionClick(data.name as string)
                        }
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      {aggregatedEmotions.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-3 mt-4">
                  {aggregatedEmotions.map((emotion, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 cursor-pointer hover:bg-muted p-1 rounded transition-colors"
                      onClick={() => handleEmotionClick(emotion.name)}
                    >
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: emotion.color }} />
                      <span className="text-xs text-muted-foreground">
                        {emotion.name} ({emotion.count})
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Crisis Events */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Crisis Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {crisisData.map((crisis, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200 cursor-pointer hover:bg-red-100 transition-colors"
                  onClick={() => handleCrisisClick(index)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <div>
                      <div className="text-sm font-medium text-red-800">Crisis at {crisis.time}</div>
                      <div className="text-xs text-red-600">Duration: {crisis.duration} minutes</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-red-800">{crisis.intensity}/10</div>
                    <div className="text-xs text-red-600">Intensity</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Existing modal for mock crisis data */}
      <CrisisEmotionModal isOpen={modalOpen && modalType === 'crisis'} onClose={() => setModalOpen(false)} type={modalType} data={modalData} />

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
                <div className="text-xs text-muted-foreground">Occurrences</div>
                <div className="font-semibold">{selectedEmotion?.count ?? 0}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Avg Intensity</div>
                <div className="font-semibold">{selectedEmotion?.avgIntensity != null ? selectedEmotion?.avgIntensity.toFixed(1) : '—'}</div>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-1">Common Triggers</div>
              <div className="flex flex-wrap gap-2">
                {(selectedEmotion?.triggers || []).map((t, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded bg-muted">{t}</span>
                ))}
                {(!selectedEmotion || selectedEmotion.triggers.length === 0) && (
                  <span className="text-xs text-muted-foreground">No triggers</span>
                )}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-1">Contexts</div>
              <ul className="list-disc pl-5 space-y-1 max-h-40 overflow-y-auto">
                {(selectedEmotion?.contexts || []).map((c, i) => (
                  <li key={i} className="text-sm">{c}</li>
                ))}
                {(!selectedEmotion || selectedEmotion.contexts.length === 0) && (
                  <span className="text-xs text-muted-foreground">No contexts</span>
                )}
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
