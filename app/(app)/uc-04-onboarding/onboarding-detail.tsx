"use client";
import { useEffect, useState } from "react";
import { Sparkles, CheckCircle2, XCircle, Info, Shield, FileWarning, ScrollText, Landmark } from "lucide-react";

interface Onboarding {
  id: string; applicantName: string; applicantType: string; productType: string;
  status: string; accountNumber: string | null;
  kycData: any; verificationResults: any; covenants: any; aiSummary: string | null;
}

export default function OnboardingDetail({ id, onChange }: { id: string; onChange: () => void }) {
  const [row, setRow] = useState<Onboarding | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [finalizing, setFinalizing] = useState<"APPROVED" | "REJECTED" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch(`/api/uc04/onboarding/${id}`, { cache: "no-store" });
      const j = await r.json();
      if (j.success) setRow(j.data);
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, [id]);

  async function verify() {
    setVerifying(true); setError(null);
    try {
      const r = await fetch(`/api/uc04/onboarding/${id}/verify`, { method: "POST" });
      const j = await r.json();
      if (!j.success) throw new Error(j.error?.message ?? "Verify failed");
      await load(); onChange();
    } catch (e: any) { setError(e.message); }
    finally { setVerifying(false); }
  }

  async function finalize(decision: "APPROVED" | "REJECTED") {
    setFinalizing(decision); setError(null);
    try {
      const r = await fetch(`/api/uc04/onboarding/${id}/finalize`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision }),
      });
      const j = await r.json();
      if (!j.success) throw new Error(j.error?.message ?? "Failed");
      await load(); onChange();
    } catch (e: any) { setError(e.message); }
    finally { setFinalizing(null); }
  }

  if (loading || !row) return <div className="glass p-10 text-center text-[13px] text-ink-500">Loading…</div>;

  const v = row.verificationResults;
  const covenants = row.covenants;

  const riskBadge = (r: string) => r === "HIGH" ? "badge badge-critical" : r === "MEDIUM" ? "badge badge-major" : "badge badge-approved";
  const checkIcon = (s: string) => s === "PASS" ? <CheckCircle2 className="w-4 h-4 text-emerald-600" strokeWidth={1.75}/>
                                 : s === "FAIL" ? <XCircle className="w-4 h-4 text-red-600" strokeWidth={1.75}/>
                                 : <Info className="w-4 h-4 text-amber-600" strokeWidth={1.75}/>;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="glass p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="label mb-2">Applicant</div>
            <div className="display text-2xl text-ink-900">{row.applicantName}</div>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <span className="text-[12px] font-mono uppercase tracking-wider text-ink-500">{row.applicantType}</span>
              <span className="text-ink-300">·</span>
              <span className="text-[12px] font-mono uppercase tracking-wider text-ink-500">{row.productType.replace("_", " ")}</span>
              <span className="text-ink-300">·</span>
              <span className="text-[12px] font-mono uppercase tracking-wider text-ink-500">{row.status}</span>
            </div>
            {row.accountNumber && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg"
                   style={{ background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.25)' }}>
                <Landmark className="w-3.5 h-3.5 text-emerald-700" strokeWidth={1.75}/>
                <span className="text-[11px] font-mono text-emerald-800 tracking-wider">Account {row.accountNumber}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            {row.status !== "APPROVED" && row.status !== "REJECTED" && (
              <button onClick={verify} disabled={verifying} className="btn-primary">
                <Sparkles className="w-4 h-4" strokeWidth={1.75}/>
                {verifying ? "Verifying…" : v ? "Re-verify" : "Verify KYC"}
              </button>
            )}
            {row.status === "REVIEW" && (
              <>
                <button onClick={() => finalize("APPROVED")} disabled={!!finalizing}
                        className="text-[11px] font-mono uppercase tracking-wider px-3 py-2 rounded-lg flex items-center justify-center gap-1"
                        style={{ background: 'rgba(16, 185, 129, 0.10)', color: '#047857', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                  <CheckCircle2 className="w-3 h-3" strokeWidth={1.75}/>{finalizing === "APPROVED" ? "Approving…" : "Approve & open"}
                </button>
                <button onClick={() => finalize("REJECTED")} disabled={!!finalizing}
                        className="text-[11px] font-mono uppercase tracking-wider px-3 py-2 rounded-lg flex items-center justify-center gap-1"
                        style={{ background: 'rgba(239, 68, 68, 0.08)', color: '#B91C1C', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
                  <XCircle className="w-3 h-3" strokeWidth={1.75}/> Reject
                </button>
              </>
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

      {/* AI summary */}
      {row.aiSummary && (
        <div className="glass p-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-accent-from" strokeWidth={1.75}/>
            <div className="label">AI assessment</div>
            {v?.riskRating && <span className={`ml-auto ${riskBadge(v.riskRating)}`}>Risk: {v.riskRating}</span>}
            {v?.recommendation && <span className="badge badge-minor">{v.recommendation.replace(/_/g, " ")}</span>}
          </div>
          <p className="text-[14px] text-ink-900 leading-relaxed">{row.aiSummary}</p>
        </div>
      )}

      {/* Verification checks */}
      {v?.verificationChecks?.length > 0 && (
        <div className="glass">
          <div className="px-6 py-4 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.5)' }}>
            <Shield className="w-3.5 h-3.5 text-accent-from" strokeWidth={1.75}/>
            <div className="label">Verification checks</div>
            <div className="ml-auto text-[12px] font-mono text-ink-500">{v.verificationChecks.length}</div>
          </div>
          <ul className="divide-y" style={{ borderColor: 'rgba(148,163,184,0.15)' }}>
            {v.verificationChecks.map((c: any, i: number) => (
              <li key={i} className="p-4 flex items-start gap-3">
                <div className="shrink-0 mt-0.5">{checkIcon(c.status)}</div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-medium text-ink-900">{c.check}</div>
                  <div className="text-[12px] text-ink-500 mt-1 leading-relaxed">{c.note}</div>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-ink-500 shrink-0">{c.status}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Document flags */}
      {v?.documentFlags?.length > 0 && (
        <div className="glass">
          <div className="px-6 py-4 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.5)' }}>
            <FileWarning className="w-3.5 h-3.5 text-amber-600" strokeWidth={1.75}/>
            <div className="label">Document flags</div>
            <div className="ml-auto text-[12px] font-mono text-ink-500">{v.documentFlags.length}</div>
          </div>
          <ul className="divide-y" style={{ borderColor: 'rgba(148,163,184,0.15)' }}>
            {v.documentFlags.map((f: any, i: number) => (
              <li key={i} className="p-4 flex items-start gap-3">
                <span className={f.severity === "MAJOR" ? "badge badge-major" : "badge badge-minor"}>{f.severity}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-medium text-ink-900">{f.field}</div>
                  <div className="text-[12px] text-ink-500 mt-1">{f.issue}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Covenants */}
      {Array.isArray(covenants) && covenants.length > 0 && (
        <div className="glass">
          <div className="px-6 py-4 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.5)' }}>
            <ScrollText className="w-3.5 h-3.5 text-accent-from" strokeWidth={1.75}/>
            <div className="label">Recommended covenants</div>
            <div className="ml-auto text-[12px] font-mono text-ink-500">{covenants.length}</div>
          </div>
          <ul className="divide-y" style={{ borderColor: 'rgba(148,163,184,0.15)' }}>
            {covenants.map((c: any, i: number) => (
              <li key={i} className="p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] font-mono text-accent-from tracking-wider">{c.code}</span>
                </div>
                <div className="text-[13px] font-medium text-ink-900">{c.description}</div>
                <div className="text-[12px] text-ink-500 mt-1 leading-relaxed">{c.reason}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Raw KYC data */}
      <div className="glass p-6">
        <div className="label mb-3">Extracted KYC data</div>
        <pre className="text-[11px] font-mono leading-relaxed p-4 rounded-xl overflow-x-auto"
             style={{ background: 'rgba(15, 23, 42, 0.04)', border: '1px solid rgba(15, 23, 42, 0.05)', color: '#334155' }}>
{JSON.stringify(row.kycData, null, 2)}
        </pre>
      </div>
    </div>
  );
}
