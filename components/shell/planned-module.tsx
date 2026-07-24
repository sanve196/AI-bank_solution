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
        actions={<span className="badge badge-pending flex items-center gap-1"><Clock className="w-3 h-3" /> Coming soon</span>}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <h3 className="font-semibold text-sm text-slate-700">Planned Features</h3>
          </div>
          <ul className="space-y-2">
            {features.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" /> {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-brand-600" />
            <h3 className="font-semibold text-sm text-slate-700">End-to-End Workflow</h3>
          </div>
          <ol className="space-y-2">
            {workflow.map((s, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 text-xs font-semibold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="mt-6 card p-5 bg-brand-50 border-brand-100">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-sm text-slate-900">Reference implementation available</div>
            <p className="text-sm text-slate-700 mt-1">
              This module follows the same pattern as <a href="/uc-01-sop-deviation" className="text-brand-600 underline">UC-01 SOP Deviation</a>, which is fully implemented. Development for this module can begin using UC-01 as a template.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
