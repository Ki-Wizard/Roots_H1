import type { SurveyQuestion } from "@philotype/shared";

export const questions: SurveyQuestion[] = [
  {
    id: "fairness-friend",
    status: "active",
    title: "친구의 부정행위",
    dilemma:
      "친한 친구가 시험에서 부정행위를 했다는 사실을 알게 되었습니다. 신고하면 친구는 큰 불이익을 받지만, 신고하지 않으면 공정성이 무너집니다.",
    negativeChoice: "친구의 상황과 결과를 먼저 고려한다",
    positiveChoice: "모두에게 같은 원칙을 적용한다",
    weights: {
      individualCommunity: -0.5,
      outcomePrinciple: 1,
      reasonExperience: -0.2,
      freedomOrder: 0.5,
    },
  },
  {
    id: "privacy-safety",
    status: "active",
    title: "안전을 위한 감시",
    dilemma:
      "범죄 예방을 위해 공공장소의 감시 기술을 크게 확대하면 안전은 높아질 수 있지만 개인의 사생활과 자유가 줄어들 수 있습니다.",
    negativeChoice: "개인의 자유와 사생활을 우선한다",
    positiveChoice: "공동체 안전과 질서를 우선한다",
    weights: {
      individualCommunity: 1,
      outcomePrinciple: -0.2,
      reasonExperience: 0.1,
      freedomOrder: 1,
    },
  },
  {
    id: "career-choice",
    status: "active",
    title: "안정과 도전 사이",
    dilemma:
      "안정적인 직장을 선택하면 예측 가능한 삶을 살 수 있지만, 오래 꿈꿔 온 불확실한 도전을 포기해야 합니다.",
    negativeChoice: "스스로 원하는 도전을 선택한다",
    positiveChoice: "안정적인 책임과 질서를 선택한다",
    weights: {
      individualCommunity: 0.3,
      outcomePrinciple: -0.4,
      reasonExperience: -0.3,
      freedomOrder: 1,
    },
  },
  {
    id: "truth-comfort",
    status: "planned",
    title: "진실과 위로",
    dilemma: "진실을 말하면 상대가 크게 상처받지만 침묵하면 관계가 유지됩니다.",
    negativeChoice: "상대가 받을 결과를 고려한다",
    positiveChoice: "정직의 원칙을 지킨다",
    weights: {
      individualCommunity: -0.4,
      outcomePrinciple: 1,
      reasonExperience: 0,
      freedomOrder: 0.2,
    },
  },
  {
    id: "automation-jobs",
    status: "planned",
    title: "기술 발전과 일자리",
    dilemma: "자동화 기술은 사회 전체의 효율을 높이지만 일부 사람의 일자리를 잃게 합니다.",
    negativeChoice: "혁신과 전체 결과를 우선한다",
    positiveChoice: "공동체 구성원의 보호를 우선한다",
    weights: {
      individualCommunity: 0.8,
      outcomePrinciple: 0.4,
      reasonExperience: 0.2,
      freedomOrder: 0.1,
    },
  },
  {
    id: "rule-exception",
    status: "planned",
    title: "규칙의 예외",
    dilemma: "선한 목적을 이루기 위해 작은 규칙 위반이 필요한 상황입니다.",
    negativeChoice: "상황에 따라 예외를 허용한다",
    positiveChoice: "목적과 무관하게 규칙을 지킨다",
    weights: {
      individualCommunity: 0,
      outcomePrinciple: 1,
      reasonExperience: -0.4,
      freedomOrder: 0.6,
    },
  },
  {
    id: "tradition-change",
    status: "planned",
    title: "전통과 변화",
    dilemma: "오랫동안 유지된 공동체 전통이 일부 구성원에게 불편함을 줍니다.",
    negativeChoice: "개인의 선택과 변화를 우선한다",
    positiveChoice: "공동체의 전통과 연속성을 우선한다",
    weights: {
      individualCommunity: 1,
      outcomePrinciple: 0.2,
      reasonExperience: 0.5,
      freedomOrder: 0.8,
    },
  },
  {
    id: "expert-lived-experience",
    status: "planned",
    title: "전문가 지식과 실제 경험",
    dilemma: "통계와 전문가 의견이 현장에서 직접 경험한 사람들의 판단과 충돌합니다.",
    negativeChoice: "논리와 객관적 자료를 우선한다",
    positiveChoice: "당사자의 경험과 맥락을 우선한다",
    weights: {
      individualCommunity: 0.2,
      outcomePrinciple: 0,
      reasonExperience: 1,
      freedomOrder: -0.1,
    },
  },
];

export const activeQuestions = questions.filter(
  (question) => question.status === "active",
);
