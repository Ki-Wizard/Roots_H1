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
      questionId: "fairness-friend",
      questionTitle: "친구의 부정행위",
      reason: "모두에게 같은 규칙이 적용되어야 공정하기 때문입니다.",
      interpretation: "공정성을 일관된 규칙에서 찾는 답변입니다.",
    },
  ],
};

class RecordingHttpClient implements JsonHttpClient {
  requestBody: unknown;
  requestHeaders: Record<string, string> = {};

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
            content: JSON.stringify(generatedReport),
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
    expect(report.evidence[0]?.questionId).toBe("fairness-friend");
    expect(httpClient.requestHeaders.Authorization).toBe("Bearer test-key");
    expect(httpClient.requestHeaders["HTTP-Referer"]).toBe(
      "http://localhost:5173",
    );
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
  });
});
