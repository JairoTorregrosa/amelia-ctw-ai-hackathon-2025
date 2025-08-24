-- Funciones mejoradas para consultar insights con la nueva columna completed

-- Función para obtener insights pendientes (no completados)
CREATE OR REPLACE FUNCTION get_pending_insights()
RETURNS TABLE(
  insight_id BIGINT,
  conversation_id BIGINT,
  patient_id UUID,
  insight_type TEXT,
  display_name TEXT,
  created_at TIMESTAMPTZ,
  days_pending INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ci.id as insight_id,
    ci.conversation_id,
    c.patient_id,
    it.type_key as insight_type,
    it.display_name,
    ci.created_at,
    EXTRACT(DAY FROM now() - ci.created_at)::INTEGER as days_pending
  FROM conversation_insights ci
  JOIN conversations c ON ci.conversation_id = c.id
  JOIN insight_types it ON ci.insight_type_id = it.id
  WHERE ci.completed = false
  ORDER BY ci.created_at ASC;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener insights completados de una conversación
CREATE OR REPLACE FUNCTION get_completed_insights_for_conversation(conv_id BIGINT)
RETURNS TABLE(
  insight_id BIGINT,
  insight_type TEXT,
  display_name TEXT,
  content JSONB,
  completed_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ci.id as insight_id,
    it.type_key as insight_type,
    it.display_name,
    ci.content,
    ci.updated_at as completed_at
  FROM conversation_insights ci
  JOIN insight_types it ON ci.insight_type_id = it.id
  WHERE ci.conversation_id = conv_id 
    AND ci.completed = true
  ORDER BY ci.updated_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener estadísticas de insights
CREATE OR REPLACE FUNCTION get_insights_stats()
RETURNS TABLE(
  total_insights BIGINT,
  completed_insights BIGINT,
  pending_insights BIGINT,
  completion_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_insights,
    COUNT(*) FILTER (WHERE completed = true) as completed_insights,
    COUNT(*) FILTER (WHERE completed = false) as pending_insights,
    ROUND(
      (COUNT(*) FILTER (WHERE completed = true)::NUMERIC / 
       NULLIF(COUNT(*), 0) * 100), 2
    ) as completion_rate
  FROM conversation_insights;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener insights pendientes de un paciente específico
CREATE OR REPLACE FUNCTION get_patient_pending_insights(patient_uuid UUID)
RETURNS TABLE(
  insight_id BIGINT,
  conversation_id BIGINT,
  insight_type TEXT,
  display_name TEXT,
  created_at TIMESTAMPTZ,
  days_pending INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ci.id as insight_id,
    ci.conversation_id,
    it.type_key as insight_type,
    it.display_name,
    ci.created_at,
    EXTRACT(DAY FROM now() - ci.created_at)::INTEGER as days_pending
  FROM conversation_insights ci
  JOIN conversations c ON ci.conversation_id = c.id
  JOIN insight_types it ON ci.insight_type_id = it.id
  WHERE c.patient_id = patient_uuid 
    AND ci.completed = false
  ORDER BY ci.created_at ASC;
END;
$$ LANGUAGE plpgsql;
