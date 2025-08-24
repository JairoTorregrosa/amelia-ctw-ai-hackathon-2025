import { makeRepository } from './base';
import type { Row, Insert, Update } from './base';
import { supabase } from '@/libraries/supabase';
import type { InsightQueryParams } from '@/types/insights';

export const Conversations = makeRepository('conversations');

export type Conversation = Row<'conversations'>;
export type ConversationInsert = Insert<'conversations'>;
export type ConversationUpdate = Update<'conversations'>;

export async function fetchConversationsByPatientRange(params: InsightQueryParams): Promise<Conversation[]> {
  const { patientId, fromIso, toIso } = params;
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('patient_id', patientId)
    .gte('started_at', fromIso)
    .lte('last_message_at', toIso);

  if (error) throw error;
  return (data || []) as Conversation[];
}
