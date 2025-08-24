"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { UserAvatar } from "@/components/user-avatar"
import { Brain } from "lucide-react"
import { PatientSidebar } from "@/components/patient-sidebar"
import { InsightCharts } from "@/components/insight-charts"
import { DateRangePicker } from "@/components/date-range-picker"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useQuery } from "@tanstack/react-query"
import { PatientContext, Profiles } from "@/models"
import type { Profile } from "@/models/profiles"
import type { TriageInfo } from "@/models/patient_context"
import { format, parseISO, isValid as isValidDate } from "date-fns"

export default function DashboardPage() {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState({
    from: "2025-07-15",
    to: "2025-07-22",
  })
  const [isLoadingSummary, setIsLoadingSummary] = useState(false)

  const { data: patients, isLoading: loadingPatients } = useQuery({
    queryKey: ["patients"],
    queryFn: () =>
      Profiles.list({
        filters: { role: "patient" },
        order: { column: "full_name", ascending: true },
      }),
  })

  const { data: therapist } = useQuery({
    queryKey: ["therapist"],
    queryFn: async () => {
      const result = await Profiles.list({ filters: { role: "therapist" }, limit: 1 })
      return result[0] ?? null
    },
  })

  useEffect(() => {
    if (!selectedPatientId && patients && patients.length > 0) {
      setSelectedPatientId(patients[0].id)
    }
  }, [patients, selectedPatientId])

  const selectedPatient: Profile | undefined = patients?.find((p) => p.id === selectedPatientId)

  const {
    data: patientContext,
    isLoading: loadingPatientContext,
  } = useQuery({
    queryKey: ["patientContext", selectedPatientId],
    enabled: !!selectedPatientId,
    queryFn: async () => {
      const result = await PatientContext.list({ filters: { patient_id: selectedPatientId as string }, limit: 1 })
      return result[0] ?? null
    },
  })

  const triageInfo: TriageInfo | null = (patientContext?.triage_info as unknown as TriageInfo) || null
  const lastUpdatedIso = patientContext?.last_updated_at ?? null

  const isLoadingPatientData = loadingPatients || loadingPatientContext

  const handlePatientChange = (patientId: string) => {
    setSelectedPatientId(patientId)
    setIsLoadingSummary(true)
    // Simulate summary recompute
    setTimeout(() => setIsLoadingSummary(false), 800)
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Sidebar - Patient Info */}
      {selectedPatient ? (
        <PatientSidebar
          profile={selectedPatient}
          triageInfo={triageInfo}
          lastUpdatedIso={lastUpdatedIso}
          isLoading={isLoadingPatientData}
        />
      ) : (
        <PatientSidebar
          profile={{ id: "", created_at: "", updated_at: null, email: "", full_name: "Loading...", phone: null, role: "patient" }}
          isLoading={true}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 p-6">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold text-foreground">Insights</h1>
            <Select value={selectedPatientId ?? ""} onValueChange={handlePatientChange}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select patient" />
              </SelectTrigger>
              <SelectContent>
                {(patients || []).map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    <div className="flex items-center gap-2">
                      <UserAvatar className="h-6 w-6" />
                      {patient.full_name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Psychologist Profile */}
          <div className="flex items-center gap-3">
            <UserAvatar />
            <span className="text-sm font-medium">{therapist?.full_name || 'Therapist'}</span>
            <Button variant="outline" size="sm">
              Logout
            </Button>
          </div>
        </div>

        {/* Date Range Picker */}
        <div className="mb-6">
          <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
        </div>

        {/* Insights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Summary Card - Full Width */}
          <Card className="lg:col-span-2 bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Patient Summary ({format(parseISO(dateRange.from), 'MMM d, yyyy')} - {format(parseISO(dateRange.to), 'MMM d, yyyy')})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingSummary ? (
                <div className="py-8">
                  <LoadingSpinner size="lg" text="Loading patient summary..." />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-primary/10 rounded-lg">
                      <div className="text-2xl font-bold text-primary">12</div>
                      <div className="text-sm text-muted-foreground">Total Sessions</div>
                    </div>
                    <div className="text-center p-4 bg-secondary/10 rounded-lg">
                      <div className="text-2xl font-bold text-secondary">3</div>
                      <div className="text-sm text-muted-foreground">Crisis Events</div>
                    </div>
                    <div className="text-center p-4 bg-accent/10 rounded-lg">
                      <div className="text-2xl font-bold text-accent">7.2</div>
                      <div className="text-sm text-muted-foreground">Avg Mood Score</div>
                    </div>
                    <div className="text-center p-4 bg-green-100 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">85%</div>
                      <div className="text-sm text-muted-foreground">Engagement Rate</div>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Key Insights:</strong> Patient shows significant improvement in anxiety management. Mood
                      scores have increased by 15% compared to previous period. Recommended to continue current therapy
                      approach with focus on coping strategies.
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <InsightCharts isLoading={isLoadingSummary} />
      </div>
    </div>
  )
}
