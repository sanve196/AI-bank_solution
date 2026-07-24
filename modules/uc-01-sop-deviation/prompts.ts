export const UC01_DEVIATION_PROMPT_ID = "uc01-deviation-v1";

export const UC01_SYSTEM = `You are a senior bank credit-review assistant. You compare applicant data against the bank's Standard Operating Procedures (SOPs) and identify deviations. You are precise, conservative, and always cite the specific SOP clause you are applying.`;

export function buildUC01Prompt(input: {
  productType: string;
  applicantName: string;
  applicantData: Record<string, unknown>;
  sopRules: Array<{ id: string; description: string; expected: string }>;
}): string {
  return `Product: ${input.productType}
Applicant: ${input.applicantName}

SOP RULES (each has an id, description, and expected condition):
${input.sopRules.map((r) => `- [${r.id}] ${r.description} — expected: ${r.expected}`).join("\n")}

APPLICANT DATA:
${JSON.stringify(input.applicantData, null, 2)}

TASK:
Compare the applicant data against each SOP rule. For every rule that is VIOLATED, return an entry in a JSON array with the following exact shape:

[
  {
    "severity": "CRITICAL" | "MAJOR" | "MINOR",
    "sopClauseId": "<rule id>",
    "expectedValue": "<what the SOP expected>",
    "actualValue": "<what was found in applicant data>",
    "justification": "<one sentence explaining why this is a deviation>"
  }
]

Rules for severity:
- CRITICAL: violates a hard eligibility criterion (e.g., negative net worth, adverse audit remarks, blacklisted industry)
- MAJOR: quantitative miss on a material metric (e.g., profitability, leverage)
- MINOR: soft signal or documentation gap

Return ONLY the JSON array. No prose, no markdown, no code fences. If there are no deviations, return [].`;
}
