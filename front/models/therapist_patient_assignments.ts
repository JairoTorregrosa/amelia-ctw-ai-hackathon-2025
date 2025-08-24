import { BaseModel, type Row, type Insert, type Update } from './base';

export type TherapistPatientAssignment = Row<'therapist_patient_assignments'>;
export type TherapistPatientAssignmentInsert = Insert<'therapist_patient_assignments'>;
export type TherapistPatientAssignmentUpdate = Update<'therapist_patient_assignments'>;

/**
 * TherapistPatientAssignments model class with assignment management methods
 */
export class TherapistPatientAssignmentsModel extends BaseModel<'therapist_patient_assignments'> {
  constructor() {
    super('therapist_patient_assignments');
  }

  /**
   * Get assignments by therapist ID
   */
  async getByTherapistId(therapistId: string): Promise<TherapistPatientAssignment[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*, profiles!therapist_patient_assignments_patient_id_fkey(*)')
      .eq('therapist_id', therapistId)
      .order('assigned_at', { ascending: false });

    if (error) throw error;
    return (data || []) as TherapistPatientAssignment[];
  }

  /**
   * Get assignments by patient ID
   */
  async getByPatientId(patientId: string): Promise<TherapistPatientAssignment[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*, profiles!therapist_patient_assignments_therapist_id_fkey(*)')
      .eq('patient_id', patientId)
      .order('assigned_at', { ascending: false });

    if (error) throw error;
    return (data || []) as TherapistPatientAssignment[];
  }

  /**
   * Get active assignment for a patient
   */
  async getActiveByPatientId(patientId: string): Promise<TherapistPatientAssignment | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*, profiles!therapist_patient_assignments_therapist_id_fkey(*)')
      .eq('patient_id', patientId)
      .eq('status', 'active')
      .maybeSingle();

    if (error && 'code' in error && error.code !== 'PGRST116') throw error;
    return (data as TherapistPatientAssignment) ?? null;
  }

  /**
   * Create a new assignment
   */
  async createAssignment(therapistId: string, patientId: string): Promise<TherapistPatientAssignment> {
    return this.create({
      therapist_id: therapistId,
      patient_id: patientId,
      status: 'active'
    } as TherapistPatientAssignmentInsert);
  }

  /**
   * Update assignment status
   */
  async updateStatus(id: number, status: string): Promise<TherapistPatientAssignment> {
    return this.update(id, { status } as TherapistPatientAssignmentUpdate);
  }
}

// Create and export singleton instance
export const TherapistPatientAssignments = new TherapistPatientAssignmentsModel();