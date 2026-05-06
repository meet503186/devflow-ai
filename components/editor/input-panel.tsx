"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, HelpCircle } from "lucide-react";

type TaskType = "bug" | "feature" | "task";

const TASK_TYPE_OPTIONS: { value: TaskType; label: string; emoji: string }[] = [
  { value: "bug", label: "Bug Report", emoji: "🐛" },
  { value: "feature", label: "Feature Request", emoji: "✨" },
  { value: "task", label: "Task", emoji: "✅" },
];

const MAX_CHARS = 2000;

export function InputPanel() {
  const [description, setDescription] = useState("");
  const [taskType, setTaskType] = useState<TaskType | "">("");
  const [additionalInstructions, setAdditionalInstructions] = useState("");

  const isDisabled = description.trim().length === 0;
  const charCount = description.length;

  const selectedOption = TASK_TYPE_OPTIONS.find((o) => o.value === taskType);

  return (
    <div className="flex h-full flex-col gap-6">
      {/* Step header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent-primary)] text-xs font-bold text-white">
            1
          </span>
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            Describe the issue or task
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-[var(--text-muted)]">
          Provide as much context as possible. Our AI will convert it to a
          well-structured Jira ticket.
        </p>
      </div>

      {/* Main description textarea */}
      <div className="flex flex-col gap-1">
        <Textarea
          placeholder="Describe the issue or task..."
          value={description}
          onChange={(e) => {
            if (e.target.value.length <= MAX_CHARS) {
              setDescription(e.target.value);
            }
          }}
          className="min-h-[160px] resize-none rounded-md border-[var(--border-default)] text-sm"
        />
        <p
          className={`text-right text-xs ${
            charCount > MAX_CHARS - 100
              ? "text-[var(--state-error)]"
              : "text-[var(--text-muted)]"
          }`}
        >
          {charCount} / {MAX_CHARS}
        </p>
      </div>

      {/* Task Type */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-[var(--text-primary)]">
          Task Type
        </label>
        <Select
          value={taskType}
          onValueChange={(v) => setTaskType(v as TaskType)}
        >
          <SelectTrigger className="h-11 w-full rounded-md border-[var(--border-default)] text-sm">
            {selectedOption ? (
              <span className="flex items-center gap-2">
                <span>{selectedOption.emoji}</span>
                <span>{selectedOption.label}</span>
              </span>
            ) : (
              <SelectValue placeholder="Select a type..." />
            )}
          </SelectTrigger>
          <SelectContent position="popper" sideOffset={4} className="w-[--radix-select-trigger-width]">
            {TASK_TYPE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <span className="flex items-center gap-2">
                  <span>{option.emoji}</span>
                  <span>{option.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Additional Instructions */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <label className="text-sm font-bold text-[var(--text-primary)]">
            Additional Instructions
          </label>
          <span className="text-sm text-[var(--text-muted)]">(optional)</span>
          <HelpCircle className="h-4 w-4 text-[var(--text-muted)]" />
        </div>
        <Textarea
          placeholder="Make it concise and include edge cases"
          value={additionalInstructions}
          onChange={(e) => setAdditionalInstructions(e.target.value)}
          className="min-h-[96px] resize-none rounded-md border-[var(--border-default)] text-sm"
        />
      </div>

      {/* Generate button */}
      <div className="mt-auto pt-1">
        <Button
          disabled={isDisabled}
          className="h-12 w-full gap-2 rounded-md bg-[var(--accent-primary)] text-base font-semibold text-white hover:bg-[var(--accent-primary)]/90 disabled:opacity-50"
        >
          <Sparkles className="h-5 w-5" />
          Generate Ticket
        </Button>
      </div>
    </div>
  );
}
