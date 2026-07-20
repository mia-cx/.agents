---
name: perf-search
description: Find performance-improvement opportunities and mark them as dependency-ranked TODO(perf) comments in code. Use when the user invokes /perf-search, asks to scan for perf opportunities, add performance TODOs, identify hot paths, annotate code with benchmarkable optimization ideas, or prepare work for perf-loop.
---

# Perf Search

Add `TODO(perf)` comments for plausible performance upside and rank them by dependency-aware exploration order. Be exhaustive by default, but start from the current code with no legacy/prior-art context so old patterns do not bias the inventory. Preserve the full search inventory: parent prerequisites, dependent leaf ideas, benchmark gaps, and "maybe later" low-level experiments. Foundational TODOs should come first, but dependent leaf ideas should remain visible with explicit blockers.

## Workflow

1. Search the current codebase first with no legacy/prior-art context: hot paths, benchmark harnesses, manifest profiles, profiling notes, existing `TODO(perf)`/`REJECT(perf)`, tight loops, allocation-heavy code, scheduling, I/O, rendering, serialization, image/audio/video processing, and production/user-facing paths.
2. Read surrounding current code before annotating.
3. Treat `REJECT(perf)` as closed. Do not retry the same idea unless new conditions materially change the experiment: new harness/profile, new fixtures, changed data layout/API, fixed oracle, different cache/sample mode, or different production workload. If new conditions justify retesting, say so in the TODO.
4. Build a small dependency map for the target area before writing TODOs.
5. Add parent TODOs at the highest useful scope first: benchmark/oracle, API boundary, allocation strategy, data layout, algorithm/path selection, then kernels.
6. Add child TODOs for plausible leaf opportunities too. If a child depends on an unsettled parent, keep it and mark `after perf:<level> <parent-name>` instead of omitting it.
7. Do a second no-context exhaustiveness pass before editing: enumerate every plausible idea found from the current code, then explicitly choose TODO, REJECT note, or skip-with-reason. Do not stop after the first few high-confidence TODOs.
8. Only search prior art when the user explicitly asks, when current-code TODOs are already captured, or when a TODO needs historical context to avoid repeating closed work. Keep prior-art findings separate from the initial no-context inventory.
9. Assign `rank=N` to every TODO. Rank by dependency order first, expected upside second, implementation risk third. Use unique ranks within the searched scope unless there is a deliberate tie.
10. Phrase every TODO as a testable hypothesis, including the benchmark/profile that should judge it.
11. Avoid behavior changes unless the user explicitly asks.
12. Run the narrowest cheap validation for comment-only changes when available.
13. Commit the TODO-only checkpoint before ending. Stage only TODO/comment/doc changes from the search pass.
14. Summarize added TODOs with file refs, dependency level, rank, blocker, benchmark/profile, validation, and checkpoint commit hash. If prior art was used, call that out separately from no-context findings.

## Dependency-first search order

Classify opportunities in this order:

1. `perf:harness` — benchmark correctness, oracle failures, representative fixtures, sample/cache mode, baseline hygiene.
2. `perf:api` — public/internal boundaries, caller-owned buffers, cache/plan ownership, validation boundaries.
3. `perf:layout` — data layout, precomputed metadata, scratch buffers, memory locality, reusable plans.
4. `perf:path` — algorithm choice and top-level strategy split by input/scale/shape class.
5. `perf:kernel` — hot-loop specialization, branch removal, tiling, SIMD/vectorization, scheduling.
6. `perf:micro` — arithmetic tweaks, reciprocal/division changes, tiny helper inlining, bounds/math cleanup.

Prefer testing the highest unresolved level first. Still record lower-level ideas when they are concrete and benchmarkable; mark dependencies so perf-loop does not start them too early.

## Exhaustiveness standard

A perf-search pass is an inventory, not a shortlist. For the requested scope, first add TODOs for every concrete, benchmarkable hypothesis visible from the current code alone, even when:

- it is dependent on an unresolved parent; mark `after ...`.
- it is lower expected upside; rank it later.
- it is risky because of correctness; include the correctness requirement and acceptance condition.
- it probably loses but materially changed conditions make one retest worthwhile; state the changed condition.

Do not consult old implementations, deleted code, or sibling prototypes during the initial pass. Prior art is a separate optional pass: use it only when requested or when needed to interpret an existing `REJECT(perf)`. If prior art adds TODOs, label them as such in wording and rank them after the no-context prerequisites unless they reveal a missing foundation.

