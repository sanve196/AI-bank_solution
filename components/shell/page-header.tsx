export default function PageHeader({
  code, title, description, actions,
}: { code?: string; title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        {code && <div className="text-xs font-mono text-brand-500 mb-1">{code}</div>}
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        {description && <p className="text-sm text-slate-600 mt-1 max-w-2xl">{description}</p>}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}
