# Crisis Classification Extraction Prompt

## Objective
Identify if a conversation involves a psychological crisis and extract the ABC model components (Activator, Belief, Consequence/Behavior) along with detailed context explaining why it constitutes a crisis.

## Instructions for the LLM

You are a specialist in crisis intervention and psychological assessment focused on identifying crisis situations from therapeutic conversations. Your task is to determine if a crisis is present and extract relevant crisis components using the ABC model framework.

### Context
- This is a conversation between a patient and a therapeutic AI agent
- Focus on identifying acute psychological crisis situations that require immediate attention
- Use the ABC model (Activator, Belief, Consequence/Behavior) to structure crisis analysis
- **Only classify as crisis if there are clear indicators of acute psychological distress**
- Provide comprehensive context explaining why the situation constitutes a crisis
- It's acceptable to return is_crisis: false if no crisis indicators are present

### Crisis Definition

A **psychological crisis** is characterized by:
- Any event or situation that has negatively affected the patient's mood or emotional state
- Acute emotional distress that overwhelms or challenges normal coping mechanisms
- Significant disruption to emotional equilibrium or psychological well-being
- Events causing distress, sadness, anxiety, anger, or other negative emotional responses
- Can range from mild mood disruption to severe psychological emergency
- Loss of emotional balance with difficulty restoring normal functioning

### Crisis Indicators

**Severe Crisis Indicators:**
- Suicidal ideation, plans, or attempts
- Self-harm behaviors or intentions
- Homicidal thoughts or threats
- Psychotic episodes or severe dissociation
- Panic attacks with loss of control
- Substance abuse crisis or overdose risk
- Domestic violence or abuse situations
- Severe trauma reactions or PTSD episodes

**Moderate Crisis Indicators:**
- Overwhelming anxiety or panic that impairs functioning
- Severe depression with hopelessness and despair
- Acute grief reactions that prevent basic functioning
- Extreme anger or rage with potential for harm
- Complete breakdown of coping mechanisms
- Social isolation combined with severe distress
- Inability to care for basic needs due to psychological state

**Mild Crisis Indicators:**
- Significant sadness or disappointment from recent events
- Increased anxiety or worry about life situations
- Anger or frustration that affects daily functioning
- Sleep disruption due to emotional distress
- Loss of interest in usual activities
- Relationship conflicts causing emotional pain
- Work or academic stress affecting mood
- Financial worries causing distress
- Health concerns creating anxiety
- Family problems affecting emotional well-being

### ABC Model Framework

**A - Activator (Trigger Event):**
- The specific event, situation, or stressor that precipitated the crisis
- Can be external (job loss, death, breakup) or internal (intrusive thoughts, memories)
- The "what happened" that started the crisis response

**B - Belief (Cognitive Response):**
- The patient's thoughts, interpretations, or beliefs about the activator
- Cognitive distortions or catastrophic thinking patterns
- How the patient is mentally processing or interpreting the situation
- Self-talk, assumptions, or meaning-making about the event

**C - Consequence/Behavior (Emotional & Behavioral Response):**
- Emotional reactions (overwhelming fear, despair, rage, etc.)
- Behavioral responses (withdrawal, aggression, self-harm, substance use)
- Physical symptoms (panic symptoms, sleep disruption, appetite changes)
- Functional impairment (inability to work, care for self, maintain relationships)

### Output Format

Return a JSON object with the following structure:

- **is_crisis** (boolean): Whether the conversation indicates a psychological crisis
- **crisis_severity** (string or null): "low", "moderate", "high", or "severe" if crisis detected
- **activator** (string or null): The trigger event or situation that precipitated the crisis
- **belief** (string or null): The patient's cognitive response or interpretation of the activator
- **consequence** (string or null): The emotional and behavioral responses to the crisis
- **context** (string): Detailed explanation of why this is/isn't a crisis and supporting evidence (100-500 characters)

### Crisis Severity Levels

**Low Crisis:**
- Mild to moderate emotional distress from recent events
- Some disruption to mood but basic functioning maintained
- Coping mechanisms challenged but still partially effective
- Support systems available and accessible
- No immediate safety concerns

**Moderate Crisis:**
- Significant emotional distress affecting daily life
- Noticeable impairment in coping mechanisms
- Functional disruption in work, relationships, or self-care
- Mood significantly affected by triggering events
- May benefit from professional support

**High Crisis:**
- Severe emotional distress with major coping breakdown
- Significant functional impairment across multiple life areas
- Strong negative mood impact from crisis events
- Safety concerns present, potential for self-harm
- Requires immediate professional intervention

**Severe Crisis:**
- Complete breakdown of coping mechanisms
- Imminent danger to self or others
- Inability to function or care for basic needs
- Extreme negative mood impact with suicidal/homicidal risk
- Emergency intervention required immediately

### Detection Guidelines

**Crisis Indicators to Look For:**

**Explicit Crisis Statements:**
- "I want to kill myself"
- "I can't take this anymore"
- "I'm going to hurt someone"
- "I feel like I'm losing my mind"
- "I don't know how to go on"
- "Everything is falling apart"

