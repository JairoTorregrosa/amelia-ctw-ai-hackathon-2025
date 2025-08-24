import { supabase } from '@/libraries/supabase';
import type { Database } from '@/types/supabase';
import { ensure } from './base';

/**
 * RPC (Remote Procedure Call) model class for database functions
 */
export class RpcModel {
  /**
   * Complete an insight with result content
   */
  async completeInsight(args: Database['public']['Functions']['complete_insight']['Args']) {
    const { data, error } = await supabase.rpc('complete_insight', args);
    return ensure<Database['public']['Functions']['complete_insight']['Returns']>(data, error);
  }

  /**
   * Create active insights for a conversation
   */
  async createActiveInsights(
    args: Database['public']['Functions']['create_active_insights']['Args'],
  ) {
    const { data, error } = await supabase.rpc('create_active_insights', args);
    return ensure<Database['public']['Functions']['create_active_insights']['Returns']>(
      data,
      error,
    );
  }

  /**
   * Get conversation timeout minutes
   */
  async getConversationTimeoutMinutes(
    args: Database['public']['Functions']['get_conversation_timeout_minutes']['Args'],
  ) {
    const { data, error } = await supabase.rpc('get_conversation_timeout_minutes', args);
    return ensure<Database['public']['Functions']['get_conversation_timeout_minutes']['Returns']>(
      data,
      error,
    );
  }

  /**
   * Get pending insights
   */
  async getPendingInsights(args: Database['public']['Functions']['get_pending_insights']['Args']) {
    const { data, error } = await supabase.rpc('get_pending_insights', args);
    return ensure<Database['public']['Functions']['get_pending_insights']['Returns']>(data, error);
  }

  /**
   * Set conversation timeout minutes
   */
  async setConversationTimeoutMinutes(
    args: Database['public']['Functions']['set_conversation_timeout_minutes']['Args'],
  ) {
    const { data, error } = await supabase.rpc('set_conversation_timeout_minutes', args);
    return ensure<Database['public']['Functions']['set_conversation_timeout_minutes']['Returns']>(
      data,
      error,
    );
  }

  /**
   * Toggle insight type active status
   */
  async toggleInsightType(args: Database['public']['Functions']['toggle_insight_type']['Args']) {
    const { data, error } = await supabase.rpc('toggle_insight_type', args);
    return ensure<Database['public']['Functions']['toggle_insight_type']['Returns']>(data, error);
  }

  /**
   * Close inactive conversations
   */
  async closeInactiveConversations(
    args: Database['public']['Functions']['close_inactive_conversations']['Args'],
  ) {
    const { data, error } = await supabase.rpc('close_inactive_conversations', args);
    return ensure<Database['public']['Functions']['close_inactive_conversations']['Returns']>(
      data,
      error,
    );
  }

  /**
   * Get completed insights for a conversation
   */
  async getCompletedInsightsForConversation(
    args: Database['public']['Functions']['get_completed_insights_for_conversation']['Args'],
  ) {
    const { data, error } = await supabase.rpc('get_completed_insights_for_conversation', args);
    return ensure<
      Database['public']['Functions']['get_completed_insights_for_conversation']['Returns']
    >(data, error);
  }

  /**
   * Complete multiple insights in batch
   */
  async completeInsightBatch(
    args: Database['public']['Functions']['complete_insight_batch']['Args'],
  ) {
    const { data, error } = await supabase.rpc('complete_insight_batch', args);
    return ensure<Database['public']['Functions']['complete_insight_batch']['Returns']>(
      data,
      error,
    );
  }

  /**
   * Get insights statistics
   */
  async getInsightsStats(args: Database['public']['Functions']['get_insights_stats']['Args']) {
    const { data, error } = await supabase.rpc('get_insights_stats', args);
    return ensure<Database['public']['Functions']['get_insights_stats']['Returns']>(data, error);
  }

  /**
   * Get oldest pending insights
   */
  async getOldestPendingInsights(
    args: Database['public']['Functions']['get_oldest_pending_insights']['Args'],
  ) {
    const { data, error } = await supabase.rpc('get_oldest_pending_insights', args);
    return ensure<Database['public']['Functions']['get_oldest_pending_insights']['Returns']>(
      data,
      error,
    );
  }

  /**
   * Get patient pending insights
   */
  async getPatientPendingInsights(
    args: Database['public']['Functions']['get_patient_pending_insights']['Args'],
  ) {
    const { data, error } = await supabase.rpc('get_patient_pending_insights', args);
    return ensure<Database['public']['Functions']['get_patient_pending_insights']['Returns']>(
      data,
      error,
    );
  }

  /**
   * Get scheduled jobs status
   */
  async getScheduledJobsStatus(
    args: Database['public']['Functions']['get_scheduled_jobs_status']['Args'],
  ) {
    const { data, error } = await supabase.rpc('get_scheduled_jobs_status', args);
    return ensure<Database['public']['Functions']['get_scheduled_jobs_status']['Returns']>(
      data,
      error,
    );
  }

  /**
   * Run conversation cleanup now
   */
  async runConversationCleanupNow(
    args: Database['public']['Functions']['run_conversation_cleanup_now']['Args'],
  ) {
    const { data, error } = await supabase.rpc('run_conversation_cleanup_now', args);
    return ensure<Database['public']['Functions']['run_conversation_cleanup_now']['Returns']>(
      data,
      error,
    );
  }

  /**
   * Cleanup orphaned insights
   */
  async cleanupOrphanedInsights(
    args: Database['public']['Functions']['cleanup_orphaned_insights']['Args'],
  ) {
    const { data, error } = await supabase.rpc('cleanup_orphaned_insights', args);
    return ensure<Database['public']['Functions']['cleanup_orphaned_insights']['Returns']>(
      data,
      error,
    );
  }

  /**
   * Pause conversation cleanup job
   */
  async pauseConversationCleanupJob(
    args: Database['public']['Functions']['pause_conversation_cleanup_job']['Args'],
  ) {
    const { data, error } = await supabase.rpc('pause_conversation_cleanup_job', args);
    return ensure<Database['public']['Functions']['pause_conversation_cleanup_job']['Returns']>(
      data,
      error,
    );
  }

  /**
   * Resume conversation cleanup job
   */
  async resumeConversationCleanupJob(
    args: Database['public']['Functions']['resume_conversation_cleanup_job']['Args'],
  ) {
    const { data, error } = await supabase.rpc('resume_conversation_cleanup_job', args);
    return ensure<Database['public']['Functions']['resume_conversation_cleanup_job']['Returns']>(
      data,
      error,
    );
  }
}

// Create and export singleton instance
export const Rpc = new RpcModel();
