# Database Schema - Sistema de Terapia con IA

Esta carpeta contiene toda la estructura de base de datos para el sistema de terapia con inteligencia artificial.

## Estructura de Archivos

### Tablas Principales (Orden de Aplicación)

1. **01-predefined-types.sql** - Tipos personalizados (ENUMs)
   - `user_role`: 'patient', 'therapist'
   - `message_sender`: 'agent', 'patient'

2. **02-profiles.sql** - Perfiles de usuarios
   - Vinculado 1:1 con `auth.users` de Supabase
   - Información básica: nombre, email, rol

3. **03-therapist_patient_assignments.sql** - Asignaciones terapeuta-paciente
   - Relación many-to-many entre terapeutas y pacientes
   - Control de estado (active/inactive)
   - Restricción única por par terapeuta-paciente

4. **04-patient-context.sql** - Contexto del paciente
   - Información de triaje (JSONB flexible)
   - Resumen de notas del terapeuta
   - Tareas activas (JSONB)

5. **05-conversations.sql** - Conversaciones de terapia
   - Sesiones de chat entre paciente y agente IA
   - Timestamps de actividad
   - Resúmenes generados automáticamente

6. **06-messages.sql** - Mensajes individuales
   - Contenido de cada mensaje en las conversaciones
   - Identificación de remitente (agent/patient)

### Triggers (Aplicar después de las tablas)

- **triggers/** - Carpeta con triggers automáticos
  - `01-update-last-message-trigger.sql` - Mantiene sincronizado `last_message_at`

## Aplicación en Supabase

### Orden de Ejecución:
1. Aplicar archivos 01-06 en orden numérico
2. Aplicar triggers después de completar las tablas
3. Configurar Row Level Security (RLS) si es necesario

### Comando de Migración:
```sql
-- Para cada archivo, usar:
-- mcp_supabase_apply_migration
-- name: [nombre_descriptivo]
-- query: [contenido del archivo .sql]
```

## Datos de Prueba

El sistema incluye datos ficticios para testing:
- **Paciente**: María González Rodríguez (maria.gonzalez@email.com)
- **Conversación completa** con 15+ mensajes
- **Contexto del paciente** con información de triaje realista
- **Tareas activas** de ejemplo

## Consideraciones de Seguridad

⚠️ **IMPORTANTE**: Todas las tablas necesitan Row Level Security (RLS) habilitado para proteger datos sensibles de pacientes.

## Consideraciones de Rendimiento

💡 **RECOMENDADO**: Agregar índices en foreign keys para mejor rendimiento:
- `conversations.patient_id`
- `messages.conversation_id`
- `therapist_patient_assignments.patient_id`

## Estructura de Datos JSONB

### patient_context.triage_info
```json
{
  "reason_for_consultation": "string",
  "symptoms": ["array", "of", "strings"],
  "severity_level": "string",
  "previous_therapy": boolean,
  "medications": "string",
  "emergency_contact": {
    "name": "string",
    "relationship": "string", 
    "phone": "string"
  }
}
```

### patient_context.active_tasks
```json
[
  {
    "id": number,
    "description": "string",
    "status": "active|in_progress|completed",
    "assigned_date": "YYYY-MM-DD",
    "due_date": "YYYY-MM-DD"
  }
]
```
