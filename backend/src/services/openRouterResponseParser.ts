import type { AnalysisEvidence, GeneratedReport } from "@philotype/shared";

export class OpenRouterResponseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OpenRouterResponseError";
  }
}

export function parseOpenRouterReport(payload: unknown): GeneratedReport {
  const content = readAssistantContent(payload);
  const reportPayload = parseJsonContent(content);
  return readGeneratedReport(reportPayload);
}

function readAssistantContent(payload: unknown): string {
  if (!isRecord(payload)) {
    throw new OpenRouterResponseError("OpenRouter 응답이 객체가 아닙니다.");
  }

  const choices = payload["choices"];
  if (!isUnknownArray(choices) || choices.length === 0) {
    throw new OpenRouterResponseError("OpenRouter 응답에 choices가 없습니다.");
  }

  const firstChoice = choices[0];
  if (!isRecord(firstChoice)) {
    throw new OpenRouterResponseError("OpenRouter choice 형식이 올바르지 않습니다.");
  }

  const message = firstChoice["message"];
  if (!isRecord(message)) {
    throw new OpenRouterResponseError("OpenRouter message 형식이 올바르지 않습니다.");
  }

  const content = message["content"];
  if (typeof content !== "string" || content.trim().length === 0) {
    throw new OpenRouterResponseError("OpenRouter message content가 비어 있습니다.");
  }

  return content;
}

function parseJsonContent(content: string): unknown {
  const start = content.indexOf("{");
  const end = content.lastIndexOf("}");
  if (start < 0 || end <= start) {
    throw new OpenRouterResponseError("AI 응답에서 JSON 객체를 찾을 수 없습니다.");
  }

  try {
    const payload: unknown = JSON.parse(content.slice(start, end + 1));
    return payload;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new OpenRouterResponseError("AI 응답 JSON을 파싱할 수 없습니다.");
    }
    throw error;
  }
}

function readGeneratedReport(payload: unknown): GeneratedReport {
  if (!isRecord(payload)) {
    throw new OpenRouterResponseError("AI 리포트가 객체가 아닙니다.");
  }

  return {
    summary: readString(payload, "summary"),
    strengths: readStringArray(payload, "strengths"),
    cautions: readStringArray(payload, "cautions"),
    recurringQuestion: readString(payload, "recurringQuestion"),
    opposingView: readString(payload, "opposingView"),
    prescriptions: readStringArray(payload, "prescriptions"),
    recommendedPhilosophers: readStringArray(payload, "recommendedPhilosophers"),
    shareText: readString(payload, "shareText"),
    evidence: readEvidenceArray(payload),
  };
}

function readString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new OpenRouterResponseError(`AI 리포트의 ${key} 값이 올바르지 않습니다.`);
  }
  return value.trim();
}

function readStringArray(record: Record<string, unknown>, key: string): string[] {
  const value = record[key];
  if (!isUnknownArray(value) || value.length === 0) {
    throw new OpenRouterResponseError(`AI 리포트의 ${key} 배열이 비어 있습니다.`);
  }

  const result: string[] = [];
  for (const item of value) {
    if (typeof item !== "string" || item.trim().length === 0) {
      throw new OpenRouterResponseError(
        `AI 리포트의 ${key} 배열 항목이 올바르지 않습니다.`,
      );
    }
    result.push(item.trim());
  }
  return result;
}

function readEvidenceArray(record: Record<string, unknown>): AnalysisEvidence[] {
  const value = record["evidence"];
  if (!isUnknownArray(value) || value.length === 0) {
    throw new OpenRouterResponseError("AI 리포트의 evidence 배열이 비어 있습니다.");
  }

  const result: AnalysisEvidence[] = [];
  for (const item of value) {
    if (!isRecord(item)) {
      throw new OpenRouterResponseError("AI 리포트 evidence 형식이 올바르지 않습니다.");
    }
    result.push({
      questionId: readString(item, "questionId"),
      questionTitle: readString(item, "questionTitle"),
      reason: readString(item, "reason"),
      interpretation: readString(item, "interpretation"),
    });
  }
  return result;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isUnknownArray(value: unknown): value is readonly unknown[] {
  return Array.isArray(value);
}
