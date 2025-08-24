import { makeRepository } from './base';
import type { Row, Insert, Update } from './base';

export const InsightTypes = makeRepository('insight_types');

export type InsightType = Row<'insight_types'>;
export type InsightTypeInsert = Insert<'insight_types'>;
export type InsightTypeUpdate = Update<'insight_types'>;
