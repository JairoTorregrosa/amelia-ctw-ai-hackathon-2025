-- Funciones para manejo de timeout de conversaciones

-- Función para obtener el timeout actual
CREATE OR REPLACE FUNCTION get_conversation_timeout_minutes()
RETURNS INTEGER AS $$
DECLARE
  timeout_mins INTEGER;
BEGIN
  SELECT timeout_minutes INTO timeout_mins
  FROM conversation_config 
  ORDER BY id DESC 
  LIMIT 1;
  
  RETURN COALESCE(timeout_mins, 120); -- Default 2 horas
END;
$$ LANGUAGE plpgsql;

-- Función para cambiar el timeout
CREATE OR REPLACE FUNCTION set_conversation_timeout_minutes(minutes_param INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE conversation_config 
  SET 
    timeout_minutes = minutes_param,
    updated_at = now();
  
  RAISE NOTICE 'Timeout de conversaciones actualizado a % minutos', minutes_param;
  RETURN true;
END;
$$ LANGUAGE plpgsql;
