# Contract Review with the Burgess Principle

A calm, clause-by-clause contract review skill for the [Advocate Companion](https://github.com/ljbudgie/advocate-companion). Paste or describe a contract and receive a structured, plain-language breakdown — with every high-risk, unclear, or one-sided clause automatically checked against the Burgess Principle.

Designed for ordinary people, especially those with limited energy or hidden disabilities, who want to feel more confident before signing.

---

### The Burgess Principle

> **"Was a human member of the team able to personally review the specific facts and implications of this clause for my individual situation?"**

If the answer is no — or there is any doubt — the clause is flagged for human review. That is the whole point: see the human first.

For the full framework: [github.com/ljbudgie/burgess-principle](https://github.com/ljbudgie/burgess-principle)

---

### How It Works

1. **Paste or describe your contract** (full text, specific clauses, or a summary of what you were told).
2. The skill **breaks it into clauses** and summarises each one in plain language.
3. Any clause that is high-risk, unclear, one-sided, or personally important is **automatically flagged** with:
   - **Risk level** — Low / Medium / High
   - **Plain English explanation** — what it actually means for you
   - **Suggested follow-up** — a polite question or request you can send to the other party
4. You receive a **clear summary** and suggested next steps.

---

### Example Prompts

You can trigger this skill with natural language — no special commands needed.

| You say | What happens |
|---------|--------------|
| *"Review this contract using Burgess Principle"* | Clause-by-clause breakdown with flagged risks and follow-up suggestions. |
| *"Check my new phone contract for risks"* | Highlights clauses that need your attention before signing. |
| *"Apply Burgess to the cancellation clause"* | Focuses on that specific clause and checks if it got individual human consideration. |
| *"What does clause 7 actually mean?"* | A plain-language explanation of that specific clause. |
| *"Is there anything in here I should ask about before signing?"* | A short list of clauses worth raising with the other party, with suggested wording. |
| *"Can you summarise the whole thing in simple terms?"* | A calm, respectful overview of what the contract says and what it asks of you. |

---

### Running the Edge Function

This skill is implemented as a Supabase Edge Function. Deploy it alongside the existing functions:

```bash
supabase functions deploy contract-review
```

Send a request:

```bash
curl -X POST https://<your-project>.supabase.co/functions/v1/contract-review \
  -H "Authorization: Bearer <anon-key>" \
  -H "Content-Type: application/json" \
  -d '{ "contractText": "Your contract text here..." }'
```

---

### Important Notes

- **This is not legal advice.** It helps you prepare for meaningful human review.
- Designed for people with limited energy or hidden disabilities — calm pace, no jargon, no pressure.
- Every flagged clause is an invitation to pause and involve a real person who understands your situation.
- Zero bloat. One file, one purpose, one principle.

---

For the full Burgess Principle framework and philosophy, see:
[github.com/ljbudgie/burgess-principle](https://github.com/ljbudgie/burgess-principle)
