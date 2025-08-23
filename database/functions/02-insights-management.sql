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
    -- Insertar insight en estado pending
    INSERT INTO conversation_insights (
      conversation_id,
      insight_type_id,
      status,
      created_at
    ) VALUES (
      conv_id,
      insight_type_record.id,
      'pending',
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
    status = 'completed',
    content = result_content,
    updated_at = now()
  WHERE id = insight_id;
  
  GET DIAGNOSTICS updated_rows = ROW_COUNT;
  RETURN updated_rows > 0;
END;
$$ LANGUAGE plpgsql;
