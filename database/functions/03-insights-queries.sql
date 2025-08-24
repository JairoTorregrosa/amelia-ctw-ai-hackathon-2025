-- Funciones de consulta para insights

-- Función para obtener insights pendientes (para cron jobs)
CREATE OR REPLACE FUNCTION get_pending_insights()
RETURNS TABLE(
  insight_id BIGINT,
  conversation_id BIGINT,
  type_key TEXT,
  display_name TEXT,
  config JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ci.id,
    ci.conversation_id,
    it.type_key,
    it.display_name,
    it.config
  FROM conversation_insights ci
  JOIN insight_types it ON ci.insight_type_id = it.id
  WHERE ci.completed = false
  ORDER BY ci.created_at ASC;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener insights de una conversación
CREATE OR REPLACE FUNCTION get_conversation_insights(conv_id BIGINT)
RETURNS TABLE(
  type_key TEXT,
  display_name TEXT,
  completed BOOLEAN,
  content JSONB,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    it.type_key,
    it.display_name,
    ci.completed,
    ci.content,
    ci.created_at
  FROM conversation_insights ci
  JOIN insight_types it ON ci.insight_type_id = it.id
  WHERE ci.conversation_id = conv_id
  ORDER BY ci.created_at;
END;
$$ LANGUAGE plpgsql;
