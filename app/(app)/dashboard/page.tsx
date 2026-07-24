import PageHeader from "../../../components/shell/page-header";
import Link from "next/link";
import {
  FileSearch, ShieldAlert, GitBranch, UserPlus, MapPin, Timer,
  Building2, Siren, Scale, ClipboardCheck, FileText, ArrowUpRight
} from "lucide-react";

const modules = [
  { code: "01", title: "SOP Deviation Identification", desc: "Auto-compare applicant data against SOPs and flag deviations.", icon: FileSearch, href: "/uc-01-sop-deviation", status: "live" },
  { code: "02", title: "Anomaly Detection", desc: "Cross-source fraud and misrepresentation pattern detection.", icon: ShieldAlert, href: "/uc-02-anomaly", status: "planned" },
  { code: "03", title: "Decisioning", desc: "Route flagged cases to the right approver with AI justification.", icon: GitBranch, href: "/uc-03-decisioning", status: "planned" },
  { code: "04", title: "Customer Onboarding", desc: "KYC verification, deviation handling, and account creation.", icon: UserPlus, href: "/uc-04-onboarding", status: "planned" },
  { code: "05", title: "Field Visit Analyser", desc: "Multi-modal analysis of SME field visits.", icon: MapPin, href: "/uc-05-field-visit", status: "planned" },
  { code: "06", title: "Process Analytics & TAT", desc: "Conversational analytics for managers on process velocity.", icon: Timer, href: "/uc-06-process-analytics", status: "planned" },
  { code: "07", title: "Branch Operations", desc: "Branch benchmarking and training-need identification.", icon: Building2, href: "/uc-07-branch-analytics", status: "planned" },
  { code: "08", title: "Incident Investigation", desc: "Log correlation, timeline reconstruction, RCA support.", icon: Siren, href: "/uc-08-incident", status: "planned" },
  { code: "09", title: "Regulatory Companion", desc: "Regulation summarisation and impact assessment.", icon: Scale, href: "/uc-09-regulatory", status: "planned" },
  { code: "10", title: "Compliance Planning", desc: "Change action planning and deadline tracking.", icon: ClipboardCheck, href: "/uc-10-compliance-planning", status: "planned" },
  { code: "11", title: "Case Reporting", desc: "Auto-generated STR/SAR narratives from alerts and data.", icon: FileText, href: "/uc-11-case-reporting", status: "planned" },
];

const stats = [
  { label: "Modules live", value: "1", suffix: "/ 11" },
  { label: "AI calls today", value: "—", suffix: "" },
  { label: "Open cases", value: "0", suffix: "" },
  { label: "Avg. turnaround", value: "—", suffix: "" },
];

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Welcome to BankAgent"
        description="Your unified AI-assisted platform for payments, operations, and compliance. Choose a module below to get started."
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="glass p-5">
            <div className="label mb-3">{s.label}</div>
            <div className="flex items-baseline gap-1.5">
              <span className="display text-[32px] text-ink-900">{s.value}</span>
              {s.suffix && <span className="text-[13px] text-ink-500">{s.suffix}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Modules */}
      <div className="mb-5 flex items-end justify-between">
        <div>
          <div className="label mb-2">Use cases</div>
          <h2 className="display text-2xl text-ink-900">Modules</h2>
        </div>
        <div className="text-[12px] font-mono text-ink-500">11 total · 1 live</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((m) => {
          const Icon = m.icon;
          const live = m.status === "live";
          return (
            <Link key={m.code} href={m.href} className="glass p-5 group transition-all hover:shadow-glass-strong hover:-translate-y-0.5">
              <div className="flex items-start justify-between mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center relative"
                     style={{
                       background: 'rgba(255,255,255,0.6)',
                       border: '1px solid rgba(255,255,255,0.9)',
                       boxShadow: '0 1px 0 0 rgba(255,255,255,0.9) inset, 0 2px 8px -2px rgba(15,23,42,0.06)',
                     }}>
                  <Icon className="w-4 h-4 text-accent-from" strokeWidth={1.75} />
                </div>
                <span className={live ? "badge badge-live" : "badge badge-pending"}>
                  {live ? "Live" : "Planned"}
                </span>
              </div>
              <div className="label mb-2">UC {m.code}</div>
              <h3 className="text-[15px] font-medium text-ink-900 leading-snug tracking-tight">{m.title}</h3>
              <p className="text-[13px] text-ink-500 mt-2 leading-relaxed">{m.desc}</p>
              <div className="mt-5 flex items-center gap-1 text-[12px] font-mono uppercase tracking-wider text-ink-300 group-hover:text-accent-from transition-colors">
                Open <ArrowUpRight className="w-3 h-3" strokeWidth={1.75} />
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
