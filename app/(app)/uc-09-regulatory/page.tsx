import PlannedModule from "@/components/shell/planned-module";
export default function Page() {
  return (
    <PlannedModule
      code="UC-09"
      title="Regulatory Companion"
      description="An AI agent that analyses new regulations from SEBI, RBI, and other agencies, and assesses their impact on bank operations."
      features={[
        "Regulator feed integration (SEBI, RBI, etc.)",
        "Regulation summarisation with Claude",
        "Clause-to-policy mapping via vector search",
        "Impact matrix generation",
        "Notification to owners of impacted processes",
      ]}
      workflow={[
        "Scheduled job fetches new circulars from regulator sources",
        "Claude summarises each regulation and extracts key obligations",
        "System maps obligations to internal policies/products using vector search",
        "Impact matrix generated",
        "Owners of impacted areas notified with due dates",
      ]}
    />
  );
}
