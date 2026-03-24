import { describe, expect, it } from "vitest";
import { getAbortDisposition } from "./meeting.js";

describe("getAbortDisposition", () => {
  it("treats force-close abort reasons distinctly", () => {
    const controller = new AbortController();
    controller.abort("force-close");

    expect(getAbortDisposition(controller.signal)).toBe("force-closed");
  });

  it("falls back to aborted for other aborts", () => {
    const controller = new AbortController();
    controller.abort();

    expect(getAbortDisposition(controller.signal)).toBe("aborted");
  });
});
