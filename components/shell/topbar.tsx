import { Bell, Search, User } from "lucide-react";

export default function Topbar() {
  return (
    <header className="glass h-14 flex items-center px-4 gap-3 sticky top-4 z-10">
      <div className="flex-1 max-w-lg relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" strokeWidth={1.75} />
        <input
          type="search"
          placeholder="Search cases, customers, regulations…"
          className="w-full pl-9 pr-3 py-1.5 text-[13px] bg-transparent border-0 focus:outline-none placeholder:text-ink-300"
        />
      </div>
      <button className="relative p-2 rounded-xl text-ink-500 hover:text-ink-900 hover:bg-white/60 transition-colors">
        <Bell className="w-4 h-4" strokeWidth={1.75} />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
              style={{ backgroundImage: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }} />
      </button>
      <div className="w-px h-6 bg-ink-100" />
      <div className="flex items-center gap-2.5 pr-1">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium"
             style={{ backgroundImage: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
          <User className="w-4 h-4" strokeWidth={1.75} />
        </div>
        <div className="hidden md:block">
          <div className="text-[13px] font-medium text-ink-900 leading-tight tracking-tight">Demo User</div>
          <div className="text-[10px] font-mono tracking-wider uppercase text-ink-500 mt-0.5">Credit Officer</div>
        </div>
      </div>
    </header>
  );
}
