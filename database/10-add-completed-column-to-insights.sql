-- Agregar columna completed a conversation_insights

-- Agregar la columna completed con valor por defecto false
ALTER TABLE conversation_insights 
ADD COLUMN completed BOOLEAN NOT NULL DEFAULT false;

-- Crear índice para la nueva columna
CREATE INDEX idx_insights_completed ON conversation_insights(completed);
CREATE INDEX idx_insights_not_completed ON conversation_insights(completed) WHERE completed = false;

-- Actualizar registros existentes donde content no sea null
UPDATE conversation_insights 
SET completed = true 
WHERE content IS NOT NULL;
