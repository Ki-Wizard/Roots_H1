import type {
  AnalysisRequest,
  AnalysisResponse,
  PublicSurveyQuestion,
} from "@philotype/shared";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

export interface QuestionResponse {
  questions: PublicSurveyQuestion[];
  answerRules: {
    reasonMinLength: number;
    reasonMaxLength: number;
  };
}

export async function fetchQuestions(): Promise<QuestionResponse> {
  const response = await fetch(`${API_BASE_URL}/api/questions`);
  if (!response.ok) {
    throw new Error("질문을 불러오지 못했습니다.");
  }
  return response.json();
}

export async function requestAnalysis(
  payload: AnalysisRequest,
): Promise<AnalysisResponse> {
  const response = await fetch(`${API_BASE_URL}/api/analysis`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.details?.join(" ") ?? body.error ?? "분석에 실패했습니다.");
  }
  return body;
}
