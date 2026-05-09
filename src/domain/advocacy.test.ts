import { describe, expect, it } from "vitest";
import { inferBurgessMetadata } from "./advocacy";

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
});
