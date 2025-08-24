# Workflows - Sistema de Procesamiento de Insights

Esta carpeta contiene todos los workflows y configuraciones para el procesamiento automático de insights de conversaciones terapéuticas.

## Estructura

```
workflows/
└── insights/
    ├── conversational/
    │   ├── prompt.md      ← Instrucciones para el LLM
    │   └── schema.json    ← Schema de output esperado
    ├── psychological/
    │   ├── prompt.md      ← Instrucciones para el LLM
    │   └── schema.json    ← Schema de output esperado
    └── emotional/
        ├── prompt.md      ← Instrucciones para el LLM
        └── schema.json    ← Schema de output esperado
```

## Tipos de Insights

### 1. Conversational (Factual)
**Propósito**: Resumen objetivo de hechos y temas discutidos
**Enfoque**: Factual, sin interpretaciones psicológicas
**Output**: Resumen, temas principales, tareas, eventos mencionados

### 2. Psychological (Clínico)
**Propósito**: Análisis psicológico profundo y recomendaciones
**Enfoque**: Progreso terapéutico, patrones de comportamiento
**Output**: Evaluación clínica, factores de riesgo, recomendaciones

### 3. Emotional (Cuantitativo)
**Propósito**: Extracción de datos emocionales y escalas
**Enfoque**: Estado de ánimo, emociones, trayectoria emocional
**Output**: Escala 1-10, emociones identificadas, triggers

## Uso en Cron Jobs

### Flujo de Procesamiento

1. **Obtener Insights Pendientes**
   ```sql
   SELECT * FROM get_pending_insights();
   ```

2. **Para cada insight pendiente:**
   - Leer el prompt correspondiente (`workflows/insights/{type}/prompt.md`)
   - Obtener mensajes de la conversación
   - Enviar al LLM con el prompt + contexto
   - Validar output contra schema (`workflows/insights/{type}/schema.json`)
   - Guardar resultado en base de datos

3. **Completar Insight**
   ```sql
   SELECT complete_insight(insight_id, result_json);
   ```

### Ejemplo de Implementación

```python
import json
from pathlib import Path

def process_insight(insight_id, conversation_id, type_key, config):
    # 1. Cargar prompt
    prompt_path = Path(f"workflows/insights/{type_key}/prompt.md")
    prompt = prompt_path.read_text()
    
    # 2. Cargar schema
    schema_path = Path(f"workflows/insights/{type_key}/schema.json")
    schema = json.loads(schema_path.read_text())
    
    # 3. Obtener mensajes de la conversación
    messages = get_conversation_messages(conversation_id)
    
    # 4. Procesar con LLM
    result = llm_process(prompt, messages, schema)
    
    # 5. Guardar resultado
    complete_insight(insight_id, result)
```

## Configuración de Insights

Cada tipo de insight tiene configuración en la base de datos:

```sql
-- Ver configuración actual
SELECT type_key, display_name, is_active, config 
FROM insight_types;

-- Activar/desactivar tipo
SELECT toggle_insight_type('psychological', false);
```

## Personalización

### Modificar Prompts
- Editar archivos `prompt.md` para ajustar instrucciones
- Mantener estructura y objetivos claros
- Probar cambios con conversaciones de ejemplo

### Actualizar Schemas
- Modificar archivos `schema.json` para cambiar estructura de output
- Validar schemas con herramientas JSON Schema
- Actualizar código de procesamiento si es necesario

### Agregar Nuevo Tipo de Insight

1. Crear carpeta `workflows/insights/{nuevo_tipo}/`
2. Crear `prompt.md` con instrucciones específicas
3. Crear `schema.json` con estructura de output
4. Agregar tipo a base de datos:
   ```sql
   INSERT INTO insight_types (type_key, display_name, config) 
   VALUES ('nuevo_tipo', 'Nuevo Tipo', '{"description": "..."}');
   ```

## Mejores Prácticas

### Prompts Efectivos
- Instrucciones claras y específicas
- Ejemplos de formato esperado
- Limitaciones y restricciones explícitas
- Contexto terapéutico apropiado

### Schemas Robustos
- Validaciones de longitud y formato
- Campos requeridos vs opcionales
- Enums para valores controlados
- Descripciones claras de cada campo

### Procesamiento Confiable
- Validación de output contra schema
- Manejo de errores y reintentos
- Logging de procesamiento
- Monitoreo de calidad de insights
