import { BaseModel, type Row, type Insert, type Update } from './base';

export type PatientContextRow = Row<'patient_context'>;
export type PatientContextInsert = Insert<'patient_context'>;
export type PatientContextUpdate = Update<'patient_context'>;

// Narrow typing for triage_info JSON blob we care about
export type TriageInfo = {
  riesgo?: {
    acciones_inmediatas?: string[];
    ideacion_autolesiva?: string;
    nivel_riesgo_global?: string;
    riesgo_hacia_terceros?: string;
  };
  usuario?: {
    edad?: number;
    genero?: string;
    ubicacion?: string;
    pronombres?: string;
    estado_civil?: string;
    nombre_preferido?: string;
  };
  metadata?: {
    clinico?: { nombre?: string; credenciales?: string };
    version?: string;
    fecha_registro_iso8601?: string;
  };
  fortalezas?: string[];
  plan_inicial?: {
    tareas?: string[];
    enfoque?: string[];
    modalidad?: string;
    frecuencia?: string;
  };
  motivo_consulta?: {
    descripcion_breve?: string;
    objetivos_iniciales_usuario?: string[];
  };
  objetivos_4_semanas?: string[];
  presentacion_actual?: {
    inicio?: string;
    habitos_clave?: {
      apetito?: string;
      sustancias?: { tabaco?: string; alcohol?: string; cafeina?: string };
      sueno_horas?: number;
      actividad_fisica?: string;
    };
    impacto_funcional?: { social?: string; laboral?: string; autocuidado?: string };
    sintomas_principales?: string[];
  };
  proxima_cita_iso8601?: string;
  consentimiento_informado?: boolean;
};

/**
 * PatientContext model class with CRUD operations and patient context management
 */
export class PatientContextModel extends BaseModel<'patient_context'> {
  constructor() {
    super('patient_context');
  }

  /**
   * Get patient context by patient ID
   */
  async getByPatientId(patientId: string): Promise<PatientContextRow | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('patient_id', patientId)
      .maybeSingle();

    if (error && 'code' in error && error.code !== 'PGRST116') throw error;
    return (data as PatientContextRow) ?? null;
  }

  /**
   * Update patient context by patient ID
   */
  async updateByPatientId(patientId: string, updates: Partial<PatientContextUpdate>): Promise<PatientContextRow> {
    const existing = await this.getByPatientId(patientId);
    
    if (existing) {
      return this.update(existing.id, {
        ...updates,
        last_updated_at: new Date().toISOString()
      } as PatientContextUpdate);
    } else {
      // Create new context if it doesn't exist
      return this.create({
        patient_id: patientId,
        ...updates,
        last_updated_at: new Date().toISOString()
      } as PatientContextInsert);
    }
  }

  /**
   * Update triage information for a patient
   */
  async updateTriageInfo(patientId: string, triageInfo: TriageInfo): Promise<PatientContextRow> {
    return this.updateByPatientId(patientId, {
      triage_info: triageInfo as any
    });
  }

  /**
   * Update active tasks for a patient
   */
  async updateActiveTasks(patientId: string, activeTasks: any[]): Promise<PatientContextRow> {
    const existing = await this.getByPatientId(patientId);
    const summaries = (existing?.conversation_summaries as any) ?? {};
    const updatedSummaries = { ...summaries, active_tasks: activeTasks };
    return this.updateByPatientId(patientId, {
      conversation_summaries: updatedSummaries as any,
    });
  }

  /**
   * Update therapist notes summary for a patient
   */
  async updateTherapistNotes(patientId: string, notes: string): Promise<PatientContextRow> {
    const existing = await this.getByPatientId(patientId);
    const summaries = (existing?.conversation_summaries as any) ?? {};
    const updatedSummaries = { ...summaries, therapist_notes_summary: notes };
    return this.updateByPatientId(patientId, {
      conversation_summaries: updatedSummaries as any,
    });
  }

  /**
   * Get triage info for a patient
   */
  async getTriageInfo(patientId: string): Promise<TriageInfo | null> {
    const context = await this.getByPatientId(patientId);
    return context?.triage_info as TriageInfo | null;
  }

  /**
   * Get active tasks for a patient
   */
  async getActiveTasks(patientId: string): Promise<any[] | null> {
    const context = await this.getByPatientId(patientId);
    const summaries = (context?.conversation_summaries as any) ?? null;
    return summaries?.active_tasks ?? null;
  }
}

// Create and export singleton instance
export const PatientContext = new PatientContextModel();