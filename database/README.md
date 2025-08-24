# Database Schema V2 - Sistema de Terapia con IA

Esta es la versión 2 simplificada y optimizada de la base de datos, incorporando todas las lecciones aprendidas.

## Orden de Aplicación

Aplicar los archivos en este orden exacto:

### Tablas Base (1-9)
1. **01-predefined-types.sql** - Tipos ENUM
2. **02-profiles.sql** - Perfiles de usuarios (con phone)
3. **03-therapist-patient-assignments.sql** - Asignaciones
4. **04-patient-context.sql** - Contexto del paciente
5. **05-conversations.sql** - Conversaciones (con status y índices)
6. **06-messages.sql** - Mensajes (con patient_id)
7. **07-conversation-timeout-config.sql** - Configuración de timeout
8. **08-insight-types.sql** - Tipos de insights configurables
9. **09-conversation-insights.sql** - Insights generados

### Funciones (10-12)
10. **functions/01-conversation-timeout.sql** - Funciones de timeout
11. **functions/02-insights-management.sql** - Gestión de insights
12. **functions/03-insights-queries.sql** - Consultas de insights

### Triggers (13)
13. **triggers/01-smart-conversation-management.sql** - Trigger de auto-gestión

## Características Principales

### ✅ Auto-gestión de Conversaciones
- Timeout configurable (default: 2 horas)
- Cierre automático de conversaciones inactivas
- Creación automática de nuevas conversaciones
- Solo requiere `patient_id` en mensajes

### ✅ Sistema de Insights
- Tipos configurables (activar/desactivar)
- Creación automática al cerrar conversaciones
- Estados simples: pending → completed
- Configuración JSONB flexible

### ✅ Optimizaciones
- Índices en campos críticos
- Constraints para integridad
- Funciones eficientes
- Estructura simplificada

## Uso Básico

### Enviar Mensaje (Auto-gestión)
```javascript
await supabase.from('messages').insert({
  patient_id: currentUserId,  // Solo esto es obligatorio
  sender: 'patient',
  content: 'Mi mensaje'
  // conversation_id se resuelve automáticamente
});
```

### Configurar Timeout
```sql
-- Cambiar a 1 hora
SELECT set_conversation_timeout_minutes(60);

-- Cambiar a 30 minutos
SELECT set_conversation_timeout_minutes(30);
```

### Gestionar Insights
```sql
-- Desactivar tipo de insight
SELECT toggle_insight_type('primary_emotions', false);

-- Ver insights pendientes
SELECT * FROM get_pending_insights();

-- Completar insight
SELECT complete_insight(123, '{"summary": "Paciente muestra mejoras..."}');
```

## Estructura de Datos

### Profiles
- `id`, `full_name`, `email`, `phone`, `role`
- Vinculado 1:1 con `auth.users`

### Conversations
- Auto-gestión con `status` (active/completed)
- Timeout configurable
- Creación automática de insights al cerrar

### Messages
- `patient_id` obligatorio
- `conversation_id` opcional (se resuelve automáticamente)
- Trigger maneja toda la lógica

### Insights
- Tipos configurables con JSONB
- Estados simples: pending/completed
- Creación automática al cerrar conversaciones

## Estructura V2 Organizada

```
database/v2/
├── 01-predefined-types.sql          ← ENUMs básicos
├── 02-profiles.sql                  ← Perfiles con phone
├── 03-therapist-patient-assignments.sql ← Asignaciones
├── 04-patient-context.sql           ← Contexto del paciente
├── 05-conversations.sql             ← Conversaciones con status e índices
├── 06-messages.sql                  ← Mensajes con patient_id
├── 07-conversation-timeout-config.sql ← Configuración de timeout
├── 08-insight-types.sql             ← Tipos de insights configurables
├── 09-conversation-insights.sql     ← Insights generados
├── functions/
│   ├── 01-conversation-timeout.sql  ← Funciones de timeout
│   ├── 02-insights-management.sql   ← Gestión de insights
│   └── 03-insights-queries.sql      ← Consultas de insights
├── triggers/
│   └── 01-smart-conversation-management.sql ← Trigger principal
└── README.md                        ← Documentación completa
```

## Beneficios V2

1. **Organización Clara** - Funciones y triggers separados
2. **Simplicidad** - Menos complejidad, más enfoque
3. **Flexibilidad** - Configuración dinámica
4. **Automatización** - Gestión transparente
5. **Escalabilidad** - Estructura optimizada
6. **Mantenibilidad** - Código limpio y documentado
