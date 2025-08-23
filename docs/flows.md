# Mapa de Desarrollo: Flujos de Trabajo en N8n (Arquitectura MVP)

Este documento detalla la arquitectura simplificada para el MVP del sistema de asistente terapéutico. El enfoque prioriza la simplicidad, la reducción de costos y la robustez del núcleo funcional.

## Flujo 1: Conversacional

**Misión:** Gestionar la interacción en tiempo real con el paciente, manejando los dos casos de uso principales (check-in y log de crisis) y utilizando un contexto calculado en tiempo real.

**Trigger:** Webhook por cada mensaje de WhatsApp.

**Input:** Mensaje del usuario.

### Proceso Detallado (Pasos en N8n):

1. **Identificar Paciente y Gestionar Sesión de Conversación** (crear nueva si es necesario).
2. **Guardar Mensaje Entrante** en la tabla `messages`.
3. **Llamada al Flujo 6 (Creación de Contexto):** Se ejecuta este sub-flujo para ensamblar el contexto actualizado del paciente.
4. **Llamada al "Agente Router" (LLM):** Envía el mensaje del usuario y el estado actual del flujo, para decidir si continuar o cambiar de flujo (ej. de check-in a crisis).
5. **Ejecutar Agente Especialista (LLM):** Basado en la decisión del router, el "Conversador de Check-in" o el "Guía de Crisis" genera una respuesta utilizando el contexto provisto por el Flujo 6.
6. **Guardar y Enviar Respuesta:** Guarda la respuesta en `messages`, actualiza `last_message_at`, y la envía al usuario.

**Output:** Respuesta al usuario, nuevas filas en `messages`, fila actualizada en `conversations`.

### Relaciones:
- **Directas:** Es el punto de contacto con el usuario. Llama directamente al Flujo 6 cada vez que necesita contexto.
- **Indirectas:** Genera los datos crudos (conversaciones) que serán utilizados por el Flujo 2 y el Flujo 3.

---

## Flujo 2: Analítico Bajo Demanda

**Misión:** Generar insights clínicos de un rango de fechas específico, únicamente cuando el terapeuta lo solicita, y entregarlos directamente sin almacenarlos.

**Trigger:** Webhook. Se activa cuando el terapeuta presiona un botón de "Analizar" en su dashboard.

**Input:** Un objeto JSON con `patientId`, `startDate`, `endDate`.

### Proceso Detallado (Pasos en N8n):

1. **Recopilar Conversaciones:** Ejecuta un SELECT en `messages` para obtener todas las conversaciones del paciente en el rango de fechas especificado.
2. **Ejecutar Equipo de Analistas Especialistas (LLM):**
   - **Paso A:** Envía la transcripción completa a un "Especialista en Ciclos" para extraer `MAINTENANCE_CYCLE`.
   - **Paso B:** Envía la transcripción a un "Especialista en Distorsiones" para extraer `COGNITIVE_DISTORTION`.
   - **Paso C:** Envía la transcripción a un "Agente Agregador" para generar un resumen de alto nivel sobre los temas y emociones del período.
3. **Formatear Respuesta:** Consolida los resultados de los especialistas en un único objeto JSON.
4. **Entregar al Terapeuta:** Envía este objeto JSON como respuesta directa al webhook, para que la interfaz del terapeuta pueda renderizarlo.

**Output:** Un objeto JSON transitorio con los insights, enviado al frontend del terapeuta. No se escribe nada en la base de datos.

### Relaciones:
- **Directas:** Ninguna. Es un flujo terminal.
- **Indirectas:** Lee los datos generados por el Flujo 1.

---

## Flujo 3: Offload de Resúmenes (Segundo Plano)

**Misión:** Procesar conversaciones terminadas para generar un resumen conciso de cada una, que luego será utilizado para construir el contexto.

**Trigger:** CRON Job (ej. cada 30 minutos).

**Input:** Busca su propio trabajo: conversaciones donde `summary IS NULL`.

### Proceso Detallado (Pasos en N8n):

1. **Buscar Conversaciones sin Resumen:** Ejecuta un SELECT en `conversations`.
2. **Bucle (Loop):** Para cada conversación encontrada:
   - Obtiene la transcripción completa de `messages`.
   - Llama a un "Agente Resumidor" (LLM) con un prompt para generar un párrafo conciso.
3. **Actualizar BD:** Ejecuta un UPDATE en la fila de la conversación actual, rellenando la columna `summary` con el texto generado.

**Output:** Filas actualizadas en la tabla `conversations` con sus resúmenes completados.

### Relaciones:
- **Directas:** Ninguna. Es un flujo de fondo.
- **Indirectas:** Genera los resúmenes que son un input clave para el Flujo 6 (Creación de Contexto).

---

## Flujo 4: Ingreso de Datos del Paciente (Onboarding)

**Misión:** Registrar a un nuevo paciente y su información clínica inicial.

**Trigger:** Webhook del formulario de "Nuevo Paciente".

*(El resto del flujo es idéntico al WF-01 de la versión anterior)*

---

## Flujo 5: Ingreso de Contexto por Terapeuta

**Misión:** Integrar las notas de sesión y tareas del terapeuta en el contexto del paciente.

**Trigger:** Webhook del formulario de "Nota de Sesión".

*(El resto del flujo es idéntico al WF-02 de la versión anterior, incluyendo la capacidad de manejar PDFs)*

---

## (NUEVO) Flujo 6: Creación de Contexto en Tiempo Real

**Misión:** Ensamblar un paquete de contexto completo y actualizado cada vez que el agente conversacional lo necesite. Este no es un flujo que se ejecuta por sí solo, sino un sub-flujo reutilizable.

**Trigger:** Es llamado por otro workflow, principalmente por el Flujo 1 (Conversacional).

**Input:** `patientId`.

### Proceso Detallado (Pasos en N8n):

1. **Obtener Contexto del Terapeuta:** Ejecuta un SELECT en `patient_context` para obtener `therapist_notes_summary` y `active_tasks`.
2. **Obtener Resúmenes de Conversaciones:** Ejecuta un SELECT en `conversations` para obtener los `summary` de las últimas 3 conversaciones de ese paciente (`ORDER BY created_at DESC LIMIT 3`).
3. **Obtener Contexto de Triage:** Ejecuta un SELECT en `patient_context` para obtener `triage_info`.
4. **Ensamblar Contexto:** Un nodo de código o "Set" combina toda esta información en un único bloque de texto o JSON estructurado.

**Output:** Un objeto JSON o un bloque de texto que contiene todo el contexto necesario, listo para ser inyectado en el prompt de un agente de IA.

### Relaciones:
- **Directas:** Es una función de servicio, llamada directamente por el Flujo 1.
- **Indirectas:** Es un consumidor de los datos generados por los flujos Flujo 3, Flujo 4 y Flujo 5. Es el "pegamento" que une toda la información del sistema para hacerla útil en tiempo real.