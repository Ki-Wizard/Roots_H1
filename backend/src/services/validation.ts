import type {
  AnalysisRequest,
  ChoiceId,
  SurveyAnswer,
} from "@philotype/shared";
import { CHOICE_IDS } from "@philotype/shared";
import { activeQuestions } from "../config/questions.js";

export interface ValidationResult {
  valid: boolean;
  details: string[];
  request?: AnalysisRequest;
}

const validChoices = new Set<ChoiceId>(CHOICE_IDS);

export function validateAnalysisRequest(input: unknown): ValidationResult {
  const details: string[] = [];

  if (!isRecord(input) || !Array.isArray(input.answers)) {
    return {
      valid: false,
      details: ["answers 배열이 필요합니다."],
    };
  }

  const answers = input.answers.filter(isSurveyAnswer);
  if (answers.length !== input.answers.length) {
    details.push("각 답변에는 questionId, choice, reason이 필요합니다.");
  }

  const answerMap = new Map<string, SurveyAnswer>();
  for (const answer of answers) {
    if (answerMap.has(answer.questionId)) {
      details.push(`중복 응답이 있습니다: ${answer.questionId}`);
    }
    answerMap.set(answer.questionId, answer);

    if (!validChoices.has(answer.choice)) {
      details.push(`${answer.questionId}: choice는 negative 또는 positive여야 합니다.`);
    }

    const reasonLength = answer.reason.trim().length;
    if (reasonLength < 5 || reasonLength > 200) {
      details.push(`${answer.questionId}: 선택 이유는 5~200자로 작성해야 합니다.`);
    }
  }

  for (const question of activeQuestions) {
    if (!answerMap.has(question.id)) {
      details.push(`필수 질문 응답이 누락되었습니다: ${question.id}`);
    }
  }

  for (const answer of answers) {
    if (!activeQuestions.some((question) => question.id === answer.questionId)) {
      details.push(`알 수 없거나 아직 활성화되지 않은 질문입니다: ${answer.questionId}`);
    }
  }

  return {
    valid: details.length === 0,
    details,
    request:
      details.length === 0
        ? {
            anonymousId:
              typeof input.anonymousId === "string" ? input.anonymousId : undefined,
            answers,
            freeText: typeof input.freeText === "string" ? input.freeText : undefined,
          }
        : undefined,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isSurveyAnswer(value: unknown): value is SurveyAnswer {
  return (
    isRecord(value) &&
    typeof value.questionId === "string" &&
    typeof value.choice === "string" &&
    typeof value.reason === "string"
  );
}
