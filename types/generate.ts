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

export interface TicketVersionOutput {
  title: string;
  description: string;
  acceptanceCriteria: string[];
}

export interface TicketVersion {
  id: string;
  createdAt: string;
  output: TicketVersionOutput;
  metadata?: {
    latency?: number;
    tokens?: number;
  };
}

export interface TicketSession {
  id: string;
  createdAt: string;
  generationType: string;
  input: string;
  instructions?: string;
  activeVersionId: string;
  versions: TicketVersion[];
}
