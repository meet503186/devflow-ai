import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { InputPanel } from "@/components/editor/input-panel";
import { OutputPanel } from "@/components/editor/output-panel";
import { DebugPanel } from "@/components/editor/debug-panel";

export default function Home() {
  return (
    <div className="h-screen overflow-hidden bg-background">
      <Navbar />
      <Sidebar />
      <main className="ml-[260px] flex h-full flex-col gap-4 p-4 pt-14">
        <div className="flex min-h-0 flex-1 gap-4">
          <div className="flex-1 overflow-y-auto rounded-xl border border-border bg-card p-4">
            <InputPanel />
          </div>
          <div className="flex-1 overflow-y-auto rounded-xl border border-border bg-card p-4">
            <OutputPanel />
          </div>
        </div>
        <DebugPanel />
      </main>
    </div>
  );
}
