import { BaseModel, type Row, type Insert, type Update } from './base';

export type InsightType = Row<'insight_types'>;
export type InsightTypeInsert = Insert<'insight_types'>;
export type InsightTypeUpdate = Update<'insight_types'>;

/**
 * InsightTypes model class with insight type management methods
 */
export class InsightTypesModel extends BaseModel<'insight_types'> {
  constructor() {
    super('insight_types');
  }

  /**
   * Get active insight types
   */
  async getActive(): Promise<InsightType[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('is_active', true)
      .order('display_name', { ascending: true });

    if (error) throw error;
    return (data || []) as InsightType[];
  }

  /**
   * Get insight type by type key
   */
  async getByTypeKey(typeKey: string): Promise<InsightType | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('type_key', typeKey)
      .maybeSingle();

    if (error && 'code' in error && error.code !== 'PGRST116') throw error;
    return (data as InsightType) ?? null;
  }

  /**
   * Toggle insight type active status
   */
  async toggleActive(id: number): Promise<InsightType> {
    const current = await this.getById(id);
    if (!current) throw new Error('Insight type not found');

    return this.update(id, {
      is_active: !current.is_active
    } as InsightTypeUpdate);
  }
}

// Create and export singleton instance
export const InsightTypes = new InsightTypesModel();