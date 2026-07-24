import PlannedModule from "@/components/shell/planned-module";
export default function Page() {
  return (
    <PlannedModule
      code="UC-05"
      title="Field Visit Report Analyser (SME Onboarding)"
      description="Searches and summarises data captured from field visits to accelerate SME onboarding decisions."
      features={[
        "Mobile app for RM to capture field data",
        "Multi-modal analysis (text, image, audio)",
        "Auto-summary generation with Claude",
        "Cross-check against declared business details",
        "Photo geo-tag verification",
      ]}
      workflow={[
        "RM captures visit data via mobile app: notes, photos with geo-tag, optional voice note",
        "Data synced to backend on connectivity",
        "Claude analyses text + images and produces a structured summary and risk flags",
        "Photo geo-tags cross-checked with declared business address",
        "Summary attached to onboarding case; risk flags highlighted to credit officer",
      ]}
    />
  );
}
