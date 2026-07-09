import type { AnalysisRequest } from "@philotype/shared";
import { describe, expect, it } from "vitest";
import { activeQuestions } from "../config/questions.js";
import { analyze } from "./analyzer.js";
import { calculateProfile } from "./scoreCalculator.js";
import type { JsonHttpClient } from "./httpJsonClient.js";
import { OpenRouterReportGenerator } from "./openRouterReportGenerator.js";

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

const generatedReport = {
  summary: "선택 이유에서 원칙과 자유를 함께 고려하는 경향이 드러납니다.",
  strengths: ["일관된 기준을 세웁니다.", "반대 가치를 함께 살핍니다."],
  cautions: ["원칙이 맥락을 가리지 않는지 점검하세요."],
  recurringQuestion: "내 기준은 타인에게도 공정하게 적용될 수 있을까?",
  opposingView: "결과 중심 관점은 피해와 효용을 먼저 볼 수 있습니다.",
  prescriptions: ["반대 선택의 장점을 한 문장으로 써보세요."],
  recommendedPhilosophers: ["칸트", "롤스"],
  shareText: "나의 PhiloType은 원칙적 합리주의자입니다.",
  evidence: [
    {
      questionId: "triage-power",
      questionTitle: "정전된 병원의 예비 전력",
      reason: "더 많은 생명을 살리는 결과를 먼저 봐야 한다고 생각합니다.",
      interpretation: "결과를 기준으로 피해를 줄이려는 답변입니다.",
    },
  ],
  axisScores: [
    {
      id: "individualCommunity",
      negativeLabel: "개인",
      positiveLabel: "공동체",
      score: 20,
      leaning: "개인",
    },
    {
      id: "outcomePrinciple",
      negativeLabel: "결과주의",
      positiveLabel: "의무주의",
      score: 20,
      leaning: "결과주의",
    },
    {
      id: "reasonExperience",
      negativeLabel: "감정",
      positiveLabel: "이성",
      score: 58,
      leaning: "이성",
    },
    {
      id: "freedomOrder",
      negativeLabel: "현실",
      positiveLabel: "이상",
      score: 80,
      leaning: "이상",
    },
  ],
};

class RecordingHttpClient implements JsonHttpClient {
  requestBody: unknown;
  requestHeaders: Record<string, string> = {};

  constructor(private readonly content = JSON.stringify(generatedReport)) {}

  async postJson(
    _url: string,
    requestOptions: {
      readonly headers: Record<string, string>;
      readonly body: unknown;
      readonly timeoutMs: number;
    },
  ): Promise<unknown> {
    this.requestBody = requestOptions.body;
    this.requestHeaders = requestOptions.headers;
    return {
      choices: [
        {
          message: {
            content: this.content,
          },
        },
      ],
    };
  }
}

describe("OpenRouterReportGenerator", () => {
  it("returns parsed report fields when OpenRouter responds with JSON", async () => {
    const httpClient = new RecordingHttpClient();
    const generator = new OpenRouterReportGenerator({
      config: {
        apiKey: "test-key",
        endpoint: "https://openrouter.ai/api/v1/chat/completions",
        model: "anthropic/claude-3.5-haiku",
        siteTitle: "PhiloType",
        siteUrl: "http://localhost:5173",
        timeoutMs: 10_000,
        maxTokens: 900,
        temperature: 0.4,
      },
      httpClient,
    });

    const profile = calculateProfile(request);
    const report = await generator.generate(
      request,
      profile,
      activeQuestions,
    );

    expect(report.summary).toBe(generatedReport.summary);
    expect(report.evidence[0]?.questionId).toBe("triage-power");
    expect(httpClient.requestHeaders.Authorization).toBe("Bearer test-key");
    expect(httpClient.requestHeaders["HTTP-Referer"]).toBe(
      "http://localhost:5173",
    );
    expect(JSON.stringify(httpClient.requestBody)).toContain(
      "단정형 대신",
    );
    expect(JSON.stringify(httpClient.requestBody)).toContain(
      "현재 답변에서 보이는 경향",
    );
    expect(JSON.stringify(httpClient.requestBody)).toContain(
      "선택 이유를 바탕으로 axisScores",
    );
    expect(JSON.stringify(httpClient.requestBody)).toContain(
      '"response_format":{"type":"json_schema"',
    );
    expect(JSON.stringify(httpClient.requestBody)).toContain('"strict":true');
    expect(JSON.stringify(httpClient.requestBody)).toContain(
      '"additionalProperties":false',
    );
    expect(JSON.stringify(httpClient.requestBody)).toContain(
      '"provider":{"require_parameters":true}',
    );
  });

  it("returns parsed report fields when OpenRouter appends text after JSON", async () => {
    const httpClient = new RecordingHttpClient(
      `${JSON.stringify(generatedReport)}\n\n참고: 위 JSON만 사용하세요. {추가 설명}`,
    );
    const generator = new OpenRouterReportGenerator({
      config: {
        apiKey: "test-key",
        endpoint: "https://openrouter.ai/api/v1/chat/completions",
        model: "anthropic/claude-3.5-haiku",
        siteTitle: "PhiloType",
        timeoutMs: 10_000,
        maxTokens: 900,
        temperature: 0.4,
      },
      httpClient,
    });

    const profile = calculateProfile(request);
    const report = await generator.generate(
      request,
      profile,
      activeQuestions,
    );

    expect(report.summary).toBe(generatedReport.summary);
    expect(report.evidence[0]?.questionId).toBe("triage-power");
  });

  it("marks analysis responses as openrouter when enabled", async () => {
    const httpClient = new RecordingHttpClient();
    const generator = new OpenRouterReportGenerator({
      config: {
        apiKey: "test-key",
        endpoint: "https://openrouter.ai/api/v1/chat/completions",
        model: "anthropic/claude-3.5-haiku",
        siteTitle: "PhiloType",
        timeoutMs: 10_000,
        maxTokens: 900,
        temperature: 0.4,
      },
      httpClient,
    });

    const result = await analyze(request, generator);

    expect(result.mode).toBe("openrouter");
    expect(result.primaryType).toBeTruthy();
    expect(result.summary).toBe(generatedReport.summary);
    expect(result.axisScores).toEqual(generatedReport.axisScores);
  });
});
