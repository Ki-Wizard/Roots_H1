import { createHash } from "node:crypto";
import type { AnalysisRequest, AnalysisResponse } from "@philotype/shared";
import { activeQuestions } from "../config/questions.js";
import { calculateProfile } from "./scoreCalculator.js";
import type { ReportGenerator } from "./reportGenerator.js";

export async function analyze(
  request: AnalysisRequest,
  reportGenerator: ReportGenerator,
): Promise<AnalysisResponse> {
  const profile = calculateProfile(request);
  const report = await reportGenerator.generate(request, profile, activeQuestions);

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
    axisScores: profile.axisScores,
    ...report,
  };
}
