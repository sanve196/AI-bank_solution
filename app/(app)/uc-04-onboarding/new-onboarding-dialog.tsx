"use client";
import { useState } from "react";
import { X, Sparkles } from "lucide-react";

const SAMPLES = {
  individual_clean: {
    label: "Individual (clean)",
    hint: "salaried, docs ok",
    data: {
      applicantName: "Priya Sharma",
      applicantType: "INDIVIDUAL" as const,
      productType: "SAVINGS" as const,
      kycData: {
        pan: "AAAPS1234A",
        aadhaar_last_4: "6789",
        dob: "1988-04-12",
        address_proof: "utility_bill_verified",
        annual_income_inr: 1450000,
        employer: "Infosys Ltd",
        employment_years: 6,
        credit_score: 782,
        residence_type: "owned",
      },
    },
  },
  sme_risky: {
    label: "SME (concerns)",
    hint: "missing docs",
    data: {
      applicantName: "Bright Steel Traders",
      applicantType: "SME" as const,
      productType: "WORKING_CAPITAL" as const,
      kycData: {
        gstin: "27ABCDE1234F1Z5",
        pan: "ABCDE1234F",
        business_type: "trader",
        years_in_business: 2,
        annual_turnover_inr: 8500000,
        auditor_remarks: "management is new to industry",
        credit_bureau_score: 620,
        address_proof: "MISSING",
        promoter_networth_declared: false,
        existing_bank_relationships: 0,
      },
    },
  },
  corporate: {
    label: "Corporate",
    hint: "large firm",
    data: {
      applicantName: "Meridian Chemicals Pvt Ltd",
      applicantType: "CORPORATE" as const,
      productType: "TERM_LOAN" as const,
      kycData: {
        cin: "U24100MH2005PTC157821",
        gstin: "27AAACM1234H1Z0",
        incorporation_year: 2005,
        annual_revenue_inr: 4200000000,
        promoter_experience_years: 25,
        auditor: "KPMG India",
        auditor_remarks: "clean",
        debt_to_equity: 1.1,
        board_size: 7,
        credit_rating: "AA-",
      },
    },
  },
};

export default function NewOnboardingDialog({
  onClose, onCreated,
}: { onClose: () => void; onCreated: (id: string) => void }) {
  const [applicantName, setApplicantName] = useState("");
  const [applicantType, setApplicantType] = useState<"INDIVIDUAL" | "SME" | "CORPORATE">("INDIVIDUAL");
  const [productType, setProductType] = useState<"SAVINGS" | "CURRENT" | "TERM_LOAN" | "WORKING_CAPITAL">("SAVINGS");
  const [dataJson, setDataJson] = useState("{}");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function loadSample(key: keyof typeof SAMPLES) {
    const s = SAMPLES[key].data;
    setApplicantName(s.applicantName);
    setApplicantType(s.applicantType);
    setProductType(s.productType);
    setDataJson(JSON.stringify(s.kycData, null, 2));
  }

  async function submit() {
    setSubmitting(true); setError(null);
    try {
      let data: any;
      try { data = JSON.parse(dataJson); } catch { throw new Error("KYC data must be valid JSON"); }
      const r = await fetch("/api/uc04/onboarding", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicantName, applicantType, productType, kycData: data }),
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
            <div className="label mb-1">New onboarding</div>
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
                        style={{ background: 'rgba(79, 70, 229, 0.05)', border: '1px solid rgba(79, 70, 229, 0.12)' }}>
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
            <input value={applicantName} onChange={(e) => setApplicantName(e.target.value)} className="input" placeholder="e.g. Priya Sharma"/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="label mb-1.5">Applicant type</div>
              <select value={applicantType} onChange={(e) => setApplicantType(e.target.value as any)} className="input">
                <option value="INDIVIDUAL">Individual</option>
                <option value="SME">SME</option>
                <option value="CORPORATE">Corporate</option>
              </select>
            </div>
            <div>
              <div className="label mb-1.5">Product</div>
              <select value={productType} onChange={(e) => setProductType(e.target.value as any)} className="input">
                <option value="SAVINGS">Savings account</option>
                <option value="CURRENT">Current account</option>
                <option value="TERM_LOAN">Term loan</option>
                <option value="WORKING_CAPITAL">Working capital</option>
              </select>
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between mb-1.5">
              <div className="label">Extracted KYC data</div>
              <div className="text-[10px] font-mono text-ink-300">JSON</div>
            </div>
            <p className="text-[11px] text-ink-500 mb-2 leading-relaxed">
              In production this comes from OCR + Claude extraction of uploaded KYC documents.
            </p>
            <textarea value={dataJson} onChange={(e) => setDataJson(e.target.value)} rows={10}
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
            {submitting ? "Creating…" : "Create case"}
          </button>
        </div>
      </div>
    </div>
  );
}
