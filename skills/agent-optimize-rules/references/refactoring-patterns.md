## Three Refactoring Patterns

### Pattern 1: Vague → Specific

Replace adjectives and instructions with concrete, actionable steps.

**Before:**

```text
Be concise. Don't ramble. Use good formatting.
```

**After:**

```text
1. Write short sentences. One idea per sentence.
2. Use headings, lists, tables for scannability.
3. Skip filler intros ("In this document...", "It is important to note...").
4. Prefer concrete nouns and active voice.
```

---

### Pattern 2: Negative → Positive

Reframe as desired behavior, not forbidden action. Negative instructions make models fixate on the forbidden action.

**Before:**

```text
DO NOT ASK FOR INTERESTS. DO NOT ASK FOR PERSONAL INFORMATION.
```

**After:**

```text
Recommend from top global trending items. If user asks for preferences, respond: "I can't store preferences, but here are today's trending picks..."
```

---

### Pattern 3: Imprecise → Precise

Add concrete targets: audience, length, examples, constraints.

**Before:**

```text
Explain the concept. Keep it short, don't be too descriptive.
```

**After:**

```text
Use 2–3 sentences. Target: high school student. Include one concrete example.
```

---
