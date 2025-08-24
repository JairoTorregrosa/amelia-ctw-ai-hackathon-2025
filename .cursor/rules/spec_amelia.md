# **Mapa de Desarrollo: Flujos de Trabajo en N8n (Arquitectura MVP)**

Este documento detalla la arquitectura simplificada para el MVP del sistema de asistente terapéutico. El enfoque prioriza la simplicidad, la reducción de costos y la robustez del núcleo funcional.

### **Flujo 1: Conversacional**

* **Misión:** Gestionar la interacción en tiempo real con el paciente, manejando los dos casos de uso principales (check-in y log de crisis) y utilizando un contexto calculado en tiempo real.
* **Trigger:** **Webhook** por cada mensaje de WhatsApp.  
* **Input:** Mensaje del usuario.  
* **Proceso Detallado (Pasos en N8n):**  
  * **Identificar Paciente** y **Gestionar Sesión de Conversación** (crear nueva si es necesario).  
  * **Guardar Mensaje Entrante** en la tabla messages.  
  * **Llamada al Flujo 6 (Creación de Contexto):** Se ejecuta este sub-flujo para ensamblar el contexto actualizado del paciente.  
  * **Llamada al "Agente Router" (LLM):** Envía el mensaje del usuario y el estado actual del flujo, para decidir si continuar o cambiar de flujo (ej. de check-in a crisis).  
  * **Ejecutar Agente Especialista (LLM):** Basado en la decisión del router, el "Conversador de Check-in" o el "Guía de Crisis" genera una respuesta utilizando el contexto provisto por el Flujo 6\.  
  * **Guardar y Enviar Respuesta:** Guarda la respuesta en messages, actualiza last\_message\_at, y la envía al usuario.  
* **Output:** Respuesta al usuario, nuevas filas en messages, fila actualizada en conversations.  
* **Relaciones:**  
  * **Directas:** Es el punto de contacto con el usuario. Llama directamente al **Flujo 6** cada vez que necesita contexto.  
  * **Indirectas:** Genera los datos crudos (conversaciones) que serán utilizados por el **Flujo 2** y el **Flujo 3**.

### **Flujo 2: Analítico Bajo Demanda**

* **Misión:** Generar insights clínicos de un rango de fechas específico, únicamente cuando el terapeuta lo solicita, y entregarlos directamente sin almacenarlos.  
* **Trigger:** **Webhook.** Se activa cuando el terapeuta presiona un botón de "Analizar" en su dashboard.  
* **Input:** Un objeto JSON con patientId, startDate, endDate.  
* **Proceso Detallado (Pasos en N8n):**  
  * **Recopilar Conversaciones:** Ejecuta un SELECT en messages para obtener todas las conversaciones del paciente en el rango de fechas especificado.  
  * **Ejecutar Equipo de Analistas Especialistas (LLM):**  
    * **Paso A:** Envía la transcripción completa a un "Especialista en Ciclos" para extraer MAINTENANCE\_CYCLE.  
    * **Paso B:** Envía la transcripción a un "Especialista en Distorsiones" para extraer COGNITIVE\_DISTORTION.  
    * **Paso C:** Envía la transcripción a un "Agente Agregador" para generar un resumen de alto nivel sobre los temas y emociones del período.  
  * **Formatear Respuesta:** Consolida los resultados de los especialistas en un único objeto JSON.  
  * **Entregar al Terapeuta:** Envía este objeto JSON como respuesta directa al webhook, para que la interfaz del terapeuta pueda renderizarlo.  
* **Output:** Un objeto JSON transitorio con los insights, enviado al frontend del terapeuta. **No se escribe nada en la base de datos.**  
* **Relaciones:**  
  * **Directas:** Ninguna. Es un flujo terminal.  
  * **Indirectas:** Lee los datos generados por el **Flujo 1**.

### **Flujo 3: Offload de Resúmenes (Segundo Plano)**

* **Misión:** Procesar conversaciones terminadas para generar un resumen conciso de cada una, que luego será utilizado para construir el contexto.  
* **Trigger:** **CRON Job** (ej. cada 30 minutos).  
* **Input:** Busca su propio trabajo: conversaciones donde summary IS NULL.  
* **Proceso Detallado (Pasos en N8n):**  
  * **Buscar Conversaciones sin Resumen:** Ejecuta un SELECT en conversations.  
  * **Bucle (Loop):** Para cada conversación encontrada:  
    * Obtiene la transcripción completa de messages.  
    * Llama a un "Agente Resumidor" (LLM) con un prompt para generar un párrafo conciso.  
    * **Actualizar BD:** Ejecuta un UPDATE en la fila de la conversación actual, rellenando la columna summary con el texto generado.  
* **Output:** Filas actualizadas en la tabla conversations con sus resúmenes completados.  
* **Relaciones:**  
  * **Directas:** Ninguna. Es un flujo de fondo.  
  * **Indirectas:** Genera los resúmenes que son un **input clave** para el **Flujo 6 (Creación de Contexto)**.

### **Flujo 4: Ingreso de Datos del Paciente (Onboarding)**

