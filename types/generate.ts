export interface DebugInfo {
  systemPrompt: string;
  userPrompt: string;
  rawResponse: string;
  latencyMs: number;
  promptTokens: number;
  responseTokens: number;
}

export interface GenerateRequest {
  input: string;
  taskType: string;
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
  input: { input: string; taskType: string; instructions: string };
  timestamp: number;
}
