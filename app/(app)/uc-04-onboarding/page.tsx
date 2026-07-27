"use client";
import { useEffect, useState } from "react";
import PageHeader from "../../../components/shell/page-header";
import { Plus, RefreshCw, UserPlus, CheckCircle2, Clock, AlertTriangle, XCircle } from "lucide-react";
import NewOnboardingDialog from "./new-onboarding-dialog";
import OnboardingDetail from "./onboarding-detail";

interface Row {
  id: string; applicantName: string; applicantType: string; productType: string;
  status: string; accountNumber: string | null; createdAt: string;
}

export default function UC04Page() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/uc04/onboarding", { cache: "no-store" });
      const j = await r.json();
      if (j.success) setRows(j.data);
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  const statusBadge = (s: string) => {
    if (s === "DRAFT")     return <span className="badge badge-neutral">Draft</span>;
    if (s === "VERIFYING") return <span className="badge badge-pending"><Clock className="w-3 h-3" strokeWidth={1.75}/> Verifying</span>;
    if (s === "REVIEW")    return <span className="badge badge-major"><AlertTriangle className="w-3 h-3" strokeWidth={1.75}/> Review</span>;
    if (s === "APPROVED")  return <span className="badge badge-approved"><CheckCircle2 className="w-3 h-3" strokeWidth={1.75}/> Approved</span>;
    if (s === "REJECTED")  return <span className="badge badge-critical"><XCircle className="w-3 h-3" strokeWidth={1.75}/> Rejected</span>;
    return <span className="badge badge-neutral">{s}</span>;
  };

  return (
    <>
      <PageHeader
        code="UC 04"
        title="Customer Onboarding & Account Setup"
        description="Verifies customer documents and internal records, runs AI-powered KYC assessment, manages deviation approvals, and sets up the account with applicable covenants."
        actions={
          <>
            <button onClick={load} className="btn-secondary"><RefreshCw className="w-4 h-4" strokeWidth={1.75}/> Refresh</button>
            <button onClick={() => setShowNew(true)} className="btn-primary"><Plus className="w-4 h-4" strokeWidth={1.75}/> New onboarding</button>
          </>
        }
      />

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
                <UserPlus className="w-8 h-8 mx-auto text-ink-300 mb-3" strokeWidth={1.25}/>
                <div className="text-[13px] text-ink-500 mb-4">No onboarding cases yet</div>
                <button onClick={() => setShowNew(true)} className="btn-primary"><Plus className="w-4 h-4" strokeWidth={1.75}/> Create first</button>
              </div>
            ) : (
              <ul className="divide-y" style={{ borderColor: 'rgba(148,163,184,0.15)' }}>
                {rows.map((r) => (
                  <li key={r.id}>
                    <button
                      onClick={() => setSelectedId(r.id)}
                      className={`w-full text-left px-5 py-3.5 hover:bg-white/40 transition-colors ${selectedId === r.id ? "bg-white/50" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-[13px] font-medium text-ink-900 truncate tracking-tight">{r.applicantName}</div>
                          <div className="label mt-1">{r.applicantType} · {r.productType.replace("_", " ")}</div>
                        </div>
                        {statusBadge(r.status)}
                      </div>
                      {r.accountNumber && (
                        <div className="mt-2 text-[11px] font-mono text-emerald-700">
                          A/C {r.accountNumber}
                        </div>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="xl:col-span-3">
          {selectedId ? (
            <OnboardingDetail id={selectedId} onChange={load} />
          ) : (
            <div className="glass p-16 text-center">
              <UserPlus className="w-10 h-10 mx-auto text-ink-300 mb-4" strokeWidth={1.25}/>
              <div className="text-[13px] text-ink-500">Select a case to view details, verify KYC and set up the account</div>
            </div>
          )}
        </div>
      </div>

      {showNew && (
        <NewOnboardingDialog
          onClose={() => setShowNew(false)}
          onCreated={(id) => { setShowNew(false); setSelectedId(id); load(); }}
        />
      )}
    </>
  );
}
