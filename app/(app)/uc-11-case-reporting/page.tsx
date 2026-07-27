"use client";
import { useEffect, useState } from "react";
import PageHeader from "../../../components/shell/page-header";
import { RefreshCw, FileText, AlertOctagon } from "lucide-react";
import CaseDetail from "./case-detail";

interface Row {
  id: string; caseNumber: string; customerName: string; customerId: string | null;
  reportType: string; status: string; recommendation: string | null; createdAt: string;
}

export default function UC11Page() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/uc11/cases", { cache: "no-store" });
      const j = await r.json();
      if (j.success) setRows(j.data);
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  const statusBadge = (s: string) =>
    s === "OPEN" ? <span className="badge badge-major">Open</span> :
    s === "IN_REVIEW" ? <span className="badge badge-minor">In review</span> :
    s === "FILED" ? <span className="badge badge-approved">Filed</span> :
    <span className="badge badge-neutral">Closed</span>;

  const openCount = rows.filter((r) => r.status === "OPEN").length;

  return (
    <>
      <PageHeader
        code="UC 11"
        title="Case Investigation & Reporting"
        description="Automates AML/fraud case investigation reporting. Aggregates alerts from rules and predictive AI systems together with customer transaction data, then uses Claude to draft a regulator-ready STR/SAR narrative with identified red flags."
        actions={<button onClick={load} className="btn-secondary"><RefreshCw className="w-4 h-4" strokeWidth={1.75}/> Refresh</button>}
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="glass p-5">
          <div className="label mb-2">Total cases</div>
          <div className="display text-3xl text-ink-900">{rows.length}</div>
        </div>
        <div className="glass p-5">
          <div className="label mb-2">Open</div>
          <div className="flex items-baseline gap-2">
            <div className="display text-3xl text-ink-900">{openCount}</div>
            {openCount > 0 && <span className="badge badge-major">Action needed</span>}
          </div>
        </div>
        <div className="glass p-5">
          <div className="label mb-2">Filed / Closed</div>
          <div className="display text-3xl text-ink-900">{rows.length - openCount}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <div className="xl:col-span-2">
          <div className="glass">
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.6)' }}>
              <div className="label">Cases</div>
              <div className="text-[12px] font-mono text-ink-500">{rows.length}</div>
            </div>
            {loading ? (
              <div className="p-10 text-center text-[13px] text-ink-500">Loading…</div>
            ) : rows.length === 0 ? (
              <div className="p-10 text-center">
                <FileText className="w-8 h-8 mx-auto text-ink-300 mb-3" strokeWidth={1.25}/>
                <div className="text-[13px] text-ink-500">No cases</div>
              </div>
            ) : (
              <ul className="divide-y" style={{ borderColor: 'rgba(148,163,184,0.15)' }}>
                {rows.map((r) => (
                  <li key={r.id}>
                    <button onClick={() => setSelectedId(r.id)}
                            className={`w-full text-left px-5 py-4 hover:bg-white/40 transition-colors ${selectedId === r.id ? "bg-white/50" : ""}`}>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-mono text-accent-from tracking-wider">{r.caseNumber}</span>
                        {statusBadge(r.status)}
                      </div>
                      <div className="text-[13px] font-medium text-ink-900 truncate tracking-tight">{r.customerName}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="label">{r.reportType}</div>
                        {r.recommendation && <div className="text-[10px] font-mono text-ink-500">→ {r.recommendation.replace(/_/g, " ")}</div>}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="xl:col-span-3">
          {selectedId ? (
            <CaseDetail id={selectedId} onChange={load} />
          ) : (
            <div className="glass p-16 text-center">
              <AlertOctagon className="w-10 h-10 mx-auto text-ink-300 mb-4" strokeWidth={1.25}/>
              <div className="text-[13px] text-ink-500">Select a case to view alerts, transactions, and draft the STR narrative</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
