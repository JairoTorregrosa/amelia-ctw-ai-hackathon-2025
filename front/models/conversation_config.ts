import { makeRepository } from './base';
import type { Row, Insert, Update } from './base';

export const ConversationConfig = makeRepository('conversation_config');

export type ConversationConfigRow = Row<'conversation_config'>;
export type ConversationConfigInsert = Insert<'conversation_config'>;
export type ConversationConfigUpdate = Update<'conversation_config'>;
