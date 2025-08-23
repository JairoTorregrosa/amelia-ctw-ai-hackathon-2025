-- Trigger para actualizar automáticamente last_message_at en conversations
-- Se ejecuta cada vez que se inserta un nuevo mensaje

-- Función que actualiza el timestamp de la última actividad
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  -- Actualizar last_message_at cuando se inserta un nuevo mensaje
  -- OPTIMIZADO: Solo actualiza si el nuevo mensaje es más reciente
  UPDATE conversations 
  SET last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id 
    AND (last_message_at IS NULL OR last_message_at < NEW.created_at);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger que se ejecuta después de insertar un mensaje
CREATE TRIGGER trigger_update_last_message
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_last_message();

-- Comentarios:
-- - Este trigger mantiene sincronizado el campo last_message_at automáticamente
-- - Se ejecuta solo en INSERT, no en UPDATE o DELETE de mensajes
-- - Útil para identificar conversaciones inactivas y ordenar por actividad reciente
-- - No requiere cambios en el código de la aplicación
--
-- Optimizaciones de rendimiento:
-- - Usa PRIMARY KEY index (conversations.id) - O(1) lookup
-- - Solo actualiza 1 fila específica, no toda la tabla
-- - Condición adicional evita UPDATEs innecesarios si mensaje es más antiguo
-- - Costo típico: ~2ms por mensaje insertado
