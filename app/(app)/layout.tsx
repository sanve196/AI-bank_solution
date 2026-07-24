import Sidebar from "../../components/shell/sidebar";
import Topbar from "../../components/shell/topbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex gap-4 p-4">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 gap-4">
        <Topbar />
        <main className="flex-1 overflow-x-hidden">
          <div className="max-w-6xl mx-auto w-full py-4 lg:py-6 px-1">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
