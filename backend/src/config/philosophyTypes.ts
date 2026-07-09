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
    name: "의무 중심 칸트주의자",
    philosopher: "칸트",
    axis: "outcomePrinciple",
    direction: "positive",
    coreValues: ["의무", "원칙", "정직"],
    decisionStyle: "결과보다 지켜야 할 의무와 보편적 원칙을 먼저 묻습니다.",
  },
  {
    id: "pragmatic-utilitarian",
    name: "결과 중심 공리주의자",
    philosopher: "벤담",
    axis: "outcomePrinciple",
    direction: "negative",
    coreValues: ["효용", "행복", "현실성"],
    decisionStyle: "선택이 만들어 낼 실제 결과와 전체 행복을 비교합니다.",
  },
  {
    id: "experiential-virtue-thinker",
    name: "이성적 합리주의자",
    philosopher: "데카르트",
    axis: "reasonExperience",
    direction: "positive",
    coreValues: ["이성", "논리", "검토"],
    decisionStyle: "감정적 반응보다 논리와 근거를 통해 판단을 점검합니다.",
  },
  {
    id: "skeptical-empiricist",
    name: "공감적 정서주의자",
    philosopher: "데이비드 흄",
    axis: "reasonExperience",
    direction: "negative",
    coreValues: ["공감", "감정", "직관"],
    decisionStyle: "논리만으로는 놓치기 쉬운 감정과 관계의 신호를 중시합니다.",
  },
  {
    id: "ordered-contractarian",
    name: "이상적 정의론자",
    philosopher: "플라톤",
    axis: "freedomOrder",
    direction: "positive",
    coreValues: ["이상", "정의", "신념"],
    decisionStyle: "현실적 손익보다 옳다고 믿는 가치와 정의를 우선합니다.",
  },
  {
    id: "liberty-centered-egalitarian",
    name: "현실적 실용주의자",
    philosopher: "마키아벨리",
    axis: "freedomOrder",
    direction: "negative",
    coreValues: ["현실", "성과", "실행"],
    decisionStyle: "이상적 명분보다 실제로 가능한 선택과 결과를 우선합니다.",
  },
];
