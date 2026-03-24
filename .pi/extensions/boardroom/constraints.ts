import type { ConstraintSet, ConstraintState } from "./types.js";

export class ConstraintTracker {
  private budgetUsed = 0;
  private startTime: number;
  private roundsUsed = 0;

  constructor(private readonly limits: ConstraintSet) {
    this.startTime = Date.now();
  }

  addCost(amount: number): void {
    this.budgetUsed += amount;
  }

  incrementRound(): void {
    this.roundsUsed++;
  }

  get elapsedMinutes(): number {
    return (Date.now() - this.startTime) / 60_000;
  }

  get budgetState(): ConstraintState {
    const ratio = this.budgetUsed / this.limits.budget;
    if (ratio >= 1) return "exceeded";
    if (ratio >= 0.8) return "warn";
    return "ok";
  }

  get timeState(): ConstraintState {
    const ratio = this.elapsedMinutes / this.limits.time_limit_minutes;
    if (ratio >= 1) return "exceeded";
    if (ratio >= 0.8) return "warn";
    return "ok";
  }

  get roundsState(): ConstraintState {
    if (this.roundsUsed >= this.limits.max_debate_rounds) return "exceeded";
    return "ok";
  }

  canContinue(budgetHardStop: boolean, timeHardStop: boolean): boolean {
    if (this.roundsState === "exceeded") return false;
    if (budgetHardStop && this.budgetState === "exceeded") return false;
    if (timeHardStop && this.timeState === "exceeded") return false;
    return true;
  }

  get summary(): string {
    const budget = `$${this.budgetUsed.toFixed(2)}/$${this.limits.budget}`;
    const time = `${this.elapsedMinutes.toFixed(1)}/${this.limits.time_limit_minutes}min`;
    const rounds = `${this.roundsUsed}/${this.limits.max_debate_rounds} rounds`;
    return `${budget} | ${time} | ${rounds}`;
  }

  get totalCost(): number {
    return this.budgetUsed;
  }

  get currentRound(): number {
    return this.roundsUsed;
  }
}
