import { useEffect, useMemo, useState } from "react";
import type {
  AnalysisResponse,
  ChoiceId,
  PublicSurveyQuestion,
  SurveyAnswer,
} from "@philotype/shared";
import { fetchQuestions, requestAnalysis } from "./api";
import { Intro } from "./components/Intro";
import { Loading } from "./components/Loading";
import { Result } from "./components/Result";
import { Survey } from "./components/Survey";

type Screen = "intro" | "survey" | "loading" | "result";

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

  const updateChoice = (questionId: string, choice: ChoiceId) => {
    setAnswers((current) => ({
      ...current,
      [questionId]: {
        questionId,
        choice,
        reason: current[questionId]?.reason ?? "",
      },
    }));
  };

  const updateReason = (questionId: string, reason: string) => {
    setAnswers((current) => ({
      ...current,
      ...(current[questionId]
        ? {
            [questionId]: {
              ...current[questionId],
              reason,
            },
          }
        : {}),
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
          questionCount={questions.length}
          onStart={() => setScreen("survey")}
        />
      )}
      {screen === "survey" && (
        <Survey
          questions={questions}
          answers={answers}
          completedCount={completedCount}
          error={error}
          onChoice={updateChoice}
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
          Prototype · AI Report
        </span>
      )}
    </header>
  );
}
