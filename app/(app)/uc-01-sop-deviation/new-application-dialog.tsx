"use client";
import { useState } from "react";
import { X, Sparkles } from "lucide-react";

const SAMPLES = {
  clean: {
    label: "Clean applicant",
    hint: "few or no deviations",
    data: {
      applicantName: "Sunshine Textiles Pvt Ltd",
      productType: "TERM_LOAN" as const,
      extractedData: {
        profit_last_4q: [1200000, 1450000, 1380000, 1520000],
        auditor_remarks: "clean",
        industry_outlook: "positive",
        debt_to_equity: 1.4,
        years_in_business: 8,
        annual_revenue_inr: 85000000,
      },
    },
  },
  risky: {
    label: "Risky applicant",
    hint: "multiple deviations",
    data: {
      applicantName: "Everstar Trading Co",
      productType: "TERM_LOAN" as const,
      extractedData: {
        profit_last_4q: [-320000, -180000, 90000, -50000],
        auditor_remarks: "material weakness in internal controls noted",
        industry_outlook: "negative",
        debt_to_equity: 4.7,
        years_in_business: 2,
        annual_revenue_inr: 12000000,
      },
    },
  },
  mixed: {
    label: "Working capital",
    hint: "mixed case",
    data: {
      applicantName: "Ganga Distributors LLP",
      productType: "WORKING_CAPITAL" as const,
      extractedData: {
        current_ratio: 0.9,
        auditor_remarks: "clean",
        profit_last_2q: [50000, 80000],
        annual_revenue_inr: 24000000,
      },
    },
  },
};

export default function NewApplicationDialog({
  onClose, onCreated,
}: { onClose: () => void; onCreated: (id: string) => void }) {
  const [applicantName, setApplicantName] = useState("");
  const [productType, setProductType] = useState<"TERM_LOAN" | "WORKING_CAPITAL">("TERM_LOAN");
  const [dataJson, setDataJson] = useState("{}");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function loadSample(key: keyof typeof SAMPLES) {
    const s = SAMPLES[key].data;
    setApplicantName(s.applicantName);
    setProductType(s.productType);
    setDataJson(JSON.stringify(s.extractedData, null, 2));
  }

  async function submit() {
    setSubmitting(true); setError(null);
    try {
      let data: any;
      try { data = JSON.parse(dataJson); } catch { throw new Error("Extracted data must be valid JSON"); }
      const r = await fetch("/api/uc01/applications", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicantName, productType, extractedData: data }),
      });
      const j = await r.json();
      if (!j.success) throw new Error(j.error?.message ?? "Failed");
      onCreated(j.data.id);
    } catch (e: any) { setError(e.message); }
    finally { setSubmitting(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
         style={{ background: 'rgba(15, 23, 42, 0.35)', backdropFilter: 'blur(8px)' }}>
      <div className="glass-strong w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.5)' }}>
          <div>
            <div className="label mb-1">New application</div>
            <h3 className="display text-xl text-ink-900">Create case</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-ink-500 hover:text-ink-900 hover:bg-white/60"><X className="w-4 h-4" strokeWidth={1.75}/></button>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <div className="label mb-2">Quick samples</div>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(SAMPLES) as Array<keyof typeof SAMPLES>).map((k) => (
                <button key={k} type="button" onClick={() => loadSample(k)}
                        className="text-left px-3 py-2.5 rounded-xl transition-all hover:-translate-y-0.5"
                        style={{
                          background: 'rgba(79, 70, 229, 0.05)',
                          border: '1px solid rgba(79, 70, 229, 0.12)',
                        }}>
                  <div className="flex items-center gap-1 text-[12px] font-medium text-ink-900 tracking-tight">
                    <Sparkles className="w-3 h-3 text-accent-from" strokeWidth={1.75}/> {SAMPLES[k].label}
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-ink-500 mt-1">{SAMPLES[k].hint}</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="label mb-1.5">Applicant name</div>
            <input value={applicantName} onChange={(e) => setApplicantName(e.target.value)} className="input" placeholder="e.g. Sunshine Textiles Pvt Ltd"/>
          </div>
          <div>
            <div className="label mb-1.5">Product type</div>
            <select value={productType} onChange={(e) => setProductType(e.target.value as any)} className="input">
              <option value="TERM_LOAN">Term loan</option>
              <option value="WORKING_CAPITAL">Working capital</option>
            </select>
          </div>
          <div>
            <div className="flex items-baseline justify-between mb-1.5">
              <div className="label">Extracted applicant data</div>
              <div className="text-[10px] font-mono text-ink-300">JSON</div>
            </div>
            <p className="text-[11px] text-ink-500 mb-2 leading-relaxed">
              In production this comes from OCR + Claude extraction of uploaded financial statements.
            </p>
            <textarea value={dataJson} onChange={(e) => setDataJson(e.target.value)} rows={9}
                      className="input font-mono text-[11px] leading-relaxed"/>
          </div>
          {error && (
            <div className="text-[13px] px-3 py-2 rounded-xl"
                 style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#B91C1C' }}>
              {error}
            </div>
          )}
        </div>
        <div className="px-6 py-4 flex justify-end gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.5)' }}>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={submit} disabled={!applicantName || submitting} className="btn-primary">
            {submitting ? "Creating…" : "Create application"}
          </button>
        </div>
      </div>
    </div>
  );
}
