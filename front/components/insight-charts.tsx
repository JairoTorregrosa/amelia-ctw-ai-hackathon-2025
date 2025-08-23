"use client"

import { useState } from "react"
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
import { CrisisEmotionModal, getCrisisDetails, getEmotionDetails } from "./crisis-emotion-modal"

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

const emotionData = [
  { name: "Calm", value: 35, color: "#A5E3D0" },
  { name: "Anxious", value: 25, color: "#6CAEDD" },
  { name: "Happy", value: 20, color: "#C7B7E8" },
  { name: "Sad", value: 15, color: "#F97316" },
  { name: "Angry", value: 5, color: "#EF4444" },
]

const crisisData = [
  { time: "09:30", intensity: 8, duration: 15 },
  { time: "14:20", intensity: 6, duration: 8 },
  { time: "19:45", intensity: 9, duration: 22 },
]

interface InsightChartsProps {
  isLoading?: boolean
}

export function InsightCharts({ isLoading = false }: InsightChartsProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<"crisis" | "emotion">("crisis")
  const [modalData, setModalData] = useState<any>(null)

  const handleCrisisClick = (crisisIndex: number) => {
    const crisisDetails = getCrisisDetails(crisisIndex)
    if (crisisDetails) {
      setModalType("crisis")
      setModalData(crisisDetails)
      setModalOpen(true)
    }
  }

  const handleEmotionClick = (emotionName: string) => {
    const emotionDetails = getEmotionDetails(emotionName)
    if (emotionDetails) {
      setModalType("emotion")
      setModalData(emotionDetails)
      setModalOpen(true)
    }
  }

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

        {/* Emotion Distribution */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-accent" />
              Emotion Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={emotionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  onClick={(data) => {
                    if (data && data.name) {
                      handleEmotionClick(data.name)
                    }
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {emotionData.map((entry, index) => (
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
            <div className="flex flex-wrap gap-2 mt-4">
              {emotionData.map((emotion, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 cursor-pointer hover:bg-muted p-1 rounded transition-colors"
                  onClick={() => handleEmotionClick(emotion.name)}
                >
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: emotion.color }} />
                  <span className="text-xs text-muted-foreground">
                    {emotion.name} ({emotion.value}%)
                  </span>
                </div>
              ))}
            </div>
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

      <CrisisEmotionModal isOpen={modalOpen} onClose={() => setModalOpen(false)} type={modalType} data={modalData} />
    </>
  )
}
