import { makeRepository } from './base';
import type { Row, Insert, Update } from './base';

export const PatientContext = makeRepository('patient_context');

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
