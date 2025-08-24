-- Add conversational_summary insight type

INSERT INTO insight_types (type_key, display_name, config) VALUES
(
  'conversational_summary',
  'Resumen Conversacional',
  '{
    "description": "Extraction of key events and important developments mentioned during the conversation",
    "max_events": 10,
    "fields": {
      "event": {
        "type": "string",
        "min_length": 10,
        "max_length": 200,
        "description": "Brief description of what happened"
      },
      "importance": {
        "type": "string", 
        "min_length": 10,
        "max_length": 150,
        "description": "Why this event is important or significant"
      }
    },
    "output_format": "key_events array with event and importance fields"
  }'
);
