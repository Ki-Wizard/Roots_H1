import type { AnalysisRequest } from "@philotype/shared";
import { describe, expect, it } from "vitest";
import { calculateProfile } from "./scoreCalculator.js";

const request: AnalysisRequest = {
  answers: [
    {
      questionId: "triage-power",
      choice: "negative",
      reason: "더 많은 생명을 살리는 결과를 먼저 봐야 한다고 생각합니다.",
    },
    {
      questionId: "privacy-cameras",
      choice: "negative",
      reason: "안전도 중요하지만 개인의 기본 자유를 지켜야 합니다.",
    },
    {
      questionId: "whistleblower-file",
      choice: "positive",
      reason: "위험이 있어도 사회적으로 필요한 진실은 공개해야 합니다.",
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
