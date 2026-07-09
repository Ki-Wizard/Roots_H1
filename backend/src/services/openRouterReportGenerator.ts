import type {
  AnalysisRequest,
  GeneratedReport,
  SurveyQuestion,
} from "@philotype/shared";
import type { ScoredProfile } from "./scoreCalculator.js";
import type { JsonHttpClient } from "./httpJsonClient.js";
import { parseOpenRouterReport } from "./openRouterResponseParser.js";
import { OPENROUTER_REPORT_RESPONSE_FORMAT } from "./openRouterStructuredOutput.js";
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
  readonly response_format: typeof OPENROUTER_REPORT_RESPONSE_FORMAT;
  readonly provider: {
    readonly require_parameters: true;
  };
  readonly stream: false;
}

const SYSTEM_PROMPT = [
  "당신은 PhiloType의 한국어 철학 프로파일 리포트 작성자입니다.",
  "대표 유형, 보조 유형, 대표 철학자는 이미 코드가 결정했습니다.",
  "축 점수는 코드가 계산한 기준값과 사용자의 선택 이유를 함께 보고 보정합니다.",
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
      response_format: OPENROUTER_REPORT_RESPONSE_FORMAT,
      provider: {
        require_parameters: true,
      },
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
      axisScores: [
        {
          id: "individualCommunity | outcomePrinciple | reasonExperience | freedomOrder",
          negativeLabel: "string",
          positiveLabel: "string",
          score: "0부터 100까지의 정수",
          leaning: "negativeLabel, positiveLabel, 또는 중립",
        },
      ],
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
      "마크다운 코드블록 없이 JSON 객체만 작성합니다.",
      "summary는 2문장 이하로 작성합니다.",
      "strengths, cautions, prescriptions는 각각 1문장 항목으로 작성합니다.",
      "각 배열 항목은 80자 이하로 작성합니다.",
      "opposingView와 shareText는 각각 2문장 이하로 작성합니다.",
      "recommendedPhilosophers는 철학자 이름만 작성하고 설명을 붙이지 않습니다.",
      "evidence는 사용자의 실제 reason을 그대로 포함하고, interpretation만 해석합니다.",
      "단정형 대신 '~하는 경향', '~로 볼 수 있습니다'처럼 가능성 표현을 사용합니다.",
      "사용자를 고정된 유형으로 규정하지 말고 현재 답변에서 보이는 경향으로 표현합니다.",
      "선택 이유를 바탕으로 axisScores를 보정하되, 각 축의 기존 기준값에서 최대 20점까지만 조정합니다.",
      "선택 이유가 선택지 방향과 충돌하거나 다른 축의 근거를 강하게 드러내면 axisScores에 반영합니다.",
      "axisScores는 네 개 축을 모두 포함하고, id와 label은 입력의 baselineAxisScores 값을 그대로 사용합니다.",
      "primaryType, secondaryType, philosopher 값은 변경하거나 다시 계산하지 않습니다.",
    ],
    profile: {
      primaryType: profile.primaryType.name,
      secondaryType: profile.secondaryType.name,
      representativePhilosopher: profile.primaryType.philosopher,
      secondaryPhilosopher: profile.secondaryType.philosopher,
      coreValues: profile.primaryType.coreValues,
      decisionStyle: profile.primaryType.decisionStyle,
      baselineAxisScores: profile.axisScores,
    },
    answers: request.answers.map((answer) => {
      const question = questions.find((item) => item.id === answer.questionId);
      const selectedChoice =
        answer.choice === "positive"
          ? question?.positiveChoice
          : question?.negativeChoice;
      return {
        questionId: answer.questionId,
        questionTitle: question?.title ?? answer.questionId,
        dilemma: question?.dilemma ?? "",
        negativeChoice: question?.negativeChoice ?? "",
        positiveChoice: question?.positiveChoice ?? "",
        choice: answer.choice,
        selectedChoice: selectedChoice ?? "",
        reason: answer.reason,
      };
    }),
  });
}
