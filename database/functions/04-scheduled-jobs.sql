-- Jobs programados para mantenimiento automático

-- Habilitar la extensión pg_cron si no está habilitada
-- NOTA: Esto requiere permisos de superusuario
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Job para cerrar conversaciones inactivas cada 5 minutos
-- Este job ejecuta la función close_inactive_conversations() cada 5 minutos
-- para identificar conversaciones que deberían cerrarse y crear sus insights

-- Eliminar job existente si existe (para evitar duplicados)
SELECT cron.unschedule('close-inactive-conversations');

-- Crear el job programado cada 5 minutos
SELECT cron.schedule(
  'close-inactive-conversations',           -- nombre del job
  '*/5 * * * *',                          -- cada 5 minutos (cron expression)
  'SELECT close_inactive_conversations();' -- función a ejecutar
);

-- Función para verificar el estado del job
CREATE OR REPLACE FUNCTION get_scheduled_jobs_status()
RETURNS TABLE(
  jobname TEXT,
  schedule TEXT,
  command TEXT,
  active BOOLEAN,
  last_run TIMESTAMP WITH TIME ZONE,
  next_run TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    j.jobname::TEXT,
    j.schedule::TEXT,
    j.command::TEXT,
    j.active,
    j.last_run,
    j.next_run
  FROM cron.job j
  WHERE j.jobname = 'close-inactive-conversations';
END;
$$ LANGUAGE plpgsql;

-- Función para pausar el job de cierre de conversaciones
CREATE OR REPLACE FUNCTION pause_conversation_cleanup_job()
RETURNS BOOLEAN AS $$
BEGIN
  PERFORM cron.alter_job('close-inactive-conversations', active => false);
  RAISE NOTICE 'Job de cierre de conversaciones pausado';
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error al pausar el job: %', SQLERRM;
    RETURN false;
END;
$$ LANGUAGE plpgsql;

-- Función para reanudar el job de cierre de conversaciones
CREATE OR REPLACE FUNCTION resume_conversation_cleanup_job()
RETURNS BOOLEAN AS $$
BEGIN
  PERFORM cron.alter_job('close-inactive-conversations', active => true);
  RAISE NOTICE 'Job de cierre de conversaciones reanudado';
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error al reanudar el job: %', SQLERRM;
    RETURN false;
END;
$$ LANGUAGE plpgsql;

-- Función para ejecutar manualmente el cierre de conversaciones
CREATE OR REPLACE FUNCTION run_conversation_cleanup_now()
RETURNS TABLE(closed_conversation_id BIGINT, insights_created INTEGER) AS $$
BEGIN
  RAISE NOTICE 'Ejecutando cierre manual de conversaciones inactivas...';
  RETURN QUERY SELECT * FROM close_inactive_conversations();
END;
$$ LANGUAGE plpgsql;
