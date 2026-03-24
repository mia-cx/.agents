import { describe, it, expect } from "vitest";
import {
  parseRoutingHeaders,
  parseWorkstreamsFromCeoOutput,
  composeMessagingFramingPrompt,
  composeMessagingAssessmentPrompt,
  composeMessagingSynthesisPrompt,
} from "./messaging-prompts.js";
import type { AgentConfig, ParsedBrief } from "./types.js";
import type { AgentContextProjection } from "./messaging-types.js";

const mockAgent: AgentConfig = {
  name: "CTO",
  slug: "cto",
  description: "Technical assessment",
  model: "claude-sonnet-4-6",
  tags: [],
  systemPrompt: "You are the CTO.",
  filePath: "agents/executive-board/cto.md",
};

const mockBrief: ParsedBrief = {
  title: "Test Decision",
  slug: "test-decision",
  content: "Should we build feature X?",
  filePath: "boardroom/briefs/test.md",
  warnings: [],
};

describe("parseRoutingHeaders", () => {
  it("parses TO header", () => {
    const result = parseRoutingHeaders("TO: cto, cfo\nMy analysis is...");
    expect(result.to).toEqual(["cto", "cfo"]);
    expect(result.content).toBe("My analysis is...");
  });

  it("parses REPLY-TO header", () => {
    const result = parseRoutingHeaders("REPLY-TO: msg-0001\nI disagree because...");
    expect(result.replyTo).toBe("msg-0001");
    expect(result.type).toBe("reply");
  });

  it("parses TYPE header", () => {
    const result = parseRoutingHeaders("TYPE: ceo-only\nPrivate concern...");
    expect(result.type).toBe("ceo-only");
  });

  it("parses all headers together", () => {
    const input = "TO: cfo\nREPLY-TO: msg-0003\nTYPE: direct\nThe budget looks concerning.";
    const result = parseRoutingHeaders(input);
    expect(result.to).toEqual(["cfo"]);
    expect(result.replyTo).toBe("msg-0003");
    expect(result.type).toBe("direct");
    expect(result.content).toBe("The budget looks concerning.");
  });

  it("defaults to broadcast when no headers", () => {
    const result = parseRoutingHeaders("Just my general thoughts on the matter.");
    expect(result.to).toEqual([]);
    expect(result.replyTo).toBeNull();
    expect(result.type).toBe("broadcast");
    expect(result.content).toBe("Just my general thoughts on the matter.");
  });

  it("infers direct type from TO header", () => {
    const result = parseRoutingHeaders("TO: cto\nHey CTO, what about the architecture?");
    expect(result.type).toBe("direct");
  });

  it("handles case-insensitive headers", () => {
    const result = parseRoutingHeaders("to: cfo\ntype: request-reply\nPlease respond.");
    expect(result.to).toEqual(["cfo"]);
    expect(result.type).toBe("request-reply");
  });

  it("ignores invalid TYPE values", () => {
    const result = parseRoutingHeaders("TYPE: invalid\nSome content");
    expect(result.type).toBe("broadcast");
  });

  it("strips special characters from TO slugs", () => {
    const result = parseRoutingHeaders("TO: VP of Engineering, Head-of-QA\nContent");
    expect(result.to).toEqual(["vp-of-engineering", "head-of-qa"]);
  });

  it("parses NEW-THREAD header", () => {
    const result = parseRoutingHeaders("NEW-THREAD: Cost Analysis Deep-Dive\nLet me break down the costs...");
    expect(result.newThread).toBe("Cost Analysis Deep-Dive");
    expect(result.content).toBe("Let me break down the costs...");
  });

  it("parses NEW-THREAD with other headers", () => {
    const input = "TO: cfo\nNEW-THREAD: Budget Sub-Topic\nTYPE: direct\nLet's focus on budget.";
    const result = parseRoutingHeaders(input);
    expect(result.to).toEqual(["cfo"]);
    expect(result.newThread).toBe("Budget Sub-Topic");
    expect(result.type).toBe("direct");
    expect(result.content).toBe("Let's focus on budget.");
  });

  it("defaults newThread to null when not present", () => {
    const result = parseRoutingHeaders("Just a regular message.");
    expect(result.newThread).toBeNull();
  });
});

