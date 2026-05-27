---
name: perf-loop
description: Run a dependency-first benchmark-driven performance optimization loop over TODO(perf) items using the project's explicit accepted baseline workflow. Use when the user invokes /perf-loop, asks to work through perf TODOs, optimize with benchmarks, compare candidates, accept/reject benchmarked changes, or refresh explicit baselines with ditherette-bench/Criterion/custom harnesses.
---

# Perf Loop

Optimize `TODO(perf)` items one hypothesis at a time. Correctness gates the change; benchmarks decide whether it stays.

Ditherette has three separate benchmark phases:

1. **Setup baseline** before candidate edits: create/refresh `accepted` once only when needed.
2. **Candidate compare** after edits: run the manifest profile exactly as configured.
3. **Promote accepted result** after an `ACCEPT` decision: replace `accepted` from the latest measured run.

## Core loop

1. Inventory `TODO(perf)` comments in the requested scope.
2. Parse `rank=N`, level (`harness`, `api`, `layout`, `path`, `kernel`, `micro`), benchmark/profile, and `after ...` blockers.
3. Pick the lowest-rank unblocked TODO with an existing benchmark.
4. Commit any pending TODO-only search checkpoint before implementation.
5. Start from a known baseline: use the existing `accepted` baseline. If the user asks to refresh it, or no compatible baseline exists, run the setup baseline command before candidate edits.
6. Implement the smallest change that tests the selected hypothesis.
7. Run correctness first.
8. Run the focused benchmark using the configured profile as-is. This is the candidate comparison.
9. Decide: `ACCEPT`, `REJECT`, `DEFER`, or `CLOSE`.
10. Leave `accepted` unchanged for `REJECT`/`DEFER`/`CLOSE`; promote only after `ACCEPT`.

## Running benchmark commands

Use the Bash tool timeout `9000` for benchmark commands so they stay foregrounded instead of auto-backgrounding and forcing repeated polling/sleep commands.

Example tool call settings:

```text
command: cargo run --release --manifest-path crates/ditherette-bench/Cargo.toml -- run <profile>
timeout: 9000
```

Do not poll long benchmark runs with separate `sleep`/log-tail commands unless the benchmark is already backgrounded by mistake or the user asks for progress.

## Ditherette baseline phases

### 1. Setup baseline: before candidate edits only

Run this once at the start of a perf-loop when the user asks for a refresh or no compatible `accepted` baseline exists. Use Bash timeout `9000`:

```sh
cargo run --release --manifest-path crates/ditherette-bench/Cargo.toml -- \
  run <profile> --save-baseline accepted
```

After implementation starts, the setup phase is over.

### 2. Candidate compare: after edits, before decision

Use the manifest profile exactly as configured. Use Bash timeout `9000`:

```sh
cargo run --release --manifest-path crates/ditherette-bench/Cargo.toml -- \
  run <profile>
```

This is the only benchmark command for deciding `ACCEPT`, `REJECT`, `DEFER`, or `CLOSE`.

### 3. Promote accepted result: after `ACCEPT` only

Promote the latest measured candidate run. Use Bash timeout `9000`:

```sh
cargo run --release --manifest-path crates/ditherette-bench/Cargo.toml -- \
  run <profile> --replace-baseline accepted
```

Ditherette scopes generated baseline artifacts by compatible run config, so the single human name `accepted` covers different profiles/configs.

## Benchmark runner choice

Prefer the project's established runner:

1. Ditherette custom harness profiles:
   ```sh
   cargo run --release --manifest-path crates/ditherette-bench/Cargo.toml -- run <profile>
   ```
2. Existing package/cargo scripts around the runner.
3. Existing Criterion benches.
4. A new focused benchmark via `/perf-bench` when no suitable benchmark exists.

Run the manifest profile exactly as configured unless the user explicitly asks for a different command. Keep benchmark selection in the manifest profile.

## Candidate measurement

After editing one hypothesis, run benchmarks with Bash timeout `9000`:

```sh
# example correctness command; use the narrowest relevant project check
cargo test --manifest-path crates/ditherette-wasm/Cargo.toml --test <test-name>

cargo run --release --manifest-path crates/ditherette-bench/Cargo.toml -- \
  run <profile>
```

Read benchmark deltas as speed-relative percentages. Check important cases, p95, and stdev; use the mean/median table as evidence, not decoration.

## Decisions

### ACCEPT

Use when correctness passes and representative cases improve meaningfully.

Steps:

1. Remove the accepted `TODO(perf)` or narrow it to the next untested hypothesis.
2. Commit the code and TODO update as one accepted unit.
3. Promote the latest measured candidate run:
   ```sh
   cargo run --release --manifest-path crates/ditherette-bench/Cargo.toml -- \
     run <profile> --replace-baseline accepted
   ```
4. Report that `accepted` was refreshed.

### REJECT

Use when correctness fails, representative cases regress, or results are neutral/noisy.

Steps:

1. Revert only the attempted implementation diff, preserving TODO inventory and unrelated files.
2. Convert the TODO to a `REJECT(perf)` note when the result prevents repeated work; otherwise delete the TODO.
3. Keep the existing `accepted` baseline unchanged.
4. Optionally sanity-check restored state with the configured benchmark profile.

Example:

```rust
// REJECT(perf): Pre-summing full x spans as u32 changed rounding for fractional
// area scales and regressed represented cases in `ditherette-bench run area`.
```

### DEFER

Use when the idea remains plausible but needs a higher-level decision or better benchmark coverage. Replace the TODO with the blocker and the next condition to revisit.

### CLOSE

Use when a parent decision makes the TODO irrelevant. Remove it or replace it with the accepted parent rationale.

## Dependency order

Work by explicit rank first. When rank is absent or tied, use this order:

1. `harness` — benchmark correctness, oracle failures, representative fixtures, sample/cache mode, baseline hygiene.
2. `api` — internal boundaries, caller-owned buffers, cache/plan ownership, validation boundaries.
3. `layout` — precomputed metadata, scratch buffers, memory locality, reusable plans.
4. `path` — algorithm choice by scale/shape/input class.
5. `kernel` — hot-loop specialization, branch removal, tiling, SIMD/vectorization, scheduling.
6. `micro` — arithmetic tweaks, reciprocal/division changes, inlining, bounds/math cleanup.

Foundation gate before editing:

```text
What parent decision could make this TODO irrelevant?
```

If the answer names an unresolved parent, work the parent first or defer the child.

## Repo hygiene

- Keep one hypothesis per benchmark decision.
- Use targeted edits/reverts that preserve unrelated work and TODO markers.
- Commit after each accepted unit.
- Keep rejected attempts out of the code except for concise `REJECT(perf)` knowledge.
- Use representative real fixtures/scale groups for final acceptance. Treat tiny synthetic runs as smoke tests only.
- Phase-gate baseline commands: setup uses `--save-baseline`; candidate comparison uses plain `run <profile>`; accepted promotion uses `--replace-baseline`.

## Reporting format

Report each attempted TODO as:

```text
TODO | rank | level | blocker | profile | attempted change | result | decision | commit
```

Include:

- correctness command/result
- benchmark command
- speed-relative summary
- key regressions/noise notes
- `--replace-baseline accepted` command for accepted changes
