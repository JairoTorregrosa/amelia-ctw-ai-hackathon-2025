-- Funciones para manejo de insights

-- Función simple para crear insights activos cuando se cierra una conversación
CREATE OR REPLACE FUNCTION create_active_insights(conv_id BIGINT)
RETURNS INTEGER AS $$
DECLARE
  insight_type_record RECORD;
  insights_created INTEGER := 0;
BEGIN
  -- Crear insights para todos los tipos activos
  FOR insight_type_record IN 
    SELECT id, type_key, display_name
    FROM insight_types 
    WHERE is_active = true 
  LOOP
    -- Insertar insight en estado no completado
    INSERT INTO conversation_insights (
      conversation_id,
      insight_type_id,
      completed,
      created_at
    ) VALUES (
      conv_id,
      insight_type_record.id,
      false,
      now()
    )
    ON CONFLICT (conversation_id, insight_type_id) DO NOTHING;
    
    -- Contar insights creados
    IF FOUND THEN
      insights_created := insights_created + 1;
      RAISE NOTICE 'Insight % creado para conversación %', 
        insight_type_record.type_key, conv_id;
    END IF;
  END LOOP;
  
  RETURN insights_created;
END;
$$ LANGUAGE plpgsql;

-- Función para activar/desactivar tipos de insights
CREATE OR REPLACE FUNCTION toggle_insight_type(type_key_param TEXT, is_active_param BOOLEAN)
RETURNS BOOLEAN AS $$
DECLARE
  updated_rows INTEGER;
BEGIN
  UPDATE insight_types 
  SET is_active = is_active_param
  WHERE type_key = type_key_param;
  
  GET DIAGNOSTICS updated_rows = ROW_COUNT;
  
  IF updated_rows > 0 THEN
    RAISE NOTICE 'Tipo de insight % %', 
      type_key_param, 
      CASE WHEN is_active_param THEN 'activado' ELSE 'desactivado' END;
    RETURN true;
  ELSE
    RAISE NOTICE 'Tipo de insight % no encontrado', type_key_param;
    RETURN false;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Función simple para completar un insight
CREATE OR REPLACE FUNCTION complete_insight(insight_id BIGINT, result_content JSONB)
RETURNS BOOLEAN AS $$
DECLARE
  updated_rows INTEGER;
BEGIN
  UPDATE conversation_insights 
  SET 
    content = result_content,
    completed = true,
    updated_at = now()
  WHERE id = insight_id;
  
  GET DIAGNOSTICS updated_rows = ROW_COUNT;
  RETURN updated_rows > 0;
END;
$$ LANGUAGE plpgsql;

-- Función para identificar y cerrar conversaciones inactivas (ejecutada cada 5 minutos)
CREATE OR REPLACE FUNCTION close_inactive_conversations()
RETURNS TABLE(closed_conversation_id BIGINT, insights_created INTEGER) AS $$
DECLARE
  conv_record RECORD;
  insights_count INTEGER;
  timeout_minutes INTEGER;
  timeout_interval INTERVAL;
  total_closed INTEGER := 0;
BEGIN
  -- Obtener timeout configurado en minutos
  SELECT get_conversation_timeout_minutes() INTO timeout_minutes;
  
  -- Construir intervalo dinámico
  timeout_interval := timeout_minutes * INTERVAL '1 minute';
  
  -- Buscar conversaciones activas que deberían cerrarse
  FOR conv_record IN 
    SELECT id, patient_id
    FROM conversations 
    WHERE status = 'active'
      AND last_message_at IS NOT NULL 
      AND last_message_at <= now() - timeout_interval
  LOOP
    -- Marcar conversación como completada
    UPDATE conversations 
    SET status = 'completed', 
        updated_at = now()
    WHERE id = conv_record.id;
    
    -- Crear insights activos para la conversación cerrada
    SELECT create_active_insights(conv_record.id) INTO insights_count;
    
    -- Retornar información de la conversación cerrada
    closed_conversation_id := conv_record.id;
    insights_created := insights_count;
    total_closed := total_closed + 1;
    
    RAISE NOTICE 'Conversación % cerrada automáticamente. % insights creados.', 
      conv_record.id, insights_count;
    
    RETURN NEXT;
  END LOOP;
  
  IF total_closed = 0 THEN
    RAISE NOTICE 'No se encontraron conversaciones inactivas para cerrar.';
  ELSE
    RAISE NOTICE 'Total de conversaciones cerradas: %', total_closed;
  END IF;
  
  RETURN;
END;
$$ LANGUAGE plpgsql;
