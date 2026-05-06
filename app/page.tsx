import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";

export default function Home() {
  return (
    <div className="h-screen overflow-hidden bg-background">
      <Navbar />
      <Sidebar />
      <main className="ml-[260px] h-full pt-14 flex gap-4 p-4">
        <div className="flex-1 rounded-xl bg-card border border-border p-4 flex items-center justify-center">
          <span className="text-sm text-muted-foreground">Input Panel</span>
        </div>
        <div className="flex-1 rounded-xl bg-card border border-border p-4 flex items-center justify-center">
          <span className="text-sm text-muted-foreground">Output Panel</span>
        </div>
      </main>
    </div>
  );
}
