import type { GenerateRequest } from "@/types/generate";
import { getTemplate } from "@/lib/templates";

export function buildSystemPrompt(templateId?: string): string {
  const template = templateId ? getTemplate(templateId) : undefined;

  const base = `You are an expert software project manager and technical writer. Your task is to convert unstructured developer task descriptions into well-structured Jira tickets.

Always respond with a valid JSON object in this exact format:
{
  "title": "A concise, action-oriented ticket title (max 80 characters)",
  "description": "A clear, detailed description of the task including context, requirements, and technical details",
  "acceptanceCriteria": [
    "Criterion 1 — specific, testable, and measurable",
    "Criterion 2",
    "Criterion 3"
  ]
}

Rules:
- Output ONLY the raw JSON object. No markdown fences, no explanations, no extra text.
- Title must be actionable and specific (e.g., "Add user authentication endpoint").
- Description must give a developer enough context to implement the feature without guessing.
- Acceptance criteria must each be specific, testable, and measurable.
- Generate between 3 and 6 acceptance criteria items.`;

  if (!template) return base;

  return `${base}\n\n${template.systemPromptAddition}`;
}

export function buildUserPrompt(req: GenerateRequest): string {
  const parts: string[] = [];

  parts.push(`Task Description:\n${req.input}`);

  if (req.previousOutput) {
    parts.push(
      `\nPrevious Output (this was your last attempt — improve it: make the title more specific, the description clearer and more actionable, and the acceptance criteria sharper and more testable):\n${req.previousOutput}`,
    );
  }

  if (req.instructions) {
    parts.push(`\nAdditional Instructions:\n${req.instructions}`);
  }

  return parts.join("\n");
}
