export interface DebugInfo {
  systemPrompt: string;
  userPrompt: string;
  rawResponse: string;
  latencyMs: number;
  promptTokens: number;
  completionTokens: number;
  temperature: number;
}

export interface GenerateRequest {
  input: string;
  instructions?: string;
  previousOutput?: string;
  templateId?: string;
}

export interface GenerateResponse {
  title: string;
  description: string;
  acceptanceCriteria: string[];
  debugInfo?: DebugInfo;
}

export interface GenerateErrorResponse {
  error: string;
}

export interface HistoryEntry {
  id: string;
  output: Omit<GenerateResponse, "debugInfo">;
  input: { description: string; additionalInstructions: string };
  timestamp: number;
}
