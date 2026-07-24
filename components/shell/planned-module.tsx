import PageHeader from "./page-header";
import { Clock, CheckCircle2, Sparkles } from "lucide-react";

export default function PlannedModule({
  code, title, description, features, workflow,
}: {
  code: string; title: string; description: string;
  features: string[]; workflow: string[];
}) {
  return (
    <>
      <PageHeader
        code={code}
        title={title}
        description={description}
        actions={<span className="badge badge-pending"><Clock className="w-3 h-3" strokeWidth={1.75} /> Coming soon</span>}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-accent-from" strokeWidth={1.75} />
            <div className="label">Planned features</div>
          </div>
          <ul className="space-y-3">
            {features.map((f, i) => (
              <li key={i} className="flex items-start gap-3 text-[13px] text-ink-700 leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-accent-from/70 shrink-0 mt-0.5" strokeWidth={1.5} /> {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="glass p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-3.5 h-3.5 text-accent-from" strokeWidth={1.75} />
            <div className="label">End-to-end workflow</div>
          </div>
          <ol className="space-y-3">
            {workflow.map((s, i) => (
              <li key={i} className="flex items-start gap-3 text-[13px] text-ink-700 leading-relaxed">
                <span className="w-5 h-5 rounded-lg font-mono text-[10px] font-medium flex items-center justify-center shrink-0 text-white mt-0.5"
                      style={{ backgroundImage: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="mt-5 glass p-5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
               style={{ background: 'rgba(79, 70, 229, 0.10)' }}>
            <Sparkles className="w-4 h-4 text-accent-from" strokeWidth={1.75} />
          </div>
          <div>
            <div className="text-[13px] font-medium text-ink-900">Reference implementation available</div>
            <p className="text-[13px] text-ink-500 mt-1 leading-relaxed">
              This module follows the same pattern as{" "}
              <a href="/uc-01-sop-deviation" className="text-accent underline underline-offset-2">UC-01 SOP Deviation</a>,
              which is fully implemented. Development can begin using UC-01 as a template.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