Only omit ideas that are pure vibes, untestable, already closed by still-applicable `REJECT(perf)`, or contrary to project constraints. When omitting a tempting idea because it is closed, prefer a nearby `REJECT(perf)`/`NOTE(perf)` if future agents are likely to rediscover it.

## Benchmark references in TODOs

Name the benchmark that should judge the hypothesis.

For Ditherette's custom harness, prefer manifest profiles:

```rust
// TODO(perf:path, rank=1): Split resize dispatch by scale class so nearest can
// use simpler downscale/upscale loops. Benchmark with `ditherette-bench run
// nearest` using the manifest profile.
```

If correctness needs a specific oracle, state that requirement:

```rust
// TODO(perf:kernel, rank=3, after perf:path resize-scale-classes): Specialize
// the nearest exact-scale loop once path dispatch is settled. Verify against the
// configured nearest oracle, then benchmark `ditherette-bench run nearest`.
```

For non-Ditherette projects, reference the established runner/script exactly:

```rust
// TODO(perf:layout, rank=2): Reuse the parsed route trie between requests.
// Benchmark with `pnpm bench:router`.
```

## Parent/child TODO shape

Use level tags, ranks, and blockers:

```rust
// TODO(perf:layout, rank=1): Precompute x/y resize metadata into a reusable
// plan so kernels share cache-friendly coordinates. Benchmark with
// `ditherette-bench run bilinear`.
```

```rust
// TODO(perf:kernel, rank=4, after perf:layout resize-plan): Specialize two-tap
// x coverage once the plan shape is fixed. Benchmark with the configured
// profile.
```

If several leaf ideas depend on one parent, write both parent and child TODOs. Mark each child with `after ...` so execution order is clear:

```rust
// TODO(perf:path, rank=1): Decide exact-integer, fractional-minify, and upscale
// resize paths before benchmarking row-kernel variants; path choice may replace
// several kernels.

// TODO(perf:kernel, rank=5, after perf:path resize-paths): Specialize exact
// row copies if the path split keeps this loop hot. Benchmark `run nearest`.
```

## Ditherette custom harness notes

When `crates/ditherette-bench/` exists, use its behavior in TODOs and summaries:

- Profiles live in `crates/ditherette-bench/ditherette-bench.toml` and are invoked with `run <profile>`.
- Manifest profiles are the source of truth for fixtures, scales, sample settings, oracles, and baselines.
- TODOs should name the manifest profile to run, not alternate one-off benchmark settings.
- New accepted baselines use the project's established save/promote workflow.
- Result artifacts live under `crates/ditherette-bench/target/bench/`.
- Avoid telling perf-loop to clear Criterion cache for Ditherette's harness; it has explicit strict baselines.

Good TODO benchmark hints:

```text
ditherette-bench run nearest
ditherette-bench run area
ditherette-bench run bilinear
```

## Checkpoint commit

Perf-search produces a planning artifact. Commit it separately before implementation work:

```sh
git add <files-with-new-TODOs>
git commit -m "docs(perf): mark <scope> perf leads" \
  -m "Records benchmarkable performance hypotheses before implementation work so perf-loop changes can be accepted or reverted cleanly."
```

Do not include behavior changes in this checkpoint. If you accidentally changed code while adding TODOs, split the diff or revert the behavior change first.

## Coverage

Add TODOs for all plausible improvements you can identify, including foundational and leaf-level ideas:

- Benchmark/oracle/profile gaps that make optimization unsafe.
- Missing representative fixtures, sample/cache modes, or baseline hygiene.
- Public/internal API shape, caller-owned buffers, reusable plans, cache ownership.
- Repeated allocation, cloning, copying, conversions, formatting, or parsing.
- Data layout, memory access, cache locality, precomputed metadata, scratch reuse.
- Algorithm/path selection by input size, scale class, shape, hot/cold path, or exact cases.
- Parallelism, scheduling, locking, atomics, async/task overhead, channel overhead, CPU affinity/priority effects.
- Loops that recompute invariant work or perform avoidable bounds/math work.
- Kernel specialization, SIMD/vectorization, GPU/Wasm/native boundary opportunities.
- I/O, network, database, filesystem, subprocess, serialization, compression, rendering, DOM, canvas, startup/cold-path costs.

Skip pure style changes, impossible-to-benchmark vibes, already-closed `REJECT(perf)` ideas, or changes that trade away correctness/readability with no plausible upside. When in doubt, add both the parent TODO and a dependent child TODO, then rank them so perf-loop starts in the right place.
