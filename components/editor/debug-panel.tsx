"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGenerateStore } from "@/store/generate";
import { GEMINI_MODEL } from "@/lib/config";

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

  const stats = [
    ["Model", GEMINI_MODEL],
    ["Latency", `${(debug.latencyMs / 1000).toFixed(2)}s`],
    ["Prompt Tokens", debug.promptTokens.toString()],
    ["Completion Tokens", debug.completionTokens.toString()],
    ["Total Tokens", (debug.promptTokens + debug.completionTokens).toString()],
    ["Temperature", debug.temperature.toString()],
  ] as const;

  return (
    <div className="rounded-xl border border-border bg-card">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
      >
        <div className="flex items-center gap-2.5">
          <span className="font-semibold">Debug Panel</span>
          <span className="rounded px-1.5 py-0.5 text-xs font-semibold bg-amber-500/20 text-amber-500">
            BETA
          </span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <span className="text-xs">{open ? "Collapse" : "Expand"}</span>
          {open ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </button>

      {open && (
        <div className="border-t border-border p-4">
          <div className="flex gap-4">
            <div className="flex-1 min-w-0">
              <Tabs defaultValue="prompt">
                <TabsList className="mb-3">
                  <TabsTrigger value="prompt">Prompt Used</TabsTrigger>
                  <TabsTrigger value="raw">Raw Response</TabsTrigger>
                  <TabsTrigger value="json">Parsed JSON</TabsTrigger>
                </TabsList>

                <TabsContent value="prompt">
                  <ScrollArea className="h-48 rounded-md border border-border bg-background p-3">
                    <pre className="whitespace-pre-wrap font-mono text-xs text-foreground">
                      <span className="text-muted-foreground">
                        {"// SYSTEM PROMPT\n"}
                      </span>
                      {debug.systemPrompt}
                      {"\n\n"}
                      <span className="text-muted-foreground">
                        {"// USER PROMPT\n"}
                      </span>
                      {debug.userPrompt}
                    </pre>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="raw">
                  <ScrollArea className="h-48 rounded-md border border-border bg-background p-3">
                    <pre className="whitespace-pre-wrap font-mono text-xs text-foreground">
                      {debug.rawResponse}
                    </pre>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="json">
                  <ScrollArea className="h-48 rounded-md border border-border bg-background p-3">
                    <pre className="whitespace-pre-wrap font-mono text-xs text-foreground">
                      {JSON.stringify(parsedJson, null, 2)}
                    </pre>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>

            <div className="w-48 shrink-0">
              <table className="w-full">
                <tbody>
                  {stats.map(([label, value]) => (
                    <tr
                      key={label}
                      className="border-b border-border last:border-b-0"
                    >
                      <td className="py-1.5 pr-3 text-xs text-muted-foreground">
                        {label}
                      </td>
                      <td className="py-1.5 text-xs font-medium text-foreground text-right">
                        {value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
