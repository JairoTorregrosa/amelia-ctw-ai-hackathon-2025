import { makeRepository } from './base'
import type { Row, Insert, Update } from './base'

export const ConversationInsights = makeRepository('conversation_insights')

export type ConversationInsight = Row<'conversation_insights'>
export type ConversationInsightInsert = Insert<'conversation_insights'>
export type ConversationInsightUpdate = Update<'conversation_insights'>


