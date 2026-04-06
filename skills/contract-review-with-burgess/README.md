# Contract Review with the Burgess Principle

**Lightweight contract review skill for the Advocate Companion**

A calm, clause-by-clause contract review skill for the [Advocate Companion](https://github.com/ljbudgie/advocate-companion). It helps ordinary people — especially those with limited energy or hidden disabilities — feel more confident when dealing with contracts using the Burgess Principle.

### Core Idea
Before accepting any significant clause, the skill asks:

**“Was a human member of the team able to personally review the specific facts and implications of this clause for my individual situation?”**

### How It Works
When you share a contract (paste text or describe key sections), this skill:
1. **Breaks the contract into clauses** — one at a time, at a steady pace.
2. **Summarises each clause in plain language** — no jargon, no rush.
3. **Applies the Burgess Principle** to any clause that is high-risk, unclear, or especially important.
4. You receive a clear, respectful summary + suggested next steps (e.g. polite questions to send to the other party).

### How It Uses the Burgess Principle
The [Burgess Principle](https://github.com/ljbudgie/burgess-principle) asks whether someone actually looked at your specific situation — or just applied a blanket rule. In contract review, this means:
- Generic "standard terms" that may not reflect your circumstances are flagged.
- Clauses with significant personal impact are highlighted for individual consideration.
- The AI never pretends to replace a solicitor, adviser, or anyone who knows your situation. It simply asks the question the Burgess Principle asks — and makes sure a real person answers it.

### Example User Prompts
- “Review this contract using Burgess Principle”
- “Check my new phone contract for risks and apply Burgess”
- “Help me understand the cancellation clause in this agreement”

| You say | What happens |
|---------|--------------|
| *"Please review this contract for me."* | The skill reads through each clause, summarises it, and flags anything that needs a human eye. |
| *"What does clause 7 actually mean?"* | A plain-language explanation of that specific clause. |
| *"Is there anything in here I should ask about before signing?"* | A short list of clauses worth raising with the other party, with suggested wording. |
| *"Can you summarise the whole thing in simple terms?"* | A calm, respectful overview of what the contract says and what it asks of you. |

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

### Important Notes
- This skill is **not** legal advice and does not replace professional legal review.
- It is designed to help ordinary people (especially those with limited energy or hidden disabilities) feel more confident when dealing with contracts.
- The goal is to encourage meaningful human review where it matters most.
- This skill is an assistive tool — not a substitute for legal advice. Every flagged clause is an invitation to pause and involve a real person who understands your situation. That is the whole point.

For the full Burgess Principle framework and philosophy, see:  
https://github.com/ljbudgie/burgess-principle