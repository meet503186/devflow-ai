import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompts";
import type {
  DebugInfo,
  GenerateRequest,
  GenerateResponse,
  GenerateErrorResponse,
} from "@/types/generate";

const MAX_INPUT_LENGTH = 2000;
const MAX_INSTRUCTIONS_LENGTH = 500;
const GEMINI_MODEL = "gemini-2.5-flash";

function validateRequest(body: unknown): GenerateRequest {
  if (typeof body !== "object" || body === null) {
    throw new ValidationError("Invalid request body");
  }

  const { input, taskType, instructions, previousOutput, templateId } =
    body as Record<string, unknown>;

  if (typeof input !== "string" || input.trim().length === 0) {
    throw new ValidationError("input is required");
  }
  if (input.length > MAX_INPUT_LENGTH) {
    throw new ValidationError(
      `input must be ${MAX_INPUT_LENGTH} characters or fewer`,
    );
  }
  if (typeof taskType !== "string" || taskType.trim().length === 0) {
    throw new ValidationError("taskType is required");
  }

  return {
    input: input.trim(),
    taskType: taskType.trim(),
    instructions:
      typeof instructions === "string"
        ? instructions.slice(0, MAX_INSTRUCTIONS_LENGTH)
        : undefined,
    previousOutput:
      typeof previousOutput === "string" ? previousOutput : undefined,
    templateId: typeof templateId === "string" ? templateId : undefined,
  };
}

function parseResponse(text: string): GenerateResponse {
  const cleaned = text
    .replace(/^```(?:json)?\s*\n?/, "")
    .replace(/\n?```\s*$/, "")
    .trim();

  const parsed = JSON.parse(cleaned) as Record<string, unknown>;

  if (
    typeof parsed.title !== "string" ||
    typeof parsed.description !== "string" ||
    !Array.isArray(parsed.acceptanceCriteria)
  ) {
    throw new Error("Unexpected response structure from AI model");
  }

  return {
    title: parsed.title,
    description: parsed.description,
    acceptanceCriteria: (parsed.acceptanceCriteria as unknown[]).filter(
      (c): c is string => typeof c === "string",
    ),
  };
}

class ValidationError extends Error {}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<GenerateResponse | GenerateErrorResponse>> {
  let req: GenerateRequest;

  try {
    const body = await request.json();
    req = validateRequest(body);
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("[generate] GEMINI_API_KEY is not set");
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  try {
    const systemPrompt = buildSystemPrompt(req.templateId);
    const userPrompt = buildUserPrompt(req);

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: systemPrompt,
    });

    const startMs = Date.now();
    const result = await model.generateContent(userPrompt);
    const latencyMs = Date.now() - startMs;

    const text = result.response.text();
    const response = parseResponse(text);
    const usage = result.response.usageMetadata;

    const debugInfo: DebugInfo = {
      systemPrompt,
      userPrompt,
      rawResponse: text,
      latencyMs,
      promptTokens: usage?.promptTokenCount ?? 0,
      responseTokens: usage?.candidatesTokenCount ?? 0,
    };

    return NextResponse.json({ ...response, debugInfo });
  } catch (err) {
    console.error(
      "[generate] generation error:",
      err instanceof Error ? err.message : err,
    );
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
