import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GenerateResponse, HistoryEntry } from "@/types/generate";

type GenerateStatus = "idle" | "loading" | "success" | "error";

type LastInput = {
  description: string;
  additionalInstructions: string;
};

interface GenerateState {
  description: string;
  additionalInstructions: string;
  status: GenerateStatus;
  output: GenerateResponse | null;
  error: string | null;
  history: HistoryEntry[];
  lastInput: LastInput | null;
  activeTemplateId: string | null;
  setDescription: (v: string) => void;
  setAdditionalInstructions: (v: string) => void;
  setTemplate: (templateId: string | null) => void;
  restore: (entry: HistoryEntry) => void;
  newTicket: () => void;
  generate: () => Promise<void>;
  regenerate: () => Promise<void>;
}

function formatOutputForPrompt(output: GenerateResponse): string {
  return [
    `Title: ${output.title}`,
    `\nDescription:\n${output.description}`,
    `\nAcceptance Criteria:\n${output.acceptanceCriteria.map((c) => `- ${c}`).join("\n")}`,
  ].join("\n");
}

function makeHistoryEntry(output: GenerateResponse, input: LastInput): HistoryEntry {
  const { debugInfo: _, ...outputWithoutDebug } = output;
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    output: outputWithoutDebug,
    input,
    timestamp: Date.now(),
  };
}

export const useGenerateStore = create<GenerateState>()(
  persist(
    (set, get) => ({
      description: "",
      additionalInstructions: "",
      status: "idle" as GenerateStatus,
      output: null,
      error: null,
      history: [],
      lastInput: null,
      activeTemplateId: null,

      setDescription: (v) => set({ description: v }),
      setAdditionalInstructions: (v) => set({ additionalInstructions: v }),
      setTemplate: (templateId) => set({ activeTemplateId: templateId }),

      restore: (entry) =>
        set({
          status: "success",
          output: { ...entry.output },
          lastInput: entry.input,
          error: null,
          description: entry.input.description,
          additionalInstructions: entry.input.additionalInstructions,
        }),

      newTicket: () =>
        set((state) => ({
          description: "",
          additionalInstructions: "",
          status: "idle",
          output: null,
          error: null,
          lastInput: null,
          activeTemplateId: null,
          history:
            state.output && state.lastInput
              ? [makeHistoryEntry(state.output, state.lastInput), ...state.history]
              : state.history,
        })),

      generate: async () => {
        const { description, additionalInstructions, activeTemplateId } = get();
        const newLastInput: LastInput = { description, additionalInstructions };

        set((state) => ({
          status: "loading",
          error: null,
          lastInput: newLastInput,
          history:
            state.output && state.lastInput
              ? [makeHistoryEntry(state.output, state.lastInput), ...state.history]
              : state.history,
        }));

        try {
          const res = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              input: description,
              instructions: additionalInstructions || undefined,
              templateId: activeTemplateId ?? undefined,
            }),
          });
          const data = await res.json();
          if (!res.ok) {
            set({ status: "error", error: data.error ?? "Generation failed." });
            return;
          }
          set({ status: "success", output: data });
        } catch {
          set({ status: "error", error: "Network error. Please try again." });
        }
      },

      regenerate: async () => {
        const { output, lastInput, activeTemplateId } = get();
        if (!output || !lastInput) return;

        const previousOutput = formatOutputForPrompt(output);

        set((state) => ({
          status: "loading",
          error: null,
          history:
            state.output && state.lastInput
              ? [makeHistoryEntry(state.output, state.lastInput), ...state.history]
              : state.history,
        }));

        try {
          const res = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              input: lastInput.description,
              instructions: lastInput.additionalInstructions || undefined,
              previousOutput,
              templateId: activeTemplateId ?? undefined,
            }),
          });
          const data = await res.json();
          if (!res.ok) {
            set({ status: "error", error: data.error ?? "Regeneration failed." });
            return;
          }
          set({ status: "success", output: data });
        } catch {
          set({ status: "error", error: "Network error. Please try again." });
        }
      },
    }),
    {
      name: "devflow-history",
      partialize: (state) => ({ history: state.history }),
    }
  )
);
