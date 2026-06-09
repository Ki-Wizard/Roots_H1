import type { AnalysisRequest } from "@philotype/shared";
import { describe, expect, it } from "vitest";
import { calculateProfile } from "./scoreCalculator.js";

const request: AnalysisRequest = {
  answers: [
    {
      questionId: "fairness-friend",
      scale: 2,
      reason: "모두에게 같은 규칙이 적용되어야 공정하기 때문입니다.",
    },
    {
      questionId: "privacy-safety",
      scale: -2,
      reason: "안전도 중요하지만 개인의 기본 자유를 지켜야 합니다.",
    },
    {
      questionId: "career-choice",
      scale: -1,
      reason: "후회하지 않으려면 원하는 도전을 직접 선택해야 합니다.",
    },
  ],
};

describe("calculateProfile", () => {
  it("returns deterministic axis scores and type matches", () => {
    expect(calculateProfile(request)).toEqual(calculateProfile(request));
  });

  it("keeps every normalized score between 0 and 100", () => {
    const profile = calculateProfile(request);
    expect(profile.axisScores).toHaveLength(4);
    profile.axisScores.forEach((axis) => {
      expect(axis.score).toBeGreaterThanOrEqual(0);
      expect(axis.score).toBeLessThanOrEqual(100);
    });
  });
});
