export interface OfflineTemplate {
  title: string;
  context: string;
  body: string;
}

export const offlineTemplates: OfflineTemplate[] = [
  {
    title: "Employer – General Adjustment Request",
    context: "Use when requesting a reasonable adjustment from your employer.",
    body: `Dear [Manager/HR],

I am writing to formally request a reasonable adjustment under the Equality Act 2010 (or equivalent legislation). My condition affects my ability to [describe impact], and I believe the following adjustment would enable me to perform my role effectively:

[Describe the adjustment you need]

I am happy to discuss this further and provide any supporting documentation. I would appreciate a written response within a reasonable timeframe.

Thank you for your consideration.

Yours sincerely,
[Your name]`,
  },
  {
    title: "University – Academic Adjustment",
    context: "Use when requesting accommodations from a university or educational institution.",
    body: `Dear [Disability Services / Course Leader],

I am writing to request reasonable adjustments for my studies. I have [condition/disability] which affects my ability to [describe impact on studies].

I would like to request the following adjustments:

- [e.g. extra time in examinations]
- [e.g. lecture notes provided in advance]
- [e.g. alternative assessment format]

I am registered with disability services and happy to provide further evidence. I would appreciate confirmation of these adjustments in writing.

Kind regards,
[Your name]
[Student ID]`,
  },
  {
    title: "Medical Setting – Appointment Adjustment",
    context: "Use when requesting adjustments at a medical or healthcare appointment.",
    body: `Dear [Practice Manager / Healthcare Provider],

I am writing to request a reasonable adjustment for my appointments at your practice/clinic. Due to my [condition/disability], I experience difficulty with [describe barrier — e.g. waiting in crowded areas, standard appointment length, communication method].

I would like to request:

- [e.g. a longer appointment slot]
- [e.g. a quiet waiting area]
- [e.g. written instructions rather than verbal]

These adjustments are necessary to ensure I can access healthcare on an equal basis. I am happy to discuss this further and provide supporting documentation if needed.

Thank you,
[Your name]
[Date of birth / patient reference]`,
  },
  {
    title: "Refusal Escalation – Formal Follow-Up",
    context: "Use when a previous adjustment request has been refused and you wish to escalate.",
    body: `Dear [Name / Organisation],

I am writing to follow up on my request for a reasonable adjustment dated [date], which was refused on [date of refusal]. I do not believe the refusal adequately considered my individual circumstances as required by law.

Under the Equality Act 2010 (or equivalent legislation), organisations have a duty to make reasonable adjustments where a disabled person would otherwise be placed at a substantial disadvantage. A blanket refusal without individual consideration does not meet this obligation.

I am requesting that you:
1. Reconsider my request with individual assessment.
2. Provide the reasons for refusal in writing.
3. Confirm your internal complaints procedure.

If this matter is not resolved, I may seek advice from [relevant body — e.g. EHRC, ACAS, an advocacy organisation].

Yours sincerely,
[Your name]`,
  },
];
