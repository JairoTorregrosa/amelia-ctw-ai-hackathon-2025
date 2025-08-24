import { BaseModel, type Row, type Insert, type Update } from './base';
import type { InsightQueryParams } from '@/types/insights';

export type Conversation = Row<'conversations'>;
export type ConversationInsert = Insert<'conversations'>;
export type ConversationUpdate = Update<'conversations'>;

/**
 * Conversations model class with CRUD operations and custom methods
 */
export class ConversationsModel extends BaseModel<'conversations'> {
  constructor() {
    super('conversations');
  }

  /**
   * Fetch conversations for a specific patient within a date range
   */
  async fetchByPatientRange(params: InsightQueryParams): Promise<Conversation[]> {
    const { patientId, fromIso, toIso } = params;
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('patient_id', patientId)
      .gte('started_at', fromIso)
      .lte('last_message_at', toIso);

    if (error) throw error;
    return (data || []) as Conversation[];
  }

  /**
   * Get active conversations for a patient
   */
  async getActiveByPatient(patientId: string): Promise<Conversation[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('patient_id', patientId)
      .eq('status', 'active')
      .order('started_at', { ascending: false });

    if (error) throw error;
    return (data || []) as Conversation[];
  }

  /**
   * Get the most recent conversation for a patient
   */
  async getLatestByPatient(patientId: string): Promise<Conversation | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('patient_id', patientId)
      .order('started_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error && 'code' in error && error.code !== 'PGRST116') throw error;
    return (data as Conversation) ?? null;
  }

  /**
   * Update conversation status
   */
  async updateStatus(id: number, status: string): Promise<Conversation> {
    return this.update(id, { status } as ConversationUpdate);
  }

  /**
   * Close a conversation
   */
  async close(id: number, summary?: string): Promise<Conversation> {
    const updateData: ConversationUpdate = {
      status: 'closed',
      updated_at: new Date().toISOString(),
    };

    if (summary) {
      updateData.summary = summary;
    }

    return this.update(id, updateData);
  }
}

// Create and export singleton instance
export const Conversations = new ConversationsModel();
