import { makeRepository } from './base';
import type { Row, Insert, Update } from './base';
import { supabase } from '@/libraries/supabase';
import type { 
  PrimaryEmotionContent, 
  MoodClassificationRow, 
  CrisisClassificationRow,
  InsightQueryParams 
} from '@/types/insights';

export const ConversationInsights = makeRepository('conversation_insights');

export type ConversationInsight = Row<'conversation_insights'>;
export type ConversationInsightInsert = Insert<'conversation_insights'>;
export type ConversationInsightUpdate = Update<'conversation_insights'>;

// Types moved to @/types/insights

export async function fetchPrimaryEmotionInsightsByPatient(params: InsightQueryParams): Promise<PrimaryEmotionContent[]> {
  const { patientId, fromIso, toIso } = params;
  const { data, error } = await supabase
    .from('conversation_insights')
    .select(
      [
        'content',
        'conversations!inner(patient_id,started_at,last_message_at)',
        'insight_types!inner(type_key)',
      ].join(','),
    )
    .eq('completed', true)
    .eq('conversations.patient_id', patientId)
    .gte('conversations.started_at', fromIso)
    .lte('conversations.last_message_at', toIso)
    .eq('insight_types.type_key', 'primary_emotions');

  if (error) throw error;
  // Return only the content json array
  return (data || []).map((row: { content: PrimaryEmotionContent }) => row.content);
}

// Mood classification types moved to @/types/insights

export async function fetchMoodClassificationByPatientRange(params: InsightQueryParams): Promise<MoodClassificationRow[]> {
  const { patientId, fromIso, toIso } = params;
  const { data, error } = await supabase
    .from('conversation_insights')
    .select(
      [
        'created_at,content',
        'conversations!inner(started_at,last_message_at,patient_id)',
        'insight_types!inner(type_key)',
      ].join(','),
    )
    .eq('completed', true)
    .eq('conversations.patient_id', patientId)
    .gte('conversations.started_at', fromIso)
    .lte('conversations.last_message_at', toIso)
    .eq('insight_types.type_key', 'mood_classification');

  if (error) throw error;
  return (data || []) as unknown as MoodClassificationRow[];
}

// Crisis classification types moved to @/types/insights

export async function fetchCrisisClassificationByPatientRange(params: InsightQueryParams): Promise<CrisisClassificationRow[]> {
  const { patientId, fromIso, toIso } = params;
  const { data, error } = await supabase
    .from('conversation_insights')
    .select(
      [
        'created_at,content',
        'conversations!inner(started_at,last_message_at,patient_id)',
        'insight_types!inner(type_key)',
      ].join(','),
    )
    .eq('completed', true)
    .eq('conversations.patient_id', patientId)
    .gte('conversations.started_at', fromIso)
    .lte('conversations.last_message_at', toIso)
    .eq('insight_types.type_key', 'crisis_classification');

  if (error) throw error;
  return (data || []) as unknown as CrisisClassificationRow[];
}
