# PhiloType API 명세

Base URL: `http://localhost:4000`

## `GET /api/health`

서버 상태와 현재 AI 모드, 영구 저장 여부를 확인합니다.

```json
{
  "status": "ok",
  "aiMode": "mock",
  "persistence": false
}
```

## `GET /api/questions`

활성화된 딜레마 질문을 반환합니다. 점수 가중치는 클라이언트에 공개하지 않습니다.

```json
{
  "questions": [
    {
      "id": "fairness-friend",
      "title": "친구의 부정행위",
      "dilemma": "친한 친구가 시험에서...",
      "negativeChoice": "친구의 상황과 결과를 먼저 고려한다",
      "positiveChoice": "모두에게 같은 원칙을 적용한다"
    }
  ],
  "scale": {
    "min": -2,
    "max": 2,
    "reasonMinLength": 5,
    "reasonMaxLength": 200
  }
}
```

## `POST /api/analysis`

### 요청

- 활성 질문 3개에 모두 응답해야 합니다.
- `scale`은 `-2`, `-1`, `0`, `1`, `2` 중 하나입니다.
- `reason`은 공백 제외 5~200자입니다.
- `anonymousId`는 선택 항목이며 서버에 저장하지 않습니다.

```json
{
  "anonymousId": "local-browser-uuid",
  "answers": [
    {
      "questionId": "fairness-friend",
      "scale": 2,
      "reason": "모두에게 같은 규칙이 적용되어야 공정하기 때문입니다."
    },
    {
      "questionId": "privacy-safety",
      "scale": -2,
      "reason": "안전도 중요하지만 개인의 기본 자유를 지켜야 합니다."
    },
    {
      "questionId": "career-choice",
      "scale": -1,
      "reason": "후회하지 않으려면 원하는 도전을 직접 선택해야 합니다."
    }
  ]
}
```

### 성공 응답

```json
{
  "analysisId": "deterministic-id",
  "mode": "mock",
  "primaryType": "원칙적 합리주의자",
  "secondaryType": "자유 중심 정의론자",
  "representativePhilosopher": "칸트",
  "coreValues": ["원칙", "일관성", "정당성"],
  "decisionStyle": "결과보다 모두에게 적용 가능한 원칙인지를 먼저 묻습니다.",
  "axisScores": [],
  "summary": "현재 답변에서 드러난 판단 경향입니다.",
  "strengths": [],
  "cautions": [],
  "recurringQuestion": "내 기준은 다른 사람에게도 공정하게 적용될 수 있을까?",
  "opposingView": "반대 관점 설명",
  "prescriptions": [],
  "recommendedPhilosophers": [],
  "shareText": "공유용 문구",
  "evidence": []
}
```

### 오류 응답

```json
{
  "error": "분석 요청이 올바르지 않습니다.",
  "details": [
    "필수 질문 응답이 누락되었습니다: career-choice"
  ]
}
```

## 향후 AI 연동 계약

`ReportGenerator` 구현체는 계산된 `ScoredProfile`과 원본 답변을 받아
`GeneratedReport`만 반환합니다. AI 구현체는 사고축 점수, 대표 유형, 대표 철학자를
변경할 권한이 없습니다. Claude/OpenRouter 구현체는 운영진 승인 이후에만 추가합니다.
