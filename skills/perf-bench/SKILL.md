---
name: perf-bench
description: Design or add a focused performance benchmark using the project's established benchmarking tools. Use when the user invokes /perf-bench, asks to benchmark a TODO(perf), create a microbench, compare variants, establish a baseline, or choose Criterion/custom TS/browser benchmark tooling.
---

# Perf Bench

Create the smallest benchmark that can accept or reject one performance hypothesis.

## Workflow

1. Discover existing tooling before inventing any:
   - Rust: prefer existing Criterion benches and `cargo bench` scripts.
   - TypeScript/JS: prefer existing `bench:*` scripts, custom benchmark harnesses, Playwright/browser perf scripts, or project conventions.
   - Other stacks: use whatever benchmark runner already exists.
2. Read nearby benchmarks and package scripts. Match naming, sample sizes, fixtures, output style, and feature flags.
3. Isolate the cost being tested. Add a microbench for scheduling/allocation/bookkeeping; use real-kernel benches only for final confirmation.
4. Include representative cases and one boundary case. Keep the matrix small enough to run repeatedly.
5. Prevent optimizer lies: use black boxes, consume outputs, check correctness when comparing alternative implementations.
6. Add a script if the repo has script aliases; otherwise document the exact command.
7. Run the benchmark once if practical and report baseline numbers.

## Benchmark design template

For each benchmark, record:

```text
Hypothesis: [what could get faster]
Tooling: [existing runner/script]
Command: [exact command]
Cases: [small list and why]
Metric: [time/throughput/allocs/etc.]
Acceptance: [what result would justify a code change]
Final confirmation: [real workload benchmark, if microbench is synthetic]
```

## Defaults

- Prefer microbench first when the TODO is about overhead, scheduling, allocation, caching, parsing, or bookkeeping.
- Prefer real workload first when the TODO changes algorithm choice, I/O, rendering, network behavior, database queries, or user-visible latency.
- Keep benchmark code separate from production code unless the project already embeds benchmark-only helpers.
- Name benchmarks after the subsystem and hypothesis, not the attempted fix.

## Output

End with:

- Files changed.
- Command to run.
- Baseline results if run.
- What result would count as acceptance.
