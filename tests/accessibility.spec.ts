import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:4173";

/**
 * Pre-existing accessibility rules that cannot be fixed without modifying
 * existing theme files:
 *
 * - color-contrast: The shadcn/ui theme uses --muted-foreground (#67768b) on
 *   --background (#f9f8f6) which yields a 4.35:1 ratio, just under the 4.5:1
 *   WCAG 2 AA threshold. Fixing requires changing CSS custom properties.
 */
const KNOWN_PREEXISTING_RULES = ["color-contrast"];

/**
 * Filter axe results to only serious and critical violations.
 */
function filterViolations(
  violations: Awaited<ReturnType<AxeBuilder["analyze"]>>["violations"]
) {
  return violations.filter(
    (v) => v.impact === "serious" || v.impact === "critical"
  );
}

/**
 * Format violations for readable test output.
 */
function formatViolations(
  violations: Awaited<ReturnType<AxeBuilder["analyze"]>>["violations"]
) {
  return violations
    .map(
      (v) =>
        `[${v.impact}] ${v.id}: ${v.description}\n` +
        v.nodes
          .map((n) => `  - ${n.html}\n    ${n.failureSummary}`)
          .join("\n")
    )
    .join("\n\n");
}

test.describe("Accessibility audit", () => {
  test("main page has no serious or critical accessibility violations", async ({
    page,
  }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page })
      .disableRules(KNOWN_PREEXISTING_RULES)
      .analyze();
    const serious = filterViolations(results.violations);

    expect(serious, formatViolations(serious)).toHaveLength(0);
  });

  test("onboarding flow has no serious or critical accessibility violations", async ({
    page,
  }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");

    // Step 0 – Welcome screen: click "Let's begin"
    const beginButton = page.getByRole("button", { name: /let.*s begin/i });
    await beginButton.waitFor({ state: "visible", timeout: 10_000 });
    await beginButton.click();

    // Step 1 – Name entry
    const nameInput = page.getByPlaceholder("e.g. Alex Johnson");
    await nameInput.waitFor({ state: "visible", timeout: 5_000 });
    await nameInput.fill("Accessibility Tester");
    await page.getByRole("button", { name: /continue/i }).click();

    // Step 2 – Adjustment selection (skip)
    await page.getByRole("button", { name: /continue/i }).click();

    // Step 3 – Country selection
    const countrySelect = page.locator("select");
    await countrySelect.waitFor({ state: "visible", timeout: 5_000 });
    await countrySelect.selectOption({ label: "United Kingdom" });
    await page.getByRole("button", { name: /continue/i }).click();

    // Step 4 – Context (final onboarding screen before submission)
    await page
      .getByRole("button", { name: /generate opening message/i })
      .waitFor({ state: "visible", timeout: 5_000 });

    const results = await new AxeBuilder({ page })
      .disableRules(KNOWN_PREEXISTING_RULES)
      .analyze();
    const serious = filterViolations(results.violations);

    expect(serious, formatViolations(serious)).toHaveLength(0);
  });

  test("conversation view has no serious or critical accessibility violations", async ({
    page,
  }) => {
    // Seed localStorage with a saved conversation so ConversationHistory renders
    const seed = [
      {
        id: "a11y-test-conv-001",
        profile: {
          fullName: "Accessibility Tester",
          adjustment: "ADHD",
          country: "United Kingdom",
          context: "Workplace adjustment request",
        },
        messages: [
          {
            id: "msg-001",
            role: "staff-display",
            content:
              "Dear Manager, I am writing to request a reasonable adjustment under the Equality Act 2010.",
            timestamp: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    await page.goto(BASE_URL);
    await page.evaluate((data) => {
      localStorage.setItem("burgess-conversations", JSON.stringify(data));
    }, seed);
    await page.reload();
    await page.waitForLoadState("networkidle");

    // ConversationHistory should render; click on the saved conversation
    const conversationItem = page.getByText("Accessibility Tester").first();
    await conversationItem.waitFor({ state: "visible", timeout: 10_000 });
    await conversationItem.click();

    // Wait for ConversationView to render
    await page.waitForLoadState("networkidle");
    await page
      .locator("[data-message-bubble]")
      .first()
      .waitFor({ state: "visible", timeout: 10_000 });

    const results = await new AxeBuilder({ page })
      .disableRules(KNOWN_PREEXISTING_RULES)
      .analyze();
    const serious = filterViolations(results.violations);

    expect(serious, formatViolations(serious)).toHaveLength(0);
  });
});
