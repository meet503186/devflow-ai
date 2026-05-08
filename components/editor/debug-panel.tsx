"use client";

import { useState } from "react";
import { Bug, ChevronDown, ChevronUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGenerateStore } from "@/store/generate";

export function DebugPanel() {
  const { output } = useGenerateStore();
  const [open, setOpen] = useState(false);

  const debug = output?.debugInfo;
  if (!debug) return null;

  const parsedJson = {
    title: output.title,
    description: output.description,
    acceptanceCriteria: output.acceptanceCriteria,
  };

  const totalTokens = debug.promptTokens + debug.responseTokens;

  return (
    <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-base)]"
      >
        <div className="flex items-center gap-2">
          <Bug className="h-4 w-4 text-[var(--accent-primary)]" />
          <span>Debug Info</span>
          <div className="ml-3 flex items-center gap-4 text-xs text-[var(--text-muted)]">
            <span>{debug.latencyMs}ms</span>
            <span>~{totalTokens} tokens</span>
          </div>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 text-[var(--text-muted)]" />
        ) : (
          <ChevronDown className="h-4 w-4 text-[var(--text-muted)]" />
        )}
      </button>

      {open && (
        <div className="border-t border-[var(--border-default)] p-4">
          <Tabs defaultValue="prompt">
            <TabsList className="mb-3">
              <TabsTrigger value="prompt">Prompt Used</TabsTrigger>
              <TabsTrigger value="raw">Raw Response</TabsTrigger>
              <TabsTrigger value="json">Parsed JSON</TabsTrigger>
            </TabsList>

            <TabsContent value="prompt">
              <ScrollArea className="h-48 rounded-md border border-[var(--border-default)] bg-[var(--bg-base)] p-3">
                <pre className="whitespace-pre-wrap font-mono text-xs text-[var(--text-primary)]">
                  <span className="text-[var(--text-muted)]">{"// SYSTEM PROMPT\n"}</span>
                  {debug.systemPrompt}
                  {"\n\n"}
                  <span className="text-[var(--text-muted)]">{"// USER PROMPT\n"}</span>
                  {debug.userPrompt}
                </pre>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="raw">
              <ScrollArea className="h-48 rounded-md border border-[var(--border-default)] bg-[var(--bg-base)] p-3">
                <pre className="whitespace-pre-wrap font-mono text-xs text-[var(--text-primary)]">
                  {debug.rawResponse}
                </pre>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="json">
              <ScrollArea className="h-48 rounded-md border border-[var(--border-default)] bg-[var(--bg-base)] p-3">
                <pre className="whitespace-pre-wrap font-mono text-xs text-[var(--text-primary)]">
                  {JSON.stringify(parsedJson, null, 2)}
                </pre>
              </ScrollArea>
            </TabsContent>
          </Tabs>

          <div className="mt-3 flex items-center gap-6 border-t border-[var(--border-default)] pt-3 text-xs text-[var(--text-muted)]">
            <span>
              Latency:{" "}
              <strong className="text-[var(--text-primary)]">{debug.latencyMs}ms</strong>
            </span>
            <span>
              Prompt tokens:{" "}
              <strong className="text-[var(--text-primary)]">~{debug.promptTokens}</strong>
            </span>
            <span>
              Response tokens:{" "}
              <strong className="text-[var(--text-primary)]">~{debug.responseTokens}</strong>
            </span>
            <span>
              Total:{" "}
              <strong className="text-[var(--text-primary)]">~{totalTokens}</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
