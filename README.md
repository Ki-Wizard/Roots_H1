# PhiloType

> 딜레마 선택과 선택 이유를 바탕으로 철학적 사고축 점수와 유형을 계산해 결과를 제공하는 웹 서비스

PhiloType은 사용자의 선택 결과보다 선택 기준을 분석하는 데 초점을 둔 프로토타입입니다. 현재 구현은 프론트엔드 설문 화면, 백엔드 분석 API, 점수 계산 로직, Mock/OpenRouter 기반 리포트 생성기로 구성되어 있습니다.

## 현재 구현 내용

### 1. 설문 및 질문 데이터

- 백엔드의 [backend/src/config/questions.ts](backend/src/config/questions.ts) 에 40개의 활성 질문이 정의되어 있습니다.
- 각 질문은 A/B 선택지와 가중치 정보를 포함하며, 선택지별로 사고축 점수에 반영됩니다.
- 질문 데이터는 프론트엔드의 설문 화면에서 불러와서 사용합니다.

### 2. 사고축 점수 계산

- 4개 사고축을 기준으로 점수를 계산합니다.
- 축 정의는 [backend/src/config/axes.ts](backend/src/config/axes.ts) 에 있으며, 다음과 같습니다.
  - 개인 / 공동체
  - 결과주의 / 의무주의
  - 감정 / 이성
  - 현실 / 이상
- 각 답변은 질문별 가중치와 함께 반영되고, 최종 점수는 0~100 범위로 정규화됩니다.
- 계산 로직은 [backend/src/services/scoreCalculator.ts](backend/src/services/scoreCalculator.ts) 에 구현되어 있습니다.

### 3. 철학 유형 매칭

- 계산된 축 점수의 강도에 따라 대표 유형과 보조 유형을 선정합니다.
- 유형 정의는 [backend/src/config/philosophyTypes.ts](backend/src/config/philosophyTypes.ts) 에 있습니다.
- 분석 결과에는 대표 철학자, 핵심 가치, 의사결정 스타일이 함께 포함됩니다.

### 4. 리포트 생성

- 분석 결과는 [backend/src/services/analyzer.ts](backend/src/services/analyzer.ts) 를 통해 생성됩니다.
- 리포트 생성은 인터페이스 기반으로 분리되어 있으며, 현재는 다음 두 가지 구현이 있습니다.
  - Mock 리포트 생성기: 즉시 결정적인 결과를 반환
  - OpenRouter 리포트 생성기: 외부 AI 모델로 해석 문장을 생성
- 생성기 선택은 [backend/src/services/reportGeneratorFactory.ts](backend/src/services/reportGeneratorFactory.ts) 에서 처리합니다.

### 5. API 구조

백엔드에는 다음 세 개의 주요 엔드포인트가 있습니다.

- GET /api/health: 현재 모드와 persistence 상태 확인
- GET /api/questions: 설문 질문과 답변 길이 규칙 반환
- POST /api/analysis: 요청 검증 후 분석 결과 반환

실제 구현은 [backend/src/app.ts](backend/src/app.ts) 와 [backend/src/server.ts](backend/src/server.ts) 에 있습니다.

## 프론트엔드 흐름

- [frontend/src/api.ts](frontend/src/api.ts) 에서 질문 목록과 분석 요청을 서버로 전송합니다.
- 설문 화면에서 사용자가 선택과 이유를 입력하면, 결과 화면에서 축 점수와 리포트를 확인할 수 있습니다.
- 현재 프론트엔드는 시작, 설문, 로딩, 결과 화면으로 구성되어 있습니다.

## 프로젝트 구조

```text
backend/   Express 서버, 설문 데이터, 점수 계산, 리포트 생성
frontend/  React 기반 설문/결과 UI
shared/    프론트엔드와 백엔드가 공유하는 타입 정의
docs/      API, 발표 흐름, AI 안전 정책 문서
```

## 로컬 실행

Node.js 20 이상이 필요합니다.

```bash
npm install
npm run dev:backend
```

다른 터미널에서:

```bash
npm run dev:frontend
```

- Frontend: http://localhost:5173
- Backend: http://localhost:4000
- Health check: http://localhost:4000/api/health

PowerShell 환경에서는 다음처럼 실행할 수 있습니다.

```powershell
npm.cmd install
npm.cmd run dev:backend
npm.cmd run dev:frontend
```

## AI 모드 설정

기본 실행은 Mock 모드로 동작합니다. 실제 AI 리포트를 사용하려면 로컬 .env 파일에 다음 값을 설정합니다.

```env
AI_MODE=openrouter
OPENROUTER_API_KEY=발급받은_키
OPENROUTER_MODEL=anthropic/claude-sonnet-4.6
```

추가적으로 다음 환경변수를 조정할 수 있습니다.

- OPENROUTER_MAX_TOKENS
- OPENROUTER_TEMPERATURE
- OPENROUTER_TIMEOUT_MS

## 검증 및 테스트

```bash
npm test
npm run build
```

## 참고 문서

- [docs/API.md](docs/API.md)
- [docs/AI_SAFETY.md](docs/AI_SAFETY.md)
- [docs/PRESENTATION.md](docs/PRESENTATION.md)
