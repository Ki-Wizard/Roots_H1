import type {
  AnalysisRequest,
  AxisId,
  AxisScore,
  SurveyAnswer,
} from "@philotype/shared";
import { axes } from "../config/axes.js";
import { activeQuestions } from "../config/questions.js";
import {
  philosophyTypes,
  type PhilosophyType,
} from "../config/philosophyTypes.js";

export interface ScoredProfile {
  axisScores: AxisScore[];
  primaryType: PhilosophyType;
  secondaryType: PhilosophyType;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const getAnswerMap = (answers: SurveyAnswer[]) =>
  new Map(answers.map((answer) => [answer.questionId, answer]));

export function calculateProfile(request: AnalysisRequest): ScoredProfile {
  const answerMap = getAnswerMap(request.answers);

  const axisScores = axes.map((axis) => {
    let weightedScore = 0;
    let maximumMagnitude = 0;

    for (const question of activeQuestions) {
      const weight = question.weights[axis.id];
      const answer = answerMap.get(question.id);

      if (!answer || weight === 0) {
        continue;
      }

      weightedScore += answer.scale * weight;
      maximumMagnitude += 2 * Math.abs(weight);
    }

    const normalized =
      maximumMagnitude === 0
        ? 50
        : Math.round(clamp(50 + (weightedScore / maximumMagnitude) * 50, 0, 100));

    return {
      id: axis.id,
      negativeLabel: axis.negativeLabel,
      positiveLabel: axis.positiveLabel,
      score: normalized,
      leaning:
        normalized === 50
          ? "중립"
          : normalized > 50
            ? axis.positiveLabel
            : axis.negativeLabel,
    };
  });

  const ranked = [...axisScores].sort(
    (left, right) => Math.abs(right.score - 50) - Math.abs(left.score - 50),
  );

  return {
    axisScores,
    primaryType: matchType(ranked[0].id, ranked[0].score),
    secondaryType: matchType(ranked[1].id, ranked[1].score),
  };
}

function matchType(axis: AxisId, score: number): PhilosophyType {
  const direction = score >= 50 ? "positive" : "negative";
  const match = philosophyTypes.find(
    (type) => type.axis === axis && type.direction === direction,
  );

  if (!match) {
    throw new Error(`No philosophy type configured for ${axis}:${direction}`);
  }

  return match;
}
