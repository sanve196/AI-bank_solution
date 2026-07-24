import PlannedModule from "@/components/shell/planned-module";
export default function Page() {
  return (
    <PlannedModule
      code="UC-11"
      title="Case Investigation & Reporting"
      description="Automates case investigation reporting using alerts from rules-based and predictive AI systems together with customer transaction data."
      features={[
        "Alert aggregation from multiple sources",
        "Auto-population of investigation templates",
        "Claude-generated case narrative (STR/SAR-style)",
        "Regulator-ready report export",
        "Case lifecycle tracking",
      ]}
      workflow={[
        "Alerts from rules engine and predictive AI aggregated into a case",
        "System pulls associated transactions and customer data",
        "Claude generates narrative sections of an STR/SAR-style report",
        "Investigator reviews, edits, and finalises the report",
        "Report exported in regulator-required format",
      ]}
    />
  );
}
