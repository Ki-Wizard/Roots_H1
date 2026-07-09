import { createHash } from "node:crypto";
import type {
  AnalysisRequest,
  AnalysisResponse,
  AxisScore,
} from "@philotype/shared";
import { activeQuestions } from "../config/questions.js";
import { calculateProfile } from "./scoreCalculator.js";
import type { ReportGenerator } from "./reportGenerator.js";

export async function analyze(
  request: AnalysisRequest,
  reportGenerator: ReportGenerator,
): Promise<AnalysisResponse> {
  const profile = calculateProfile(request);
  const report = await reportGenerator.generate(request, profile, activeQuestions);
  const { axisScores: reportAxisScores, ...generatedReport } = report;
  const axisScores = reportAxisScores
    ? applyReasonAdjustedAxisScores(reportAxisScores, profile.axisScores)
    : profile.axisScores;

  return {
    analysisId: createHash("sha256")
      .update(JSON.stringify(request.answers))
      .digest("hex")
      .slice(0, 12),
    mode: reportGenerator.mode,
    primaryType: profile.primaryType.name,
    secondaryType: profile.secondaryType.name,
    representativePhilosopher: profile.primaryType.philosopher,
    coreValues: profile.primaryType.coreValues,
    decisionStyle: profile.primaryType.decisionStyle,
    axisScores,
    ...generatedReport,
  };
}

function applyReasonAdjustedAxisScores(
  reportAxisScores: AxisScore[],
  baselineAxisScores: AxisScore[],
): AxisScore[] {
  return baselineAxisScores.map((baselineAxis) => {
    const reportAxis = reportAxisScores.find(
      (axisScore) => axisScore.id === baselineAxis.id,
    );
    if (!reportAxis) {
      return baselineAxis;
    }

    const score = clamp(
      reportAxis.score,
      baselineAxis.score - 20,
      baselineAxis.score + 20,
    );
    return {
      ...baselineAxis,
      score,
      leaning: getLeaning(score, baselineAxis),
    };
  });
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function getLeaning(score: number, axisScore: AxisScore): string {
  if (score === 50) {
    return "중립";
  }

  return score > 50 ? axisScore.positiveLabel : axisScore.negativeLabel;
}
