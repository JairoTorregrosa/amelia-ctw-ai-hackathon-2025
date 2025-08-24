-- Remover la columna status de conversation_insights
-- Ya tenemos la columna completed que es más clara y eficiente

-- Primero, eliminar los índices relacionados con la columna status
DROP INDEX IF EXISTS idx_insights_status;
DROP INDEX IF EXISTS idx_insights_pending;

-- Eliminar la columna status
ALTER TABLE conversation_insights 
DROP COLUMN status;

-- Actualizar el comentario de la tabla para reflejar el cambio
COMMENT ON TABLE conversation_insights IS 'Tabla para almacenar insights generados. Usa la columna completed (boolean) para indicar si el insight está completado.';
COMMENT ON COLUMN conversation_insights.completed IS 'Indica si el insight ha sido completado (true) o está pendiente (false)';
COMMENT ON COLUMN conversation_insights.content IS 'Contenido del insight (NULL mientras completed = false)';
