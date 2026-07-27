"use client";
import { useEffect, useState } from "react";
import { Sparkles, Info, Calendar, Target, AlertOctagon, Users, FileText } from "lucide-react";

interface Regulation {
  id: string; regulator: string; title: string; circularNumber: string | null;
  publishedAt: string; status: string; fullText: string;
  summary: string | null; obligations: any; impactMatrix: any;
}

export default function RegulationDetail({ id, onChange }: { id: string; onChange: () => void }) {
  const [row, setRow] = useState<Regulation | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFullText, setShowFullText] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch(`/api/uc09/regulations/${id}`, { cache: "no-store" });
      const j = await r.json();
      if (j.success) setRow(j.data);
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, [id]);

  async function analyze() {
    setAnalyzing(true); setError(null);
    try {
      const r = await fetch(`/api/uc09/regulations/${id}/analyze`, { method: "POST" });
      const j = await r.json();
      if (!j.success) throw new Error(j.error?.message ?? "Analyze failed");
      await load(); onChange();
    } catch (e: any) { setError(e.message); }
    finally { setAnalyzing(false); }
  }

  if (loading || !row) return <div className="glass p-10 text-center text-[13px] text-ink-500">Loading…</div>;

  const obligations: any[] = Array.isArray(row.obligations) ? row.obligations : [];
  const meta = row.impactMatrix as any;
  const impactMatrix: any[] = Array.isArray(meta?.impactMatrix) ? meta.impactMatrix : [];
  const riskIfIgnored: string | undefined = meta?.riskIfIgnored;
  const stakeholders: string[] = Array.isArray(meta?.keyStakeholders) ? meta.keyStakeholders : [];

  const priorityBadge = (p: string) =>
    p === "HIGH" ? "badge badge-critical" :
    p === "MEDIUM" ? "badge badge-major" :
    "badge badge-minor";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="glass p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="badge badge-minor">{row.regulator}</span>
              <span className="text-[10px] font-mono text-ink-300">{new Date(row.publishedAt).toISOString().slice(0, 10)}</span>
              {row.status === "ANALYZED" && <span className="badge badge-approved">Analyzed</span>}
              {row.status === "NEW" && <span className="badge badge-major">New</span>}
            </div>
            <div className="display text-xl text-ink-900 leading-tight">{row.title}</div>
            {row.circularNumber && <div className="text-[11px] font-mono text-ink-500 mt-2">{row.circularNumber}</div>}
          </div>
          <button onClick={analyze} disabled={analyzing} className="btn-primary shrink-0">
            <Sparkles className="w-4 h-4" strokeWidth={1.75}/>
            {analyzing ? "Analyzing…" : row.summary ? "Re-analyze" : "Analyze"}
          </button>
        </div>
        {error && (
          <div className="mt-4 flex gap-2 text-[13px] px-3 py-2 rounded-xl"
               style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#B91C1C' }}>
            <Info className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={1.75}/> {error}
          </div>
        )}
      </div>

      {/* Summary */}
      {row.summary && (
        <div className="glass p-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-accent-from" strokeWidth={1.75}/>
            <div className="label">AI summary</div>
          </div>
          <p className="text-[14px] text-ink-900 leading-relaxed">{row.summary}</p>
        </div>
      )}

      {/* Risk if ignored */}
      {riskIfIgnored && (
        <div className="glass p-5" style={{ background: 'rgba(239, 68, 68, 0.04)', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
          <div className="flex items-start gap-3">
            <AlertOctagon className="w-4 h-4 text-red-600 shrink-0 mt-0.5" strokeWidth={1.75}/>
            <div>
              <div className="label mb-1" style={{ color: '#B91C1C' }}>Risk if ignored</div>
              <p className="text-[13px] text-ink-900 leading-relaxed">{riskIfIgnored}</p>
            </div>
          </div>
        </div>
      )}

      {/* Obligations */}
      {obligations.length > 0 && (
        <div className="glass">
          <div className="px-6 py-4 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.5)' }}>
            <Target className="w-3.5 h-3.5 text-accent-from" strokeWidth={1.75}/>
            <div className="label">Obligations</div>
            <div className="ml-auto text-[12px] font-mono text-ink-500">{obligations.length}</div>
          </div>
          <ul className="divide-y" style={{ borderColor: 'rgba(148,163,184,0.15)' }}>
            {obligations.map((o, i) => (
              <li key={i} className="p-4">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-[11px] font-mono text-accent-from tracking-wider">{o.id}</span>
                  <span className={priorityBadge(o.priority)}>{o.priority}</span>
                  <span className="ml-auto flex items-center gap-1 text-[11px] font-mono text-ink-500">
                    <Calendar className="w-3 h-3" strokeWidth={1.75}/> {o.effectiveDate}
                  </span>
                </div>
                <p className="text-[13px] text-ink-900 leading-relaxed">{o.text}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Impact matrix */}
      {impactMatrix.length > 0 && (
        <div className="glass">
          <div className="px-6 py-4 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.5)' }}>
            <Target className="w-3.5 h-3.5 text-accent-from" strokeWidth={1.75}/>
            <div className="label">Impact matrix</div>
            <div className="ml-auto text-[12px] font-mono text-ink-500">{impactMatrix.length} areas</div>
          </div>
          <ul className="divide-y" style={{ borderColor: 'rgba(148,163,184,0.15)' }}>
            {impactMatrix.map((im, i) => (
              <li key={i} className="p-4">
                <div className="text-[13px] font-medium text-ink-900 mb-1">{im.area}</div>
                <div className="text-[12px] text-ink-500 mb-3 leading-relaxed">{im.impact}</div>
                {Array.isArray(im.changesRequired) && im.changesRequired.length > 0 && (
                  <div>
                    <div className="label mb-2">Changes required</div>
                    <ul className="space-y-1">
                      {im.changesRequired.map((c: string, j: number) => (
                        <li key={j} className="text-[12px] text-ink-700 flex items-start gap-2">
                          <span className="text-accent-from mt-0.5">→</span> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Stakeholders */}
      {stakeholders.length > 0 && (
        <div className="glass p-5">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-3.5 h-3.5 text-accent-from" strokeWidth={1.75}/>
            <div className="label">Key stakeholders</div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {stakeholders.map((s, i) => <span key={i} className="badge badge-neutral">{s}</span>)}
          </div>
        </div>
      )}

      {/* Full text (collapsible) */}
      <div className="glass p-6">
        <button onClick={() => setShowFullText((v) => !v)} className="w-full flex items-center gap-2 text-left">
          <FileText className="w-3.5 h-3.5 text-ink-500" strokeWidth={1.75}/>
          <div className="label">Full circular text</div>
          <span className="ml-auto text-[11px] font-mono text-ink-500">{showFullText ? "Hide" : "Show"}</span>
        </button>
        {showFullText && (
          <pre className="mt-4 text-[11px] font-mono leading-relaxed p-4 rounded-xl overflow-x-auto whitespace-pre-wrap"
               style={{ background: 'rgba(15, 23, 42, 0.04)', border: '1px solid rgba(15, 23, 42, 0.05)', color: '#334155' }}>
{row.fullText}
          </pre>
        )}
      </div>
    </div>
  );
}
