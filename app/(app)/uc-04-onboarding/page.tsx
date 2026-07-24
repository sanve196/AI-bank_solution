import PlannedModule from "@/components/shell/planned-module";
export default function Page() {
  return (
    <PlannedModule
      code="UC-04"
      title="Customer Onboarding & Account Setup"
      description="Verifies customer documents and internal records, manages deviation approvals, and sets up the account along with applicable covenants."
      features={[
        "Document upload + auto-classification",
        "OCR + Claude-based data extraction and validation",
        "Deviation approval workflow (via UC-03)",
        "Automated account creation via core banking APIs",
        "Covenant configuration engine",
      ]}
      workflow={[
        "Applicant/RM initiates onboarding with KYC docs",
        "System extracts data from documents (Claude vision + OCR)",
        "System cross-verifies with internal records and bureau",
        "Deviations routed to UC-03 for decisioning",
        "On approval, account created via core banking API with product-appropriate covenants",
        "Confirmation sent to applicant and RM",
      ]}
    />
  );
}
