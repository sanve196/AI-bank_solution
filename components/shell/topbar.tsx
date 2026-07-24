import { Bell, Search, User } from "lucide-react";

export default function Topbar() {
  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center px-6 gap-4 sticky top-0 z-10">
      <div className="flex-1 max-w-xl relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="search"
          placeholder="Search cases, customers, regulations…"
          className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-md bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
        />
      </div>
      <button className="relative p-2 text-slate-500 hover:text-slate-700">
        <Bell className="w-5 h-5" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
      </button>
      <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700">
          <User className="w-4 h-4" />
        </div>
        <div className="text-sm hidden md:block">
          <div className="font-medium text-slate-700 leading-tight">Demo User</div>
          <div className="text-[11px] text-slate-500">Credit Officer</div>
        </div>
      </div>
    </header>
  );
}