describe("parseWorkstreamsFromCeoOutput", () => {
  it("parses valid workstream JSON", () => {
    const content = `Here is my framing:

\`\`\`json
{
  "workstreams": [
    { "title": "Revenue Impact", "description": "Analyze revenue implications" },
    { "title": "Technical Feasibility", "description": "Evaluate build complexity" }
  ],
  "roster": [
    { "name": "cfo", "reason": "Financial analysis" },
    { "name": "cto", "reason": "Technical assessment" }
  ],
  "rationale": "These two perspectives cover the key decision axes"
}
\`\`\`

Let me elaborate on the key questions...`;

    const result = parseWorkstreamsFromCeoOutput(content);
    expect(result).not.toBeNull();
    expect(result!.workstreams).toHaveLength(2);
    expect(result!.workstreams[0].title).toBe("Revenue Impact");
    expect(result!.roster).toHaveLength(2);
    expect(result!.rationale).toBe("These two perspectives cover the key decision axes");
  });

  it("returns null for no JSON block", () => {
    const result = parseWorkstreamsFromCeoOutput("Just some text without JSON.");
    expect(result).toBeNull();
  });

  it("handles malformed JSON", () => {
    const content = "```json\n{ invalid json }\n```";
    const result = parseWorkstreamsFromCeoOutput(content);
    expect(result).toBeNull();
  });

  it("handles missing fields gracefully", () => {
    const content = '```json\n{ "roster": [{ "name": "cto" }] }\n```';
    const result = parseWorkstreamsFromCeoOutput(content);
    expect(result).not.toBeNull();
    expect(result!.workstreams).toEqual([]);
    expect(result!.roster).toHaveLength(1);
  });
});

describe("composeMessagingFramingPrompt", () => {
  it("includes messaging protocol instructions", () => {
    const prompt = composeMessagingFramingPrompt(mockAgent, mockBrief);
    expect(prompt).toContain("Messaging Model");
    expect(prompt).toContain("workstreams");
    expect(prompt).toContain("broadcast");
    expect(prompt).toContain(mockBrief.title);
  });
});

describe("composeMessagingAssessmentPrompt", () => {
  it("includes thread context and routing instructions", () => {
    const context: AgentContextProjection = {
      relevant_messages: [],
      inbox: [],
      room_summary: "",
      active_threads: [],
    };
    const prompt = composeMessagingAssessmentPrompt(mockAgent, mockBrief, "CEO framing", context, null);
    expect(prompt).toContain("MESSAGING INSTRUCTIONS");
    expect(prompt).toContain("TO:");
    expect(prompt).toContain("REPLY-TO:");
    expect(prompt).toContain("TYPE:");
  });

  it("includes inbox messages when present", () => {
    const context: AgentContextProjection = {
      relevant_messages: [],
      inbox: [{
        id: "msg-0001",
        type: "direct",
        from: "cfo",
        to: ["cto"],
        in_response_to: null,
        thread_id: "thread-001",
        phase: 1,
        round: 1,
        timestamp: new Date().toISOString(),
        content: "Hey CTO, what about costs?",
        token_count: 50,
        cost: 0.01,
        delivery_status: "delivered",
      }],
      room_summary: "",
      active_threads: [],
    };
    const prompt = composeMessagingAssessmentPrompt(mockAgent, mockBrief, "CEO framing", context, null);
    expect(prompt).toContain("Your Inbox");
    expect(prompt).toContain("Hey CTO, what about costs?");
  });
});

describe("composeMessagingSynthesisPrompt", () => {
  it("includes thread summary", () => {
    const threads = [{
      id: "thread-001",
      title: "Revenue Analysis",
      parent_id: null,
      created_by: "ceo",
      created_at: new Date().toISOString(),
      status: "active" as const,
      participants: ["ceo", "cfo"],
      pending_replies: [],
      message_ids: ["msg-0001"],
    }];
    const messages = [{
      id: "msg-0001",
      type: "broadcast" as const,
      from: "ceo",
      to: [],
      in_response_to: null,
      thread_id: "thread-001",
      phase: 1,
      round: 0,
      timestamp: new Date().toISOString(),
      content: "Analyze the revenue impact.",
      token_count: 100,
      cost: 0.05,
      delivery_status: "delivered" as const,
    }];
    const prompt = composeMessagingSynthesisPrompt(mockAgent, mockBrief, "Framing", threads, messages, null);
    expect(prompt).toContain("Thread Summary");
    expect(prompt).toContain("Revenue Analysis");
    expect(prompt).toContain("Analyze the revenue impact");
  });
});
