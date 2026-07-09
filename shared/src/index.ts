export const AXIS_IDS = [
  "individualCommunity",
  "outcomePrinciple",
  "reasonExperience",
  "freedomOrder",
] as const;

export type AxisId = (typeof AXIS_IDS)[number];
export const CHOICE_IDS = ["negative", "positive"] as const;
export type ChoiceId = (typeof CHOICE_IDS)[number];
export type QuestionStatus = "active" | "planned";

export interface AxisDefinition {
  id: AxisId;
  negativeLabel: string;
  positiveLabel: string;
}

export interface SurveyQuestion {
  id: string;
  status: QuestionStatus;
  title: string;
  dilemma: string;
  negativeChoice: string;
  positiveChoice: string;
  weights: Record<AxisId, number>;
}

export interface PublicSurveyQuestion {
  id: string;
  title: string;
  dilemma: string;
  negativeChoice: string;
  positiveChoice: string;
}

export interface SurveyAnswer {
  questionId: string;
  choice: ChoiceId;
  reason: string;
}

export interface AnalysisRequest {
  anonymousId?: string;
  answers: SurveyAnswer[];
  freeText?: string;
}

export interface AxisScore {
  id: AxisId;
  negativeLabel: string;
  positiveLabel: string;
  score: number;
  leaning: string;
}

export interface AnalysisEvidence {
  questionId: string;
  questionTitle: string;
  reason: string;
  interpretation: string;
}

export interface GeneratedReport {
  axisScores?: AxisScore[];
  summary: string;
  strengths: string[];
  cautions: string[];
  recurringQuestion: string;
  opposingView: string;
  prescriptions: string[];
  recommendedPhilosophers: string[];
  shareText: string;
  evidence: AnalysisEvidence[];
}

export interface AnalysisResponse extends GeneratedReport {
  analysisId: string;
  mode: "mock" | "openrouter";
  primaryType: string;
  secondaryType: string;
  representativePhilosopher: string;
  coreValues: string[];
  decisionStyle: string;
  axisScores: AxisScore[];
}

export interface ApiError {
  error: string;
  details?: string[];
}
