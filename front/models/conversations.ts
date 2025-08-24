import { makeRepository } from './base'
import type { Row, Insert, Update } from './base'
import { supabase } from '@/lib/supabase'

export const Conversations = makeRepository('conversations')

export type Conversation = Row<'conversations'>
export type ConversationInsert = Insert<'conversations'>
export type ConversationUpdate = Update<'conversations'>

export async function fetchConversationsByPatientRange(params: {
  patientId: string
  fromIso: string
  toIso: string
}): Promise<Conversation[]> {
  const { patientId, fromIso, toIso } = params
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('patient_id', patientId)
    .gte('started_at', fromIso)
    .lte('last_message_at', toIso)

  if (error) throw error
  return (data || []) as Conversation[]
}


