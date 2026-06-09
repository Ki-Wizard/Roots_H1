import { useEffect, useMemo, useState } from "react";
import type {
  AnalysisResponse,
  PublicSurveyQuestion,
  ScaleValue,
  SurveyAnswer,
} from "@philotype/shared";
import { fetchQuestions, requestAnalysis } from "./api";

type Screen = "intro" | "survey" | "loading" | "result";

const scaleOptions: { value: ScaleValue; label: string }[] = [
  { value: -2, label: "매우 왼쪽" },
  { value: -1, label: "왼쪽에 가까움" },
  { value: 0, label: "상황에 따라 다름" },
  { value: 1, label: "오른쪽에 가까움" },
  { value: 2, label: "매우 오른쪽" },
];

function getAnonymousId() {
  const existing = localStorage.getItem("philotype-anonymous-id");
  if (existing) return existing;
  const id = crypto.randomUUID();
  localStorage.setItem("philotype-anonymous-id", id);
  return id;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [questions, setQuestions] = useState<PublicSurveyQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, SurveyAnswer>>({});
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchQuestions()
      .then(({ questions: loadedQuestions }) => setQuestions(loadedQuestions))
      .catch((reason: Error) => setError(reason.message));
  }, []);

  const completedCount = useMemo(
    () =>
      questions.filter((question) => {
        const answer = answers[question.id];
        return answer && answer.reason.trim().length >= 5;
      }).length,
    [answers, questions],
  );

  const updateScale = (questionId: string, scale: ScaleValue) => {
    setAnswers((current) => ({
      ...current,
      [questionId]: {
        questionId,
        scale,
        reason: current[questionId]?.reason ?? "",
      },
    }));
  };

  const updateReason = (questionId: string, reason: string) => {
    setAnswers((current) => ({
      ...current,
      [questionId]: {
        questionId,
        scale: current[questionId]?.scale ?? 0,
        reason,
      },
    }));
  };

  const submit = async () => {
    if (completedCount !== questions.length) {
      setError("모든 질문을 선택하고 이유를 5자 이상 작성해 주세요.");
      return;
    }

    setError("");
    setScreen("loading");
    try {
      const response = await requestAnalysis({
        anonymousId: getAnonymousId(),
        answers: questions.map((question) => answers[question.id]),
      });
      setResult(response);
      setScreen("result");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "분석에 실패했습니다.");
      setScreen("survey");
    }
  };

  const restart = () => {
    setAnswers({});
    setResult(null);
    setError("");
    setScreen("intro");
  };

  return (
    <main className="paper-grid min-h-screen overflow-hidden">
      <Header screen={screen} completed={completedCount} total={questions.length} />
      {screen === "intro" && (
        <Intro
          disabled={questions.length === 0}
          onStart={() => setScreen("survey")}
        />
      )}
      {screen === "survey" && (
        <Survey
          questions={questions}
          answers={answers}
          completedCount={completedCount}
          error={error}
          onScale={updateScale}
          onReason={updateReason}
          onSubmit={submit}
        />
      )}
      {screen === "loading" && <Loading />}
      {screen === "result" && result && <Result result={result} onRestart={restart} />}
    </main>
  );
}

function Header({
  screen,
  completed,
  total,
}: {
  screen: Screen;
  completed: number;
  total: number;
}) {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-full bg-ink font-display text-lg italic text-paper">
          P
        </span>
        <div>
          <p className="font-display text-xl font-bold leading-none">PhiloType</p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.24em] text-sage">
            Think beyond the choice
          </p>
        </div>
      </div>
      {screen === "survey" && (
        <p className="rounded-full border border-ink/10 bg-white/60 px-4 py-2 text-xs font-bold text-sage">
          {completed} / {total} 답변 완료
        </p>
      )}
      {screen !== "survey" && (
        <span className="rounded-full bg-amber/20 px-4 py-2 text-xs font-bold text-ink">
          Prototype · Mock AI
        </span>
      )}
    </header>
  );
}

