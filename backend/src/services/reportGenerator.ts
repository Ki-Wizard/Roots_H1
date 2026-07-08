import type {
  AnalysisRequest,
  GeneratedReport,
  SurveyQuestion,
} from "@philotype/shared";
import type { ScoredProfile } from "./scoreCalculator.js";

export type ReportMode = "mock" | "openrouter";

export interface ReportGenerator {
  readonly mode: ReportMode;
  generate(
    request: AnalysisRequest,
    profile: ScoredProfile,
    questions: SurveyQuestion[],
  ): Promise<GeneratedReport>;
}
