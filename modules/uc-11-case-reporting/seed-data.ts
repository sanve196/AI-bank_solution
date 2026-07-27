export const SAMPLE_CASES = [
  {
    caseNumber: "AML-2025-0847",
    customerName: "Rakesh Kumar Enterprises",
    customerId: "CUST-98217",
    alertSources: [
      { source: "RULES_ENGINE", ruleId: "R-045", description: "Cash deposit above INR 10L without corresponding business receipts", triggeredAt: "2025-07-18" },
      { source: "ML_MODEL", modelId: "STR-XGB-v3", score: 0.87, description: "Anomalous structuring pattern detected — deposits just below reporting threshold across 3 branches" },
    ],
    transactions: [
      { date: "2025-07-12", type: "CASH_DEPOSIT", amount_inr: 890000, branch: "Delhi-CP" },
      { date: "2025-07-14", type: "CASH_DEPOSIT", amount_inr: 950000, branch: "Delhi-Karol Bagh" },
      { date: "2025-07-16", type: "CASH_DEPOSIT", amount_inr: 920000, branch: "Delhi-Rohini" },
      { date: "2025-07-18", type: "OUTWARD_RTGS", amount_inr: 2650000, counterparty: "Bharat Traders (Dubai)" },
    ],
    reportType: "STR",
    status: "OPEN",
  },
  {
    caseNumber: "AML-2025-0851",
    customerName: "Sunita Mehta",
    customerId: "CUST-11423",
    alertSources: [
      { source: "RULES_ENGINE", ruleId: "R-018", description: "Multiple international transfers to high-risk jurisdictions within 30 days", triggeredAt: "2025-07-20" },
    ],
    transactions: [
      { date: "2025-06-25", type: "OUTWARD_SWIFT", amount_inr: 480000, counterparty: "Redacted (Cayman Islands)" },
      { date: "2025-07-10", type: "OUTWARD_SWIFT", amount_inr: 520000, counterparty: "Redacted (Cayman Islands)" },
      { date: "2025-07-18", type: "OUTWARD_SWIFT", amount_inr: 495000, counterparty: "Redacted (BVI)" },
    ],
    reportType: "STR",
    status: "OPEN",
  },
  {
    caseNumber: "AML-2025-0855",
    customerName: "Green Valley Farms Pvt Ltd",
    customerId: "CUST-77129",
    alertSources: [
      { source: "RULES_ENGINE", ruleId: "R-032", description: "Business receipts inconsistent with declared industry (agricultural firm receiving IT-services-like payments)", triggeredAt: "2025-07-21" },
      { source: "ML_MODEL", modelId: "STR-XGB-v3", score: 0.62, description: "Moderate anomaly — pattern mismatch with peer group" },
    ],
    transactions: [
      { date: "2025-07-05", type: "INWARD_RTGS", amount_inr: 850000, counterparty: "Zenith Software Solutions" },
      { date: "2025-07-11", type: "INWARD_RTGS", amount_inr: 1200000, counterparty: "Blue Ocean Consulting" },
      { date: "2025-07-15", type: "OUTWARD_NEFT", amount_inr: 1900000, counterparty: "Rakesh Kumar (individual)" },
    ],
    reportType: "SAR",
    status: "OPEN",
  },
];
