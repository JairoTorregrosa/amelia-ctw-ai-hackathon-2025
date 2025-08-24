-- Trigger para auto-completar insights cuando se llena el content

-- Función que actualiza la columna completed basada en el content
CREATE OR REPLACE FUNCTION auto_complete_insight()
RETURNS TRIGGER AS $$
BEGIN
  -- Si content no es null, marcar como completed = true
  IF NEW.content IS NOT NULL THEN
    NEW.completed = true;
  ELSE
    -- Si content es null, marcar como completed = false
    NEW.completed = false;
  END IF;
  
  -- Actualizar timestamp
  NEW.updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger que se ejecuta ANTES de INSERT o UPDATE en conversation_insights
CREATE TRIGGER trigger_auto_complete_insight
  BEFORE INSERT OR UPDATE ON conversation_insights
  FOR EACH ROW
  EXECUTE FUNCTION auto_complete_insight();
