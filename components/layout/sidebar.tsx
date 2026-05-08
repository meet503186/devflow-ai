"use client";

import { History, LayoutTemplate } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TEMPLATES } from "@/lib/templates";
import { useGenerateStore } from "@/store/generate";

export function Sidebar() {
  const { activeTemplateId, setTemplate } = useGenerateStore();

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
            <div className="space-y-1.5">
              {TEMPLATES.map((template) => {
                const isActive = activeTemplateId === template.id;
                return (
                  <button
                    key={template.id}
                    onClick={() =>
                      setTemplate(isActive ? null : template.id)
                    }
                    className={[
                      "w-full text-left rounded-md px-3 py-2.5 transition-colors",
                      "flex items-start gap-2.5",
                      isActive
                        ? "bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 text-[var(--text-primary)]"
                        : "hover:bg-[var(--bg-base)] text-[var(--text-primary)] border border-transparent",
                    ].join(" ")}
                  >
                    <span className="text-base leading-none mt-0.5">
                      {template.emoji}
                    </span>
                    <span className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-xs font-semibold leading-none">
                        {template.name}
                      </span>
                      <span className="text-xs text-[var(--text-muted)] leading-tight">
                        {template.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </ScrollArea>
    </aside>
  );
}