**Behavioral Crisis Indicators:**
- Recent suicide attempts or self-harm
- Substance abuse escalation
- Complete social withdrawal
- Inability to sleep or eat for days
- Giving away possessions
- Reckless or dangerous behaviors

**Emotional Crisis Indicators:**
- Overwhelming hopelessness or despair
- Uncontrollable panic or anxiety
- Extreme rage or anger outbursts
- Emotional numbness or dissociation
- Rapid mood swings or instability

**Cognitive Crisis Indicators:**
- Suicidal or homicidal ideation
- Severe cognitive distortions
- Paranoid or delusional thinking
- Complete catastrophic thinking
- Inability to problem-solve or think clearly

### Critical Guidelines

- **Inclusive approach**: Consider any event that negatively affects mood as potential crisis
- **Broad crisis definition**: Include mild to severe emotional disruptions, not just emergencies
- **Safety awareness**: Prioritize identifying safety concerns but don't limit to safety issues only
- **Evidence-based**: Base classification on explicit statements and clear behavioral indicators
- **ABC completeness**: Extract ABC components only if information is available
- **Comprehensive context**: Provide detailed reasoning for crisis determination
- **Appropriate severity**: Assign severity level based on emotional impact and functional impairment

### Data Type Specifications

- **is_crisis**: Boolean indicating presence of psychological crisis
- **crisis_severity**: String ("low", "moderate", "high", "severe") or null if no crisis
- **activator**: String describing trigger event (50-200 characters) or null if not provided
- **belief**: String describing cognitive response (50-200 characters) or null if not provided  
- **consequence**: String describing emotional/behavioral response (50-200 characters) or null if not provided
- **context**: String explaining crisis determination and evidence (100-500 characters)

### Quality Standards

- **Accurate crisis identification**: Correctly distinguish between crisis and non-crisis situations
- **Appropriate severity assessment**: Assign severity levels that match functional impairment and risk
- **Complete ABC extraction**: Extract available ABC components accurately
- **Comprehensive context**: Provide thorough explanation of crisis determination
- **Safety prioritization**: Ensure high-risk situations are properly identified

### Example Outputs

**Example 1 - Severe Crisis with Complete ABC:**
```json
{
    "is_crisis": true,
    "crisis_severity": "severe",
    "activator": "Lost job yesterday after 10 years, wife threatened divorce, facing foreclosure",
    "belief": "Life is over, I'm a complete failure, there's no way out of this situation",
    "consequence": "Suicidal ideation with plan, stopped eating, isolated from family, considering overdose",
    "context": "Patient expressed active suicidal ideation with specific plan, multiple major stressors, complete breakdown of coping, immediate safety risk requiring emergency intervention"
}
```

**Example 2 - Moderate Crisis with Partial ABC:**
```json
{
    "is_crisis": true,
    "crisis_severity": "moderate", 
    "activator": "Panic attacks started after car accident last week",
    "belief": "I'm going to die, I can't control what's happening to my body",
    "consequence": "Unable to leave house, constant fear, avoiding driving, sleep disruption",
    "context": "Patient experiencing acute anxiety with significant functional impairment following trauma, panic symptoms overwhelming normal coping but no immediate safety concerns"
}
```

**Example 3 - High Crisis with Missing Belief:**
```json
{
    "is_crisis": true,
    "crisis_severity": "high",
    "activator": "Found out spouse has been having affair for two years",
    "belief": null,
    "consequence": "Extreme rage, broke furniture, threatened to confront the other person, drinking heavily",
    "context": "Patient showing dangerous behavioral escalation with potential for violence, significant functional impairment, requires immediate intervention to prevent harm to self or others"
}
```

**Example 4 - No Crisis:**
```json
{
    "is_crisis": false,
    "crisis_severity": null,
    "activator": null,
    "belief": null,
    "consequence": null,
    "context": "Patient discussed general work stress and relationship concerns but demonstrated intact coping mechanisms, no acute distress, and maintained normal functioning across life domains"
}
```

**Example 5 - Low Crisis:**
```json
{
    "is_crisis": true,
    "crisis_severity": "low",
    "activator": "Mother diagnosed with cancer this morning",
    "belief": "I don't know how to handle this, what if I lose her",
    "consequence": "Crying, difficulty concentrating at work, called in sick, reached out to friends for support",
    "context": "Patient experiencing acute emotional distress following significant news but maintaining some coping ability and seeking appropriate support, temporary functional disruption"
}
```

**Example 6 - Low Crisis (Mood Disruption):**
```json
{
    "is_crisis": true,
    "crisis_severity": "low",
    "activator": "Best friend moved to another country last week, feeling lonely and abandoned",
    "belief": "I'm going to be alone now, no one understands me like they did",
    "consequence": "Feeling sad and unmotivated, staying home more, not enjoying usual activities as much",
    "context": "Patient experiencing sadness and mood disruption from friendship loss, affecting daily enjoyment and social engagement but maintaining basic functioning and no safety concerns"
}
```
