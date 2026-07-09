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

`AI_MODE=openrouter`로 서버를 시작하면 `aiMode`는 `openrouter`를 반환합니다.

## `GET /api/questions`

활성화된 딜레마 질문을 반환합니다. 점수 가중치는 클라이언트에 공개하지 않습니다.

```json
{
  "questions": [
    {
      "id": "triage-power",
      "title": "정전된 병원의 예비 전력",
      "dilemma": "큰 병원에 정전이 발생했습니다...",
      "negativeChoice": "더 많은 생명을 살릴 수 있는 중환자실에 전력을 보낸다",
      "positiveChoice": "먼저 치료 순서가 온 응급실 환자에게 전력을 보낸다"
    }
  ],
  "answerRules": {
    "reasonMinLength": 5,
    "reasonMaxLength": 200
  }
}
```

## `POST /api/analysis`

### 요청

- 활성 질문 40개에 모두 응답해야 합니다.
- `choice`는 `negative` 또는 `positive` 중 하나입니다.
- `reason`은 공백 제외 5~200자입니다.
- `anonymousId`는 선택 항목이며 서버에 저장하지 않습니다.

아래 요청 본문은 일부 문항만 보여주는 축약 예시입니다. 실제 요청은 활성 질문 40개
전체에 대한 답변을 포함해야 합니다.

```json
{
  "anonymousId": "local-browser-uuid",
  "answers": [
    {
      "questionId": "triage-power",
      "choice": "negative",
      "reason": "더 많은 생명을 살리는 결과를 먼저 봐야 한다고 생각합니다."
    },
    {
      "questionId": "privacy-cameras",
      "choice": "negative",
      "reason": "안전도 중요하지만 개인의 기본 자유를 지켜야 합니다."
    },
    {
      "questionId": "whistleblower-file",
      "choice": "positive",
      "reason": "위험이 있어도 사회적으로 필요한 진실은 공개해야 합니다."
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

`mode`는 `mock` 또는 `openrouter`입니다. `openrouter` 모드에서도 점수, 대표 유형,
대표 철학자는 서버 코드가 계산한 값을 그대로 사용하고 AI는 리포트 문장만 생성합니다.

### 오류 응답

```json
{
  "error": "분석 요청이 올바르지 않습니다.",
  "details": [
    "필수 질문 응답이 누락되었습니다: addictive-service-growth"
  ]
}
```

## AI 연동 계약

`ReportGenerator` 구현체는 계산된 `ScoredProfile`과 원본 답변을 받아
`GeneratedReport`만 반환합니다. AI 구현체는 사고축 점수, 대표 유형, 대표 철학자를
변경할 권한이 없습니다.
