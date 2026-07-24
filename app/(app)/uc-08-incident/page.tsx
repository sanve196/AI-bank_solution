import PlannedModule from "@/components/shell/planned-module";
export default function Page() {
  return (
    <PlannedModule
      code="UC-08"
      title="Incident Investigation"
      description="Supports the investigation of operational risk and compliance incidents."
      features={[
        "Incident intake and categorisation",
        "Automated log correlation across systems",
        "Timeline visualisation",
        "Claude-generated root cause hypotheses",
        "Regulatory reporting templates",
      ]}
      workflow={[
        "Incident logged manually or auto-created from alerts",
        "System pulls related logs from all connected systems within a time window",
        "Claude reconstructs a timeline and proposes root cause hypotheses",
        "Investigator refines and finalises the RCA",
        "Report generated in regulatory-friendly format",
      ]}
    />
  );
}
