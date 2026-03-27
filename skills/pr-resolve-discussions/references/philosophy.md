## Philosophy

Codebases are the training data for every future AI interaction in the repo. Placeholder fixes, swallowed errors, `any` casts, dead branches, and "good enough" patches don't just accumulate tech debt — they actively degrade the quality of every future LLM-assisted change. A reviewer who flags structural rot is doing you a favour. Treat their findings as leads on systemic problems, not annoyances to dismiss.

**Prefer architectural, deep fixes over quick & cheap.** If a reviewer points out a bad error path, don't just add a null check — trace the error contract through the module boundary, fix the abstraction, and make the bad state unrepresentable. The goal is to leave the code in a state where the class of bug can't recur, not just where this instance is patched.
