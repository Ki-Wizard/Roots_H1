import { FetchJsonHttpClient } from "./httpJsonClient.js";
import { MockReportGenerator } from "./mockReportGenerator.js";
import {
  OpenRouterReportGenerator,
  type OpenRouterConfig,
} from "./openRouterReportGenerator.js";
import type { ReportGenerator, ReportMode } from "./reportGenerator.js";

const DEFAULT_OPENROUTER_ENDPOINT =
  "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_OPENROUTER_MODEL = "anthropic/claude-sonnet-4.6";

export class ReportGeneratorConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReportGeneratorConfigError";
  }
}

export function createReportGenerator(
  env: NodeJS.ProcessEnv = process.env,
): ReportGenerator {
  const mode = readReportMode(env);

  switch (mode) {
    case "mock":
      return new MockReportGenerator();
    case "openrouter":
      return new OpenRouterReportGenerator({
        config: readOpenRouterConfig(env),
        httpClient: new FetchJsonHttpClient(),
      });
  }
}

function readReportMode(env: NodeJS.ProcessEnv): ReportMode {
  const mode = env.AI_MODE ?? "mock";
  switch (mode) {
    case "mock":
    case "openrouter":
      return mode;
    default:
      throw new ReportGeneratorConfigError(
        "AI_MODE는 mock 또는 openrouter여야 합니다.",
      );
  }
}

function readOpenRouterConfig(env: NodeJS.ProcessEnv): OpenRouterConfig {
  return {
    apiKey: readRequiredEnv(env, "OPENROUTER_API_KEY"),
    endpoint: env.OPENROUTER_ENDPOINT ?? DEFAULT_OPENROUTER_ENDPOINT,
    model: env.OPENROUTER_MODEL ?? DEFAULT_OPENROUTER_MODEL,
    siteTitle: env.OPENROUTER_SITE_TITLE ?? "PhiloType",
    siteUrl: readOptionalEnv(env, "OPENROUTER_SITE_URL"),
    timeoutMs: readPositiveInteger(env, "OPENROUTER_TIMEOUT_MS", 15_000),
    maxTokens: readPositiveInteger(env, "OPENROUTER_MAX_TOKENS", 900),
    temperature: readTemperature(env, "OPENROUTER_TEMPERATURE", 0.4),
  };
}

function readRequiredEnv(env: NodeJS.ProcessEnv, key: string): string {
  const value = env[key];
  if (!value || value.trim().length === 0) {
    throw new ReportGeneratorConfigError(`${key} 환경변수가 필요합니다.`);
  }
  return value.trim();
}

function readOptionalEnv(
  env: NodeJS.ProcessEnv,
  key: string,
): string | undefined {
  const value = env[key];
  if (!value || value.trim().length === 0) {
    return undefined;
  }
  return value.trim();
}

function readPositiveInteger(
  env: NodeJS.ProcessEnv,
  key: string,
  defaultValue: number,
): number {
  const rawValue = env[key];
  if (!rawValue || rawValue.trim().length === 0) {
    return defaultValue;
  }

  const value = Number(rawValue);
  if (!Number.isInteger(value) || value <= 0) {
    throw new ReportGeneratorConfigError(`${key}는 양의 정수여야 합니다.`);
  }
  return value;
}

function readTemperature(
  env: NodeJS.ProcessEnv,
  key: string,
  defaultValue: number,
): number {
  const rawValue = env[key];
  if (!rawValue || rawValue.trim().length === 0) {
    return defaultValue;
  }

  const value = Number(rawValue);
  if (!Number.isFinite(value) || value < 0 || value > 2) {
    throw new ReportGeneratorConfigError(`${key}는 0 이상 2 이하 숫자여야 합니다.`);
  }
  return value;
}
