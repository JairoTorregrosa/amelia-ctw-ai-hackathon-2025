"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { UserAvatar } from "@/components/user-avatar"
import { Brain } from "lucide-react"
import { PatientSidebar } from "@/components/patient-sidebar"
import { InsightCharts } from "@/components/insight-charts"
import { DateRangePicker } from "@/components/date-range-picker"
import { LoadingSpinner } from "@/components/loading-spinner"

// Mock data for patients
const mockPatients = [
  {
    id: "1",
    name: "Sarah Johnson",
    age: 28,
    diagnosis: "Anxiety Disorder",
    lastSession: "2025-08-20",
    riskLevel: "low",
    avatar: "/professional-woman.png",
  },
  {
    id: "2",
    name: "Michael Chen",
    age: 34,
    diagnosis: "Depression",
    lastSession: "2025-08-19",
    riskLevel: "medium",
    avatar: "/professional-man.png",
  },
  {
    id: "3",
    name: "Emma Rodriguez",
    age: 22,
    diagnosis: "PTSD",
    lastSession: "2025-08-18",
    riskLevel: "high",
    avatar: "/young-woman.png",
  },
]

// Mock psychologist data
const mockPsychologist = {
  name: "Dr. Amanda Wilson",
  avatar: "/doctor-woman.png",
}

export default function DashboardPage() {
  const [selectedPatient, setSelectedPatient] = useState(mockPatients[0])
  const [dateRange, setDateRange] = useState({
    from: "2025-07-15",
    to: "2025-07-22",
  })
  const [isLoadingPatientData, setIsLoadingPatientData] = useState(false)
  const [isLoadingSummary, setIsLoadingSummary] = useState(false)

  const handlePatientChange = (patientId: string) => {
    const patient = mockPatients.find((p) => p.id === patientId)
    if (patient) {
      setIsLoadingPatientData(true)
      setIsLoadingSummary(true)

      setTimeout(() => {
        setSelectedPatient(patient)
        setIsLoadingPatientData(false)
        setIsLoadingSummary(false)
      }, 1500)
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Sidebar - Patient Info */}
      <PatientSidebar patient={selectedPatient} isLoading={isLoadingPatientData} />

      {/* Main Content Area */}
      <div className="flex-1 p-6">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold text-foreground">Insights</h1>
            <Select value={selectedPatient.id} onValueChange={handlePatientChange}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select patient" />
              </SelectTrigger>
              <SelectContent>
                {mockPatients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    <div className="flex items-center gap-2">
                      <UserAvatar className="h-6 w-6" />
                      {patient.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Psychologist Profile */}
          <div className="flex items-center gap-3">
            <UserAvatar />
            <span className="text-sm font-medium">{mockPsychologist.name}</span>
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
                Patient Summary ({dateRange.from} - {dateRange.to})
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
