export function Loading() {
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
          현재 설정된 리포트 생성기로 응답 기반 리포트를 생성합니다.
        </p>
      </div>
    </section>
  );
}
