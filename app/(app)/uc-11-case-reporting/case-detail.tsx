"use client";
import { useEffect, useState } from "react";
import { Sparkles, Info, Download, CheckCircle2, AlertTriangle, ShieldAlert, FileEdit } from "lucide-react";

interface Case {
  id: string; caseNumber: string; customerName: string; customerId: string | null;
  reportType: string; status: string; recommendation: string | null;
  alertSources: any; transactions: any; narrative: string | null; redFlags: any;
}

export default function CaseDetail({ id, onChange }: { id: string; onChange: () => void }) {
  const [row, setRow] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingNarrative, setEditingNarrative] = useState(false);
  const [narrativeDraft, setNarrativeDraft] = useState("");

  async function load() {
    setLoading(true);
    try {
      const r = await fetch(`/api/uc11/cases/${id}`, { cache: "no-store" });
      const j = await r.json();
      if (j.success) { setRow(j.data); setNarrativeDraft(j.data.narrative ?? ""); }
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, [id]);

  async function generate() {
    setGenerating(true); setError(null);
    try {
      const r = await fetch(`/api/uc11/cases/${id}/generate`, { method: "POST" });
      const j = await r.json();
      if (!j.success) throw new Error(j.error?.message ?? "Failed");
      await load(); onChange();
    } catch (e: any) { setError(e.message); }
    finally { setGenerating(false); }
  }

  async function saveNarrative() {
    const r = await fetch(`/api/uc11/cases/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ narrative: narrativeDraft }),
    });
    if ((await r.json()).success) { setEditingNarrative(false); load(); }
  }

  async function fileReport() {
    if (!confirm("Mark this case as FILED and download the report?")) return;
    await fetch(`/api/uc11/cases/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "FILED" }),
    });
    window.open(`/api/uc11/cases/${id}/report`, "_blank");
    load(); onChange();
  }

  if (loading || !row) return <div className="glass p-10 text-center text-[13px] text-ink-500">Loading…</div>;

  const alerts: any[] = Array.isArray(row.alertSources) ? row.alertSources : [];
  const txns: any[] = Array.isArray(row.transactions) ? row.transactions : [];
  const rfMeta: any = row.redFlags ?? {};
  const redFlags: any[] = Array.isArray(rfMeta.flags) ? rfMeta.flags : [];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="glass p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-[11px] font-mono text-accent-from tracking-wider">{row.caseNumber}</span>
              <span className="badge badge-minor">{row.reportType}</span>
              {row.recommendation && <span className="badge badge-major">{row.recommendation.replace(/_/g, " ")}</span>}
              {rfMeta.urgency === "HIGH" && <span className="badge badge-critical">HIGH URGENCY</span>}
            </div>
            <div className="display text-2xl text-ink-900">{row.customerName}</div>
            {row.customerId && <div className="text-[12px] font-mono text-ink-500 mt-1">{row.customerId}</div>}
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            {row.status !== "FILED" && (
              <button onClick={generate} disabled={generating} className="btn-primary">
                <Sparkles className="w-4 h-4" strokeWidth={1.75}/>
                {generating ? "Drafting…" : row.narrative ? "Re-draft" : "Draft report"}
              </button>
            )}
            {row.narrative && row.status !== "FILED" && (
              <button onClick={fileReport}
                      className="text-[11px] font-mono uppercase tracking-wider px-3 py-2 rounded-lg flex items-center justify-center gap-1"
                      style={{ background: 'rgba(16, 185, 129, 0.10)', color: '#047857', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                <CheckCircle2 className="w-3 h-3" strokeWidth={1.75}/> File & export
              </button>
            )}
            {row.status === "FILED" && (
              <a href={`/api/uc11/cases/${id}/report`} target="_blank"
                 className="text-[11px] font-mono uppercase tracking-wider px-3 py-2 rounded-lg flex items-center justify-center gap-1"
                 style={{ background: 'rgba(79, 70, 229, 0.10)', color: '#4338CA', border: '1px solid rgba(79, 70, 229, 0.25)' }}>
                <Download className="w-3 h-3" strokeWidth={1.75}/> Download
              </a>
            )}
          </div>
        </div>
        {error && (
          <div className="mt-4 flex gap-2 text-[13px] px-3 py-2 rounded-xl"
               style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#B91C1C' }}>
            <Info className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={1.75}/> {error}
          </div>
        )}
      </div>

      {/* Red flags */}
      {redFlags.length > 0 && (
        <div className="glass">
          <div className="px-6 py-4 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.5)' }}>
            <ShieldAlert className="w-3.5 h-3.5 text-red-600" strokeWidth={1.75}/>
            <div className="label">Identified red flags</div>
            <div className="ml-auto text-[12px] font-mono text-ink-500">Confidence: {rfMeta.confidence}</div>
          </div>
          <ul className="divide-y" style={{ borderColor: 'rgba(148,163,184,0.15)' }}>
            {redFlags.map((f: any, i: number) => (
              <li key={i} className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600" strokeWidth={1.75}/>
                  <span className="text-[11px] font-mono text-red-700 tracking-wider">{f.code}</span>
                </div>
                <div className="text-[13px] font-medium text-ink-900">{f.description}</div>
                <div className="text-[12px] text-ink-500 mt-1 leading-relaxed"><span className="label mr-1">Evidence:</span>{f.evidence}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Narrative */}
      {row.narrative && (
        <div className="glass">
          <div className="px-6 py-4 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.5)' }}>
            <Sparkles className="w-3.5 h-3.5 text-accent-from" strokeWidth={1.75}/>
            <div className="label">Report narrative</div>
            {!editingNarrative && row.status !== "FILED" && (
              <button onClick={() => setEditingNarrative(true)} className="ml-auto text-[11px] font-mono uppercase tracking-wider text-ink-500 hover:text-ink-900 flex items-center gap-1">
                <FileEdit className="w-3 h-3" strokeWidth={1.75}/> Edit
              </button>
            )}
          </div>
          {editingNarrative ? (
            <div className="p-6 space-y-3">
              <textarea value={narrativeDraft} onChange={(e) => setNarrativeDraft(e.target.value)}
                        rows={20} className="input font-mono text-[12px] leading-relaxed"/>
              <div className="flex justify-end gap-2">
                <button onClick={() => { setEditingNarrative(false); setNarrativeDraft(row.narrative ?? ""); }} className="btn-secondary">Cancel</button>
                <button onClick={saveNarrative} className="btn-primary">Save</button>
              </div>
            </div>
          ) : (
            <pre className="p-6 text-[12px] leading-relaxed whitespace-pre-wrap text-ink-900" style={{ fontFamily: 'Geist, sans-serif' }}>
{row.narrative}
            </pre>
          )}
        </div>
      )}

      {/* Alerts */}
      <div className="glass">
        <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.5)' }}>
          <div className="label">Triggering alerts</div>
        </div>
        <ul className="divide-y" style={{ borderColor: 'rgba(148,163,184,0.15)' }}>
          {alerts.map((a: any, i: number) => (
            <li key={i} className="p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="badge badge-minor">{a.source}</span>
                {a.ruleId && <span className="text-[11px] font-mono text-ink-500">{a.ruleId}</span>}
                {a.modelId && <span className="text-[11px] font-mono text-ink-500">{a.modelId}</span>}
                {typeof a.score === "number" && <span className="text-[11px] font-mono text-red-700">score {a.score.toFixed(2)}</span>}
              </div>
              <div className="text-[13px] text-ink-900">{a.description}</div>
            </li>
          ))}
        </ul>
      </div>

      {/* Transactions */}
      <div className="glass">
        <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.5)' }}>
          <div className="label">Related transactions</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="text-left border-b" style={{ borderColor: 'rgba(148,163,184,0.15)' }}>
                <th className="px-6 py-2 label">Date</th>
                <th className="px-3 py-2 label">Type</th>
                <th className="px-3 py-2 label">Amount (INR)</th>
                <th className="px-3 py-2 label">Counterparty / Branch</th>
              </tr>
            </thead>
            <tbody>
              {txns.map((t: any, i: number) => (
                <tr key={i} className="border-b" style={{ borderColor: 'rgba(148,163,184,0.10)' }}>
                  <td className="px-6 py-2.5 font-mono text-ink-700">{t.date}</td>
                  <td className="px-3 py-2.5 text-ink-900">{t.type}</td>
                  <td className="px-3 py-2.5 font-mono text-ink-900">{new Intl.NumberFormat("en-IN").format(t.amount_inr)}</td>
                  <td className="px-3 py-2.5 text-ink-700">{t.counterparty ?? t.branch ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
