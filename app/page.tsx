import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { InputPanel } from "@/components/editor/input-panel";
import { OutputPanel } from "@/components/editor/output-panel";

export default function Home() {
  return (
    <div className="h-screen overflow-hidden bg-background">
      <Navbar />
      <Sidebar />
      <main className="ml-[260px] h-full pt-14 flex gap-4 p-4">
        <div className="flex-1 rounded-xl bg-card border border-border p-4 overflow-y-auto">
          <InputPanel />
        </div>
        <div className="flex-1 rounded-xl bg-card border border-border p-4 overflow-y-auto">
          <OutputPanel />
        </div>
      </main>
    </div>
  );
}
