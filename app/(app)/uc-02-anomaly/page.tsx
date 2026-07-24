import PlannedModule from "../../../components/shell/planned-module";
export default function Page() {
  return (
    <PlannedModule
      code="UC-02"
      title="Anomaly Detection Across Multiple Data Sources"
      description="Analyses information across documents and systems to surface patterns that may indicate fraud or misrepresentation."
      features={[
        "Multi-source data connectors (core banking, CRM, bureau APIs)",
        "Entity resolution to link records across systems",
        "ML models for pattern and outlier detection",
        "Configurable alert thresholds",
        "Claude-generated narrative for each alert",
        "Case creation on anomaly detection",
      ]}
      workflow={[
        "Scheduled job pulls latest data from all connected sources",
        "Entity resolution links records across sources (same customer, different IDs)",
        "Statistical + ML models compute anomaly scores per customer/transaction",
        "Claude analyses top-scoring anomalies and writes an investigator-friendly narrative",
        "Alerts created and routed to fraud investigation queue",
      ]}
    />
  );
}
