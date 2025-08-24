-- Trigger para auto-gestión inteligente de conversaciones

-- Función principal de gestión de conversaciones (sin cierre automático)
CREATE OR REPLACE FUNCTION smart_conversation_management()
RETURNS TRIGGER AS $$
DECLARE
  active_conv_id BIGINT;
  new_conv_id BIGINT;
  timeout_minutes INTEGER;
  timeout_interval INTERVAL;
BEGIN
  -- Obtener timeout configurado en minutos
  SELECT get_conversation_timeout_minutes() INTO timeout_minutes;
  
  -- Construir intervalo dinámico
  timeout_interval := timeout_minutes * INTERVAL '1 minute';
  
  -- 1. Buscar conversación activa del paciente (que no haya expirado)
  SELECT id INTO active_conv_id
  FROM conversations 
  WHERE patient_id = NEW.patient_id 
    AND status = 'active'
    AND (last_message_at IS NULL OR last_message_at > now() - timeout_interval);
  
  -- 2. Si no hay conversación activa válida, crear nueva
  IF active_conv_id IS NULL THEN
    -- Crear nueva conversación activa
    INSERT INTO conversations (patient_id, status, started_at, last_message_at)
    VALUES (NEW.patient_id, 'active', now(), now())
    RETURNING id INTO new_conv_id;
    
    -- Asignar la nueva conversación al mensaje
    NEW.conversation_id = new_conv_id;
    
    RAISE NOTICE 'Nueva conversación % creada para paciente %', new_conv_id, NEW.patient_id;
    
  ELSE
    -- 3. Usar conversación activa existente
    NEW.conversation_id = active_conv_id;
    
    -- Actualizar last_message_at
    UPDATE conversations 
    SET last_message_at = NEW.created_at
    WHERE id = active_conv_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger que se ejecuta ANTES de insertar un mensaje
CREATE TRIGGER trigger_smart_conversation_management
  BEFORE INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION smart_conversation_management();
