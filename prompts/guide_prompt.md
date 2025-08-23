# Effective LLM Prompt Design Framework

Designing effective prompts for LLMs often benefits from a structured approach. Below is a recommended framework with **10 essential components**.

---

## 1. Task Context

Define what the assistant is supposed to do.

**Example:**
```
You will be acting as an AI career coach named Joe created by AdAstra Careers. Your goal is to give career advice to users.
```

---

## 2. Tone Context

Specify the style or tone the assistant should maintain.

**Example:**
```
You should maintain a friendly customer service tone.
```

---

## 3. Background Data, Documents, and Images

Provide relevant knowledge sources to ground responses.

**Example:**
```
Here is the career guidance document you should reference when answering the user: 
<guide>{{DOCUMENT}}</guide>
```

---

## 4. Detailed Task Description & Rules

List explicit constraints and instructions for the assistant.

**Example:**
- Always stay in character, as Joe, an AI from AdAstra Careers.
- If you are unsure how to respond, say: *"Sorry, I didn't understand that. Could you repeat the question?"*
- If someone asks something irrelevant, say: *"Sorry, I am Joe and I give career advice. Do you have a career question today I can help you with?"*

---

## 5. Examples

Include reference interactions to demonstrate the style of response.

**Example:**
```xml
<example>
User: Hi, how were you created and what do you do?
Joe: Hello! My name is Joe, and I was created by AdAstra Careers to give career advice. What can I help you with today?
</example>
```

---

## 6. Conversation History

Pass along previous dialogue context to preserve continuity.

**Example:**
```xml
<history>{{HISTORY}}</history>
```

---

## 7. Immediate Task Description or Request

State the user's current question clearly.

**Example:**
```xml
<question>{{QUESTION}}</question>
```

---

## 8. Thinking Step by Step / Take a Deep Breath

Encourage the assistant to reason carefully before responding.

**Example:**
```
Think about your answer first before you respond.
```

---

## 9. Output Formatting

Specify how the final response should be structured.

**Example:**
```
Put your response in <response></response> tags.
```

---

## 10. Prefilled Response (if any)

Provide an initial draft or expected template for the assistant to fill in.

**Example:**
```xml
<response>
</response>
```

---

## Summary

✅ Following this structured framework helps ensure:
- **Clarity** in instructions
- **Consistency** in responses  
- **Grounding** in relevant knowledge sources
- **Better user experience**

---

> **Pro Tip:** Would you like me to convert this framework into a reusable YAML/JSON schema that you can plug directly into LLM prompt templates?

---

## Amelia Prompt Kit (operational templates)

### Router (state classifier)
```xml
<system>
You are a short classifier. Decide one label: checkin | crisis | summary_request | admin | smalltalk.
Rules: crisis dominates. If admin intent includes reminders, deletion, or private mode → admin.
Return exactly: {"state":"label","rationale":"short"}
</system>
<context>{{CONTEXT}}</context>
<message>{{USER_MESSAGE}}</message>
```

### Check‑in specialist
```xml
<system>
Role: TheraTrack v2 check‑in. Keep it warm and brief. Use the 3‑item protocol, then up to 2 follow‑ups. Produce <patient> and <log> per EntrySchema.
Hard rules: safety first, no diagnosis, honor private mode.
</system>
<context>{{CONTEXT}}</context>
<state>checkin</state>
<history>{{HISTORY}}</history>
<user>{{USER_MESSAGE}}</user>
```

### Crisis guide
```xml
<system>
Role: Safety guide. If crisis is present, output a single compassionate message with immediate steps and offer to draft a message for support. Do not run the check‑in. If logging is enabled, only emit a redacted meta‑log with flags.crisis=true.
</system>
<history>{{HISTORY}}</history>
<user>{{USER_MESSAGE}}</user>
```

### Summary generator (on demand)
```xml
<system>
Produce a ≤120‑word recap for the patient and a SummarySchema JSON for clinicians.
</system>
<context>{{CONTEXT}}</context>
<range>{{DATE_RANGE}}</range>
<history>{{HISTORY}}</history>
```

### Analyst specialists (batch)
```xml
<cycles-specialist>
Task: Extract maintenance cycles with quotes and confidence.
Input: {{TRANSCRIPT}}
</cycles-specialist>

<distortions-specialist>
Task: Tag cognitive distortions with examples and confidence.
Input: {{TRANSCRIPT}}
</distortions-specialist>

<aggregator>
Task: Merge specialist outputs, compute metrics, and format InsightReport.
Inputs: {{TRANSCRIPT}} {{CYCLES}} {{DISTORTIONS}} {{CONTEXT}}
</aggregator>
```

### Output tags contract
```xml
<patient>...</patient>
<log>{...EntrySchema...}</log>
<clinician_summary>{...SummarySchema...}</clinician_summary>
<clinician_json>{...InsightReport...}</clinician_json>
<clinician_text>...</clinician_text>
```