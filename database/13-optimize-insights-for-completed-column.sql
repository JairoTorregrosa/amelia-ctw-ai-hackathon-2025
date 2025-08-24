-- Optimizaciones adicionales para trabajar mejor con la columna completed

-- Función mejorada para marcar insights como completados de forma más eficiente
CREATE OR REPLACE FUNCTION complete_insight_batch(insight_ids BIGINT[], result_contents JSONB[])
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER := 0;
  i INTEGER;
BEGIN
  -- Validar que los arrays tengan el mismo tamaño
  IF array_length(insight_ids, 1) != array_length(result_contents, 1) THEN
    RAISE EXCEPTION 'Los arrays insight_ids y result_contents deben tener el mismo tamaño';
  END IF;
  
  -- Actualizar insights en lote
  FOR i IN 1..array_length(insight_ids, 1) LOOP
    UPDATE conversation_insights 
    SET 
      content = result_contents[i],
      completed = true,
      updated_at = now()
    WHERE id = insight_ids[i] AND completed = false;
    
    IF FOUND THEN
      updated_count := updated_count + 1;
    END IF;
  END LOOP;
  
  RAISE NOTICE 'Se completaron % insights de % solicitados', updated_count, array_length(insight_ids, 1);
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener insights más antiguos sin completar (útil para priorización)
CREATE OR REPLACE FUNCTION get_oldest_pending_insights(limit_count INTEGER DEFAULT 10)
RETURNS TABLE(
  insight_id BIGINT,
  conversation_id BIGINT,
  patient_id UUID,
  insight_type TEXT,
  display_name TEXT,
  created_at TIMESTAMPTZ,
  hours_pending NUMERIC
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
    ROUND(EXTRACT(EPOCH FROM now() - ci.created_at) / 3600, 2) as hours_pending
  FROM conversation_insights ci
  JOIN conversations c ON ci.conversation_id = c.id
  JOIN insight_types it ON ci.insight_type_id = it.id
  WHERE ci.completed = false
  ORDER BY ci.created_at ASC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Función para limpiar insights huérfanos (conversaciones eliminadas)
CREATE OR REPLACE FUNCTION cleanup_orphaned_insights()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM conversation_insights ci
  WHERE NOT EXISTS (
    SELECT 1 FROM conversations c WHERE c.id = ci.conversation_id
  );
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  IF deleted_count > 0 THEN
    RAISE NOTICE 'Se eliminaron % insights huérfanos', deleted_count;
  END IF;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Índice optimizado para consultas frecuentes de insights no completados
CREATE INDEX IF NOT EXISTS idx_insights_not_completed_with_type 
ON conversation_insights(completed, insight_type_id, created_at) 
WHERE completed = false;

-- Índice para búsquedas por conversación y estado de completado
CREATE INDEX IF NOT EXISTS idx_insights_conversation_completed 
ON conversation_insights(conversation_id, completed);

-- Comentarios actualizados para documentar el nuevo enfoque
COMMENT ON COLUMN conversation_insights.completed IS 'Indica si el insight ha sido procesado y completado. false = pendiente, true = completado con contenido disponible';
COMMENT ON INDEX idx_insights_not_completed IS 'Índice optimizado para encontrar insights pendientes (completed = false)';
COMMENT ON INDEX idx_insights_completed IS 'Índice para insights completados';
