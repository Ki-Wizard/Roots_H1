import cors from "cors";
import express from "express";
import type {
  ApiError,
  PublicSurveyQuestion,
} from "@philotype/shared";
import { activeQuestions } from "./config/questions.js";
import { analyze } from "./services/analyzer.js";
import type { ReportGenerator } from "./services/reportGenerator.js";
import { createReportGenerator } from "./services/reportGeneratorFactory.js";
import { validateAnalysisRequest } from "./services/validation.js";

export interface AppOptions {
  readonly reportGenerator?: ReportGenerator;
}

export function createApp(options: AppOptions = {}) {
  const app = express();
  const reportGenerator = options.reportGenerator ?? createReportGenerator();

  app.use(
    cors({
      origin: process.env.FRONTEND_ORIGIN ?? "http://localhost:5173",
    }),
  );
  app.use(express.json({ limit: "32kb" }));

  app.get("/api/health", (_request, response) => {
    response.json({
      status: "ok",
      aiMode: reportGenerator.mode,
      persistence: false,
    });
  });

  app.get("/api/questions", (_request, response) => {
    const publicQuestions: PublicSurveyQuestion[] = activeQuestions.map(
      ({ id, title, dilemma, negativeChoice, positiveChoice }) => ({
        id,
        title,
        dilemma,
        negativeChoice,
        positiveChoice,
      }),
    );

    response.json({
      questions: publicQuestions,
      scale: {
        min: -2,
        max: 2,
        reasonMinLength: 5,
        reasonMaxLength: 200,
      },
    });
  });

  app.post("/api/analysis", async (request, response) => {
    const validation = validateAnalysisRequest(request.body);

    if (!validation.valid || !validation.request) {
      const error: ApiError = {
        error: "분석 요청이 올바르지 않습니다.",
        details: validation.details,
      };
      response.status(400).json(error);
      return;
    }

    const result = await analyze(validation.request, reportGenerator);
    response.json(result);
  });

  app.use(
    (
      error: Error,
      _request: express.Request,
      response: express.Response<ApiError>,
      _next: express.NextFunction,
    ) => {
      console.error(error);
      response.status(500).json({
        error: "분석 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
      });
    },
  );

  return app;
}
