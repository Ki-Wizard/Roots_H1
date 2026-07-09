import type {
  AnalysisRequest,
  GeneratedReport,
  SurveyQuestion,
} from "@philotype/shared";
import type { ScoredProfile } from "./scoreCalculator.js";
import type { ReportGenerator } from "./reportGenerator.js";

export class MockReportGenerator implements ReportGenerator {
  readonly mode = "mock" as const;

  async generate(
    request: AnalysisRequest,
    profile: ScoredProfile,
    questions: SurveyQuestion[],
  ): Promise<GeneratedReport> {
    const { primaryType, secondaryType } = profile;
    const evidence = request.answers.map((answer) => {
      const question = questions.find((item) => item.id === answer.questionId);
      const selectedChoice =
        answer.choice === "positive"
          ? question?.positiveChoice
          : question?.negativeChoice;
      return {
        questionId: answer.questionId,
        questionTitle: question?.title ?? answer.questionId,
        reason: answer.reason.trim(),
        interpretation: selectedChoice
          ? `"${selectedChoice}" 선택의 기준을 보여주며, 현재 판단 경향을 해석하는 근거가 될 수 있습니다.`
          : "선택 이유를 바탕으로 현재 판단 경향을 해석하는 근거가 될 수 있습니다.",
      };
    });

    return {
      summary: `현재 답변에서는 ${primaryType.name}의 성향이 두드러지며, ${secondaryType.name}의 관점도 함께 보입니다. 이는 고정된 정체성이 아니라 현재 답변에서 드러난 판단 경향입니다.`,
      strengths: [
        `${primaryType.coreValues[0]}을 기준으로 복잡한 상황을 정리하는 힘`,
        `${secondaryType.coreValues[0]}의 관점까지 함께 고려하는 균형감`,
      ],
      cautions: [
        `익숙한 ${primaryType.coreValues[0]}의 기준이 다른 관점을 가리지 않는지 살펴보세요.`,
        "빠른 결론보다 반대 입장의 이유를 한 번 더 확인하면 판단이 단단해집니다.",
      ],
      recurringQuestion: `내가 중요하게 여기는 ${primaryType.coreValues[0]}은 다른 사람에게도 공정하게 적용될 수 있을까?`,
      opposingView: `${primaryType.name}와 반대되는 관점은 같은 상황에서 다른 가치와 결과를 먼저 살필 수 있습니다. 어느 한쪽이 정답이라기보다, 놓친 비용을 발견하는 도구로 활용할 수 있습니다.`,
      prescriptions: [
        "결정을 내리기 전, 반대 선택을 지지하는 이유를 한 문장으로 써보세요.",
        "내 선택으로 가장 큰 영향을 받는 사람이 누구인지 확인해 보세요.",
        "원칙과 실제 결과가 충돌할 때 무엇을 조정할 수 있는지 질문해 보세요.",
      ],
      recommendedPhilosophers: [
        primaryType.philosopher,
        secondaryType.philosopher,
      ],
      shareText: `나의 PhiloType에서는 '${primaryType.name}' 경향이 보입니다. ${primaryType.decisionStyle} 정답을 단정하기보다, 내가 어떤 기준으로 판단하는지 발견했습니다.`,
      evidence,
    };
  }
}
