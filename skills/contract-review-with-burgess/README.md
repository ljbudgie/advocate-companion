# Contract Review with the Burgess Principle

A calm, clause-by-clause contract review skill for the [Advocate Companion](https://github.com/ljbudgie/advocate-companion). It helps ordinary people — especially those with limited energy or hidden disabilities — read contracts with more confidence, without replacing human judgment.

---

## What This Skill Does

When you share a contract (pasted text or uploaded file), this skill:

1. **Breaks the contract into clauses** — one at a time, at a steady pace.
2. **Summarises each clause in plain language** — no jargon, no rush.
3. **Applies the Burgess binary** to any clause that is high-risk, unclear, or especially important:

   > *"Was a human member of the team able to personally review the specific facts and implications of this clause for my individual situation?"*

   If the answer is no — or if there's any doubt — the clause is flagged for human review.

4. **Outputs a clear, respectful summary** with suggested next steps or polite follow-up questions you might ask the other party.

---

## How It Uses the Burgess Principle

The [Burgess Principle](https://github.com/ljbudgie/burgess-principle) asks whether someone actually looked at your specific situation — or just applied a blanket rule. In contract review, this means:

- Generic "standard terms" that may not reflect your circumstances are flagged.
- Clauses with significant personal impact are highlighted for individual consideration.
- The AI never pretends to replace a solicitor, adviser, or anyone who knows your situation. It simply asks the question the Burgess Principle asks — and makes sure a real person answers it.

---

## Example User Commands

| You say | What happens |
|---------|--------------|
| *"Please review this contract for me."* | The skill reads through each clause, summarises it, and flags anything that needs a human eye. |
| *"What does clause 7 actually mean?"* | A plain-language explanation of that specific clause. |
| *"Is there anything in here I should ask about before signing?"* | A short list of clauses worth raising with the other party, with suggested wording. |
| *"Can you summarise the whole thing in simple terms?"* | A calm, respectful overview of what the contract says and what it asks of you. |

---

## Running the Edge Function

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

## Important

This skill is an assistive tool — not a substitute for legal advice. Every flagged clause is an invitation to pause and involve a real person who understands your situation. That is the whole point.

---

## Links

- [The Burgess Principle](https://github.com/ljbudgie/burgess-principle)
- [Advocate Companion](https://github.com/ljbudgie/advocate-companion)
