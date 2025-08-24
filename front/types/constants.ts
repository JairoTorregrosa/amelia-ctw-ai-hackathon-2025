/**
 * Centralized constants and enums
 */

// User roles enum
export enum UserRole {
  Patient = 'patient',
  Therapist = 'therapist',
}

// Message sender enum
export enum MessageSender {
  Agent = 'agent',
  Patient = 'patient',
}

// Conversation status enum
export enum ConversationStatus {
  Active = 'active',
  Closed = 'closed',
  Pending = 'pending',
}

// Risk levels for crisis classification
export enum RiskLevel {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
  Critical = 'critical',
}

// Insight types
export enum InsightType {
  PrimaryEmotions = 'primary_emotions',
  MoodClassification = 'mood_classification',
  CrisisClassification = 'crisis_classification',
  ConversationalSummary = 'conversational_summary',
}

// Color mappings for emotions
export const EMOTION_COLORS: Record<string, string> = {
  joy: '#A5E3D0',
  sadness: '#6CAEDD',
  anger: '#EF4444',
  fear: '#F59E0B',
  surprise: '#8B5CF6',
  disgust: '#10B981',
  anticipation: '#F97316',
  trust: '#06B6D4',
  // Default colors for unknown emotions
  default: '#6B7280',
} as const;

// Risk level color mappings
export const RISK_LEVEL_COLORS: Record<string, string> = {
  low: 'bg-green-100 text-green-800',
  'bajo': 'bg-green-100 text-green-800',
  'bajo-moderado': 'bg-yellow-100 text-yellow-800',
  medium: 'bg-yellow-100 text-yellow-800',
  'moderado': 'bg-yellow-100 text-yellow-800',
  'moderado-alto': 'bg-orange-100 text-orange-800',
  high: 'bg-red-100 text-red-800',
  'alto': 'bg-red-100 text-red-800',
  critical: 'bg-red-500 text-white',
  default: 'bg-gray-100 text-gray-800',
} as const;

// Chart configuration constants
export const CHART_COLORS = [
  '#A5E3D0', '#6CAEDD', '#EF4444', '#F59E0B', '#8B5CF6',
  '#10B981', '#F97316', '#06B6D4', '#EC4899', '#84CC16'
] as const;

// API endpoints (if needed)
export const API_ENDPOINTS = {
  INSIGHTS: '/api/insights',
  CONVERSATIONS: '/api/conversations',
  PATIENTS: '/api/patients',
} as const;
