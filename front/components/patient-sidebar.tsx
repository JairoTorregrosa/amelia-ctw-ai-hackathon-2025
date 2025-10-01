import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { UserAvatar } from './user-avatar';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, AlertTriangle, Heart } from 'lucide-react';
import { LoadingSpinner } from './loading-spinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Profile } from '@/models/profiles';
import type { TriageInfo } from '@/models/patient_context';
import { RISK_LEVEL_COLORS } from '@/types/constants';
import { format, parseISO, isValid as isValidDate } from 'date-fns';
import { es } from 'date-fns/locale';

interface PatientSidebarProps {
  profile: Profile;
  triageInfo?: TriageInfo | null;
  lastUpdatedIso?: string | null;
  isLoading?: boolean;
  patients?: Profile[];
  selectedPatientId?: string | null;
  onPatientChange?: (patientId: string) => void;
}

export function PatientSidebar({
  profile,
  triageInfo,
  lastUpdatedIso,
  isLoading = false,
  patients,
  selectedPatientId,
  onPatientChange,
}: PatientSidebarProps) {
  const getRiskColor = (level?: string) => {
    const normalized = (level || '').toLowerCase();
    return RISK_LEVEL_COLORS[normalized] || RISK_LEVEL_COLORS.default;
  };

  const formatRiskLabel = (label?: string) => {
    if (!label) return 'Desconocido';
    const cleaned = label.replace(/[_-]/g, ' ').toLowerCase();
    const translations: Record<string, string> = {
      'low risk': 'Riesgo bajo',
      'medium risk': 'Riesgo medio',
      'moderate risk': 'Riesgo moderado',
      'high risk': 'Riesgo alto',
      'very high risk': 'Riesgo muy alto',
      default: 'Desconocido',
    };
    return translations[cleaned] || cleaned.replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const formatDateString = (value?: string | null) => {
    if (!value) return '—';
    try {
      const date = parseISO(value);
      if (isValidDate(date)) return format(date, "d 'de' MMMM, yyyy", { locale: es });
    } catch {
      return value;
    }
    return value;
  };

  const formatUnderscoreToSpace = (value?: string | null) => {
    if (!value) return 'No aplica';
    return value
      .split('_')
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const displayName = triageInfo?.usuario?.nombre_preferido || profile.full_name;
  const age = triageInfo?.usuario?.edad;
  const risk = triageInfo?.riesgo?.nivel_riesgo_global;
  const lastSession = formatDateString(
    lastUpdatedIso || triageInfo?.metadata?.fecha_registro_iso8601,
  );

  return (
    <div className="bg-sidebar border-sidebar-border w-80 border-r p-6">
      {Array.isArray(patients) && typeof onPatientChange === 'function' ? (
        <div className="mb-4">
          <Select value={selectedPatientId ?? ''} onValueChange={onPatientChange}>
            <SelectTrigger className="w-full bg-white text-black dark:bg-white dark:text-black">
              <SelectValue placeholder="Selecciona un paciente" />
            </SelectTrigger>
            <SelectContent>
              {patients.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}
      <Card className="bg-card border-border">
        {isLoading ? (
          <div className="p-8">
            <LoadingSpinner size="lg" text="Cargando datos del paciente..." />
          </div>
        ) : (
          <>
            <CardHeader className="pb-4 text-center">
              <div className="flex flex-col items-center gap-4">
                <UserAvatar
                  size={96}
                  src={profile.profile_picture_url ?? undefined}
                  alt={displayName}
                />
                <div>
                  <h2 className="text-card-foreground text-center text-xl font-semibold break-words">
                    {displayName}
                  </h2>
                  {age != null ? <p className="text-muted-foreground text-sm">Edad: {age}</p> : null}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex flex-col gap-2">
                  <span className="text-card-foreground text-sm font-medium">Objetivos </span>
                  {triageInfo?.motivo_consulta?.objetivos_iniciales_usuario?.map(
                    (objective: string, index: number) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-primary/10 text-primary max-w-[220px] text-wrap wrap-break-word"
                      >
                        {objective}
                      </Badge>
                    ),
                  ) || 'Sin especificar'}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-card-foreground text-sm font-medium">Nivel de riesgo</span>
                  <Badge className={getRiskColor(risk)}>
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    {formatRiskLabel(risk)}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-card-foreground text-sm font-medium">Última sesión</span>
                  <div className="text-muted-foreground flex items-center gap-1 text-sm">
                    <CalendarDays className="h-3 w-3" />
                    {lastSession}
                  </div>
                </div>
              </div>

              <div className="border-border border-t pt-4">
                <h3 className="text-card-foreground mb-3 text-sm font-medium">Información del paciente</h3>
                <div className="text-muted-foreground space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Heart className="text-primary h-4 w-4" />
                    <span>
                      {formatUnderscoreToSpace(triageInfo?.plan_inicial?.modalidad) || 'Tratamiento'}{' '}
                      • {formatUnderscoreToSpace(triageInfo?.plan_inicial?.frecuencia)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-border border-t pt-4">
                <h3 className="text-card-foreground mb-2 text-sm font-medium">Notas recientes</h3>
                <p className="text-muted-foreground max-h-24 overflow-y-auto pr-1 text-xs leading-relaxed">
                  {triageInfo?.motivo_consulta?.descripcion_breve || 'No hay notas disponibles.'}
                </p>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
