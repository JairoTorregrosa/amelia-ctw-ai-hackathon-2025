import { supabase } from '@/libraries/supabase';
import type { Database, Tables, TablesInsert, TablesUpdate } from '@/types/supabase';

// Generic types for public schema tables
type PublicTables = Database['public']['Tables'];
export type TableName = keyof PublicTables & string;

export type Row<N extends TableName> = Tables<N>;
export type Insert<N extends TableName> = TablesInsert<N>;
export type Update<N extends TableName> = TablesUpdate<N>;
export type IdOf<N extends TableName> = Row<N> extends { id: infer I } ? I : never;

export type ListOptions<N extends TableName> = {
  select?: string;
  filters?: Partial<Row<N>>;
  order?: { column: keyof Row<N> & string; ascending?: boolean; nullsFirst?: boolean };
  limit?: number;
  range?: { from: number; to: number };
};

// Utility functions
export function ensure<T>(data: T | null, error: Error | null): T {
  if (error) throw error;
  return data as T;
}

function applyListOptions<N extends TableName>(
  qb: ReturnType<typeof supabase.from>,
  options?: ListOptions<N>,
) {
  let query = qb.select(options?.select || '*');

  if (options?.filters) {
    query = query.match(options.filters as Record<string, unknown>);
  }

  if (options?.order) {
    query = query.order(options.order.column, {
      ascending: options.order.ascending ?? true,
      nullsFirst: options.order.nullsFirst ?? false,
    });
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.range) {
    query = query.range(options.range.from, options.range.to);
  }

  return query;
}

/**
 * Base Model class that provides CRUD operations for database tables.
 * All model classes should extend this class.
 */
export abstract class BaseModel<N extends TableName> {
  protected readonly tableName: N;

  constructor(tableName: N) {
    this.tableName = tableName;
  }

  /**
   * Get the table name for this model
   */
  getTableName(): N {
    return this.tableName;
  }

  /**
   * List records with optional filtering, sorting, and pagination
   */
  async list(options?: ListOptions<N>): Promise<Row<N>[]> {
    const { data, error } = await applyListOptions<N>(supabase.from(this.tableName), options);
    return ensure<Row<N>[]>(data as Row<N>[] | null, error);
  }

  /**
   * Get a single record by ID
   */
  async getById(id: IdOf<N>, select?: string): Promise<Row<N> | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select(select || '*')
      .eq('id', id as any)
      .maybeSingle();
    if (error && 'code' in error && error.code !== 'PGRST116') throw error;
    return (data as Row<N>) ?? null;
  }

  /**
   * Create a new record
   */
  async create(payload: Insert<N>): Promise<Row<N>> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(payload as any)
      .select()
      .single();
    return ensure<Row<N>>(data as Row<N> | null, error);
  }

  /**
   * Create or update a record (upsert)
   */
  async upsert(payload: Insert<N>): Promise<Row<N>> {
    const { data, error } = await supabase
      .from(this.tableName)
      .upsert(payload as any)
      .select()
      .single();
    return ensure<Row<N>>(data as Row<N> | null, error);
  }

  /**
   * Update a record by ID
   */
  async update(id: IdOf<N>, payload: Update<N>): Promise<Row<N>> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(payload as any)
      .eq('id', id as any)
      .select()
      .single();
    return ensure<Row<N>>(data as Row<N> | null, error);
  }

  /**
   * Delete a record by ID
   */
  async delete(id: IdOf<N>): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id as any);
    if (error) throw error;
  }

  /**
   * Count records with optional filtering
   */
  async count(filters?: Partial<Row<N>>): Promise<number> {
    let query = supabase.from(this.tableName).select('*', { count: 'exact', head: true });

    if (filters) {
      query = query.match(filters as Record<string, unknown>);
    }

    const { count, error } = await query;
    if (error) throw error;
    return count || 0;
  }

  /**
   * Check if a record exists by ID
   */
  async exists(id: IdOf<N>): Promise<boolean> {
    const record = await this.getById(id, 'id');
    return record !== null;
  }

  /**
   * Get the Supabase client for custom queries
   */
  protected get supabase() {
    return supabase;
  }

  /**
   * Create a query builder for the table
   */
  protected query() {
    return supabase.from(this.tableName);
  }
}
