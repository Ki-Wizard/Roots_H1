export function Intro({
  disabled,
  questionCount,
  onStart,
}: {
  disabled: boolean;
  questionCount: number;
  onStart: () => void;
}) {
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
          {disabled ? "질문 불러오는 중..." : `${questionCount}개의 딜레마 시작하기 →`}
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
