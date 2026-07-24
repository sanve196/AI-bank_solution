"use client";
import { useState } from "react";
import { X, Sparkles } from "lucide-react";

// Sample scenarios that trigger different deviation patterns
const SAMPLES = {
  clean: {
    label: "Clean applicant (few / no deviations)",
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
    label: "Risky applicant (multiple deviations)",
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
    label: "Mixed working-capital case",
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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicantName, productType, extractedData: data }),
      });
      const j = await r.json();
      if (!j.success) throw new Error(j.error?.message ?? "Failed");
      onCreated(j.data.id);
    } catch (e: any) { setError(e.message); }
    finally { setSubmitting(false); }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4">
      <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
          <h3 className="font-semibold">New Application</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Quick samples</label>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {(Object.keys(SAMPLES) as Array<keyof typeof SAMPLES>).map((k) => (
                <button key={k} type="button" onClick={() => loadSample(k)}
                        className="text-xs px-3 py-1.5 rounded-md bg-brand-50 text-brand-700 hover:bg-brand-100 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> {SAMPLES[k].label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Applicant name</label>
            <input value={applicantName} onChange={(e) => setApplicantName(e.target.value)}
                   className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Product type</label>
            <select value={productType} onChange={(e) => setProductType(e.target.value as any)}
                    className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md text-sm bg-white">
              <option value="TERM_LOAN">Term Loan</option>
              <option value="WORKING_CAPITAL">Working Capital</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
              Extracted applicant data (JSON)
            </label>
            <p className="text-xs text-slate-500 mt-1">
              In production this comes from OCR + Claude extraction of uploaded financial statements. For now, paste JSON or use a sample above.
            </p>
            <textarea value={dataJson} onChange={(e) => setDataJson(e.target.value)}
                      rows={10}
                      className="w-full mt-1.5 px-3 py-2 border border-slate-300 rounded-md text-xs font-mono focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          {error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">{error}</div>}
        </div>
        <div className="px-5 py-3 border-t border-slate-200 flex justify-end gap-2 bg-slate-50">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={submit} disabled={!applicantName || submitting} className="btn-primary">
            {submitting ? "Creating…" : "Create Application"}
          </button>
        </div>
      </div>
    </div>
  );
}
