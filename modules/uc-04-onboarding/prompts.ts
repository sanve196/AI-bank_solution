export const UC04_VERIFY_PROMPT_ID = "uc04-verify-v1";

export const UC04_SYSTEM = `You are a senior bank onboarding officer. You verify customer KYC data, cross-check it against internal records and industry norms, and produce a structured assessment. Be conservative, precise, and cite specific concerns.`;

export function buildUC04Prompt(input: {
  applicantName: string;
  applicantType: string;
  productType: string;
  kycData: Record<string, unknown>;
}): string {
  return `Applicant: ${input.applicantName}
Applicant type: ${input.applicantType}
Product requested: ${input.productType}

KYC DATA EXTRACTED FROM DOCUMENTS:
${JSON.stringify(input.kycData, null, 2)}

TASK:
Analyze this onboarding case and return a JSON object with the following exact shape:

{
  "riskRating": "LOW" | "MEDIUM" | "HIGH",
  "verificationChecks": [
    { "check": "<what was checked>", "status": "PASS" | "FAIL" | "WARN", "note": "<one sentence>" }
  ],
  "documentFlags": [
    { "field": "<field name>", "issue": "<what's wrong or missing>", "severity": "MINOR" | "MAJOR" }
  ],
  "recommendedCovenants": [
    { "code": "<COV-XXX>", "description": "<what covenant applies>", "reason": "<why for this applicant>" }
  ],
  "summary": "<3-sentence AI summary of the onboarding assessment>",
  "recommendation": "APPROVE" | "APPROVE_WITH_CONDITIONS" | "REVIEW" | "REJECT"
}

Rules:
- Perform at least 4 verification checks (identity, address, income/revenue, business existence)
- Flag any missing or suspicious fields as documentFlags
- Suggest 2-5 relevant covenants based on applicant type and product
- Return ONLY the JSON object, no prose, no markdown, no code fences`;
}
