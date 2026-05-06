"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

const MOCK_DATA = {
  title: "Fix login redirect after session expiry",
  description:
    "Users are not being redirected to the login page after their session expires. Instead, they see a blank screen or a 401 error without any user-friendly message. This affects all authenticated routes and degrades the user experience significantly.",
  acceptanceCriteria: [
    "When a session expires, the user is automatically redirected to /login",
    "A toast notification informs the user their session has expired",
    "After re-authenticating, the user is returned to the page they were on",
    "The fix works consistently across all authenticated routes",
    "No console errors appear during the redirect flow",
  ],
};

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
  const [title, setTitle] = useState(MOCK_DATA.title);
  const [description, setDescription] = useState(MOCK_DATA.description);
  const { copied, copy } = useCopyToClipboard();

  const allMarkdown = `# ${title}\n\n## Description\n\n${description}\n\n## Acceptance Criteria\n\n${MOCK_DATA.acceptanceCriteria.map((c) => `- ${c}`).join("\n")}`;

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
          onClick={() => copy(allMarkdown, "all")}
          className="flex items-center gap-2 rounded-md border-[var(--border-default)] text-sm"
        >
          {copied === "all" ? (
            <Check className="h-4 w-4 text-[var(--state-success)]" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          {copied === "all" ? "Copied!" : "Copy All as Markdown"}
        </Button>
      </div>

      {/* Title */}
      <div className="flex flex-col gap-2">
        <SectionHeader
          label="Title"
          onCopy={() => copy(title, "title")}
          isCopied={copied === "title"}
        />
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-md border-[var(--border-default)] text-sm font-medium text-[var(--text-primary)]"
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2">
        <SectionHeader
          label="Description"
          onCopy={() => copy(description, "description")}
          isCopied={copied === "description"}
        />
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[120px] resize-none rounded-md border-[var(--border-default)] text-sm leading-relaxed text-[var(--text-primary)]"
        />
      </div>

      {/* Acceptance Criteria */}
      <div className="flex flex-col gap-2">
        <SectionHeader
          label="Acceptance Criteria"
          onCopy={() =>
            copy(
              MOCK_DATA.acceptanceCriteria.map((c) => `- ${c}`).join("\n"),
              "criteria"
            )
          }
          isCopied={copied === "criteria"}
        />
        <ul className="flex flex-col gap-2 rounded-md border border-[var(--border-default)] bg-[var(--bg-base)] p-3">
          {MOCK_DATA.acceptanceCriteria.map((criterion, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <span className="mt-0.5 h-4 w-4 shrink-0 rounded-sm bg-[var(--accent-primary)]/15 text-center text-[10px] font-bold leading-4 text-[var(--accent-primary)]">
                {index + 1}
              </span>
              <span className="text-[var(--text-primary)]">{criterion}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