* **Misión:** Registrar a un nuevo paciente y su información clínica inicial.  
* **Trigger:** **Webhook** del formulario de "Nuevo Paciente".  
* **(El resto del flujo es idéntico al WF-01 de la versión anterior)**

### **Flujo 5: Ingreso de Contexto por Terapeuta**

* **Misión:** Integrar las notas de sesión y tareas del terapeuta en el contexto del paciente.  
* **Trigger:** **Webhook** del formulario de "Nota de Sesión".  
* **(El resto del flujo es idéntico al WF-02 de la versión anterior, incluyendo la capacidad de manejar PDFs)**

### **Flujo 6: Creación de Contexto en Tiempo Real**

* **Misión:** Ensamblar un paquete de contexto completo y actualizado cada vez que el agente conversacional lo necesite. Este no es un flujo que se ejecuta por sí solo, sino un **sub-flujo reutilizable**.  
* **Trigger:** Es **llamado por otro workflow**, principalmente por el **Flujo 1 (Conversacional)**.  
* **Input:** patientId.  
* **Proceso Detallado (Pasos en N8n):**  
  * **Obtener Contexto del Terapeuta:** Ejecuta un SELECT en patient\_context para obtener therapist\_notes\_summary y active\_tasks.  
  * **Obtener Resúmenes de Conversaciones:** Ejecuta un SELECT en conversations para obtener los summary de las últimas 3 conversaciones de ese paciente (ORDER BY created\_at DESC LIMIT 3).  
  * **Obtener Contexto de Triage:** Ejecuta un SELECT en patient\_context para obtener triage\_info.  
  * **Ensamblar Contexto:** Un nodo de código o "Set" combina toda esta información en un único bloque de texto o JSON estructurado.  
* **Output:** Un objeto JSON o un bloque de texto que contiene todo el contexto necesario, listo para ser inyectado en el prompt de un agente de IA.  
* **Relaciones:**  
  * **Directas:** Es una función de servicio, **llamada directamente por el Flujo 1**.  
  * **Indirectas:** Es un consumidor de los datos generados por los flujos **Flujo 3, Flujo 4 y Flujo 5**. Es el "pegamento" que une toda la información del sistema para hacerla útil en tiempo real.

---

## Plano Doble: "Rápido y humano" vs "Lento y analítico"

- Rápido y humano (izquierda del diagrama): Flujo 1 + sub‑flujo 6. Responde en tiempo real, guarda `{id, timestamp, role, message}` en `messages` y mantiene `conversations.last_message_at`. Usa router para decidir: `checkin | crisis | summary_request | admin | smalltalk`.
- Lento y analítico (derecha del diagrama): Flujos 2 y 3. Se activa por cron o petición del terapeuta, procesa transcripciones completas y produce `InsightReport`. Puede persistir en un almacén de analítica y alimentar de vuelta al bot y al terapeuta.

## Contratos de Datos (resumen)

### Tabla `messages`
```json
{
  "id": "uuid",
  "conversation_id": "uuid",
  "patient_id": "uuid",
  "timestamp": "ISO-8601",
  "role": "patient|bot|system",
  "message": "string"
}
```

### Tabla `conversations`
```json
{
  "id": "uuid",
  "patient_id": "uuid",
  "summary": "string|null",
  "last_message_at": "ISO-8601"
}
```

### ContextPackage (salida del Flujo 6)
```json
{
  "therapist_notes_summary": "string|null",
  "active_tasks": ["string"],
  "triage_info": "string|null",
  "last_conversation_summaries": ["string", "string", "string"]
}
```

### EntrySchema y SummarySchema
- Definidos en `prompts/amelia_user_flow.md` y consumidos por el Flujo 1.

### InsightReport (Flujo 2/3)
```json
{
  "patient_id": "string",
  "period": {"start": "ISO-8601", "end": "ISO-8601"},
  "flags": [{"type": "crisis|risk|none", "evidence": "string", "severity": "low|medium|high"}],
  "maintenance_cycles": [{"pattern": "string", "evidence": ["quote"], "confidence": 0.0}],
  "cognitive_distortions": [{"type": "string", "examples": ["quote"], "confidence": 0.0}],
  "themes": [{"topic": "string", "emotions": ["string"], "snippets": ["quote"]}],
  "metrics": {"messages": {"patient": 0, "bot": 0}},
  "recommendations": {"follow_up_questions": ["string"], "homework_clues": ["string"]},
  "insight_digest_for_agent": ["string"]
}
```

## Especificaciones operativas

- Router conversacional (Flujo 1): crisis siempre domina. `admin` incluye recordatorios, borrar última entrada y modo privado.
- Presupuesto de latencia en tiempo real: p95 < 2.5 s. Presupuesto de tokens por turno: ≤ 600 salida, ≤ 1.2k contexto.
- Persistencia: en crisis, almacenar solo meta‑evento redaccionado (`flags.crisis=true`).
- Idioma: español por defecto; el bot puede reflejar el idioma del paciente si cambia.
- Seguridad: aplicar protocolo de crisis antes de cualquier otra acción.

## Referencias de prompts

- Plantillas operativas en `prompts/guide_prompt.md` (Router, Check‑in, Crisis, Analistas, Agregador).
