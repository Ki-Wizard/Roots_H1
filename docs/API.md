# PhiloType API 명세

Base URL: http://localhost:4000

## 공통 사항

- 현재 구현은 서버에 분석 결과를 영구 저장하지 않습니다.
- `POST /api/analysis` 요청에는 활성 질문 40개 전체에 대한 응답이 필요합니다.
- `choice`는 `negative` 또는 `positive` 중 하나여야 합니다.
- `reason`은 공백을 제외한 길이가 5~200자 범위여야 합니다.
- `anonymousId`는 선택 항목이며 서버에서 저장하지 않습니다.

## GET /api/health

서버의 상태와 현재 리포트 생성 모드를 확인합니다.

```json
{
  "status": "ok",
  "aiMode": "mock",
  "persistence": false
}
```

`aiMode`는 현재 `mock` 또는 `openrouter` 중 하나입니다.

## GET /api/questions

활성화된 딜레마 질문 목록을 반환합니다. 공개되는 필드는 질문 ID, 제목, 딜레마, 선택지 텍스트이며, 질문별 가중치는 클라이언트에 노출되지 않습니다.

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

## POST /api/analysis

### 요청 본문

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
    }
  ]
}
```

### 성공 응답

```json
{
  "analysisId": "c4a1bc7f6d2a",
  "mode": "mock",
  "primaryType": "결과주의적 공동체주의자",
  "secondaryType": "의무주의적 개인주의자",
  "representativePhilosopher": "아리스토텔레스",
  "coreValues": ["공동체", "실용성", "배려"],
  "decisionStyle": "사람과 결과를 함께 고려해 판단합니다.",
  "axisScores": [
    {
      "id": "individualCommunity",
      "negativeLabel": "개인",
      "positiveLabel": "공동체",
      "score": 62,
      "leaning": "공동체"
    }
  ],
  "summary": "현재 답변에서 드러난 판단 경향입니다.",
  "strengths": ["배려"],
  "cautions": ["균형"],
  "recurringQuestion": "내 기준은 다른 사람에게도 공정하게 적용될 수 있을까?",
  "opposingView": "반대 관점 설명",
  "prescriptions": ["사고 훈련 문장"],
  "recommendedPhilosophers": ["칸트"],
  "shareText": "공유용 문구",
  "evidence": []
}
```

`analysisId`는 답변 내용으로부터 생성된 해시 값입니다. `mode`는 `mock` 또는 `openrouter`입니다. `openrouter` 모드에서도 점수, 대표 유형, 대표 철학자는 서버 코드가 계산한 값을 사용하고 AI는 리포트 문장만 생성합니다.

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

리포트 생성기는 계산된 점수와 유형을 변경할 수 없습니다. `ReportGenerator` 구현체는 분석 요청과 계산된 프로필을 받아 `GeneratedReport`만 반환하며, AI 응답은 서버가 이미 계산한 점수·유형과 함께 조합되어 프론트엔드로 전달됩니다.
