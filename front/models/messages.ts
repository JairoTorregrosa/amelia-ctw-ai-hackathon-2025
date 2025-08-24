import { BaseModel, type Row, type Insert, type Update } from './base';
import { MessageSender } from '@/types/constants';

export type Message = Row<'messages'>;
export type MessageInsert = Insert<'messages'>;
export type MessageUpdate = Update<'messages'>;

/**
 * Messages model class with CRUD operations and custom messaging methods
 */
export class MessagesModel extends BaseModel<'messages'> {
  constructor() {
    super('messages');
  }

  /**
   * Fetch message timestamps for a patient within a date range
   */
  async fetchTimestampsByPatientRange(params: {
    patientId: string;
    fromIso: string;
    toIso: string;
    sender?: MessageSender;
  }): Promise<string[]> {
    const { patientId, fromIso, toIso, sender } = params;
    let query = this.supabase
      .from(this.tableName)
      .select('created_at,sender', { count: 'exact' })
      .eq('patient_id', patientId)
      .gte('created_at', fromIso)
      .lte('created_at', toIso);

    if (sender) {
      query = query.eq('sender', sender);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map((r: any) => r.created_at as string);
  }

  /**
   * Get messages by conversation ID
   */
  async getByConversationId(conversationId: number): Promise<Message[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data || []) as Message[];
  }

  /**
   * Get messages by patient ID
   */
  async getByPatientId(patientId: string, limit?: number): Promise<Message[]> {
    let query = this.supabase
      .from(this.tableName)
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as Message[];
  }

  /**
   * Get recent messages for a patient
   */
  async getRecentByPatient(patientId: string, hours: number = 24): Promise<Message[]> {
    const fromTime = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
    
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('patient_id', patientId)
      .gte('created_at', fromTime)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as Message[];
  }

  /**
   * Count messages by sender for a patient
   */
  async countBySenderAndPatient(patientId: string, sender: MessageSender): Promise<number> {
    const { count, error } = await this.supabase
      .from(this.tableName)
      .select('*', { count: 'exact', head: true })
      .eq('patient_id', patientId)
      .eq('sender', sender);

    if (error) throw error;
    return count || 0;
  }

  /**
   * Get message statistics for a patient
   */
  async getPatientStats(patientId: string): Promise<{
    total: number;
    fromPatient: number;
    fromAgent: number;
    lastMessageAt?: string;
  }> {
    const [total, fromPatient, fromAgent, lastMessage] = await Promise.all([
      this.count({ patient_id: patientId } as Partial<Message>),
      this.countBySenderAndPatient(patientId, MessageSender.Patient),
      this.countBySenderAndPatient(patientId, MessageSender.Agent),
      this.getByPatientId(patientId, 1)
    ]);

    return {
      total,
      fromPatient,
      fromAgent,
      lastMessageAt: lastMessage[0]?.created_at
    };
  }

  /**
   * Create a new message and optionally associate with conversation
   */
  async createMessage(params: {
    content: string;
    patientId: string;
    sender: MessageSender;
    conversationId?: number;
  }): Promise<Message> {
    const { content, patientId, sender, conversationId } = params;
    
    return this.create({
      content,
      patient_id: patientId,
      sender,
      conversation_id: conversationId || null
    } as MessageInsert);
  }
}

// Create and export singleton instance
export const Messages = new MessagesModel();

