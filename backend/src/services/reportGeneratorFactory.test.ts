import { describe, expect, it } from "vitest";
import {
  createReportGenerator,
  ReportGeneratorConfigError,
} from "./reportGeneratorFactory.js";

describe("createReportGenerator", () => {
  it("uses mock mode by default", () => {
    const generator = createReportGenerator({});

    expect(generator.mode).toBe("mock");
  });

  it("uses OpenRouter mode when configured", () => {
    const generator = createReportGenerator({
      AI_MODE: "openrouter",
      OPENROUTER_API_KEY: "test-key",
    });

    expect(generator.mode).toBe("openrouter");
  });

  it("rejects OpenRouter mode without an API key", () => {
    expect(() => createReportGenerator({ AI_MODE: "openrouter" })).toThrow(
      ReportGeneratorConfigError,
    );
  });
});
