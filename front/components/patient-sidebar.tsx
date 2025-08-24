import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { UserAvatar } from "./user-avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, AlertTriangle, Heart } from "lucide-react"
import { LoadingSpinner } from "./loading-spinner"

interface Patient {
  id: string
  name: string
  age: number
  diagnosis: string
  lastSession: string
  riskLevel: "low" | "medium" | "high"
  avatar: string
}

interface PatientSidebarProps {
  patient: Patient
  isLoading?: boolean
}

export function PatientSidebar({ patient, isLoading = false }: PatientSidebarProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="w-80 bg-sidebar border-r border-sidebar-border p-6">
      <Card className="bg-card border-border">
        {isLoading ? (
          <div className="p-8">
            <LoadingSpinner size="lg" text="Loading patient data..." />
          </div>
        ) : (
          <>
            <CardHeader className="text-center pb-4">
              <div className="flex flex-col items-center gap-4">
                <UserAvatar size={96} />
                <div>
                  <h2 className="text-xl font-semibold text-card-foreground">{patient.name}</h2>
                  <p className="text-sm text-muted-foreground">Age: {patient.age}</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-card-foreground">Diagnosis</span>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {patient.diagnosis}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-card-foreground">Risk Level</span>
                  <Badge className={getRiskColor(patient.riskLevel)}>
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {patient.riskLevel.toUpperCase()}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-card-foreground">Last Session</span>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <CalendarDays className="h-3 w-3" />
                    {patient.lastSession}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="text-sm font-medium text-card-foreground mb-3">Patient Info</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary" />
                    <span>Active treatment plan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-secondary" />
                    <span>Weekly sessions</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="text-sm font-medium text-card-foreground mb-2">Recent Notes</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Patient showing positive response to cognitive behavioral therapy. Anxiety levels have decreased
                  significantly over the past month.
                </p>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  )
}
