import type { AxisId } from "@philotype/shared";

export interface PhilosophyType {
  id: string;
  name: string;
  philosopher: string;
  axis: AxisId;
  direction: "negative" | "positive";
  coreValues: string[];
  decisionStyle: string;
}

export const philosophyTypes: PhilosophyType[] = [
  {
    id: "relational-humanist",
    name: "관계적 인문주의자",
    philosopher: "공자",
    axis: "individualCommunity",
    direction: "positive",
    coreValues: ["관계", "책임", "조화"],
    decisionStyle: "선택이 주변 사람과 공동체에 미칠 영향을 살핍니다.",
  },
  {
    id: "autonomous-existentialist",
    name: "자율적 실존주의자",
    philosopher: "사르트르",
    axis: "individualCommunity",
    direction: "negative",
    coreValues: ["자율", "선택", "책임"],
    decisionStyle: "타인의 기준보다 스스로 선택한 삶의 방향을 중시합니다.",
  },
  {
    id: "principled-rationalist",
    name: "원칙적 합리주의자",
    philosopher: "칸트",
    axis: "outcomePrinciple",
    direction: "positive",
    coreValues: ["원칙", "일관성", "정당성"],
    decisionStyle: "결과보다 모두에게 적용 가능한 원칙인지를 먼저 묻습니다.",
  },
  {
    id: "pragmatic-utilitarian",
    name: "실용적 공리주의자",
    philosopher: "존 스튜어트 밀",
    axis: "outcomePrinciple",
    direction: "negative",
    coreValues: ["효용", "행복", "현실성"],
    decisionStyle: "선택이 만들어 낼 실제 결과와 전체 행복을 비교합니다.",
  },
  {
    id: "experiential-virtue-thinker",
    name: "경험적 덕 윤리 실천가",
    philosopher: "아리스토텔레스",
    axis: "reasonExperience",
    direction: "positive",
    coreValues: ["경험", "균형", "실천"],
    decisionStyle: "추상적 규칙보다 맥락과 반복된 경험에서 답을 찾습니다.",
  },
  {
    id: "skeptical-empiricist",
    name: "회의적 이성 탐구자",
    philosopher: "데이비드 흄",
    axis: "reasonExperience",
    direction: "negative",
    coreValues: ["검증", "회의", "논리"],
    decisionStyle: "당연해 보이는 믿음도 근거와 논리를 통해 다시 확인합니다.",
  },
  {
    id: "ordered-contractarian",
    name: "질서 중심 사회계약론자",
    philosopher: "토머스 홉스",
    axis: "freedomOrder",
    direction: "positive",
    coreValues: ["질서", "안전", "책임"],
    decisionStyle: "공동의 안전과 예측 가능한 규칙을 중요하게 여깁니다.",
  },
  {
    id: "liberty-centered-egalitarian",
    name: "자유 중심 정의론자",
    philosopher: "존 롤스",
    axis: "freedomOrder",
    direction: "negative",
    coreValues: ["자유", "공정", "권리"],
    decisionStyle: "개인의 기본 자유와 공정한 선택 조건을 우선합니다.",
  },
];
