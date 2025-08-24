import { BaseModel, type Row, type Insert, type Update } from './base';
import type {
  PrimaryEmotionContent,
  MoodClassificationRow,
  CrisisClassificationRow,
  InsightQueryParams,
} from '@/types/insights';

export type ConversationInsight = Row<'conversation_insights'>;
export type ConversationInsightInsert = Insert<'conversation_insights'>;
export type ConversationInsightUpdate = Update<'conversation_insights'>;

/**
 * ConversationInsights model class with CRUD operations and custom insight methods
 */
export class ConversationInsightsModel extends BaseModel<'conversation_insights'> {
  constructor() {
    super('conversation_insights');
  }

  /**
   * Fetch primary emotion insights for a patient within a date range
   */
  async fetchPrimaryEmotionsByPatient(params: InsightQueryParams): Promise<PrimaryEmotionContent[]> {
    const { patientId, fromIso, toIso } = params;
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select([
        'content',
        'conversations!inner(patient_id,started_at,last_message_at)',
        'insight_types!inner(type_key)',
      ].join(','))
      .eq('completed', true)
      .eq('conversations.patient_id', patientId)
      .gte('conversations.started_at', fromIso)
      .lte('conversations.last_message_at', toIso)
      .eq('insight_types.type_key', 'primary_emotions');

    if (error) throw error;
    return (data || []).map((row: any) => row.content as PrimaryEmotionContent);
  }

  /**
   * Fetch mood classification insights for a patient within a date range
   */
  async fetchMoodClassificationByPatientRange(params: InsightQueryParams): Promise<MoodClassificationRow[]> {
    const { patientId, fromIso, toIso } = params;
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select([
        'created_at,content',
        'conversations!inner(started_at,last_message_at,patient_id)',
        'insight_types!inner(type_key)',
      ].join(','))
      .eq('completed', true)
      .eq('conversations.patient_id', patientId)
      .gte('conversations.started_at', fromIso)
      .lte('conversations.last_message_at', toIso)
      .eq('insight_types.type_key', 'mood_classification');

    if (error) throw error;
    return (data || []) as unknown as MoodClassificationRow[];
  }

  /**
   * Fetch crisis classification insights for a patient within a date range
   */
  async fetchCrisisClassificationByPatientRange(params: InsightQueryParams): Promise<CrisisClassificationRow[]> {
    const { patientId, fromIso, toIso } = params;
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select([
        'created_at,content',
        'conversations!inner(started_at,last_message_at,patient_id)',
        'insight_types!inner(type_key)',
      ].join(','))
      .eq('completed', true)
      .eq('conversations.patient_id', patientId)
      .gte('conversations.started_at', fromIso)
      .lte('conversations.last_message_at', toIso)
      .eq('insight_types.type_key', 'crisis_classification');

    if (error) throw error;
    return (data || []) as unknown as CrisisClassificationRow[];
  }

  /**
   * Get insights by conversation ID
   */
  async getByConversationId(conversationId: number): Promise<ConversationInsight[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*, insight_types(*)')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as ConversationInsight[];
  }

  /**
   * Get completed insights by conversation ID
   */
  async getCompletedByConversationId(conversationId: number): Promise<ConversationInsight[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*, insight_types(*)')
      .eq('conversation_id', conversationId)
      .eq('completed', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as ConversationInsight[];
  }

  /**
   * Get pending insights (not completed)
   */
  async getPendingInsights(): Promise<ConversationInsight[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*, insight_types(*), conversations(*)')
      .eq('completed', false)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data || []) as ConversationInsight[];
  }

  /**
   * Mark an insight as completed with content
   */
  async markCompleted(id: number, content: any): Promise<ConversationInsight> {
    return this.update(id, {
      completed: true,
      content,
      updated_at: new Date().toISOString()
    } as ConversationInsightUpdate);
  }

  /**
   * Get insights by type and patient
   */
  async getByTypeAndPatient(insightType: string, patientId: string, limit?: number): Promise<ConversationInsight[]> {
    let query = this.supabase
      .from(this.tableName)
      .select([
        '*',
        'insight_types!inner(type_key)',
        'conversations!inner(patient_id)'
      ].join(','))
      .eq('insight_types.type_key', insightType)
      .eq('conversations.patient_id', patientId)
      .eq('completed', true)
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as unknown as ConversationInsight[];
  }
}

// Create and export singleton instance
export const ConversationInsights = new ConversationInsightsModel();

