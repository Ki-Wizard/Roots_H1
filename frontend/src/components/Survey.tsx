import type { ChoiceId, PublicSurveyQuestion, SurveyAnswer } from "@philotype/shared";

export function Survey({
  questions,
  answers,
  completedCount,
  error,
  onChoice,
  onReason,
  onSubmit,
}: {
  questions: PublicSurveyQuestion[];
  answers: Record<string, SurveyAnswer>;
  completedCount: number;
  error: string;
  onChoice: (id: string, value: ChoiceId) => void;
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

              <div className="mt-7 grid gap-3 md:grid-cols-2">
                <ChoiceButton
                  label="A"
                  selected={answer?.choice === "negative"}
                  text={question.negativeChoice}
                  onClick={() => onChoice(question.id, "negative")}
                />
                <ChoiceButton
                  label="B"
                  selected={answer?.choice === "positive"}
                  text={question.positiveChoice}
                  onClick={() => onChoice(question.id, "positive")}
                />
              </div>

              <label className="mt-6 block text-xs font-extrabold uppercase tracking-[0.16em] text-sage">
                왜 그렇게 선택했나요?
                <textarea
                  value={answer?.reason ?? ""}
                  disabled={!answer}
                  maxLength={200}
                  onChange={(event) => onReason(question.id, event.target.value)}
                  placeholder={
                    answer
                      ? "판단할 때 가장 중요하게 생각한 이유를 한 문장으로 적어주세요."
                      : "먼저 A 또는 B를 선택해 주세요."
                  }
                  className="mt-3 min-h-24 w-full resize-none rounded-2xl border border-ink/10 bg-paper/60 p-4 text-sm font-medium normal-case tracking-normal text-ink outline-none transition placeholder:text-ink/35 focus:border-sage focus:ring-4 focus:ring-sage/10 disabled:cursor-not-allowed disabled:opacity-60"
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

function ChoiceButton({
  label,
  selected,
  text,
  onClick,
}: {
  label: "A" | "B";
  selected: boolean;
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-24 rounded-2xl border p-4 text-left transition ${
        selected
          ? "border-ink bg-ink text-paper"
          : "border-ink/10 bg-paper/60 text-ink hover:border-sage hover:text-sage"
      }`}
    >
      <span className="block text-[10px] font-extrabold uppercase tracking-[0.18em] opacity-60">
        Choice {label}
      </span>
      <span className="mt-2 block text-sm font-extrabold leading-6">{text}</span>
    </button>
  );
}
