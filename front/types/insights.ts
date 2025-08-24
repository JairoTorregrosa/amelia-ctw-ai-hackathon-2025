/**
 * Centralized insight-related types
 */

// Primary Emotion types
export interface PrimaryEmotionItem {
  context?: string;
  emotion?: string;
  trigger?: string;
  intensity?: number;
}

export interface PrimaryEmotionContent {
  primary_emotions?: PrimaryEmotionItem[];
}

// Mood Classification types
export interface MoodClassificationContent {
  mood?: string;
  confidence?: number;
  factors?: string[];
  timestamp?: string;
  mood_score?: number;
}

export interface MoodClassificationRow {
  created_at: string;
  content: MoodClassificationContent;
  conversations?: {
    started_at?: string | null;
    last_message_at?: string | null;
  } | null;
}

// Crisis Classification types
export interface CrisisClassificationContent {
  risk_level?: 'low' | 'medium' | 'high' | 'critical';
  indicators?: string[];
  immediate_actions?: string[];
  confidence?: number;
  is_crisis?: boolean;
  crisis_severity?: string;
  activator?: string;
  belief?: string;
  consequence?: string;
  context?: string;
}

export interface CrisisClassificationRow {
  created_at: string;
  content: CrisisClassificationContent;
  conversations?: {
    started_at?: string | null;
    last_message_at?: string | null;
  } | null;
}

// Aggregated emotion types for charts
export interface AggregatedEmotion {
  name: string;
  count: number;
  avgIntensity: number | null;
  triggers: string[];
  contexts: string[];
  color: string;
}

// Insight query parameters
export interface InsightQueryParams {
  patientId: string;
  fromIso: string;
  toIso: string;
}

// Generic insight content type
export type InsightContent =
  | PrimaryEmotionContent
  | MoodClassificationContent
  | CrisisClassificationContent;
