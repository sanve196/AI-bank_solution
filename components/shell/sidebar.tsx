"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FileSearch, ShieldAlert, GitBranch, UserPlus,
  MapPin, Timer, Building2, Siren, Scale, ClipboardCheck, FileText,
  Sparkles
} from "lucide-react";
import clsx from "clsx";

type NavItem = { href: string; label: string; icon: any; code?: string };
type NavGroup = { section: string; items: NavItem[] };

const nav: NavGroup[] = [
  { section: "Overview", items: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ]},
  { section: "Onboarding", items: [
    { href: "/uc-04-onboarding", label: "Customer Onboarding", icon: UserPlus, code: "04" },
    { href: "/uc-05-field-visit", label: "Field Visit Analyser", icon: MapPin, code: "05" },
  ]},
  { section: "Detection & Decisioning", items: [
    { href: "/uc-01-sop-deviation", label: "SOP Deviation", icon: FileSearch, code: "01" },
    { href: "/uc-02-anomaly", label: "Anomaly Detection", icon: ShieldAlert, code: "02" },
    { href: "/uc-03-decisioning", label: "Decisioning", icon: GitBranch, code: "03" },
  ]},
  { section: "Analytics", items: [
    { href: "/uc-06-process-analytics", label: "Process & TAT", icon: Timer, code: "06" },
    { href: "/uc-07-branch-analytics", label: "Branch Operations", icon: Building2, code: "07" },
  ]},
  { section: "Risk & Compliance", items: [
    { href: "/uc-08-incident", label: "Incident Investigation", icon: Siren, code: "08" },
    { href: "/uc-09-regulatory", label: "Regulatory Companion", icon: Scale, code: "09" },
    { href: "/uc-10-compliance-planning", label: "Compliance Planning", icon: ClipboardCheck, code: "10" },
    { href: "/uc-11-case-reporting", label: "Case Reporting", icon: FileText, code: "11" },
  ]},
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-60 shrink-0 glass sticky top-4 self-start flex flex-col" style={{ height: 'calc(100vh - 2rem)' }}>
      {/* Brand */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center relative overflow-hidden"
               style={{ backgroundImage: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', boxShadow: '0 1px 0 0 rgba(255,255,255,0.35) inset, 0 6px 14px -4px rgba(79,70,229,0.45)' }}>
            <Sparkles className="w-4 h-4 text-white" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <div className="text-[15px] font-medium tracking-tight text-ink-900 leading-tight">BankAgent</div>
            <div className="text-[10px] font-mono tracking-wider2 uppercase text-ink-500 mt-0.5">Agentic Platform</div>
          </div>
        </div>
      </div>

      <div className="mx-5 h-px bg-gradient-to-r from-transparent via-ink-100 to-transparent" />

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {nav.map((group) => (
          <div key={group.section} className="mb-3">
            <div className="px-3 py-1.5 label">{group.section}</div>
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "group flex items-center gap-2.5 px-3 py-2 mx-0 rounded-xl text-[13px] font-medium transition-all",
                    active
                      ? "text-ink-900"
                      : "text-ink-500 hover:text-ink-900 hover:bg-white/50"
                  )}
                  style={active ? {
                    background: 'linear-gradient(135deg, rgba(79,70,229,0.10), rgba(124,58,237,0.08))',
                    boxShadow: '0 1px 0 0 rgba(255,255,255,0.9) inset, 0 2px 8px -2px rgba(79,70,229,0.15)',
                    border: '1px solid rgba(79,70,229,0.15)',
                  } : undefined}
                >
                  <Icon className={clsx("w-4 h-4 shrink-0 transition-colors", active ? "text-accent-from" : "text-ink-500 group-hover:text-ink-700")} strokeWidth={1.75} />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.code && <span className="text-[9px] font-mono text-ink-300 tracking-wider">{item.code}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="mx-5 h-px bg-gradient-to-r from-transparent via-ink-100 to-transparent" />
      <div className="p-4 label text-center">v0.2 · Confidential</div>
    </aside>
  );
}
