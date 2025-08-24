import { makeRepository } from './base'
import type { Row, Insert, Update } from './base'
import { supabase } from '@/lib/supabase'

export const ConversationInsights = makeRepository('conversation_insights')

export type ConversationInsight = Row<'conversation_insights'>
export type ConversationInsightInsert = Insert<'conversation_insights'>
export type ConversationInsightUpdate = Update<'conversation_insights'>

export type PrimaryEmotionItem = {
  context?: string
  emotion?: string
  trigger?: string
  intensity?: number
}

export type PrimaryEmotionContent = {
  primary_emotions?: PrimaryEmotionItem[]
}

export async function fetchPrimaryEmotionInsightsByPatient(params: {
  patientId: string
  fromIso: string
  toIso: string
}): Promise<PrimaryEmotionContent[]> {
  const { patientId, fromIso, toIso } = params
  const { data, error } = await supabase
    .from('conversation_insights')
    .select(
      [
        'content',
        'conversations!inner(patient_id,started_at,last_message_at)',
        'insight_types!inner(type_key)'
      ].join(',')
    )
    .eq('conversations.patient_id', patientId)
    .gte('conversations.started_at', fromIso)
    .lte('conversations.last_message_at', toIso)
    .eq('insight_types.type_key', 'primary_emotions')

  if (error) throw error
  // Return only the content json array
  return (data || []).map((row: any) => row.content as PrimaryEmotionContent)
}


