import { makeRepository } from './base'
import type { Row, Insert, Update } from './base'

export const Conversations = makeRepository('conversations')

export type Conversation = Row<'conversations'>
export type ConversationInsert = Insert<'conversations'>
export type ConversationUpdate = Update<'conversations'>


