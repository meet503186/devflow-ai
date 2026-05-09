"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import {
  Copy,
  Check,
  Loader2,
  AlertCircle,
  RefreshCw,
  ChevronDown,
  CheckCircle2,
  Clock,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGenerateStore } from "@/store/generate";
import { ScrollArea } from "../ui/scroll-area";

function useCopyToClipboard() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  };
  return { copied, copy };
}

export function OutputPanel() {
  const { status, output, error, regenerate } = useGenerateStore();
  const [title, setTitle] = useState(output?.title ?? "");
  const [description, setDescription] = useState(output?.description ?? "");
  const [copyDropdownCopied, setCopyDropdownCopied] = useState(false);
  const { copied, copy } = useCopyToClipboard();

  useEffect(() => {
    if (output) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTitle(output.title);
      setDescription(output.description);
    }
  }, [output]);

  const criteria =
    status === "success" && output ? output.acceptanceCriteria : [];
  const debugInfo = output?.debugInfo;
  const totalTokens = debugInfo
    ? debugInfo.promptTokens + debugInfo.completionTokens
    : 0;
  const isSuccess = status === "success" && output != null;

  const copyAs = (format: "markdown" | "json" | "plaintext") => {
    let text = "";
    if (format === "markdown") {
      text = `# ${title}\n\n## Description\n\n${description}\n\n## Acceptance Criteria\n\n${criteria
        .map((c) => `- ${c}`)
        .join("\n")}`;
    } else if (format === "json") {
      text = JSON.stringify(
        { title, description, acceptanceCriteria: criteria },
        null,
        2
      );
    } else {
      text = `Title: ${title}\n\nDescription:\n${description}\n\nAcceptance Criteria:\n${criteria
        .map((c) => `• ${c}`)
        .join("\n")}`;
    }
    navigator.clipboard.writeText(text).then(() => {
      setCopyDropdownCopied(true);
      setTimeout(() => setCopyDropdownCopied(false), 2000);
    });
  };

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-6">
        {/* Panel header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#14B8A6] text-xs font-bold text-white">
              2
            </span>
            <h2 className="text-lg font-bold text-foreground">
              Generated Jira Ticket
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!isSuccess}
              onClick={regenerate}
              className="flex items-center gap-1.5 text-sm disabled:opacity-40"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Regenerate
            </Button>

            <DropdownMenuPrimitive.Root>
              <DropdownMenuPrimitive.Trigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!isSuccess}
                  className="flex items-center gap-1.5 text-sm disabled:opacity-40"
                >
                  {copyDropdownCopied ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  Copy as
                  <ChevronDown className="h-3 w-3 opacity-60" />
                </Button>
              </DropdownMenuPrimitive.Trigger>
              <DropdownMenuPrimitive.Portal>
                <DropdownMenuPrimitive.Content
                  align="end"
                  sideOffset={4}
                  className={cn(
                    "z-50 min-w-[8rem] overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md",
                    "data-[state=open]:animate-in data-[state=closed]:animate-out",
                    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                    "data-[side=bottom]:slide-in-from-top-2"
                  )}
                >
                  {(["Markdown", "JSON", "Plain Text"] as const).map(
                    (label) => {
                      const fmt =
                        label === "Plain Text"
                          ? "plaintext"
                          : (label.toLowerCase() as "markdown" | "json");
                      return (
                        <DropdownMenuPrimitive.Item
                          key={label}
                          onSelect={() => copyAs(fmt)}
                          className="relative flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground"
                        >
                          {label}
                        </DropdownMenuPrimitive.Item>
                      );
                    }
                  )}
                </DropdownMenuPrimitive.Content>
              </DropdownMenuPrimitive.Portal>
            </DropdownMenuPrimitive.Root>
          </div>
        </div>

        {/* Loading state */}
        {status === "loading" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm">Generating your ticket…</p>
          </div>
        )}

        {/* Error state */}
        {status === "error" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Idle empty state */}
        {status === "idle" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-muted-foreground">
            <p className="text-sm">
              Fill in the description and click{" "}
              <span className="font-semibold text-foreground">
                Generate Ticket
              </span>{" "}
              to see results here.
            </p>
          </div>
        )}

        {/* Success: output fields */}
        {isSuccess && (
          <>
            {/* Title */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Title
                </span>
                <button
                  onClick={() => copy(title, "title")}
                  className="rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {copied === "title" ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-md text-sm font-medium"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Description
                </span>
                <button
                  onClick={() => copy(description, "description")}
                  className="rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {copied === "description" ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px] resize-none rounded-md text-sm leading-relaxed"
              />
            </div>

            {/* Acceptance Criteria */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Acceptance Criteria
              </span>
              <ul className="flex flex-col rounded-md border border-border bg-background overflow-hidden">
                {criteria.map((criterion, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm border-b border-border last:border-b-0"
                  >
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500 mt-0.5" />
                      <span className="text-foreground">{criterion}</span>
                    </div>
                    <button
                      onClick={() => copy(criterion, `criterion-${index}`)}
                      className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {copied === `criterion-${index}` ? (
                        <Check className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stats pills */}
            {debugInfo && (
              <div className="flex items-center gap-2 pt-1">
                <span className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  Generated in {(debugInfo.latencyMs / 1000).toFixed(2)}s
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                  <Cpu className="h-3.5 w-3.5" />~{totalTokens} tokens
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </ScrollArea>
  );
}
