# PhiloType

> 딜레마 선택과 선택 이유를 바탕으로 나의 철학적 사고방식을 발견하는 프로파일링 서비스

PhiloType은 사용자를 고정된 성격 유형으로 단정하지 않습니다. 선택값은 규칙 기반
점수 계산에 사용하고, 선택 이유는 결과를 설명하는 근거로 활용합니다.

## 중간 발표 프로토타입

- 딜레마 질문 3개 실제 동작, 전체 8개 질문 데이터 설계
- 4개 사고축의 결정론적 점수 계산
- 대표·보조 철학 유형과 대표 철학자 매칭
- 답변 근거, 반대 관점, 사고 훈련, 공유 문구를 포함한 Mock 리포트
- 시작 → 설문 → 분석 로딩 → 결과 카드의 반응형 React 화면
- 실제 AI 호출과 서버 영구 저장 없음

## 기술 스택

- Frontend: React, TypeScript, Tailwind CSS, Vite
- Backend: Node.js, Express, TypeScript
- Test: Vitest, Supertest
- AI: 기본값은 `MockReportGenerator`, 선택적으로 OpenRouter 호출 활성화

## 실행

Node.js 20 이상이 필요합니다.

```bash
npm install
npm run dev:backend
```

다른 터미널에서:

```bash
npm run dev:frontend
```

- Frontend: <http://localhost:5173>
- Backend: <http://localhost:4000>
- Health check: <http://localhost:4000/api/health>

Windows PowerShell 실행 정책 때문에 `npm`이 차단되는 환경에서는 `npm.cmd`를
사용합니다.

```powershell
npm.cmd install
npm.cmd run dev:backend
npm.cmd run dev:frontend
```

## 검증

```bash
npm test
npm run build
```

## 실제 AI 호출

기본 실행은 비용이 발생하지 않는 `AI_MODE=mock`입니다. 실제 리포트 문장 생성을
OpenRouter로 호출하려면 로컬 `.env`에 다음 값을 설정합니다. `.env`는 커밋하지
않습니다.

```env
AI_MODE=openrouter
OPENROUTER_API_KEY=발급받은_키
OPENROUTER_MODEL=anthropic/claude-sonnet-4.6
```

`OPENROUTER_MAX_TOKENS`, `OPENROUTER_TEMPERATURE`, `OPENROUTER_TIMEOUT_MS`로 요청
한도를 조정할 수 있습니다. `AI_MODE=openrouter`에서 키가 없으면 서버는 시작하지
않습니다.

## 구조

```text
frontend/    React 설문·결과 화면
backend/     Express API, 점수 계산, Mock 리포트
shared/      프론트·백엔드 공용 TypeScript 타입
docs/        API 명세, 발표 흐름, AI 안전 정책
```

## 분석 원칙

1. 척도 응답은 질문별 가중치와 함께 코드로 계산합니다.
2. 각 사고축 점수는 0~100으로 정규화합니다.
3. 가장 강한 두 사고축으로 대표·보조 유형을 결정합니다.
4. 리포트 생성기는 계산된 점수나 유형을 변경할 수 없습니다.
5. 결과는 경향을 설명하며 정체성, 능력, 정신 상태를 진단하지 않습니다.

## AI 사용 상태

외부 AI API 호출은 `AI_MODE=openrouter`를 명시하고 로컬 `.env`에
`OPENROUTER_API_KEY`를 넣은 경우에만 수행됩니다. Claude/OpenRouter 계정, 결제,
API 키, 사용량 제한 설정은 코드에서 변경하지 않습니다.

자세한 내용은 [AI 안전 정책](docs/AI_SAFETY.md)을 참고하세요.
