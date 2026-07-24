import PlannedModule from "@/components/shell/planned-module";
export default function Page() {
  return (
    <PlannedModule
      code="UC-06"
      title="Process Analytics & TAT Monitoring"
      description="A conversational AI agent for managers and leadership to assess the velocity and accuracy of processes, benchmark performance, and identify common bottlenecks."
      features={[
        "Conversational (chat) interface",
        "TAT computation across process stages",
        "Bottleneck heat-maps",
        "Peer benchmarking",
        "Drill-down from summary to individual cases",
      ]}
      workflow={[
        "All workflow events across UC-01 to UC-04 emit timestamps to an events table",
        "Manager opens chat interface and asks natural-language questions",
        "Claude translates question to safe SQL/aggregation over events data",
        "System executes safely and returns chart + narrative",
        "Manager can drill down to individual cases",
      ]}
    />
  );
}
