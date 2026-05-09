"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, HelpCircle, Loader2 } from "lucide-react";
import { useGenerateStore } from "@/store/generate";
import { TEMPLATES, getTemplate } from "@/lib/templates";
import { ScrollArea } from "../ui/scroll-area";

const MAX_CHARS = 2000;

export function InputPanel() {
  const {
    description,
    additionalInstructions,
    setDescription,
    setAdditionalInstructions,
    generate,
    status,
    activeTemplateId,
    setTemplate,
  } = useGenerateStore();

  const isLoading = status === "loading";
  const isDisabled = description.trim().length === 0 || isLoading;
  const charCount = description.length;
  const selectedOption = activeTemplateId
    ? getTemplate(activeTemplateId)
    : null;

  return (
    <ScrollArea className="h-full">
      <div className="flex h-full flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#6366F1] text-xs font-bold text-white">
              1
            </span>
            <h2 className="text-lg font-bold text-foreground">
              Describe the issue or task
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Provide as much context as possible. Our AI will convert it to a
            well-structured Jira ticket.
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <Textarea
            placeholder="Describe the issue or task..."
            value={description}
            onChange={(e) => {
              if (e.target.value.length <= MAX_CHARS)
                setDescription(e.target.value);
            }}
            className="min-h-[160px] resize-none text-sm"
          />
          <p
            className={`text-right text-xs ${
              charCount > MAX_CHARS - 100
                ? "text-destructive"
                : "text-muted-foreground"
            }`}
          >
            {charCount} / {MAX_CHARS}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-foreground">Template</label>
          <Select
            value={activeTemplateId || undefined}
            onValueChange={setTemplate}
          >
            <SelectTrigger className="h-11 w-full text-sm">
              {selectedOption ? (
                <span className="flex items-center gap-2">
                  <span>{selectedOption.emoji}</span>
                  <span>{selectedOption.name}</span>
                </span>
              ) : (
                <SelectValue placeholder="Select a type..." />
              )}
            </SelectTrigger>
            <SelectContent
              position="popper"
              sideOffset={4}
              className="w-[--radix-select-trigger-width]"
            >
              {TEMPLATES.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  <span className="flex items-center gap-2">
                    <span>{option.emoji}</span>
                    <span>{option.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5">
            <label className="text-sm font-bold text-foreground">
              Additional Instructions
            </label>
            <span className="text-sm text-muted-foreground">(optional)</span>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <Textarea
            placeholder="Make it concise and include edge cases"
            value={additionalInstructions}
            onChange={(e) => setAdditionalInstructions(e.target.value)}
            className="min-h-[96px] resize-none text-sm"
          />
        </div>

        <div className="mt-auto pt-1">
          <Button
            disabled={isDisabled}
            onClick={generate}
            className="h-12 w-full gap-2 rounded-md text-base font-semibold"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Sparkles className="h-5 w-5" />
            )}
            {isLoading ? "Generating…" : "Generate Ticket"}
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
}
