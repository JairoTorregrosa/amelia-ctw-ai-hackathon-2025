import { makeRepository } from './base';
import type { Row, Insert, Update } from './base';
import { supabase } from '@/libraries/supabase';

export const Messages = makeRepository('messages');

export type Message = Row<'messages'>;
export type MessageInsert = Insert<'messages'>;
export type MessageUpdate = Update<'messages'>;

export async function fetchMessageTimestampsByPatientRange(params: {
  patientId: string;
  fromIso: string;
  toIso: string;
  sender?: 'patient' | 'agent';
}): Promise<string[]> {
  const { patientId, fromIso, toIso, sender } = params;
  let query = supabase
    .from('messages')
    .select('created_at,sender', { count: 'exact' })
    .eq('patient_id', patientId)
    .gte('created_at', fromIso)
    .lte('created_at', toIso);

  if (sender) query = query.eq('sender', sender);

  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map((r: any) => r.created_at as string);
}
