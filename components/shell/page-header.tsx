export default function PageHeader({
  code, title, description, actions,
}: { code?: string; title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-8 flex items-start justify-between gap-6">
      <div className="min-w-0">
        {code && <div className="label mb-3">{code}</div>}
        <h1 className="display text-3xl md:text-[38px] text-ink-900">{title}</h1>
        {description && <p className="text-[14px] text-ink-500 mt-3 max-w-2xl leading-relaxed">{description}</p>}
      </div>
      {actions && <div className="shrink-0 flex items-center gap-2">{actions}</div>}
    </div>
  );
}
