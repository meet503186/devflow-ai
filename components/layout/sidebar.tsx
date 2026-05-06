import { History, LayoutTemplate } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-14 bottom-0 w-[260px] bg-card border-r border-border flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          <section>
            <div className="flex items-center gap-2 mb-3">
              <History className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                History
              </span>
            </div>
            <p className="text-xs text-muted-foreground">No history yet.</p>
          </section>
          <section>
            <div className="flex items-center gap-2 mb-3">
              <LayoutTemplate className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Templates
              </span>
            </div>
            <p className="text-xs text-muted-foreground">No templates yet.</p>
          </section>
        </div>
      </ScrollArea>
    </aside>
  );
}
