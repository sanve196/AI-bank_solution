"use client";
import { useEffect, useState } from "react";
import PageHeader from "../../../components/shell/page-header";
import { Plus, RefreshCw, FileSearch, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import NewApplicationDialog from "./new-application-dialog";
import ApplicationDetail from "./application-detail";

interface AppRow {
  id: string; applicantName: string; productType: string; status: string;
  createdAt: string; _count: { deviations: number };
}

export default function UC01Page() {
  const [apps, setApps] = useState<AppRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/uc01/applications", { cache: "no-store" });
      const j = await r.json();
      if (j.success) setApps(j.data);
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  const statusBadge = (s: string) => {
    if (s === "REVIEW")    return <span className="badge badge-major"><AlertTriangle className="w-3 h-3" strokeWidth={1.75}/> Review</span>;
    if (s === "ANALYZING") return <span className="badge badge-pending"><Clock className="w-3 h-3" strokeWidth={1.75}/> Analyzing</span>;
    if (s === "APPROVED")  return <span className="badge badge-approved"><CheckCircle2 className="w-3 h-3" strokeWidth={1.75}/> Approved</span>;
    return <span className="badge badge-neutral">{s}</span>;
  };

  return (
    <>
      <PageHeader
        code="UC 01"
        title="SOP Deviation Identification"
        description="Compares extracted applicant information against the bank's SOP and flags deviations from standard policy — negative industry outlook, low profitability, adverse audit remarks, and more."
        actions={
          <>
            <button onClick={load} className="btn-secondary"><RefreshCw className="w-4 h-4" strokeWidth={1.75}/> Refresh</button>
            <button onClick={() => setShowNew(true)} className="btn-primary"><Plus className="w-4 h-4" strokeWidth={1.75}/> New application</button>
          </>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <div className="xl:col-span-2">
          <div className="glass">
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.6)' }}>
              <div className="label">Applications</div>
              <div className="text-[12px] font-mono text-ink-500">{apps.length}</div>
            </div>
            {loading ? (
              <div className="p-10 text-center text-[13px] text-ink-500">Loading…</div>
            ) : apps.length === 0 ? (
              <div className="p-10 text-center">
                <FileSearch className="w-8 h-8 mx-auto text-ink-300 mb-3" strokeWidth={1.25}/>
                <div className="text-[13px] text-ink-500 mb-4">No applications yet</div>
                <button onClick={() => setShowNew(true)} className="btn-primary"><Plus className="w-4 h-4" strokeWidth={1.75}/> Create first</button>
              </div>
            ) : (
              <ul className="divide-y" style={{ borderColor: 'rgba(148,163,184,0.15)' }}>
                {apps.map((a) => (
                  <li key={a.id}>
                    <button
                      onClick={() => setSelectedId(a.id)}
                      className={`w-full text-left px-5 py-3.5 hover:bg-white/40 transition-colors ${selectedId === a.id ? "bg-white/50" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-[13px] font-medium text-ink-900 truncate tracking-tight">{a.applicantName}</div>
                          <div className="label mt-1">{a.productType.replace("_", " ")}</div>
                        </div>
                        {statusBadge(a.status)}
                      </div>
                      {a._count.deviations > 0 && (
                        <div className="mt-2 text-[11px] font-mono text-amber-800 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" strokeWidth={1.75}/>
                          {a._count.deviations} deviation{a._count.deviations !== 1 ? "s" : ""}
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
            <ApplicationDetail id={selectedId} onChange={load} />
          ) : (
            <div className="glass p-16 text-center">
              <FileSearch className="w-10 h-10 mx-auto text-ink-300 mb-4" strokeWidth={1.25}/>
              <div className="text-[13px] text-ink-500">Select an application to view details and deviations</div>
            </div>
          )}
        </div>
      </div>

      {showNew && (
        <NewApplicationDialog
          onClose={() => setShowNew(false)}
          onCreated={(id) => { setShowNew(false); setSelectedId(id); load(); }}
        />
      )}
    </>
  );
}
