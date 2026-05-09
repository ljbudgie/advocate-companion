import { describe, expect, it } from "vitest";
import { burgessCopilotInternals } from "./burgessCopilot";

describe("burgess copilot response parsing", () => {
  it("normalizes legacy text responses into structured metadata", () => {
    const response = burgessCopilotInternals.parseStructuredResponse({
      response: "Please consider my individual circumstances rather than applying a blanket policy.",
    });

    expect(response.messageText).toContain("individual circumstances");
    expect(response.burgess.blanketPolicyDetected).toBe(true);
    expect(response.nextSteps).toEqual([]);
  });

  it("preserves structured AI fields", () => {
    const response = burgessCopilotInternals.parseStructuredResponse({
      messageText: "Could you explain the reason in writing?",
      burgess: {
        sovereignQuestionAsked: true,
        blanketPolicyDetected: false,
        reasonsRequested: true,
        blanketPolicyLikelihood: "medium",
      },
      nextSteps: ["Record the response"],
      riskFlags: ["Time-sensitive"],
      citations: ["Equality Act 2010"],
    });

    expect(response.nextSteps).toEqual(["Record the response"]);
    expect(response.riskFlags).toEqual(["Time-sensitive"]);
    expect(response.citations).toEqual(["Equality Act 2010"]);
  });
});
