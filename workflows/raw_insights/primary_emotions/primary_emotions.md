# Primary Emotions Extraction Prompt

## Objective
Extract the 6 primary emotions from patient-agent therapeutic conversations in a simple JSON array format.

## Instructions for the LLM

You are a specialist in emotional analysis focused on identifying the 6 basic emotions defined by Paul Ekman. Your task is to extract these primary emotions from therapeutic conversations and return them as a simple JSON array.

### Context
- This is a conversation between a patient and a therapeutic AI agent
- Focus ONLY on the 6 primary emotions: **joy, sadness, anger, fear, surprise, disgust**
- **DO NOT extract all 6 emotions** - only extract those that actually appear with clear evidence
- Look for both explicit mentions and implicit emotional expressions  
- Return ONLY a JSON object with a "primary_emotions" array
- **Be objective - do not force interpretations or assume emotions that aren't clearly present**
- It's perfectly acceptable to return an empty array if no clear emotions are detected

### The 6 Primary Emotions

1. **Joy/Happiness**: Pleasure, contentment, satisfaction, accomplishment, hope
2. **Sadness**: Sorrow, melancholy, grief, disappointment, despair  
3. **Anger**: Irritation, frustration, rage, resentment, annoyance
4. **Fear**: Anxiety, worry, panic, nervousness, dread, concern
5. **Surprise**: Astonishment, amazement, wonder, shock (positive or negative)
6. **Disgust**: Revulsion, contempt, aversion, distaste (physical or moral)

### Output Format

Return a JSON object with a single "primary_emotions" array. For each detected emotion, provide:

- **emotion** (string): One of exactly these 6 values: "joy", "sadness", "anger", "fear", "surprise", "disgust"
- **intensity** (integer): Number from 1-10 (1=very low, 10=extremely high)  
- **context** (string): Why this emotion is present (10-200 characters)
- **trigger** (string): What caused this emotion - optional field

### Detection Guidelines

**Look for these indicators:**

**Explicit Indicators:**
- "I feel scared/happy/angry/sad..."  
- "I'm worried about..."
- "That made me so frustrated..."
- "I was shocked when..."
- "I'm disgusted by..."
- "I felt joyful..."

**Implicit Indicators:**
- Language tone and word choice
- Behavioral descriptions that suggest emotions
- Physiological responses (crying, tension, excitement)
- Changes in speech patterns or energy
- Avoidance or approach behaviors

**Intensity Scale (1-10):**
- **1-2**: Barely noticeable, minimal impact on discourse
- **3-4**: Present but subtle, doesn't dominate conversation
- **5-6**: Noticeable and affects conversation flow
- **7-8**: Strong and clearly impactful
- **9-10**: Extremely intense, dominates or overwhelms other content

### Critical Guidelines - Be Objective

- **ONLY include emotions with clear, unmistakable evidence** - do not guess or assume
- **DO NOT try to find all 6 emotions** - most conversations will only show 1-3 emotions clearly
- **Focus on the patient's emotions**, not the agent's responses
- **If uncertain about an emotion, do NOT include it** - better to miss one than to add a false positive
- **Empty array is perfectly valid** - if no clear emotions are present, return an empty array
- **Avoid complex emotions** - stick strictly to the 6 basic ones
- **Consider the full context** but don't overinterpret subtle cues

### Data Type Specifications

- **emotion**: Must be exactly one of these strings: "joy", "sadness", "anger", "fear", "surprise", "disgust"
- **intensity**: Integer between 1 and 10 (inclusive)
- **context**: String between 10-200 characters explaining why this emotion was detected
- **trigger**: String up to 150 characters describing what caused the emotion (optional)

### Quality Standards

- **High confidence threshold**: Each detected emotion must have clear, undeniable evidence
- **Specific context required**: Each emotion should have a concrete, specific context explanation
- **Accurate intensity**: Intensity levels should reflect actual emotional impact, not assumptions
- **Conservative approach**: When in doubt, don't include the emotion
- **Quality over quantity**: Better to detect 1-2 emotions accurately than force 4-5 questionable ones
- **Objective analysis**: Base decisions on what's explicitly stated or clearly implied, not on therapeutic assumptions

### Example Outputs

**Example 1 - Multiple clear emotions:**
```json
{
    "primary_emotions": [
        {
            "emotion": "fear",
            "intensity": 6,
            "context": "Patient explicitly said 'I'm terrified of losing my job' and described physical anxiety symptoms",
            "trigger": "Company restructuring and layoff announcements"
        },
        {
            "emotion": "sadness", 
            "intensity": 8,
            "context": "Patient cried when discussing family distance and said 'I feel so alone and hopeless'",
            "trigger": "Living far from family support system"
        }
    ]
}
```

**Example 2 - Single emotion:**
```json
{
    "primary_emotions": [
        {
            "emotion": "joy",
            "intensity": 7,
            "context": "Patient smiled and said 'I'm so happy and proud' when describing their recovery milestone",
            "trigger": "Achieving 30 days of sobriety"
        }
    ]
}
```

**Example 3 - No clear emotions detected:**
```json
{
    "primary_emotions": []
}
```
