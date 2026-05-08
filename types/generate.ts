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
}

export interface GenerateErrorResponse {
  error: string;
}
