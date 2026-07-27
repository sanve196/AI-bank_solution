"use client";
import { useEffect, useState } from "react";
import PageHeader from "../../../components/shell/page-header";
import { RefreshCw, Scale, Landmark, TrendingUp } from "lucide-react";
import RegulationDetail from "./regulation-detail";

interface Row {
  id: string; regulator: string; title: string; circularNumber: string | null;
  publishedAt: string; status: string; summary: string | null;
}

export default function UC09Page() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"ALL" | "RBI" | "SEBI">("ALL");

  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/uc09/regulations", { cache: "no-store" });
      const j = await r.json();
      if (j.success) setRows(j.data);
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  const filtered = filter === "ALL" ? rows : rows.filter((r) => r.regulator === filter);
  const newCount = rows.filter((r) => r.status === "NEW").length;

  const regulatorBadge = (r: string) => {
    const color = r === "RBI" ? { bg: 'rgba(79,70,229,0.10)', color: '#4338CA' }
              : r === "SEBI" ? { bg: 'rgba(16,185,129,0.10)', color: '#047857' }
              : { bg: 'rgba(245,158,11,0.10)', color: '#92400E' };
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider font-medium" style={{ background: color.bg, color: color.color }}>{r}</span>;
  };

  return (
    <>
      <PageHeader
        code="UC 09"
        title="Regulatory Companion"
        description="Ingests circulars from SEBI, RBI, and other regulators. Uses AI to summarise each circular, extract specific obligations with effective dates, and produce an impact matrix showing affected areas of the bank."
        actions={
          <>
            <button onClick={load} className="btn-secondary"><RefreshCw className="w-4 h-4" strokeWidth={1.75}/> Refresh</button>
          </>
        }
      />

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="glass p-5">
          <div className="label mb-2">Total circulars</div>
          <div className="display text-3xl text-ink-900">{rows.length}</div>
        </div>
        <div className="glass p-5">
          <div className="label mb-2">New / unanalyzed</div>
          <div className="flex items-baseline gap-2">
            <div className="display text-3xl text-ink-900">{newCount}</div>
            {newCount > 0 && <span className="badge badge-major">Action needed</span>}
          </div>
        </div>
        <div className="glass p-5">
          <div className="label mb-2">Analyzed</div>
          <div className="display text-3xl text-ink-900">{rows.length - newCount}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <div className="xl:col-span-2">
          <div className="glass">
            <div className="px-5 py-4 flex items-center justify-between gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.6)' }}>
              <div className="label">Circulars</div>
              <div className="flex gap-1">
                {(["ALL", "RBI", "SEBI"] as const).map((f) => (
                  <button key={f} onClick={() => setFilter(f)}
                          className={`text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-md transition-colors ${filter === f ? 'text-white' : 'text-ink-500 hover:text-ink-900'}`}
                          style={filter === f ? { backgroundImage: 'linear-gradient(135deg, #4F46E5, #7C3AED)' } : {}}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            {loading ? (
              <div className="p-10 text-center text-[13px] text-ink-500">Loading…</div>
            ) : filtered.length === 0 ? (
              <div className="p-10 text-center">
                <Scale className="w-8 h-8 mx-auto text-ink-300 mb-3" strokeWidth={1.25}/>
                <div className="text-[13px] text-ink-500">No regulations</div>
              </div>
            ) : (
              <ul className="divide-y" style={{ borderColor: 'rgba(148,163,184,0.15)' }}>
                {filtered.map((r) => (
                  <li key={r.id}>
                    <button onClick={() => setSelectedId(r.id)}
                            className={`w-full text-left px-5 py-4 hover:bg-white/40 transition-colors ${selectedId === r.id ? "bg-white/50" : ""}`}>
                      <div className="flex items-center gap-2 mb-2">
                        {regulatorBadge(r.regulator)}
                        {r.status === "NEW" && <span className="badge badge-major">New</span>}
                        {r.status === "ANALYZED" && <span className="badge badge-approved">Analyzed</span>}
                        <span className="ml-auto text-[10px] font-mono text-ink-300">{new Date(r.publishedAt).toISOString().slice(0, 10)}</span>
                      </div>
                      <div className="text-[13px] font-medium text-ink-900 leading-snug tracking-tight">{r.title}</div>
                      {r.circularNumber && <div className="text-[10px] font-mono text-ink-500 mt-1 truncate">{r.circularNumber}</div>}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="xl:col-span-3">
          {selectedId ? (
            <RegulationDetail id={selectedId} onChange={load} />
          ) : (
            <div className="glass p-16 text-center">
              <Scale className="w-10 h-10 mx-auto text-ink-300 mb-4" strokeWidth={1.25}/>
              <div className="text-[13px] text-ink-500">Select a circular to view AI analysis and impact assessment</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
