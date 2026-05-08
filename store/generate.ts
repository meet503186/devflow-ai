import { create } from "zustand";
import type { GenerateResponse } from "@/types/generate";

type GenerateStatus = "idle" | "loading" | "success" | "error";

interface LastInput {
  input: string;
  taskType: string;
  instructions: string;
}

interface GenerateState {
  status: GenerateStatus;
  output: GenerateResponse | null;
  error: string | null;
  history: GenerateResponse[];
  lastInput: LastInput | null;
  generate: (input: string, taskType: string, instructions: string) => Promise<void>;
  regenerate: () => Promise<void>;
}

function formatOutputForPrompt(output: GenerateResponse): string {
  return [
    `Title: ${output.title}`,
    `\nDescription:\n${output.description}`,
    `\nAcceptance Criteria:\n${output.acceptanceCriteria.map((c) => `- ${c}`).join("\n")}`,
  ].join("\n");
}

export const useGenerateStore = create<GenerateState>((set, get) => ({
  status: "idle",
  output: null,
  error: null,
  history: [],
  lastInput: null,
  generate: async (input, taskType, instructions) => {
    set({ status: "loading", error: null, lastInput: { input, taskType, instructions } });
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, taskType, instructions }),
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
    const { output, lastInput } = get();
    if (!output || !lastInput) return;

    const previousOutput = formatOutputForPrompt(output);

    set((state) => ({
      status: "loading",
      error: null,
      history: state.output ? [...state.history, state.output] : state.history,
    }));

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lastInput, previousOutput }),
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
}));
