# Database Triggers

Esta carpeta contiene todos los triggers de la base de datos del sistema de terapia con IA.

## Orden de Aplicación

Los triggers deben aplicarse **después** de crear todas las tablas principales (archivos 01-06 en la carpeta padre).

### 01-update-last-message-trigger.sql
**Propósito**: Mantiene sincronizado automáticamente el campo `last_message_at` en la tabla `conversations`.

**Funcionamiento**:
- Se ejecuta automáticamente cada vez que se inserta un nuevo mensaje
- Actualiza `conversations.last_message_at` con el timestamp del mensaje más reciente
- No requiere intervención manual del código de la aplicación

**Casos de uso**:
```sql
-- Encontrar conversaciones inactivas (más de 24 horas)
SELECT * FROM conversations 
WHERE last_message_at < now() - INTERVAL '24 hours';

-- Ordenar conversaciones por actividad reciente
SELECT * FROM conversations 
ORDER BY last_message_at DESC;
```

**Dependencias**:
- Tabla `conversations` (archivo 05-conversations.sql)
- Tabla `messages` (archivo 06-messages.sql)

## Aplicación en Supabase

Para aplicar estos triggers en Supabase, usa el comando de migración:

```sql
-- Aplicar usando mcp_supabase_apply_migration
-- Nombre: update_last_message_trigger
-- Query: [contenido del archivo .sql]
```

## Notas Importantes

- Los triggers se ejecutan automáticamente en el nivel de base de datos
- No requieren cambios en el código frontend/backend
- Mejoran la consistencia de datos sin overhead de aplicación
- Facilitan consultas de actividad y análisis de uso
