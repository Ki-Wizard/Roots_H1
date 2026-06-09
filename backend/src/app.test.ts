import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "./app.js";

const validBody = {
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

describe("PhiloType API", () => {
  it("exposes three active questions without weights", async () => {
    const response = await request(createApp()).get("/api/questions");
    expect(response.status).toBe(200);
    expect(response.body.questions).toHaveLength(3);
    expect(response.body.questions[0].weights).toBeUndefined();
  });

  it("returns the same result for the same request", async () => {
    const app = createApp();
    const first = await request(app).post("/api/analysis").send(validBody);
    const second = await request(app).post("/api/analysis").send(validBody);

    expect(first.status).toBe(200);
    expect(first.body).toEqual(second.body);
    expect(first.body.mode).toBe("mock");
    expect(first.body.evidence.length).toBeGreaterThan(0);
  });

  it("rejects missing and out-of-range answers", async () => {
    const response = await request(createApp())
      .post("/api/analysis")
      .send({
        answers: [
          {
            questionId: "fairness-friend",
            scale: 3,
            reason: "짧음",
          },
        ],
      });

    expect(response.status).toBe(400);
    expect(response.body.details.length).toBeGreaterThan(1);
  });
});
