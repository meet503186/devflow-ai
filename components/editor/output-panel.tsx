"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, Check, Loader2, AlertCircle } from "lucide-react";
import { useGenerateStore } from "@/store/generate";

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

function SectionHeader({
  label,
  onCopy,
  isCopied,
}: {
  label: string;
  onCopy: () => void;
  isCopied: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
        {label}
      </span>
      <button
        onClick={onCopy}
        className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-base)] hover:text-[var(--text-primary)]"
      >
        {isCopied ? (
          <Check className="h-3.5 w-3.5 text-[var(--state-success)]" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
        {isCopied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

export function OutputPanel() {
  const { status, output, error } = useGenerateStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { copied, copy } = useCopyToClipboard();

  const displayTitle = status === "success" && output ? output.title : title;
  const displayDescription =
    status === "success" && output ? output.description : description;
  const criteria =
    status === "success" && output ? output.acceptanceCriteria : [];

  const allMarkdown =
    status === "success" && output
      ? `# ${displayTitle}\n\n## Description\n\n${displayDescription}\n\n## Acceptance Criteria\n\n${criteria.map((c) => `- ${c}`).join("\n")}`
      : "";

  return (
    <div className="flex h-full flex-col gap-6">
      {/* Panel header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            Generated Ticket
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            Review and edit the output before copying.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={status !== "success"}
          onClick={() => copy(allMarkdown, "all")}
          className="flex items-center gap-2 rounded-md border-[var(--border-default)] text-sm disabled:opacity-40"
        >
          {copied === "all" ? (
            <Check className="h-4 w-4 text-[var(--state-success)]" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          {copied === "all" ? "Copied!" : "Copy All as Markdown"}
        </Button>
      </div>

      {/* Loading state */}
      {status === "loading" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-[var(--text-muted)]">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--accent-primary)]" />
          <p className="text-sm">Generating your ticket…</p>
        </div>
      )}

      {/* Error state */}
      {status === "error" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-[var(--state-error)]/30 bg-[var(--state-error)]/10 px-4 py-3 text-sm text-[var(--state-error)]">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Idle empty state */}
      {status === "idle" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-[var(--text-muted)]">
          <p className="text-sm">
            Fill in the description and click{" "}
            <span className="font-semibold text-[var(--text-primary)]">
              Generate Ticket
            </span>{" "}
            to see results here.
          </p>
        </div>
      )}

      {/* Success: output fields */}
      {status === "success" && output && (
        <>
          {/* Title */}
          <div className="flex flex-col gap-2">
            <SectionHeader
              label="Title"
              onCopy={() => copy(displayTitle, "title")}
              isCopied={copied === "title"}
            />
            <Input
              value={displayTitle}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-md border-[var(--border-default)] text-sm font-medium text-[var(--text-primary)]"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <SectionHeader
              label="Description"
              onCopy={() => copy(displayDescription, "description")}
              isCopied={copied === "description"}
            />
            <Textarea
              value={displayDescription}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px] resize-none rounded-md border-[var(--border-default)] text-sm leading-relaxed text-[var(--text-primary)]"
            />
          </div>

          {/* Acceptance Criteria */}
          <div className="flex flex-col gap-2">
            <SectionHeader
              label="Acceptance Criteria"
              onCopy={() =>
                copy(criteria.map((c) => `- ${c}`).join("\n"), "criteria")
              }
              isCopied={copied === "criteria"}
            />
            <ul className="flex flex-col gap-2 rounded-md border border-[var(--border-default)] bg-[var(--bg-base)] p-3">
              {criteria.map((criterion, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 h-4 w-4 shrink-0 rounded-sm bg-[var(--accent-primary)]/15 text-center text-[10px] font-bold leading-4 text-[var(--accent-primary)]">
                    {index + 1}
                  </span>
                  <span className="text-[var(--text-primary)]">{criterion}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
