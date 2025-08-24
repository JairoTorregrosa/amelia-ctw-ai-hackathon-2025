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

export function ensure<T>(data: T | null, error: any): T {
  if (error) throw error;
  return data as T;
}
export function applyListOptions<N extends TableName>(qb: any, options?: ListOptions<N>) {
  let query = qb.select(options?.select || '*');

  if (options?.filters) {
    query = query.match(options.filters as Record<string, any>);
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

export function makeRepository<N extends TableName>(table: N) {
  return {
    table,

    async list(options?: ListOptions<N>): Promise<Row<N>[]> {
      const { data, error } = await applyListOptions<N>(supabase.from(table), options);
      return ensure<Row<N>[]>(data as Row<N>[] | null, error);
    },

    async getById(id: IdOf<N>, select?: string): Promise<Row<N> | null> {
      const { data, error } = await supabase
        .from(table)
        .select(select || '*')
        .eq('id', id as any)
        .maybeSingle();
      if (error && (error as any).code !== 'PGRST116') throw error;
      return (data as Row<N>) ?? null;
    },

    async create(payload: Insert<N>): Promise<Row<N>> {
      const { data, error } = await supabase
        .from(table)
        .insert(payload as any)
        .select()
        .single();
      return ensure<Row<N>>(data as Row<N> | null, error);
    },

    async upsert(payload: Insert<N>): Promise<Row<N>> {
      const { data, error } = await supabase
        .from(table)
        .upsert(payload as any)
        .select()
        .single();
      return ensure<Row<N>>(data as Row<N> | null, error);
    },

    async update(id: IdOf<N>, payload: Update<N>): Promise<Row<N>> {
      const { data, error } = await supabase
        .from(table)
        .update(payload as any)
        .eq('id', id as any)
        .select()
        .single();
      return ensure<Row<N>>(data as Row<N> | null, error);
    },

    async delete(id: IdOf<N>): Promise<void> {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id as any);
      if (error) throw error;
    },
  };
}
