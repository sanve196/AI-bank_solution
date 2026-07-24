import PlannedModule from "@/components/shell/planned-module";
export default function Page() {
  return (
    <PlannedModule
      code="UC-10"
      title="Compliance Planning"
      description="Identifies the changes needed in policies, software, systems, and processes to comply with evolving regulatory requirements."
      features={[
        "Gap analysis engine",
        "Claude-proposed change actions per obligation",
        "Deadline & milestone tracking",
        "Owner assignment and reminders",
        "Compliance dashboard",
      ]}
      workflow={[
        "Impact assessments from UC-09 feed into compliance planner",
        "For each obligation, Claude proposes concrete change actions",
        "Actions assigned to owners with deadlines",
        "Dashboard tracks progress to deadline",
        "Escalations triggered for overdue items",
      ]}
    />
  );
}
