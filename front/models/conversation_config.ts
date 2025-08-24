import { BaseModel, type Row, type Insert, type Update } from './base';

export type ConversationConfig = Row<'conversation_config'>;
export type ConversationConfigInsert = Insert<'conversation_config'>;
export type ConversationConfigUpdate = Update<'conversation_config'>;

/**
 * ConversationConfig model class with configuration management methods
 */
export class ConversationConfigModel extends BaseModel<'conversation_config'> {
  constructor() {
    super('conversation_config');
  }

  /**
   * Get current conversation configuration
   */
  async getCurrent(): Promise<ConversationConfig | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error && 'code' in error && error.code !== 'PGRST116') throw error;
    return (data as ConversationConfig) ?? null;
  }

  /**
   * Update timeout minutes
   */
  async updateTimeout(timeoutMinutes: number): Promise<ConversationConfig> {
    const current = await this.getCurrent();
    
    if (current) {
      return this.update(current.id, {
        timeout_minutes: timeoutMinutes,
        updated_at: new Date().toISOString()
      } as ConversationConfigUpdate);
    } else {
      return this.create({
        timeout_minutes: timeoutMinutes
      } as ConversationConfigInsert);
    }
  }

  /**
   * Get current timeout minutes
   */
  async getCurrentTimeout(): Promise<number> {
    const config = await this.getCurrent();
    return config?.timeout_minutes ?? 30; // Default 30 minutes
  }
}

// Create and export singleton instance
export const ConversationConfig = new ConversationConfigModel();