# Claude·OpenRouter 사용 안전 정책

## 현재 상태

- 기본 모드: `AI_MODE=mock`
- 실제 호출 모드: `AI_MODE=openrouter`
- 활성 구현체: `MockReportGenerator`, `OpenRouterReportGenerator`
- API 키 위치: 로컬 `.env`의 `OPENROUTER_API_KEY`
- 영구 저장: 없음

서버는 기본적으로 비용이 발생하지 않는 Mock 리포트를 사용합니다. 실제 AI 호출은
개발자가 명시적으로 `AI_MODE=openrouter`를 설정하고 OpenRouter API 키를 제공한
경우에만 수행합니다.

## 절대 하지 않는 작업

- OpenRouter에서 임의 결제 또는 크레딧 충전
- 공용 계정의 기존 프로젝트, 결제, 제한 설정 변경
- API 키를 채팅·코드·GitHub에 기록
- `.env` 파일 커밋
- 점수, 대표 유형, 대표 철학자 결정을 AI에 위임

## OpenRouter 설정

```env
AI_MODE=openrouter
OPENROUTER_API_KEY=발급받은_키
OPENROUTER_MODEL=anthropic/claude-sonnet-4.6
OPENROUTER_MAX_TOKENS=900
OPENROUTER_TEMPERATURE=0.4
OPENROUTER_TIMEOUT_MS=15000
OPENROUTER_SITE_URL=http://localhost:5173
OPENROUTER_SITE_TITLE=PhiloType
```

`OPENROUTER_API_KEY`가 없으면 `AI_MODE=openrouter` 서버는 시작하지 않습니다.
사용량 제한이 필요하면 OpenRouter 콘솔에서 제한을 설정하고,
`OPENROUTER_MAX_TOKENS`를 더 낮게 조정합니다.

## 설계상 보호 장치

- AI 호출은 명시적 `AI_MODE=openrouter`에서만 수행합니다.
- 점수 계산과 유형 매칭은 외부 AI와 독립적입니다.
- 리포트 생성기 인터페이스는 점수·유형 변경을 허용하지 않습니다.
- OpenRouter 응답은 `GeneratedReport` JSON 구조로 파싱될 때만 사용합니다.
- 외부 호출 실패 또는 잘못된 AI 응답은 서버 오류로 처리합니다. 비용 없는 시연이
  필요하면 `AI_MODE=mock`으로 되돌립니다.
- 결과는 서버에 저장하지 않습니다.

## 확인할 운영 항목

- 사용할 OpenRouter 모델과 일일 예산
- 요청당 최대 토큰 수
- 키 발급과 폐기 담당자
- 사용량 초과 또는 오작동 시 보고 대상
