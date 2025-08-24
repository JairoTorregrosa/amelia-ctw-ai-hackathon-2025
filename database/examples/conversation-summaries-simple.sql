-- Simple examples using native PostgreSQL JSONB operations
-- No custom functions needed - just use standard SQL

-- Example 1: Add a new conversation summary
UPDATE patient_context 
SET conversation_summaries = conversation_summaries || jsonb_build_object(
    'conversation_id', 12345,
    'created_at', now(),
    'summary_data', '{
        "general_summary": {
            "psychological_summary": "Patient showing improved mood and coping strategies...",
            "events_summary": "Patient discussed recent job interview success...",
            "suggested_questions": ["How has your confidence improved?", "What strategies work best?"],
            "suggested_tasks": ["Continue mindfulness practice", "Journal daily interactions"]
        }
    }'::jsonb
)
WHERE patient_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid;

-- Example 2: Get all conversation summaries for a patient
SELECT conversation_summaries 
FROM patient_context 
WHERE patient_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid;

-- Example 3: Get the latest 5 summaries (ordered by created_at)
SELECT jsonb_agg(summary ORDER BY (summary->>'created_at')::timestamptz DESC) as latest_summaries
FROM patient_context,
     jsonb_array_elements(conversation_summaries) as summary
WHERE patient_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid
GROUP BY patient_id
LIMIT 5;

-- Example 4: Find a specific conversation summary
SELECT summary
FROM patient_context,
     jsonb_array_elements(conversation_summaries) as summary
WHERE patient_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid
  AND (summary->>'conversation_id')::bigint = 12345;

-- Example 5: Search summaries containing specific text
SELECT patient_id, summary
FROM patient_context,
     jsonb_array_elements(conversation_summaries) as summary
WHERE summary->'summary_data'->'general_summary'->>'psychological_summary' ILIKE '%anxiety%';

-- Example 6: Keep only the latest 50 summaries (cleanup)
UPDATE patient_context 
SET conversation_summaries = (
    SELECT jsonb_agg(summary ORDER BY (summary->>'created_at')::timestamptz DESC)
    FROM (
        SELECT summary
        FROM jsonb_array_elements(conversation_summaries) as summary
        ORDER BY (summary->>'created_at')::timestamptz DESC
        LIMIT 50
    ) as latest_summaries(summary)
)
WHERE patient_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid
  AND jsonb_array_length(conversation_summaries) > 50;
