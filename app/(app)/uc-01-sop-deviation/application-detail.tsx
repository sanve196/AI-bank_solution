"use client";
import { useEffect, useState } from "react";
import { Sparkles, CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";

interface Deviation {
  id: string; severity: "CRITICAL" | "MAJOR" | "MINOR"; sopClauseId: string;
  expectedValue: string; actualValue: string; justification: string; status: string; reviewerNote?: string | null;
}
interface AppDetail {
  id: string; applicantName: string; productType: string; status: string;
  extractedData: any; deviations: Deviation[];
}

export default function ApplicationDetail({ id, onChange }: { id: string; onChange: () => void }) {
  const [app, setApp] = useState<AppDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch(`/api/uc01/applications/${id}`, { cache: "no-store" });
      const j = await r.json();
      if (j.success) setApp(j.data);
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, [id]);

  async function analyze() {
    setAnalyzing(true); setError(null);
    try {
      const r = await fetch(`/api/uc01/applications/${id}/analyze`, { method: "POST" });
      const j = await r.json();
      if (!j.success) throw new Error(j.error?.message ?? "Analyze failed");
      await load(); onChange();
    } catch (e: any) { setError(e.message); }
    finally { setAnalyzing(false); }
  }

  async function decide(devId: string, status: "APPROVED_OVERRIDE" | "REJECTED") {
    const r = await fetch(`/api/uc01/deviations/${devId}/decision`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if ((await r.json()).success) { load(); onChange(); }
  }

  if (loading || !app) return <div className="card p-8 text-center text-sm text-slate-500">Loading…</div>;

  const sevBadge = (s: string) =>
    s === "CRITICAL" ? "badge badge-critical" :
    s === "MAJOR"    ? "badge badge-major" :
                       "badge badge-minor";

  return (
    <div className="space-y-4">
      <div className="card p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs text-slate-500">Applicant</div>
            <div className="text-lg font-semibold text-slate-900">{app.applicantName}</div>
            <div className="text-xs text-slate-500 mt-1">{app.productType.replace("_", " ")} • Status: {app.status}</div>
          </div>
          <button onClick={analyze} disabled={analyzing} className="btn-primary">
            <Sparkles className="w-4 h-4" />
            {analyzing ? "Analyzing with Claude…" : "Analyze for Deviations"}
          </button>
        </div>
        {error && (
          <div className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2 flex gap-2">
            <Info className="w-4 h-4 shrink-0 mt-0.5" /> {error}
          </div>
        )}
      </div>

      <div className="card p-5">
        <h4 className="font-semibold text-sm text-slate-700 mb-2">Extracted Applicant Data</h4>
        <pre className="text-xs bg-slate-50 border border-slate-200 rounded p-3 overflow-x-auto">
{JSON.stringify(app.extractedData, null, 2)}
        </pre>
      </div>

      <div className="card">
        <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
          <h4 className="font-semibold text-sm text-slate-700">Deviations</h4>
          <span className="text-xs text-slate-500">
            {app.deviations.length === 0 ? "None yet — click Analyze" : `${app.deviations.length} found`}
          </span>
        </div>
        {app.deviations.length === 0 ? (
          <div className="p-10 text-center">
            <CheckCircle2 className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <div className="text-sm text-slate-500">
              {app.status === "REVIEW" ? "No deviations — applicant meets all SOP criteria" : "Run analysis to identify deviations"}
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {app.deviations.map((d) => (
              <li key={d.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={sevBadge(d.severity)}>{d.severity}</span>
                      <span className="text-xs font-mono text-slate-500">{d.sopClauseId}</span>
                      {d.status !== "OPEN" && (
                        <span className={`badge ${d.status === "APPROVED_OVERRIDE" ? "badge-approved" : "badge-critical"}`}>
                          {d.status.replace("_", " ")}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-800 mt-2">{d.justification}</p>
                    <div className="grid grid-cols-2 gap-3 mt-2 text-xs">
                      <div>
                        <div className="text-slate-500">Expected</div>
                        <div className="text-slate-800 font-mono">{d.expectedValue}</div>
                      </div>
                      <div>
                        <div className="text-slate-500">Actual</div>
                        <div className="text-slate-800 font-mono">{d.actualValue}</div>
                      </div>
                    </div>
                  </div>
                  {d.status === "OPEN" && (
                    <div className="flex flex-col gap-1.5 shrink-0">
                      <button onClick={() => decide(d.id, "APPROVED_OVERRIDE")}
                              className="text-xs px-3 py-1.5 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Override
                      </button>
                      <button onClick={() => decide(d.id, "REJECTED")}
                              className="text-xs px-3 py-1.5 rounded-md bg-red-50 text-red-700 hover:bg-red-100 flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
