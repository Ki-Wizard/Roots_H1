import type { ReactNode } from "react";
import type { AnalysisResponse } from "@philotype/shared";

export function Result({
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
          Your PhiloType · {result.mode} · {result.analysisId}
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
  children: ReactNode;
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
