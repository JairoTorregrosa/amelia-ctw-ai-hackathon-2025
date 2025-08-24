import { makeRepository } from './base'
import type { Row, Insert, Update } from './base'

export const PatientContext = makeRepository('patient_context')

export type PatientContextRow = Row<'patient_context'>
export type PatientContextInsert = Insert<'patient_context'>
export type PatientContextUpdate = Update<'patient_context'>


