import type {
  AnalysisRequest,
  GeneratedReport,
  SurveyQuestion,
} from "@philotype/shared";
import type { ScoredProfile } from "./scoreCalculator.js";

export interface ReportGenerator {
  readonly mode: "mock";
  generate(
    request: AnalysisRequest,
    profile: ScoredProfile,
    questions: SurveyQuestion[],
  ): Promise<GeneratedReport>;
}
