import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { UserAvatar } from "./user-avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, AlertTriangle, Heart } from "lucide-react"
import { LoadingSpinner } from "./loading-spinner"
import type { Profile } from "@/models/profiles"
import type { TriageInfo } from "@/models/patient_context"
import { format, parseISO, isValid as isValidDate } from "date-fns"

interface PatientSidebarProps {
  profile: Profile
  triageInfo?: TriageInfo | null
  lastUpdatedIso?: string | null
  isLoading?: boolean
}

export function PatientSidebar({ profile, triageInfo, lastUpdatedIso, isLoading = false }: PatientSidebarProps) {
  const getRiskColor = (level?: string) => {
    const normalized = (level || "").toLowerCase()
    switch (normalized) {
      case "low":
      case "bajo":
        return "bg-green-100 text-green-800"
      case "bajo-moderado":
        return "bg-yellow-100 text-yellow-800"
      case "medium":
      case "moderado":
        return "bg-yellow-100 text-yellow-800"
      case "moderado-alto":
        return "bg-orange-100 text-orange-800"
      case "high":
      case "alto":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatRiskLabel = (label?: string) => {
    if (!label) return 'Unknown'
    const cleaned = label.replace(/[_-]/g, ' ')
    return cleaned
      .split(' ')
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ')
  }

  const formatDateString = (value?: string | null) => {
    if (!value) return '—'
    try {
      const date = parseISO(value)
      if (isValidDate(date)) return format(date, 'MMM d, yyyy')
    } catch {}
    return value
  }

  const formatUnderscoreToSpace = (value?: string | null) => {
    if (!value) return 'n/a'
    return value.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')
  }

  const displayName = triageInfo?.usuario?.nombre_preferido || profile.full_name
  const age = triageInfo?.usuario?.edad
  const diagnosis = triageInfo?.motivo_consulta?.descripcion_breve
  const risk = triageInfo?.riesgo?.nivel_riesgo_global
  const lastSession = formatDateString(lastUpdatedIso || triageInfo?.metadata?.fecha_registro_iso8601)

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
                  <h2 className="text-xl font-semibold text-card-foreground break-words text-center">{displayName}</h2>
                  {age != null ? (
                    <p className="text-sm text-muted-foreground">Age: {age}</p>
                  ) : null}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-card-foreground">Objectives </span>
                  {triageInfo?.motivo_consulta?.objetivos_iniciales_usuario?.map((objective: string, index: number) => (
                    <Badge key={index} variant="secondary" className="bg-primary/10 text-primary max-w-[220px] text-wrap wrap-break-word">
                      {objective}
                    </Badge>
                )) || 'Not specified'}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-card-foreground">Risk Level</span>
                  <Badge className={getRiskColor(risk)}>
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {formatRiskLabel(risk)}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-card-foreground">Last Session</span>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <CalendarDays className="h-3 w-3" />
                    {lastSession}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="text-sm font-medium text-card-foreground mb-3">Patient Info</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary" />
                    <span>
                      {formatUnderscoreToSpace(triageInfo?.plan_inicial?.modalidad) || 'Treatment'} • {formatUnderscoreToSpace(triageInfo?.plan_inicial?.frecuencia)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-secondary" />
                    <span>
                      Next appointment: {format(parseISO(triageInfo?.proxima_cita_iso8601 || ''), 'MMM d, yyyy') || '—'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="text-sm font-medium text-card-foreground mb-2">Recent Notes</h3>
                <p className="text-xs text-muted-foreground leading-relaxed max-h-24 overflow-y-auto pr-1">
                  {triageInfo?.motivo_consulta?.descripcion_breve || 'No notes available.'}
                </p>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  )
}
