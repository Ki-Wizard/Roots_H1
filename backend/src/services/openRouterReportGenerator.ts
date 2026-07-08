import type {
  AnalysisRequest,
  GeneratedReport,
  SurveyQuestion,
} from "@philotype/shared";
import type { ScoredProfile } from "./scoreCalculator.js";
import type { JsonHttpClient } from "./httpJsonClient.js";
import { parseOpenRouterReport } from "./openRouterResponseParser.js";
import type { ReportGenerator } from "./reportGenerator.js";

export interface OpenRouterConfig {
  readonly apiKey: string;
  readonly endpoint: string;
  readonly model: string;
  readonly siteTitle: string;
  readonly siteUrl?: string;
  readonly timeoutMs: number;
  readonly maxTokens: number;
  readonly temperature: number;
}

export interface OpenRouterReportGeneratorOptions {
  readonly config: OpenRouterConfig;
  readonly httpClient: JsonHttpClient;
}

interface OpenRouterMessage {
  readonly role: "system" | "user";
  readonly content: string;
}

interface OpenRouterRequestBody {
  readonly model: string;
  readonly messages: readonly OpenRouterMessage[];
  readonly temperature: number;
  readonly max_tokens: number;
  readonly stream: false;
}

const SYSTEM_PROMPT = [
  "당신은 PhiloType의 한국어 철학 프로파일 리포트 작성자입니다.",
  "점수, 대표 유형, 보조 유형, 대표 철학자는 이미 코드가 결정했습니다.",
  "절대로 사용자의 정체성, 능력, 정신 건강을 진단하거나 단정하지 마세요.",
  "답변 이유를 근거로 판단 경향, 반대 관점, 사고 훈련만 설명하세요.",
  "응답은 설명 없이 JSON 객체 하나만 반환하세요.",
].join("\n");

export class OpenRouterReportGenerator implements ReportGenerator {
  readonly mode = "openrouter" as const;

  constructor(private readonly options: OpenRouterReportGeneratorOptions) {}

  async generate(
    request: AnalysisRequest,
    profile: ScoredProfile,
    questions: SurveyQuestion[],
  ): Promise<GeneratedReport> {
    const payload = await this.options.httpClient.postJson(
      this.options.config.endpoint,
      {
        headers: this.buildHeaders(),
        body: this.buildRequestBody(request, profile, questions),
        timeoutMs: this.options.config.timeoutMs,
      },
    );

    return parseOpenRouterReport(payload);
  }

  private buildHeaders(): Record<string, string> {
    const baseHeaders = {
      Authorization: `Bearer ${this.options.config.apiKey}`,
      "Content-Type": "application/json",
      "X-OpenRouter-Title": this.options.config.siteTitle,
    };

    if (!this.options.config.siteUrl) {
      return baseHeaders;
    }

    return {
      ...baseHeaders,
      "HTTP-Referer": this.options.config.siteUrl,
    };
  }

  private buildRequestBody(
    request: AnalysisRequest,
    profile: ScoredProfile,
    questions: SurveyQuestion[],
  ): OpenRouterRequestBody {
    return {
      model: this.options.config.model,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: buildUserPrompt(request, profile, questions),
        },
      ],
      temperature: this.options.config.temperature,
      max_tokens: this.options.config.maxTokens,
      stream: false,
    };
  }
}

function buildUserPrompt(
  request: AnalysisRequest,
  profile: ScoredProfile,
  questions: SurveyQuestion[],
): string {
  return JSON.stringify({
    task: "다음 입력을 바탕으로 GeneratedReport JSON만 작성하세요.",
    outputSchema: {
      summary: "string",
      strengths: ["string", "string"],
      cautions: ["string", "string"],
      recurringQuestion: "string",
      opposingView: "string",
      prescriptions: ["string", "string", "string"],
      recommendedPhilosophers: ["string", "string"],
      shareText: "string",
      evidence: [
        {
          questionId: "string",
          questionTitle: "string",
          reason: "string",
          interpretation: "string",
        },
      ],
    },
    constraints: [
      "모든 문장은 한국어로 작성합니다.",
      "summary는 2문장 이하로 작성합니다.",
      "strengths, cautions, prescriptions는 각각 1문장 항목으로 작성합니다.",
      "evidence는 사용자의 실제 reason을 그대로 포함하고, interpretation만 해석합니다.",
      "primaryType, secondaryType, philosopher, axisScores 값은 변경하거나 다시 계산하지 않습니다.",
    ],
    profile: {
      primaryType: profile.primaryType.name,
      secondaryType: profile.secondaryType.name,
      representativePhilosopher: profile.primaryType.philosopher,
      secondaryPhilosopher: profile.secondaryType.philosopher,
      coreValues: profile.primaryType.coreValues,
      decisionStyle: profile.primaryType.decisionStyle,
      axisScores: profile.axisScores,
    },
    answers: request.answers.map((answer) => {
      const question = questions.find((item) => item.id === answer.questionId);
      return {
        questionId: answer.questionId,
        questionTitle: question?.title ?? answer.questionId,
        dilemma: question?.dilemma ?? "",
        negativeChoice: question?.negativeChoice ?? "",
        positiveChoice: question?.positiveChoice ?? "",
        scale: answer.scale,
        reason: answer.reason,
      };
    }),
  });
}
