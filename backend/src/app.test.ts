import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "./app.js";
import { activeQuestions } from "./config/questions.js";

const testChoices = ["negative", "positive"] as const;

const getTestChoice = (index: number): (typeof testChoices)[number] =>
  testChoices[index % testChoices.length] ?? "negative";

const validBody = {
  answers: activeQuestions.map((question, index) => ({
    questionId: question.id,
    choice: getTestChoice(index),
    reason: "판단 기준을 확인하기 위한 테스트 응답입니다.",
  })),
};

describe("PhiloType API", () => {
  it("exposes forty active questions without weights", async () => {
    const response = await request(createApp()).get("/api/questions");
    expect(response.status).toBe(200);
    expect(response.body.questions).toHaveLength(40);
    expect(response.body.questions[0].weights).toBeUndefined();
    expect(response.body.scale).toBeUndefined();
  });

  it("returns the same result for the same request", async () => {
    const app = createApp();
    const first = await request(app).post("/api/analysis").send(validBody);
    const second = await request(app).post("/api/analysis").send(validBody);

    expect(first.status).toBe(200);
    expect(first.body).toEqual(second.body);
    expect(first.body.mode).toBe("mock");
    expect(first.body.evidence).toHaveLength(validBody.answers.length);
    expect(first.body.summary.startsWith("현재 답변에서는")).toBe(true);
    expect(first.body.shareText).toContain("경향");
  });

  it("rejects missing and invalid-choice answers", async () => {
    const response = await request(createApp())
      .post("/api/analysis")
      .send({
        answers: [
          {
            questionId: "triage-power",
            choice: "middle",
            reason: "짧음",
          },
        ],
      });

    expect(response.status).toBe(400);
    expect(response.body.details.length).toBeGreaterThan(1);
  });
});
