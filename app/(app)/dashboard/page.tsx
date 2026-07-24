import PageHeader from "@/components/shell/page-header";
import Link from "next/link";
import {
  FileSearch, ShieldAlert, GitBranch, UserPlus, MapPin, Timer,
  Building2, Siren, Scale, ClipboardCheck, FileText, ArrowRight, CheckCircle2, Clock
} from "lucide-react";

const modules = [
  { code: "UC-01", title: "SOP Deviation Identification", desc: "Auto-compare applicant data against SOPs and flag deviations.", icon: FileSearch, href: "/uc-01-sop-deviation", status: "live" },
  { code: "UC-02", title: "Anomaly Detection", desc: "Cross-source fraud/misrepresentation pattern detection.", icon: ShieldAlert, href: "/uc-02-anomaly", status: "planned" },
  { code: "UC-03", title: "Decisioning", desc: "Route flagged cases to the right approver with AI justification.", icon: GitBranch, href: "/uc-03-decisioning", status: "planned" },
  { code: "UC-04", title: "Customer Onboarding & Account Setup", desc: "KYC verification, deviation handling, and account creation.", icon: UserPlus, href: "/uc-04-onboarding", status: "planned" },
  { code: "UC-05", title: "Field Visit Report Analyser", desc: "Multi-modal analysis of SME field visits.", icon: MapPin, href: "/uc-05-field-visit", status: "planned" },
  { code: "UC-06", title: "Process Analytics & TAT", desc: "Conversational analytics for managers on process velocity.", icon: Timer, href: "/uc-06-process-analytics", status: "planned" },
  { code: "UC-07", title: "Branch Operations Analytics", desc: "Branch benchmarking and training-need identification.", icon: Building2, href: "/uc-07-branch-analytics", status: "planned" },
  { code: "UC-08", title: "Incident Investigation", desc: "Log correlation, timeline reconstruction, RCA support.", icon: Siren, href: "/uc-08-incident", status: "planned" },
  { code: "UC-09", title: "Regulatory Companion", desc: "Regulation summarisation and impact assessment.", icon: Scale, href: "/uc-09-regulatory", status: "planned" },
  { code: "UC-10", title: "Compliance Planning", desc: "Change action planning and deadline tracking.", icon: ClipboardCheck, href: "/uc-10-compliance-planning", status: "planned" },
  { code: "UC-11", title: "Case Investigation & Reporting", desc: "Auto-generated STR/SAR narratives from alerts + data.", icon: FileText, href: "/uc-11-case-reporting", status: "planned" },
];

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Welcome to BankAgent"
        description="Your unified AI-assisted platform for payments, operations, and compliance. Choose a module below to get started."
      />

      {/* Metric strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Active Modules", value: "1 / 11", hint: "10 more coming soon" },
          { label: "AI Calls Today", value: "0", hint: "Ready when you are" },
          { label: "Open Cases", value: "0", hint: "No pending reviews" },
          { label: "Avg. TAT", value: "—", hint: "Measured once live" },
        ].map((m) => (
          <div key={m.label} className="card p-4">
            <div className="text-xs text-slate-500 uppercase tracking-wide">{m.label}</div>
            <div className="text-2xl font-semibold text-slate-900 mt-1">{m.value}</div>
            <div className="text-xs text-slate-500 mt-1">{m.hint}</div>
          </div>
        ))}
      </div>

      {/* Modules */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Modules</h2>
        <div className="text-xs text-slate-500">11 use cases total</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((m) => {
          const Icon = m.icon;
          const live = m.status === "live";
          return (
            <Link
              key={m.code}
              href={m.href}
              className="card p-5 hover:border-brand-500 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-md bg-brand-50 text-brand-600 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                {live ? (
                  <span className="badge badge-approved flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Live</span>
                ) : (
                  <span className="badge badge-pending flex items-center gap-1"><Clock className="w-3 h-3" /> Planned</span>
                )}
              </div>
              <div className="text-xs font-mono text-brand-500 mb-1">{m.code}</div>
              <h3 className="font-semibold text-slate-900 group-hover:text-brand-600 transition-colors">
                {m.title}
              </h3>
              <p className="text-sm text-slate-600 mt-1">{m.desc}</p>
              <div className="mt-3 text-xs text-brand-600 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Open module <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
