import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GenerateResponse, TicketSession, TicketVersion } from "@/types/generate";

type GenerateStatus = "idle" | "loading" | "success" | "error";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function makeVersion(response: GenerateResponse): TicketVersion {
  const { debugInfo, ...output } = response;
  return {
    id: generateId(),
    createdAt: new Date().toISOString(),
    output,
    metadata: debugInfo
      ? {
          latency: debugInfo.latencyMs,
          tokens: debugInfo.promptTokens + debugInfo.completionTokens,
        }
      : undefined,
  };
}

function formatOutputForPrompt(response: GenerateResponse): string {
  return [
    `Title: ${response.title}`,
    `\nDescription:\n${response.description}`,
    `\nAcceptance Criteria:\n${response.acceptanceCriteria.map((c) => `- ${c}`).join("\n")}`,
  ].join("\n");
}

interface GenerateState {
  description: string;
  additionalInstructions: string;
  status: GenerateStatus;
  output: GenerateResponse | null;
  error: string | null;
  sessions: TicketSession[];
  activeSessionId: string | null;
  activeVersionId: string | null;
  activeTemplateId: string | null;

  setDescription: (v: string) => void;
  setAdditionalInstructions: (v: string) => void;
  setTemplate: (templateId: string | null) => void;
  restore: (session: TicketSession) => void;
  newTicket: () => void;
  navigateVersion: (direction: "prev" | "next") => void;
  generate: () => Promise<void>;
  regenerate: () => Promise<void>;
}

export const useGenerateStore = create<GenerateState>()(
  persist(
    (set, get) => ({
      description: "",
      additionalInstructions: "",
      status: "idle" as GenerateStatus,
      output: null,
      error: null,
      sessions: [],
      activeSessionId: null,
      activeVersionId: null,
      activeTemplateId: null,

      setDescription: (v) => set({ description: v }),
      setAdditionalInstructions: (v) => set({ additionalInstructions: v }),
      setTemplate: (templateId) => set({ activeTemplateId: templateId }),

      restore: (session) => {
        const version = session.versions.find((v) => v.id === session.activeVersionId);
        if (!version) return;
        set({
          status: "success",
          output: { ...version.output },
          error: null,
          description: session.input,
          additionalInstructions: session.instructions ?? "",
          activeTemplateId: session.generationType === "none" ? null : session.generationType,
          activeSessionId: session.id,
          activeVersionId: session.activeVersionId,
        });
      },

      newTicket: () =>
        set({
          description: "",
          additionalInstructions: "",
          status: "idle",
          output: null,
          error: null,
          activeSessionId: null,
          activeVersionId: null,
          activeTemplateId: null,
        }),

      navigateVersion: (direction) => {
        const { activeSessionId, activeVersionId, sessions } = get();
        if (!activeSessionId || !activeVersionId) return;

        const session = sessions.find((s) => s.id === activeSessionId);
        if (!session) return;

        const idx = session.versions.findIndex((v) => v.id === activeVersionId);
        const newIdx = direction === "prev" ? idx - 1 : idx + 1;
        if (newIdx < 0 || newIdx >= session.versions.length) return;

        const newVersion = session.versions[newIdx];

        set({
          activeVersionId: newVersion.id,
          output: { ...newVersion.output },
          sessions: sessions.map((s) =>
            s.id === activeSessionId ? { ...s, activeVersionId: newVersion.id } : s
          ),
        });
      },

      generate: async () => {
        const { description, additionalInstructions, activeTemplateId } = get();
        set({ status: "loading", error: null });

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

          const version = makeVersion(data);
          const session: TicketSession = {
            id: generateId(),
            createdAt: new Date().toISOString(),
            generationType: activeTemplateId ?? "none",
            input: description,
            instructions: additionalInstructions || undefined,
            activeVersionId: version.id,
            versions: [version],
          };

          set((state) => ({
            status: "success",
            output: data,
            activeSessionId: session.id,
            activeVersionId: version.id,
            sessions: [session, ...state.sessions],
          }));
        } catch {
          set({ status: "error", error: "Network error. Please try again." });
        }
      },

      regenerate: async () => {
        const { output, activeSessionId, activeTemplateId, sessions } = get();
        if (!output || !activeSessionId) return;

        const currentSession = sessions.find((s) => s.id === activeSessionId);
        if (!currentSession || currentSession.versions.length >= 4) return;

        const previousOutput = formatOutputForPrompt(output);
        set({ status: "loading", error: null });

        try {
          const res = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              input: currentSession.input,
              instructions: currentSession.instructions || undefined,
              previousOutput,
              templateId: activeTemplateId ?? undefined,
            }),
          });
          const data = await res.json();
          if (!res.ok) {
            set({ status: "error", error: data.error ?? "Regeneration failed." });
            return;
          }

          const version = makeVersion(data);

          set((state) => ({
            status: "success",
            output: data,
            activeVersionId: version.id,
            sessions: state.sessions.map((s) =>
              s.id === activeSessionId
                ? { ...s, activeVersionId: version.id, versions: [...s.versions, version] }
                : s
            ),
          }));
        } catch {
          set({ status: "error", error: "Network error. Please try again." });
        }
      },
    }),
    {
      name: "devflow-sessions",
      partialize: (state) => ({ sessions: state.sessions }),
    }
  )
);
