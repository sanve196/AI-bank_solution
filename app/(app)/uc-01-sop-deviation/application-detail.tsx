"use client";
import { useEffect, useState } from "react";
import { Sparkles, CheckCircle2, XCircle, Info } from "lucide-react";

interface Deviation {
  id: string; severity: "CRITICAL" | "MAJOR" | "MINOR"; sopClauseId: string;
  expectedValue: string; actualValue: string; justification: string;
  status: string; reviewerNote?: string | null;
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

  if (loading || !app) return <div className="glass p-10 text-center text-[13px] text-ink-500">Loading…</div>;

  const sevBadge = (s: string) =>
    s === "CRITICAL" ? "badge badge-critical" :
    s === "MAJOR"    ? "badge badge-major"    :
                       "badge badge-minor";

  return (
    <div className="space-y-4">
      <div className="glass p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="label mb-2">Applicant</div>
            <div className="display text-2xl text-ink-900">{app.applicantName}</div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[12px] font-mono uppercase tracking-wider text-ink-500">{app.productType.replace("_", " ")}</span>
              <span className="text-ink-300">·</span>
              <span className="text-[12px] font-mono uppercase tracking-wider text-ink-500">{app.status}</span>
            </div>
          </div>
          <button onClick={analyze} disabled={analyzing} className="btn-primary">
            <Sparkles className="w-4 h-4" strokeWidth={1.75}/>
            {analyzing ? "Analyzing…" : "Analyze"}
          </button>
        </div>
        {error && (
          <div className="mt-4 flex gap-2 text-[13px] px-3 py-2 rounded-xl"
               style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#B91C1C' }}>
            <Info className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={1.75}/> {error}
          </div>
        )}
      </div>

      <div className="glass p-6">
        <div className="label mb-3">Extracted applicant data</div>
        <pre className="text-[11px] font-mono leading-relaxed p-4 rounded-xl overflow-x-auto"
             style={{ background: 'rgba(15, 23, 42, 0.04)', border: '1px solid rgba(15, 23, 42, 0.05)', color: '#334155' }}>
{JSON.stringify(app.extractedData, null, 2)}
        </pre>
      </div>

      <div className="glass">
        <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.5)' }}>
          <div className="label">Deviations</div>
          <div className="text-[12px] font-mono text-ink-500">
            {app.deviations.length === 0 ? "None yet" : `${app.deviations.length} found`}
          </div>
        </div>
        {app.deviations.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle2 className="w-8 h-8 mx-auto text-ink-300 mb-3" strokeWidth={1.25}/>
            <div className="text-[13px] text-ink-500">
              {app.status === "REVIEW" ? "No deviations — applicant meets all SOP criteria" : "Run analyze to identify deviations"}
            </div>
          </div>
        ) : (
          <ul className="divide-y" style={{ borderColor: 'rgba(148,163,184,0.15)' }}>
            {app.deviations.map((d) => (
              <li key={d.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={sevBadge(d.severity)}>{d.severity}</span>
                      <span className="text-[11px] font-mono text-ink-500">{d.sopClauseId}</span>
                      {d.status !== "OPEN" && (
                        <span className={`badge ${d.status === "APPROVED_OVERRIDE" ? "badge-approved" : "badge-critical"}`}>
                          {d.status.replace("_", " ")}
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] text-ink-900 mt-3 leading-relaxed">{d.justification}</p>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div>
                        <div className="label mb-1">Expected</div>
                        <div className="text-[12px] font-mono text-ink-700">{d.expectedValue}</div>
                      </div>
                      <div>
                        <div className="label mb-1">Actual</div>
                        <div className="text-[12px] font-mono text-ink-700">{d.actualValue}</div>
                      </div>
                    </div>
                  </div>
                  {d.status === "OPEN" && (
                    <div className="flex flex-col gap-1.5 shrink-0">
                      <button onClick={() => decide(d.id, "APPROVED_OVERRIDE")}
                              className="text-[11px] font-mono uppercase tracking-wider px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                              style={{ background: 'rgba(16, 185, 129, 0.10)', color: '#047857', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                        <CheckCircle2 className="w-3 h-3" strokeWidth={1.75}/> Override
                      </button>
                      <button onClick={() => decide(d.id, "REJECTED")}
                              className="text-[11px] font-mono uppercase tracking-wider px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                              style={{ background: 'rgba(239, 68, 68, 0.08)', color: '#B91C1C', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                        <XCircle className="w-3 h-3" strokeWidth={1.75}/> Reject
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
