import { makeRepository } from './base'
import type { Row, Insert, Update } from './base'

export const Messages = makeRepository('messages')

export type Message = Row<'messages'>
export type MessageInsert = Insert<'messages'>
export type MessageUpdate = Update<'messages'>


