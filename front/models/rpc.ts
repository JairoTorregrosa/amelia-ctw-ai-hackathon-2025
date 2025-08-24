import { supabase } from '@/libraries/supabase'
import type { Database } from '@/types/supabase'
import { ensure } from './base'

export const Rpc = {
  complete_insight: async (
    args: Database['public']['Functions']['complete_insight']['Args']
  ) => {
    const { data, error } = await supabase.rpc('complete_insight', args)
    return ensure<Database['public']['Functions']['complete_insight']['Returns']>(data, error)
  },
  create_active_insights: async (
    args: Database['public']['Functions']['create_active_insights']['Args']
  ) => {
    const { data, error } = await supabase.rpc('create_active_insights', args)
    return ensure<Database['public']['Functions']['create_active_insights']['Returns']>(data, error)
  },
  get_conversation_insights: async (
    args: Database['public']['Functions']['get_conversation_insights']['Args']
  ) => {
    const { data, error } = await supabase.rpc('get_conversation_insights', args)
    return ensure<Database['public']['Functions']['get_conversation_insights']['Returns']>(data, error)
  },
  get_conversation_timeout_minutes: async (
    args: Database['public']['Functions']['get_conversation_timeout_minutes']['Args']
  ) => {
    const { data, error } = await supabase.rpc('get_conversation_timeout_minutes', args)
    return ensure<Database['public']['Functions']['get_conversation_timeout_minutes']['Returns']>(data, error)
  },
  get_pending_insights: async (
    args: Database['public']['Functions']['get_pending_insights']['Args']
  ) => {
    const { data, error } = await supabase.rpc('get_pending_insights', args)
    return ensure<Database['public']['Functions']['get_pending_insights']['Returns']>(data, error)
  },
  set_conversation_timeout_minutes: async (
    args: Database['public']['Functions']['set_conversation_timeout_minutes']['Args']
  ) => {
    const { data, error } = await supabase.rpc('set_conversation_timeout_minutes', args)
    return ensure<Database['public']['Functions']['set_conversation_timeout_minutes']['Returns']>(data, error)
  },
  toggle_insight_type: async (
    args: Database['public']['Functions']['toggle_insight_type']['Args']
  ) => {
    const { data, error } = await supabase.rpc('toggle_insight_type', args)
    return ensure<Database['public']['Functions']['toggle_insight_type']['Returns']>(data, error)
  },
}


