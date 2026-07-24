import PlannedModule from "@/components/shell/planned-module";
export default function Page() {
  return (
    <PlannedModule
      code="UC-03"
      title="Decisioning"
      description="Resolves flagged deviations and investigates anomalies to trigger the appropriate next step in the workflow."
      features={[
        "Rule-based + AI-assisted decision engine",
        "Workflow orchestration and case routing",
        "Escalation matrix configuration",
        "Explainability panel for each decision",
        "Integration with BPM/workflow systems",
      ]}
      workflow={[
        "Case (deviation or anomaly) arrives in the decisioning queue",
        "Rules engine evaluates configured business rules first",
        "If inconclusive, Claude produces a recommendation with justification",
        "System routes case to appropriate approver based on escalation matrix",
        "Approver acts; decision + rationale logged",
      ]}
    />
  );
}
