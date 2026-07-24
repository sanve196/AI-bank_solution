"use client";
import { useEffect, useState } from "react";
import PageHeader from "@/components/shell/page-header";
import { Plus, RefreshCw, FileSearch, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import NewApplicationDialog from "./new-application-dialog";
import ApplicationDetail from "./application-detail";

interface AppRow {
  id: string;
  applicantName: string;
  productType: string;
  status: string;
  createdAt: string;
  _count: { deviations: number };
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
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const statusBadge = (s: string) => {
    if (s === "REVIEW") return <span className="badge badge-major flex items-center gap-1"><AlertTriangle className="w-3 h-3" />Review</span>;
    if (s === "ANALYZING") return <span className="badge badge-pending flex items-center gap-1"><Clock className="w-3 h-3" />Analyzing</span>;
    if (s === "APPROVED") return <span className="badge badge-approved flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />Approved</span>;
    return <span className="badge badge-pending">{s}</span>;
  };

  return (
    <>
      <PageHeader
        code="UC-01"
        title="SOP Deviation Identification"
        description="Compares extracted applicant information against the bank's SOP and flags deviations from standard policy — e.g., negative industry outlook, low profitability, adverse audit remarks."
        actions={
          <div className="flex gap-2">
            <button onClick={load} className="btn-secondary">
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
            <button onClick={() => setShowNew(true)} className="btn-primary">
              <Plus className="w-4 h-4" /> New Application
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-2">
          <div className="card">
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-semibold text-sm text-slate-700">Applications</h3>
              <span className="text-xs text-slate-500">{apps.length} total</span>
            </div>
            {loading ? (
              <div className="p-8 text-center text-sm text-slate-500">Loading…</div>
            ) : apps.length === 0 ? (
              <div className="p-8 text-center">
                <FileSearch className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <div className="text-sm text-slate-500 mb-3">No applications yet</div>
                <button onClick={() => setShowNew(true)} className="btn-primary">
                  <Plus className="w-4 h-4" /> Create first application
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {apps.map((a) => (
                  <li key={a.id}>
                    <button
                      onClick={() => setSelectedId(a.id)}
                      className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors ${selectedId === a.id ? "bg-brand-50" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="font-medium text-sm text-slate-900 truncate">{a.applicantName}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{a.productType.replace("_", " ")}</div>
                        </div>
                        {statusBadge(a.status)}
                      </div>
                      {a._count.deviations > 0 && (
                        <div className="mt-1.5 text-xs text-amber-700 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
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
            <div className="card p-12 text-center">
              <FileSearch className="w-10 h-10 mx-auto text-slate-300 mb-3" />
              <div className="text-sm text-slate-500">Select an application to view details and deviations.</div>
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
