import PlannedModule from "@/components/shell/planned-module";
export default function Page() {
  return (
    <PlannedModule
      code="UC-07"
      title="Conversational Analytics on Branch Operations"
      description="A conversational agent for managers and leadership to understand branch operating efficiency, benchmark performance, and identify best practices and employee training needs."
      features={[
        "NL query interface for branch KPIs",
        "Branch-to-branch comparison",
        "Employee skill-gap analysis",
        "Training recommendation engine",
        "Role-based access control",
      ]}
      workflow={[
        "Branch KPI data (transactions/day, error rates, wait times) aggregated nightly",
        "Manager asks natural-language questions in chat",
        "Claude answers with tables/charts and highlights best-practice branches",
        "Training recommendations generated based on skill gaps",
        "Recommendations sent to L&D and branch managers",
      ]}
    />
  );
}
