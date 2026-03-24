import * as fs from "node:fs";
import * as path from "node:path";
import yaml from "js-yaml";
import type { BoardroomConfig, ConstraintSet } from "./types.js";

const DEFAULT_CONFIG: BoardroomConfig = {
  default_constraints: "thorough",
  default_mode: "freeform",
  default_messaging_mode: "fanout",
  budget_hard_stop: true,
  time_hard_stop: false,
  constraints: {
    quick: { budget: 5, time_limit_minutes: 15, max_debate_rounds: 2, max_roster_size: 4 },
    standard: { budget: 10, time_limit_minutes: 30, max_debate_rounds: 4 },
    thorough: { budget: 25, time_limit_minutes: 60, max_debate_rounds: 8 },
    "deep-dive": { budget: 500, time_limit_minutes: 240, max_debate_rounds: 20 },
  },
};

const MAX_ROUNDS_CAP = 50;

export function loadConfig(cwd: string): BoardroomConfig {
  const configPath = path.join(cwd, "boardroom", "config.yaml");
  if (!fs.existsSync(configPath)) {
    return { ...DEFAULT_CONFIG };
  }
  try {
    const raw = fs.readFileSync(configPath, "utf-8");
    const parsed = yaml.load(raw) as Partial<BoardroomConfig> | null;
    if (!parsed || typeof parsed !== "object") return { ...DEFAULT_CONFIG };

    return {
      default_constraints: parsed.default_constraints ?? DEFAULT_CONFIG.default_constraints,
      default_mode: parsed.default_mode ?? DEFAULT_CONFIG.default_mode,
      default_messaging_mode: parsed.default_messaging_mode ?? DEFAULT_CONFIG.default_messaging_mode,
      budget_hard_stop: parsed.budget_hard_stop ?? DEFAULT_CONFIG.budget_hard_stop,
      time_hard_stop: parsed.time_hard_stop ?? DEFAULT_CONFIG.time_hard_stop,
      constraints: { ...DEFAULT_CONFIG.constraints, ...parsed.constraints },
    };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

export function resolveConstraints(
  config: BoardroomConfig,
  constraintsName?: string,
  overrides?: { budget?: number; time_limit_minutes?: number; max_debate_rounds?: number },
): { name: string; values: ConstraintSet } {
  const name = constraintsName ?? config.default_constraints;
  const base = config.constraints[name] ?? config.constraints[config.default_constraints] ?? DEFAULT_CONFIG.constraints.thorough;

  const values: ConstraintSet = {
    budget: overrides?.budget ?? base.budget,
    time_limit_minutes: overrides?.time_limit_minutes ?? base.time_limit_minutes,
    max_debate_rounds: Math.min(overrides?.max_debate_rounds ?? base.max_debate_rounds, MAX_ROUNDS_CAP),
    max_roster_size: base.max_roster_size,
  };

  return { name, values };
}
