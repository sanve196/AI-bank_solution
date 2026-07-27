export const UC09_ANALYZE_PROMPT_ID = "uc09-analyze-v1";

export const UC09_SYSTEM = `You are a senior bank compliance officer with deep expertise in Indian banking regulations (RBI, SEBI, IRDAI). Your job is to read a new regulatory circular and produce a concise, actionable summary for the bank's compliance team.`;

export function buildUC09Prompt(input: { regulator: string; title: string; fullText: string }): string {
  return `Regulator: ${input.regulator}
Circular title: ${input.title}

FULL TEXT:
${input.fullText}

TASK:
Analyze this regulation and return a JSON object with the following exact shape:

{
  "summary": "<180-word summary for a busy compliance officer covering what changed, who's affected, and by when>",
  "obligations": [
    {
      "id": "OBL-1",
      "text": "<specific obligation>",
      "effectiveDate": "<YYYY-MM-DD or 'Immediate' or 'TBD'>",
      "priority": "HIGH" | "MEDIUM" | "LOW"
    }
  ],
  "impactMatrix": [
    {
      "area": "<affected area, e.g. 'Retail lending', 'AML operations'>",
      "impact": "<one sentence describing impact>",
      "changesRequired": ["<change 1>", "<change 2>"]
    }
  ],
  "riskIfIgnored": "<one-sentence description of penalty or business risk>",
  "keyStakeholders": ["<role 1>", "<role 2>"]
}

Rules:
- Extract every distinct obligation as a separate item
- Impact matrix should cover at least 2 areas
- Return ONLY the JSON object, no markdown, no code fences`;
}
