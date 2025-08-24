import { makeRepository } from './base';
import type { Row, Insert, Update } from './base';

export const TherapistPatientAssignments = makeRepository('therapist_patient_assignments');

export type TherapistPatientAssignment = Row<'therapist_patient_assignments'>;
export type TherapistPatientAssignmentInsert = Insert<'therapist_patient_assignments'>;
export type TherapistPatientAssignmentUpdate = Update<'therapist_patient_assignments'>;
