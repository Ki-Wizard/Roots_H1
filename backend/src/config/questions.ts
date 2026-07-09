import type { AxisId, SurveyQuestion } from "@philotype/shared";

const singleAxisWeights = (axis: AxisId): SurveyQuestion["weights"] => ({
  individualCommunity: axis === "individualCommunity" ? 1 : 0,
  outcomePrinciple: axis === "outcomePrinciple" ? 1 : 0,
  reasonExperience: axis === "reasonExperience" ? 1 : 0,
  freedomOrder: axis === "freedomOrder" ? 1 : 0,
});

// allow: SIZE_OK - 40-item survey question data table.
export const questions: SurveyQuestion[] = [
  {
    id: "triage-power",
    status: "active",
    title: "정전된 병원의 예비 전력",
    dilemma:
      "큰 병원에 정전이 발생했습니다. 예비 전력은 한 병동에만 보낼 수 있습니다. 중환자실에 보내면 생존 가능성이 높은 세 명을 살릴 수 있고, 응급실에 보내면 가장 먼저 도착해 기다리던 위급 환자 한 명을 살릴 수 있습니다.",
    negativeChoice: "더 많은 생명을 살릴 수 있는 중환자실에 전력을 보낸다",
    positiveChoice: "먼저 치료 순서가 온 응급실 환자에게 전력을 보낸다",
    weights: singleAxisWeights("outcomePrinciple"),
  },
  {
    id: "festival-accounting",
    status: "active",
    title: "취소 직전의 학교 축제",
    dilemma:
      "학교 축제 예산을 정리하던 중, 회계 담당자인 당신은 작은 규정 위반을 발견했습니다. 조용히 넘어가면 모두가 기다린 축제는 예정대로 열리지만, 사실대로 보고하면 축제는 취소되고 준비한 학생들이 크게 실망합니다.",
    negativeChoice: "규정 위반을 숨기고 축제를 진행한다",
    positiveChoice: "축제가 취소되더라도 사실대로 보고한다",
    weights: singleAxisWeights("outcomePrinciple"),
  },
  {
    id: "unpaid-wage-evidence",
    status: "active",
    title: "버려진 영수증 사진",
    dilemma:
      "친구가 아르바이트비를 받지 못해 사장과 다투고 있습니다. 당신은 사장이 몰래 버린 내부 영수증 사진을 갖고 있습니다. 그 사진을 쓰면 친구의 억울함을 풀 수 있지만, 원래 당신이 보면 안 되는 자료입니다.",
    negativeChoice: "부당함을 바로잡기 위해 사진을 사용한다",
    positiveChoice: "몰래 얻은 자료는 쓰지 않는다",
    weights: singleAxisWeights("outcomePrinciple"),
  },
  {
    id: "class-theft-truth",
    status: "active",
    title: "도난 사건과 학급 프로젝트",
    dilemma:
      "반 친구 한 명이 도난 사건의 범인으로 몰렸습니다. 당신은 진짜 범인이 누구인지 알고 있습니다. 하지만 지금 밝히면 학급 전체가 몇 달간 준비한 외부 프로젝트가 취소되고 여러 명이 피해를 봅니다.",
    negativeChoice: "더 큰 피해를 막기 위해 침묵한다",
    positiveChoice: "프로젝트가 무너져도 진실을 밝힌다",
    weights: singleAxisWeights("outcomePrinciple"),
  },
  {
    id: "autonomous-crash",
    status: "active",
    title: "피할 수 없는 자율주행 사고",
    dilemma:
      "자율주행차가 사고를 피할 수 없는 도로에 들어섰습니다. 직진하면 횡단보도 위 세 사람이 크게 다치고, 방향을 틀면 탑승자 한 명이 크게 다칩니다. 당신은 마지막 수동 조작 권한을 갖고 있습니다.",
    negativeChoice: "피해자가 적은 방향으로 차를 돌린다",
    positiveChoice: "탑승자를 일부러 해치는 조작은 하지 않는다",
    weights: singleAxisWeights("outcomePrinciple"),
  },
  {
    id: "ai-presentation",
    status: "active",
    title: "전날 밤 쓰러진 발표자",
    dilemma:
      "팀 프로젝트 발표 전날, 발표자가 독감으로 쓰러졌습니다. 몰래 AI가 만든 발표문을 쓰면 팀은 높은 점수를 받을 수 있지만, 수업 규정상 외부 작성 발표문은 금지되어 있습니다.",
    negativeChoice: "팀 전체 성적을 위해 발표문을 사용한다",
    positiveChoice: "낮은 점수를 받아도 규정을 지킨다",
    weights: singleAxisWeights("outcomePrinciple"),
  },
  {
    id: "family-contract-lie",
    status: "active",
    title: "가족을 지키는 한 문장",
    dilemma:
      "동생의 실수로 가족의 전세 계약이 깨질 위기입니다. 당신이 중요한 사실 하나를 숨기면 계약은 유지되지만, 상대방은 그 사실을 모른 채 결정하게 됩니다.",
    negativeChoice: "가족을 지키기 위해 사실을 숨긴다",
    positiveChoice: "계약이 깨질 수 있어도 상대방에게 사실을 말한다",
    weights: singleAxisWeights("outcomePrinciple"),
  },
  {
    id: "finals-equipment-error",
    status: "active",
    title: "결승전 장비 오류",
    dilemma:
      "게임 대회 결승전에서 상대 팀 장비에 오류가 있었다는 사실을 발견했습니다. 심판은 모르고 있고, 말하지 않으면 당신 팀은 그대로 우승합니다. 알리면 경기가 다시 시작되어 결과가 불확실해집니다.",
    negativeChoice: "오류를 말하지 않고 현재 우승 기회를 유지한다",
    positiveChoice: "우승이 불확실해져도 오류를 알린다",
    weights: singleAxisWeights("outcomePrinciple"),
  },
  {
    id: "club-fund-report",
    status: "active",
    title: "동아리 지원금 실수",
    dilemma:
      "동아리 회장이 실수로 지원금을 잘못 사용했습니다. 조용히 메우면 동아리는 유지되고 아무도 피해를 보지 않습니다. 공식 보고를 하면 동아리는 해산될 수 있습니다.",
    negativeChoice: "동아리를 살리기 위해 조용히 해결한다",
    positiveChoice: "해산되더라도 공식 절차대로 보고한다",
    weights: singleAxisWeights("outcomePrinciple"),
  },
  {
    id: "wildfire-firebreak",
    status: "active",
    title: "산불 앞의 빈집",
    dilemma:
      "마을에 산불이 번지고 있습니다. 불길을 막으려면 빈집 한 채를 일부러 태워 방화선을 만들어야 합니다. 집주인의 동의는 아직 받지 못했지만, 기다리면 마을 전체가 위험해질 수 있습니다.",
    negativeChoice: "더 큰 피해를 막기 위해 빈집을 태운다",
    positiveChoice: "동의 없는 재산 훼손은 하지 않는다",
    weights: singleAxisWeights("outcomePrinciple"),
  },
  {
    id: "company-overtime-surgery",
    status: "active",
    title: "회사 위기와 가족 수술",
    dilemma:
      "회사가 큰 위기를 맞았습니다. 전 직원이 한 달간 야근하면 해고를 피할 수 있습니다. 하지만 당신은 오래전부터 잡아둔 가족 수술 일정 때문에 그 기간에 빠져야 합니다.",
    negativeChoice: "가족 일정과 개인 사정을 우선한다",
    positiveChoice: "회사를 위해 일정을 조정하고 야근에 참여한다",
    weights: singleAxisWeights("individualCommunity"),
  },
  {
    id: "late-student-penalty",
    status: "active",
    title: "한 명의 지각과 반 전체 벌점",
    dilemma:
      "반 전체가 지각 벌점을 받게 생겼습니다. 사실 지각한 사람은 한 명뿐입니다. 그 학생을 밝히면 반은 벌점을 피하지만, 그 학생은 심하게 따돌림당할 가능성이 있습니다.",
    negativeChoice: "한 학생을 보호하기 위해 모두가 벌점을 나눈다",
    positiveChoice: "공동체 규칙과 책임을 위해 당사자를 밝힌다",
    weights: singleAxisWeights("individualCommunity"),
  },
  {
    id: "privacy-cameras",
    status: "active",
    title: "아파트 복도의 CCTV",
    dilemma:
      "아파트 주민들이 보안을 위해 모든 층 CCTV 확대 설치에 찬성하고 있습니다. 당신 집 앞까지 촬영되어 사생활은 줄어들지만, 절도와 사고를 줄이는 효과는 클 것으로 보입니다.",
    negativeChoice: "사생활을 지키기 위해 반대한다",
    positiveChoice: "주민 전체의 안전을 위해 찬성한다",
    weights: singleAxisWeights("individualCommunity"),
  },
  {
    id: "weak-teammate",
    status: "active",
    title: "부족한 팀원의 마지막 기회",
    dilemma:
      "팀 프로젝트에서 한 명이 계속 따라오지 못해 전체 성과가 떨어지고 있습니다. 그 사람을 빼면 팀은 성공할 가능성이 커지지만, 그는 중요한 성장 기회를 잃게 됩니다.",
    negativeChoice: "그 사람의 성장 기회를 지켜준다",
    positiveChoice: "팀의 성과를 위해 역할을 교체한다",
    weights: singleAxisWeights("individualCommunity"),
  },
  {
    id: "volunteer-fatigue",
    status: "active",
    title: "피곤한 날의 마을 축제",
    dilemma:
      "마을 축제 준비에 주민 대부분이 자원봉사로 참여합니다. 당신은 피곤하고 축제에 큰 관심도 없습니다. 하지만 빠지면 다른 사람들이 그만큼 더 오래 일해야 합니다.",
    negativeChoice: "내 시간과 휴식을 우선한다",
    positiveChoice: "공동체 부담을 나누기 위해 참여한다",
    weights: singleAxisWeights("individualCommunity"),
  },
  {
    id: "travel-cost-friend",
    status: "active",
    title: "여행비를 못 내는 친구",
    dilemma:
      "친구들과 여행비를 똑같이 나누기로 했습니다. 그런데 한 친구가 형편이 어려워 절반만 낼 수 있다고 합니다. 그 친구가 함께하려면 나머지 사람들이 조금씩 더 부담해야 합니다.",
    negativeChoice: "각자 약속한 만큼 내는 원칙을 지킨다",
    positiveChoice: "친구가 함께할 수 있게 비용을 나눠 부담한다",
    weights: singleAxisWeights("individualCommunity"),
  },
  {
    id: "phone-ban-school",
    status: "active",
    title: "몇 명 때문에 생긴 휴대폰 금지",
    dilemma:
      "학교가 수업 중 휴대폰 사용을 전면 금지하려 합니다. 일부 학생의 문제 행동 때문이지만, 대부분 학생에게도 큰 불편이 생깁니다. 그래도 수업 분위기는 좋아질 수 있습니다.",
    negativeChoice: "개인 자유 침해라 반대한다",
    positiveChoice: "전체 학습 분위기를 위해 찬성한다",
    weights: singleAxisWeights("individualCommunity"),
  },
  {
    id: "library-children-hours",
    status: "active",
    title: "조용한 도서관과 아이들",
    dilemma:
      "동네 도서관이 조용한 학습 공간을 만들기 위해 어린이 출입 시간을 제한하려 합니다. 공부하는 사람들에게는 도움이 되지만, 아이들과 부모들은 이용할 수 있는 시간이 크게 줄어듭니다.",
    negativeChoice: "아이들과 가족의 이용권을 우선한다",
    positiveChoice: "다수 이용자의 조용한 환경을 우선한다",
    weights: singleAxisWeights("individualCommunity"),
  },
  {
    id: "after-hours-chat",
    status: "active",
    title: "퇴근 후 단톡방",
    dilemma:
      "회사 단톡방에 업무 공지가 밤늦게 올라옵니다. 모두가 빨리 확인하면 일이 편해지지만, 퇴근 후 개인 시간은 계속 침해됩니다. 당신이 확인하지 않으면 팀 대응이 늦어질 수 있습니다.",
    negativeChoice: "퇴근 후에는 개인 시간을 지키고 확인하지 않는다",
    positiveChoice: "팀 운영을 위해 늦은 공지도 확인한다",
    weights: singleAxisWeights("individualCommunity"),
  },
  {
    id: "water-ration-family",
    status: "active",
    title: "재난 속 물 두 병",
    dilemma:
      "재난 상황에서 마트가 생수를 1인 2병으로 제한합니다. 당신 가족에는 아픈 사람이 있어 더 필요합니다. 하지만 당신이 더 가져가면 뒤에 선 사람은 물을 못 살 수 있습니다.",
    negativeChoice: "가족을 위해 제한보다 더 확보한다",
    positiveChoice: "모두를 위해 제한 수량을 지킨다",
    weights: singleAxisWeights("individualCommunity"),
  },
  {
    id: "failed-interview-friend",
    status: "active",
    title: "면접에서 떨어진 친구",
    dilemma:
      "친구가 면접에서 떨어지고 울면서 '내가 그렇게 부족해?'라고 묻습니다. 사실 당신은 친구의 준비가 많이 부족했다는 것을 알고 있습니다. 지금 말하면 상처가 될 수 있지만 다음 기회에는 도움이 됩니다.",
    negativeChoice: "지금은 위로를 먼저 한다",
    positiveChoice: "상처가 되더라도 정확한 피드백을 한다",
    weights: singleAxisWeights("reasonExperience"),
  },
  {
    id: "hidden-truth-partner",
    status: "active",
    title: "상처 주기 싫었던 비밀",
    dilemma:
      "연인이 당신에게 중요한 사실을 숨겼습니다. 이유를 들어보니 상처 주기 싫어서였고 악의는 없어 보입니다. 그래도 중요한 사실을 숨겼다는 점은 분명히 남아 있습니다.",
    negativeChoice: "상대의 마음과 상황을 먼저 이해한다",
    positiveChoice: "숨겼다는 사실 자체를 분명히 문제 삼는다",
    weights: singleAxisWeights("reasonExperience"),
  },
  {
    id: "lost-presentation-file",
    status: "active",
    title: "사라진 발표 자료",
    dilemma:
      "팀원이 실수로 발표 자료를 모두 날렸습니다. 그는 이미 죄책감에 무너져 있습니다. 하지만 다시는 반복되면 안 되는 큰 실수라 원인과 책임을 분명히 해야 합니다.",
    negativeChoice: "감정을 추스를 시간을 먼저 준다",
    positiveChoice: "즉시 원인과 책임을 정리한다",
    weights: singleAxisWeights("reasonExperience"),
  },
  {
    id: "stranger-bus-money",
    status: "active",
    title: "낯선 사람의 급한 부탁",
    dilemma:
      "길에서 낯선 사람이 급히 교통비를 빌려달라고 합니다. 사연은 절박해 보이고 표정도 진심처럼 느껴집니다. 하지만 확인할 방법은 없고, 속을 가능성도 있습니다.",
    negativeChoice: "직감을 믿고 바로 도와준다",
    positiveChoice: "확인되지 않으면 정중히 거절한다",
    weights: singleAxisWeights("reasonExperience"),
  },
  {
    id: "disliked-person-defense",
    status: "active",
    title: "미움받는 사람을 변호하는 친구",
    dilemma:
      "친구가 모두에게 미움받는 사람을 변호하고 있습니다. 논리적으로는 친구의 말이 맞아 보입니다. 하지만 피해자들의 감정을 생각하면 그 변호를 듣는 것만으로도 불편합니다.",
    negativeChoice: "상처받은 사람들의 감정을 우선한다",
    positiveChoice: "불편해도 논리와 사실을 기준으로 본다",
    weights: singleAxisWeights("reasonExperience"),
  },
  {
    id: "family-false-info",
    status: "active",
    title: "가족 모임의 틀린 정보",
    dilemma:
      "가족 모임에서 어른이 틀린 정보를 강하게 말합니다. 바로잡으면 분위기가 싸해지고 관계가 불편해질 수 있습니다. 그대로 두면 잘못된 믿음이 계속 퍼질 수 있습니다.",
    negativeChoice: "분위기를 생각해 넘어간다",
    positiveChoice: "근거를 들어 조심스럽게 바로잡는다",
    weights: singleAxisWeights("reasonExperience"),
  },
  {
    id: "friend-grudge",
    status: "active",
    title: "친구가 싫어하는 사람",
    dilemma:
      "친한 친구가 어떤 사람을 싫어해서 당신도 같이 거리를 두길 원합니다. 하지만 당신이 직접 겪은 바로는 그 사람에게 큰 문제는 없었습니다. 친구는 당신이 자기 편을 들어주길 바랍니다.",
    negativeChoice: "친구의 감정에 맞춰 거리를 둔다",
    positiveChoice: "내가 본 사실을 기준으로 따로 판단한다",
    weights: singleAxisWeights("reasonExperience"),
  },
  {
    id: "public-apology",
    status: "active",
    title: "공개 사과 이후",
    dilemma:
      "누군가 공개적으로 사과했지만, 당신은 진심인지 의심됩니다. 주변 사람들은 이제 용서하고 넘어가자고 말합니다. 분위기는 회복되는 듯하지만, 아직 확인되지 않은 부분이 남아 있습니다.",
    negativeChoice: "관계 회복 분위기를 위해 사과를 받아들인다",
    positiveChoice: "진정성이 확인될 때까지 판단을 보류한다",
    weights: singleAxisWeights("reasonExperience"),
  },
  {
    id: "exam-anxiety-cheat",
    status: "active",
    title: "시험 직전의 불안",
    dilemma:
      "시험 직전 친구가 너무 불안해서 답을 조금만 알려달라고 합니다. 거절하면 친구가 무너질 것 같고, 당신도 마음이 쓰입니다. 하지만 답을 알려주는 것은 분명한 부정행위입니다.",
    negativeChoice: "친구의 상태를 보고 조금 도와준다",
    positiveChoice: "감정이 힘들어도 규칙을 지킨다",
    weights: singleAxisWeights("reasonExperience"),
  },
  {
    id: "repeated-counseling-mistake",
    status: "active",
    title: "계속 반복되는 상담",
    dilemma:
      "상담 봉사에서 만난 사람이 계속 같은 실수를 반복합니다. 마음으로는 안타깝고 한 번 더 기다려주고 싶습니다. 하지만 객관적으로는 단호한 선 긋기가 필요해 보입니다.",
    negativeChoice: "한 번 더 공감하고 기다린다",
    positiveChoice: "기준을 세우고 단호히 말한다",
    weights: singleAxisWeights("reasonExperience"),
  },
  {
    id: "corrupt-company-job",
    status: "active",
    title: "비리 있는 회사의 합격 통보",
    dilemma:
      "당신은 비리가 있다는 소문이 강한 회사에 합격했습니다. 거절하면 당장 생활이 어렵습니다. 입사하면 현실적인 안정은 얻지만, 마음속 찜찜함도 함께 감수해야 합니다.",
    negativeChoice: "생활을 위해 입사한다",
    positiveChoice: "원칙에 맞지 않아 거절한다",
    weights: singleAxisWeights("freedomOrder"),
  },
  {
    id: "policy-protest-risk",
    status: "active",
    title: "기록이 남는 시위",
    dilemma:
      "시민단체가 부당한 정책에 맞서 시위를 준비합니다. 참여하면 기록이 남아 취업이나 평가에 불리할 수 있습니다. 침묵하면 정책은 그대로 통과될 가능성이 큽니다.",
    negativeChoice: "현실적 위험을 피한다",
    positiveChoice: "불이익을 감수하고 참여한다",
    weights: singleAxisWeights("freedomOrder"),
  },
  {
    id: "startup-investor-pitch",
    status: "active",
    title: "투자자 앞의 과장",
    dilemma:
      "창업팀이 투자자를 만나기 직전입니다. 제품은 아직 부족하지만, 가능성을 조금 과장해서 말하면 투자를 받고 실제로 완성할 시간을 벌 수 있습니다. 정확히 말하면 투자는 어려울 수 있습니다.",
    negativeChoice: "살아남기 위해 가능성을 크게 말한다",
    positiveChoice: "불리해도 현재 상태를 정확히 말한다",
    weights: singleAxisWeights("freedomOrder"),
  },
  {
    id: "teacher-evaluation",
    status: "active",
    title: "평가표와 좋은 수업",
    dilemma:
      "교사인 당신은 학생들에게 더 좋은 수업을 하고 싶습니다. 하지만 학교 행정은 점수 중심 수업을 요구합니다. 이상적인 수업을 하면 평가가 낮아지고, 지시대로 하면 학생들은 덜 성장합니다.",
    negativeChoice: "평가와 현실 조건에 맞춘다",
    positiveChoice: "손해를 감수하고 좋은 수업을 한다",
    weights: singleAxisWeights("freedomOrder"),
  },
  {
    id: "unstable-dream-friend",
    status: "active",
    title: "불안정한 꿈을 택한 친구",
    dilemma:
      "친구가 안정적인 길을 포기하고 꿈을 좇아 불안정한 일을 시작하려 합니다. 현실적으로 실패 가능성이 높습니다. 하지만 그 친구는 처음으로 자신이 살아 있다고 느낀다고 말합니다.",
    negativeChoice: "현실적인 위험을 강하게 말린다",
    positiveChoice: "실패 가능성이 있어도 응원한다",
    weights: singleAxisWeights("freedomOrder"),
  },
  {
    id: "harmful-cheap-process",
    status: "active",
    title: "싸지만 해로운 생산 방식",
    dilemma:
      "회사에서 환경에 해로운 생산 방식을 쓰면 비용을 크게 줄일 수 있습니다. 법적으로는 문제가 없고 경쟁사들도 비슷하게 합니다. 더 나은 방식을 택하면 성장이 느려집니다.",
    negativeChoice: "시장에서 살아남기 위해 기존 방식을 따른다",
    positiveChoice: "비용이 늘어도 더 나은 방식을 택한다",
    weights: singleAxisWeights("freedomOrder"),
  },
  {
    id: "redevelopment-alley",
    status: "active",
    title: "사라질 오래된 골목",
    dilemma:
      "마을 재개발로 오래된 골목이 사라질 예정입니다. 새 아파트가 생기면 생활은 편해지고 집값도 오를 수 있습니다. 하지만 그곳에 담긴 기억과 공동체는 사라집니다.",
    negativeChoice: "더 나은 생활 조건을 선택한다",
    positiveChoice: "불편해도 지켜야 할 가치를 선택한다",
    weights: singleAxisWeights("freedomOrder"),
  },
  {
    id: "whistleblower-file",
    status: "active",
    title: "내부 고발 파일",
    dilemma:
      "당신은 조직의 문제를 보여주는 내부 자료를 갖고 있습니다. 공개하면 사회적으로 의미가 크지만, 가족과 커리어가 무너질 수 있습니다. 침묵하면 당신의 삶은 안정적으로 유지됩니다.",
    negativeChoice: "현실적 피해를 고려해 침묵한다",
    positiveChoice: "위험을 감수하고 공개한다",
    weights: singleAxisWeights("freedomOrder"),
  },
  {
    id: "student-council-budget",
    status: "active",
    title: "절반만 가능한 급식 개선안",
    dilemma:
      "학생회가 모두에게 공평한 급식 개선안을 냈지만, 예산상 절반만 실현 가능합니다. 완벽한 안을 고집하면 아무것도 못 바꿀 수 있고, 타협하면 일부 문제만 해결됩니다.",
    negativeChoice: "가능한 개선부터 타협한다",
    positiveChoice: "불완전한 타협보다 원안을 지킨다",
    weights: singleAxisWeights("freedomOrder"),
  },
  {
    id: "addictive-service-growth",
    status: "active",
    title: "성장하는 서비스의 중독성",
    dilemma:
      "당신이 만든 서비스가 사람들에게 편리함을 줍니다. 하지만 일부 사용자의 집중력과 생활 습관을 망칠 수 있다는 데이터를 봤습니다. 중독성을 줄이면 회사의 성장은 느려집니다.",
    negativeChoice: "현실적 성장과 사용자 선택에 맡긴다",
    positiveChoice: "손해를 감수하고 중독성을 줄인다",
    weights: singleAxisWeights("freedomOrder"),
  },
];

export const activeQuestions = questions.filter(
  (question) => question.status === "active",
);
