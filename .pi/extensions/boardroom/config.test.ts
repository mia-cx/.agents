import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { loadConfig, resolveConstraints } from "./config.js";

describe("config", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "boardroom-test-"));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  describe("loadConfig", () => {
    it("returns defaults when config file is missing", () => {
      const config = loadConfig(tmpDir);
      expect(config.default_constraints).toBe("thorough");
      expect(config.default_mode).toBe("freeform");
      expect(config.default_messaging_mode).toBe("fanout");
      expect(config.budget_hard_stop).toBe(true);
      expect(config.time_hard_stop).toBe(false);
      expect(Object.keys(config.constraints)).toEqual(["quick", "standard", "thorough", "deep-dive"]);
    });

    it("loads config from YAML", () => {
      const configDir = path.join(tmpDir, "boardroom");
      fs.mkdirSync(configDir, { recursive: true });
      fs.writeFileSync(path.join(configDir, "config.yaml"), [
        "default_constraints: quick",
        "default_mode: structured",
        "default_messaging_mode: threading",
        "budget_hard_stop: false",
      ].join("\n"));

      const config = loadConfig(tmpDir);
      expect(config.default_constraints).toBe("quick");
      expect(config.default_mode).toBe("structured");
      expect(config.default_messaging_mode).toBe("threading");
      expect(config.budget_hard_stop).toBe(false);
      expect(config.constraints.thorough.budget).toBe(25);
    });

    it("survives invalid YAML", () => {
      const configDir = path.join(tmpDir, "boardroom");
      fs.mkdirSync(configDir, { recursive: true });
      fs.writeFileSync(path.join(configDir, "config.yaml"), "not: [valid: yaml: {{");

      const config = loadConfig(tmpDir);
      expect(config.default_constraints).toBe("thorough");
    });
  });

  describe("resolveConstraints", () => {
    const config = loadConfig("/nonexistent");

    it("uses default constraints when none specified", () => {
      const { name, values } = resolveConstraints(config);
      expect(name).toBe("thorough");
      expect(values.budget).toBe(25);
      expect(values.time_limit_minutes).toBe(60);
      expect(values.max_debate_rounds).toBe(8);
    });

    it("resolves named constraints", () => {
      const { values } = resolveConstraints(config, "quick");
      expect(values.budget).toBe(5);
      expect(values.time_limit_minutes).toBe(15);
      expect(values.max_debate_rounds).toBe(2);
      expect(values.max_roster_size).toBe(4);
    });

    it("applies overrides on top of constraints", () => {
      const { values } = resolveConstraints(config, "standard", { budget: 25 });
      expect(values.budget).toBe(25);
      expect(values.time_limit_minutes).toBe(30);
    });

    it("caps max_debate_rounds at 50", () => {
      const { values } = resolveConstraints(config, "thorough", { max_debate_rounds: 99 });
      expect(values.max_debate_rounds).toBe(50);
    });

    it("falls back to thorough for unknown constraints", () => {
      const { values } = resolveConstraints(config, "nonexistent");
      expect(values.budget).toBe(25);
    });
  });
});