function Intro({ disabled, onStart }: { disabled: boolean; onStart: () => void }) {
  return (
    <section className="mx-auto grid max-w-6xl gap-14 px-5 pb-20 pt-10 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:pt-20">
      <div className="fade-up">
        <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.28em] text-sage">
          철학적 사고방식 프로파일링
        </p>
        <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.12] tracking-[-0.06em] sm:text-7xl">
          당신은 무엇을
          <br />
          선택했나요?
          <br />
          <span className="font-display italic text-sage">그리고 왜인가요?</span>
        </h1>
        <p className="mt-8 max-w-xl text-base leading-8 text-ink/65">
          딜레마에서 내린 선택과 그 이유를 함께 살펴봅니다. 성격을 단정하는
          검사가 아니라, 내가 판단할 때 중요하게 여기는 가치와 놓치기 쉬운
          관점을 발견하는 도구입니다.
        </p>
        <button
          type="button"
          disabled={disabled}
          onClick={onStart}
          className="mt-9 rounded-full bg-ink px-8 py-4 text-sm font-bold text-paper shadow-card transition hover:-translate-y-1 hover:bg-sage disabled:cursor-wait disabled:opacity-50"
        >
          {disabled ? "질문 불러오는 중..." : "3개의 딜레마 시작하기 →"}
        </button>
        <p className="mt-4 text-xs text-ink/45">
          결과는 저장되지 않으며, 약 3분이 걸립니다.
        </p>
      </div>
      <div className="relative mx-auto w-full max-w-md fade-up">
        <div className="absolute -left-8 top-8 h-full w-full -rotate-6 rounded-[2rem] border border-ink/10 bg-amber/30" />
        <div className="relative rotate-3 rounded-[2rem] border border-ink/10 bg-white/80 p-8 shadow-card backdrop-blur">
          <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-amber">
            Example profile
          </p>
          <h2 className="mt-6 font-display text-4xl font-bold italic">
            원칙적 합리주의자
          </h2>
          <p className="mt-2 font-bold text-sage">Representative · 칸트</p>
          <div className="my-8 h-px bg-ink/10" />
          <p className="text-sm leading-7 text-ink/65">
            결과도 중요하게 보지만, 최종 판단에서는 “이 선택이 모두에게 적용
            가능한가?”를 묻는 경향이 있습니다.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {["원칙", "일관성", "책임", "정당성"].map((tag) => (
              <span key={tag} className="rounded-full bg-paper px-3 py-2 text-xs font-bold">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Survey({
  questions,
  answers,
  completedCount,
  error,
  onScale,
  onReason,
  onSubmit,
}: {
  questions: PublicSurveyQuestion[];
  answers: Record<string, SurveyAnswer>;
  completedCount: number;
  error: string;
  onScale: (id: string, value: ScaleValue) => void;
  onReason: (id: string, value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <section className="mx-auto max-w-4xl px-5 pb-24 pt-8 sm:px-8">
      <div className="mb-10">
        <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-sage">
          Your choices, your reasons
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] sm:text-5xl">
          정답 대신 판단의 기준을 적어주세요.
        </h1>
      </div>

      <div className="space-y-6">
        {questions.map((question, index) => {
          const answer = answers[question.id];
          return (
            <article
              key={question.id}
              className="rounded-[1.75rem] border border-ink/10 bg-white/75 p-5 shadow-card backdrop-blur sm:p-8"
            >
              <div className="flex items-start gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ink text-sm font-extrabold text-paper">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="text-xl font-extrabold">{question.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-ink/65">{question.dilemma}</p>
                </div>
              </div>

              <div className="mt-7 grid grid-cols-5 gap-2">
                {scaleOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    title={option.label}
                    aria-label={option.label}
                    onClick={() => onScale(question.id, option.value)}
                    className={`h-11 rounded-xl border text-sm font-extrabold transition ${
                      answer?.scale === option.value
                        ? "border-ink bg-ink text-paper"
                        : "border-ink/10 bg-paper/60 text-ink hover:border-sage hover:text-sage"
                    }`}
                  >
                    {option.value > 0 ? `+${option.value}` : option.value}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex justify-between gap-6 text-[11px] font-bold leading-5 text-ink/55">
                <span className="max-w-[46%]">← {question.negativeChoice}</span>
                <span className="max-w-[46%] text-right">{question.positiveChoice} →</span>
              </div>

              <label className="mt-6 block text-xs font-extrabold uppercase tracking-[0.16em] text-sage">
                왜 그렇게 선택했나요?
                <textarea
                  value={answer?.reason ?? ""}
                  maxLength={200}
                  onChange={(event) => onReason(question.id, event.target.value)}
                  placeholder="판단할 때 가장 중요하게 생각한 이유를 한 문장으로 적어주세요."
                  className="mt-3 min-h-24 w-full resize-none rounded-2xl border border-ink/10 bg-paper/60 p-4 text-sm font-medium normal-case tracking-normal text-ink outline-none transition placeholder:text-ink/35 focus:border-sage focus:ring-4 focus:ring-sage/10"
                />
              </label>
            </article>
          );
        })}
      </div>

      {error && (
        <p className="mt-6 rounded-2xl border border-red-900/10 bg-red-50 p-4 text-sm font-bold text-red-800">
          {error}
        </p>
      )}

      <div className="mt-8 flex items-center justify-between rounded-3xl bg-ink p-5 text-paper sm:p-7">
        <div>
          <p className="text-xs font-bold text-paper/55">응답 진행률</p>
          <p className="mt-1 text-lg font-extrabold">
            {completedCount} / {questions.length} 완료
          </p>
        </div>
        <button
          type="button"
          onClick={onSubmit}
          className="rounded-full bg-paper px-6 py-3 text-sm font-extrabold text-ink transition hover:bg-amber"
        >
          내 사고방식 분석하기
        </button>
      </div>
    </section>
  );
}

function Loading() {
  return (
    <section className="mx-auto grid min-h-[70vh] max-w-3xl place-items-center px-5 text-center">
      <div>
        <div className="mx-auto grid size-24 animate-pulse place-items-center rounded-full border border-ink/10 bg-white/70 shadow-card">
          <span className="font-display text-4xl italic text-sage">P</span>
        </div>
        <p className="mt-8 text-xs font-extrabold uppercase tracking-[0.28em] text-sage">
          Reading between your choices
        </p>
        <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.04em]">
          선택 뒤에 있는 판단 기준을 정리하고 있습니다.
        </h1>
        <p className="mt-4 text-sm text-ink/55">
          현재 프로토타입은 외부 AI를 호출하지 않고 안전한 Mock 리포트를 생성합니다.
        </p>
      </div>
    </section>
  );
}

function Result({
  result,
  onRestart,
}: {
  result: AnalysisResponse;
  onRestart: () => void;
}) {
  return (
    <section className="mx-auto max-w-5xl px-5 pb-24 pt-8 sm:px-8">
      <div className="rounded-[2rem] bg-ink p-7 text-paper shadow-card sm:p-12">
        <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-amber">
          Your PhiloType · {result.analysisId}
        </p>
        <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h1 className="font-display text-5xl font-bold italic sm:text-7xl">
              {result.primaryType}
            </h1>
            <p className="mt-4 text-lg font-bold text-paper/65">
              대표 철학자 · {result.representativePhilosopher}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.coreValues.map((value) => (
              <span key={value} className="rounded-full bg-paper/10 px-4 py-2 text-xs font-bold">
                #{value}
              </span>
            ))}
          </div>
        </div>
        <p className="mt-10 max-w-3xl text-base leading-8 text-paper/70">{result.summary}</p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ResultCard eyebrow="Four axes" title="사고축 프로필">
          <div className="space-y-5">
            {result.axisScores.map((axis) => (
              <AxisProfileBar key={axis.id} axis={axis} />
            ))}
          </div>
        </ResultCard>

        <ResultCard eyebrow="Decision style" title="판단 방식">
          <p className="text-base font-bold leading-8">{result.decisionStyle}</p>
          <p className="mt-5 text-sm leading-7 text-ink/55">
            보조 성향으로 <strong>{result.secondaryType}</strong>의 관점도 함께
            나타났습니다.
          </p>
        </ResultCard>

        <ResultCard eyebrow="Evidence" title="답변에서 발견한 근거">
          <div className="space-y-5">
            {result.evidence.map((item) => (
              <blockquote key={item.questionId} className="border-l-2 border-amber pl-4">
                <p className="text-xs font-extrabold text-sage">{item.questionTitle}</p>
                <p className="mt-2 text-sm font-bold">“{item.reason}”</p>
                <p className="mt-2 text-xs leading-6 text-ink/50">{item.interpretation}</p>
              </blockquote>
            ))}
          </div>
        </ResultCard>

        <ResultCard eyebrow="Prescription" title="사고 훈련 처방전">
          <ol className="space-y-4">
            {result.prescriptions.map((item, index) => (
              <li key={item} className="flex gap-3 text-sm leading-7">
                <span className="font-display text-xl font-bold italic text-amber">
                  {index + 1}
                </span>
                {item}
              </li>
            ))}
          </ol>
        </ResultCard>
      </div>

      <div className="mt-6 rounded-[2rem] border border-ink/10 bg-amber/20 p-7 sm:p-10">
        <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-sage">
          Share card
        </p>
        <p className="mt-4 max-w-3xl font-display text-2xl font-bold italic leading-relaxed sm:text-3xl">
          “{result.shareText}”
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(result.shareText)}
            className="rounded-full bg-ink px-6 py-3 text-sm font-bold text-paper"
          >
            공유 문구 복사
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="rounded-full border border-ink/15 px-6 py-3 text-sm font-bold"
          >
            다시 분석하기
          </button>
        </div>
      </div>
    </section>
  );
}

function AxisProfileBar({
  axis,
}: {
  axis: AnalysisResponse["axisScores"][number];
}) {
  const isNeutral = axis.score === 50;
  const leansPositive = axis.score > 50;
  const strength = Math.abs(axis.score - 50) * 2;
  const barLeft = leansPositive ? 50 : axis.score;
  const barWidth = Math.abs(axis.score - 50);
  const tendencyLabel = isNeutral ? "중립" : `${axis.leaning} 성향 ${strength}%`;

  return (
    <div>
      <div className="mb-2 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-xs font-bold">
        <span>{axis.negativeLabel}</span>
        <span className="text-sage">{tendencyLabel}</span>
        <span className="text-right">{axis.positiveLabel}</span>
      </div>
      <div
        className="relative h-3 overflow-hidden rounded-full bg-ink/10"
        role="img"
        aria-label={`${axis.negativeLabel}에서 ${axis.positiveLabel} 축: ${tendencyLabel}`}
      >
        {!isNeutral && (
          <div
            className="absolute inset-y-0 rounded-full bg-sage"
            style={{ left: `${barLeft}%`, width: `${barWidth}%` }}
          />
        )}
        <div className="absolute inset-y-[-2px] left-1/2 w-0.5 -translate-x-1/2 bg-ink/55" />
        <div
          className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-ink shadow"
          style={{ left: `${axis.score}%` }}
        />
      </div>
      <div className="mt-1 grid grid-cols-3 text-[9px] font-bold uppercase tracking-[0.14em] text-ink/35">
        <span>강함</span>
        <span className="text-center">중립</span>
        <span className="text-right">강함</span>
      </div>
    </div>
  );
}

function ResultCard({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-[2rem] border border-ink/10 bg-white/75 p-7 shadow-card backdrop-blur sm:p-9">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-sage">
        {eyebrow}
      </p>
      <h2 className="mb-7 mt-2 text-2xl font-extrabold tracking-[-0.03em]">{title}</h2>
      {children}
    </article>
  );
}
