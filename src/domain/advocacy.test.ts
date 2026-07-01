import { describe, expect, it } from "vitest";
import { classifyBurgess, inferBurgessMetadata } from "./advocacy";

describe("inferBurgessMetadata", () => {
  it("detects blanket-policy language and individual consideration requests", () => {
    const metadata = inferBurgessMetadata(
      "Please consider my individual circumstances rather than applying a blanket policy. Can I have the reasons in writing?",
    );

    expect(metadata.blanketPolicyDetected).toBe(true);
    expect(metadata.sovereignQuestionAsked).toBe(true);
    expect(metadata.reasonsRequested).toBe(true);
    expect(metadata.blanketPolicyLikelihood).toBe("high");
  });

  it("assigns a three-outcome classification to every inference", () => {
    const metadata = inferBurgessMetadata("Everyone has to follow the same rule, no exceptions.");
    expect(["SOVEREIGN", "NULL", "AMBIGUOUS"]).toContain(metadata.classification);
  });
});

describe("classifyBurgess", () => {
  const base = {
    sovereignQuestionAsked: false,
    blanketPolicyDetected: false,
    decisionMakerIdentified: false,
    reasonsRequested: false,
    alternativesConsidered: false,
    blanketPolicyLikelihood: "low" as const,
    auditNotes: [] as string[],
  };

  it("returns SOVEREIGN when a named decision-maker considered the individual case", () => {
    expect(
      classifyBurgess({ ...base, decisionMakerIdentified: true, sovereignQuestionAsked: true }),
    ).toBe("SOVEREIGN");
  });

  it("returns NULL when a blanket policy is applied without individual review", () => {
    expect(classifyBurgess({ ...base, blanketPolicyDetected: true })).toBe("NULL");
  });

  it("returns AMBIGUOUS when the position is unclear", () => {
    expect(classifyBurgess(base)).toBe("AMBIGUOUS");
  });
});
