"use client";

import { Plus, FileText } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGenerateStore } from "@/store/generate";
import type { HistoryEntry } from "@/types/generate";

function relativeTime(timestamp: number): string {
  const diff = Math.floor((Date.now() - timestamp) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  const days = Math.floor(diff / 86400);
  if (days === 1) return "Yesterday";
  return new Date(timestamp).toLocaleDateString();
}

function HistoryItem({ entry, onRestore }: { entry: HistoryEntry; onRestore: () => void }) {
  const title = entry.output.title.length > 36
    ? entry.output.title.slice(0, 36) + "…"
    : entry.output.title;

  return (
    <button
      onClick={onRestore}
      className="w-full text-left rounded-md px-3 py-2.5 transition-colors hover:bg-slate-700/50 flex items-start gap-2.5"
    >
      <FileText className="h-4 w-4 shrink-0 mt-0.5 text-slate-500" />
      <span className="flex flex-col gap-0.5 min-w-0">
        <span className="text-xs font-medium text-slate-200 leading-snug truncate">
          {title}
        </span>
        <span className="text-[11px] text-slate-500">
          {relativeTime(entry.timestamp)}
        </span>
      </span>
    </button>
  );
}

export function Sidebar() {
  const { history, restore, newTicket } = useGenerateStore();

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-[260px] bg-[#0F172A] border-r border-slate-700/50 flex flex-col">
      <div className="p-3 border-b border-slate-700/50">
        <button
          onClick={newTicket}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-violet-600 hover:bg-violet-700 transition-colors h-10 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" />
          New Ticket
        </button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          <section>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              History
            </span>
            <div className="mt-3">
              {history.length === 0 ? (
                <p className="text-xs text-slate-600">No history yet.</p>
              ) : (
                <div className="space-y-0.5">
                  {history.map((entry) => (
                    <HistoryItem
                      key={entry.id}
                      entry={entry}
                      onRestore={() => restore(entry)}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* <section>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Templates
            </span>
            <div className="mt-3 space-y-0.5">
              {TEMPLATES.map((template) => {
                const isActive = activeTemplateId === template.id;
                return (
                  <button
                    key={template.id}
                    onClick={() => setTemplate(isActive ? null : template.id)}
                    className={[
                      "w-full text-left rounded-md px-3 py-2.5 transition-colors",
                      "flex items-center gap-2.5",
                      isActive
                        ? "bg-violet-600/20 border border-violet-500/30"
                        : "hover:bg-slate-700/50 border border-transparent",
                    ].join(" ")}
                  >
                    <span className="text-base leading-none">{template.emoji}</span>
                    <span className="text-xs font-medium text-slate-200">{template.name}</span>
                  </button>
                );
              })}
            </div>
          </section> */}
        </div>
      </ScrollArea>
    </aside>
  );
}
