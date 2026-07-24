"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FileSearch, ShieldAlert, GitBranch, UserPlus,
  MapPin, Timer, Building2, Siren, Scale, ClipboardCheck, FileText,
  Landmark
} from "lucide-react";
import clsx from "clsx";

type NavItem = { href: string; label: string; icon: any; code?: string };
type NavGroup = { section: string; items: NavItem[] };

const nav: NavGroup[] = [
  { section: "Overview", items: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ]},
  { section: "Onboarding", items: [
    { href: "/uc-04-onboarding", label: "Customer Onboarding", icon: UserPlus, code: "UC-04" },
    { href: "/uc-05-field-visit", label: "Field Visit Analyser", icon: MapPin, code: "UC-05" },
  ]},
  { section: "Detection & Decisioning", items: [
    { href: "/uc-01-sop-deviation", label: "SOP Deviation", icon: FileSearch, code: "UC-01" },
    { href: "/uc-02-anomaly", label: "Anomaly Detection", icon: ShieldAlert, code: "UC-02" },
    { href: "/uc-03-decisioning", label: "Decisioning", icon: GitBranch, code: "UC-03" },
  ]},
  { section: "Analytics", items: [
    { href: "/uc-06-process-analytics", label: "Process & TAT", icon: Timer, code: "UC-06" },
    { href: "/uc-07-branch-analytics", label: "Branch Operations", icon: Building2, code: "UC-07" },
  ]},
  { section: "Risk & Compliance", items: [
    { href: "/uc-08-incident", label: "Incident Investigation", icon: Siren, code: "UC-08" },
    { href: "/uc-09-regulatory", label: "Regulatory Companion", icon: Scale, code: "UC-09" },
    { href: "/uc-10-compliance-planning", label: "Compliance Planning", icon: ClipboardCheck, code: "UC-10" },
    { href: "/uc-11-case-reporting", label: "Case Reporting", icon: FileText, code: "UC-11" },
  ]},
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 shrink-0 bg-brand-900 text-slate-100 flex flex-col min-h-screen sticky top-0">
      <div className="px-5 py-5 border-b border-white/10 flex items-center gap-3">
        <div className="w-9 h-9 rounded-md bg-brand-500 flex items-center justify-center">
          <Landmark className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="font-semibold text-white leading-tight">BankAgent</div>
          <div className="text-[11px] text-slate-400">Agentic AI Platform</div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-3">
        {nav.map((group) => (
          <div key={group.section} className="mb-4">
            <div className="px-5 py-1.5 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              {group.section}
            </div>
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-3 px-5 py-2 text-sm transition-colors",
                    active
                      ? "bg-brand-600 text-white border-l-2 border-brand-500"
                      : "text-slate-300 hover:bg-white/5 hover:text-white border-l-2 border-transparent"
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.code && <span className="text-[9px] text-slate-500 font-mono">{item.code}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10 text-[11px] text-slate-400">
        v0.1.0 • Confidential
      </div>
    </aside>
  );
}
