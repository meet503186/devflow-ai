import { create } from "zustand";
import type { GenerateResponse } from "@/types/generate";

type GenerateStatus = "idle" | "loading" | "success" | "error";

interface GenerateState {
  status: GenerateStatus;
  output: GenerateResponse | null;
  error: string | null;
  generate: (input: string, taskType: string, instructions: string) => Promise<void>;
}

export const useGenerateStore = create<GenerateState>((set) => ({
  status: "idle",
  output: null,
  error: null,
  generate: async (input, taskType, instructions) => {
    set({ status: "loading", error: null });
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
}));
