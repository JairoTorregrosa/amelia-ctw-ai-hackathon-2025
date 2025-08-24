-- Migration: Add conversation_summaries column to patient_context table
-- This column will store conversation summaries as JSONB for flexible storage and querying

-- Add the conversation_summaries column
ALTER TABLE patient_context 
ADD COLUMN conversation_summaries JSONB DEFAULT '[]'::jsonb;

-- Add a comment to document the column purpose
COMMENT ON COLUMN patient_context.conversation_summaries IS 
'JSONB array storing conversation summaries. Each summary contains conversation metadata and analysis results from the general_summary workflow.';

-- Create an index for efficient querying of conversation summaries
CREATE INDEX idx_patient_context_conversation_summaries 
ON patient_context USING GIN (conversation_summaries);

-- Add a check constraint to ensure conversation_summaries is always an array
ALTER TABLE patient_context 
ADD CONSTRAINT check_conversation_summaries_is_array 
CHECK (jsonb_typeof(conversation_summaries) = 'array');
