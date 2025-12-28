"use client";

import { useMemo, useState } from "react";
import { MBTI_RESULTS, type MBTIType } from "../data/mbti";
import {
  QUIZ_QUESTIONS,
  type AnswerOption,
  type Dichotomy,
  type QuizQuestion,
} from "../data/questions";

const tallies = {
  E: 0,
  I: 0,
  S: 0,
  N: 0,
  T: 0,
  F: 0,
  J: 0,
  P: 0,
};

const letterMap: Record<
  Dichotomy,
  { A: keyof typeof tallies; B: keyof typeof tallies }
> = {
  EI: { A: "E", B: "I" },
  SN: { A: "S", B: "N" },
  TF: { A: "T", B: "F" },
  JP: { A: "J", B: "P" },
};

const dichotomyMeta = [
  {
    id: "EI",
    label: "Energy",
    left: { code: "E", title: "Extraversion", description: "Refuel around people and shared momentum." },
    right: { code: "I", title: "Introversion", description: "Recharge through solitude, reflection, and focus." },
  },
  {
    id: "SN",
    label: "Information",
    left: { code: "S", title: "Sensing", description: "Trust tangible facts, details, and lived experience." },
    right: { code: "N", title: "Intuition", description: "Notice patterns, imagine futures, and think in concepts." },
  },
  {
    id: "TF",
    label: "Decision Making",
    left: { code: "T", title: "Thinking", description: "Evaluate through logic, fairness, and outcomes." },
    right: { code: "F", title: "Feeling", description: "Factor in values, empathy, and relational harmony." },
  },
  {
    id: "JP",
    label: "Lifestyle",
    left: { code: "J", title: "Judging", description: "Prefer structure, clarity, and forward planning." },
    right: { code: "P", title: "Perceiving", description: "Stay flexible, adapt in real time, and explore options." },
  },
] as const;

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<number, "A" | "B">>({});
  const [showResults, setShowResults] = useState(false);

  const totalQuestions = QUIZ_QUESTIONS.length;
  const answered = Object.keys(responses).length;
  const progress = Math.min(Math.round((answered / totalQuestions) * 100), 100);

  const currentQuestion: QuizQuestion | undefined =
    showResults ? undefined : QUIZ_QUESTIONS[currentIndex];
  const selectedValue = currentQuestion
    ? responses[currentQuestion.id]
    : undefined;

  const scores = useMemo(() => {
    return QUIZ_QUESTIONS.reduce((acc, question) => {
      const selected = responses[question.id];
      if (!selected) {
        return acc;
      }

      const mappedLetter = letterMap[question.dimension][selected];
      acc[mappedLetter] = (acc[mappedLetter] ?? 0) + 1;
      return acc;
    }, { ...tallies });
  }, [responses]);

  const personalityType = useMemo(() => {
    if (answered !== totalQuestions) {
      return undefined;
    }

    const letters = [
      scores.E >= scores.I ? "E" : "I",
      scores.S >= scores.N ? "S" : "N",
      scores.T >= scores.F ? "T" : "F",
      scores.J >= scores.P ? "J" : "P",
    ];

    return letters.join("") as MBTIType;
  }, [answered, scores, totalQuestions]);

  const resultProfile = personalityType
    ? MBTI_RESULTS[personalityType]
    : undefined;

  const percentageFor = (left: keyof typeof tallies, right: keyof typeof tallies) => {
    const leftScore = scores[left];
    const rightScore = scores[right];
    const total = leftScore + rightScore || 1;
    return {
      left: Math.round((leftScore / total) * 100),
      right: Math.round((rightScore / total) * 100),
    };
  };

  const handleOptionSelect = (question: QuizQuestion, option: AnswerOption) => {
    setResponses((prev) => ({ ...prev, [question.id]: option.value }));
  };

  const handleNext = () => {
    if (currentIndex === totalQuestions - 1) {
      setShowResults(true);
      return;
    }
    setCurrentIndex((prev) => Math.min(prev + 1, totalQuestions - 1));
  };

  const handleBack = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNavigate = (index: number) => {
    setShowResults(false);
    setCurrentIndex(index);
  };

  const handleReset = () => {
    setResponses({});
    setCurrentIndex(0);
    setShowResults(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-zinc-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col px-4 pb-24 pt-16 sm:px-6 lg:px-8">
        <header className="mb-16 max-w-3xl space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.3em] text-white/70 backdrop-blur">
            MBTI Personality Quiz
          </span>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            Discover how you move through the world and unlock the language to
            describe it.
          </h1>
          <p className="text-lg text-white/70 sm:text-xl">
            Answer twelve intuition-checked prompts inspired by the classic MBTI
            framework. You&apos;ll receive a tailored profile with signature
            strengths, growth opportunities, and ways to collaborate better with
            the people you care about.
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-white/60">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
              ⏱️ ~4 minutes
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
              🔁 Retake anytime
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
              🎯 Data stays on this device
            </span>
          </div>
        </header>

        <section className="grid gap-10 lg:grid-cols-[1.6fr,1fr] lg:items-start">
          <div className="space-y-8">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/50 backdrop-blur">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.4em] text-white/50">
                    Progress
                  </p>
                  <p className="text-2xl font-semibold text-white">
                    {answered} / {totalQuestions} completed
                  </p>
                </div>
                <span className="rounded-full bg-white/10 px-4 py-1 text-sm font-medium text-white/80">
                  {progress}%
                </span>
              </div>
              <div className="mb-2 h-2 w-full rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-400 via-violet-400 to-fuchsia-400 transition-all duration-500"
                  style={{ width: `${Math.max(progress, showResults ? 100 : 0)}%` }}
                />
              </div>
              <p className="text-xs text-white/50">
                Each response tunes the algorithm toward your natural preferences
                across the four MBTI spectrums.
              </p>
            </div>

            {!showResults && currentQuestion ? (
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/40 backdrop-blur">
                <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-white/40">
                      Question {currentIndex + 1}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                      {currentQuestion.prompt}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleNavigate(totalQuestions - 1)}
                    className="text-xs uppercase tracking-[0.3em] text-white/40 transition hover:text-white/80"
                  >
                    Skip to review
                  </button>
                </div>
                <div className="space-y-4">
                  {currentQuestion.options.map((option) => {
                    const isSelected = selectedValue === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleOptionSelect(currentQuestion, option)}
                        className={`w-full rounded-2xl border p-6 text-left transition
                          ${
                            isSelected
                              ? "border-sky-400 bg-sky-400/10 text-white shadow-[0_20px_60px_rgba(45,212,191,0.25)]"
                              : "border-white/10 bg-white/[0.02] text-white/70 hover:border-white/30 hover:bg-white/[0.05]"
                          }`}
                      >
                        <p className="text-lg font-semibold">{option.label}</p>
                        <p className="mt-2 text-sm text-white/60">{option.description}</p>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-10 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={currentIndex === 0}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-2 text-sm font-medium text-white/70 transition hover:border-white/40 hover:text-white disabled:cursor-not-allowed disabled:border-white/10 disabled:text-white/30"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!selectedValue}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-400 via-violet-400 to-fuchsia-500 px-6 py-2 text-sm font-semibold text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {currentIndex === totalQuestions - 1
                      ? "Reveal my type"
                      : "Continue"}
                    →
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="ml-auto inline-flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-white/40 transition hover:text-white/70"
                  >
                    Reset quiz
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-8 shadow-2xl shadow-black/40 backdrop-blur">
                {resultProfile && personalityType ? (
                  <>
                    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.4em] text-white/40">
                          Your MBTI Type
                        </p>
                        <div className="mt-3 flex items-baseline gap-4">
                          <span className="text-5xl font-bold tracking-[0.2em] text-white">
                            {personalityType}
                          </span>
                          <span className="rounded-full border border-white/10 bg-white/10 px-4 py-1 text-sm font-medium text-white/70">
                            {resultProfile.nickname}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleReset}
                        className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
                      >
                        Start over
                      </button>
                    </div>
                    <h2 className="text-3xl font-semibold text-white">
                      {resultProfile.title}
                    </h2>
                    <p className="mt-4 text-lg leading-relaxed text-white/75">
                      {resultProfile.summary}
                    </p>

                    <div className="mt-10 grid gap-8 lg:grid-cols-2">
                      <div className="space-y-4">
                        <p className="text-xs uppercase tracking-[0.4em] text-white/40">
                          Signature strengths
                        </p>
                        <ul className="space-y-3 text-sm text-white/75">
                          {resultProfile.strengths.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3"
                            >
                              <span className="mt-1 h-2 w-2 rounded-full bg-sky-400" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-4">
                        <p className="text-xs uppercase tracking-[0.4em] text-white/40">
                          Growth edges
                        </p>
                        <ul className="space-y-3 text-sm text-white/75">
                          {resultProfile.growth.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3"
                            >
                              <span className="mt-1 h-2 w-2 rounded-full bg-fuchsia-400" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-10 grid gap-8 lg:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                        <p className="text-xs uppercase tracking-[0.4em] text-white/40">
                          Collaboration sweet spot
                        </p>
                        <p className="mt-3 text-sm text-white/70">
                          {resultProfile.relationships}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                        <p className="text-xs uppercase tracking-[0.4em] text-white/40">
                          Roles to explore
                        </p>
                        <ul className="mt-3 flex flex-wrap gap-2 text-sm text-white/70">
                          {resultProfile.careers.map((career) => (
                            <li
                              key={career}
                              className="rounded-full border border-white/10 bg-white/5 px-4 py-1"
                            >
                              {career}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-6 text-white/70">
                    <h2 className="text-3xl font-semibold text-white">
                      You&apos;re almost there.
                    </h2>
                    <p className="text-lg">
                      Answer the remaining prompts to discover your MBTI-powered
                      personality profile, including communication hacks, work
                      styles, and collaboration insights.
                    </p>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => handleNavigate(currentIndex)}
                        className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-black transition hover:brightness-110"
                      >
                        Return to quiz
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/40 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                Quick navigation
              </p>
              <div className="mt-4 grid grid-cols-4 gap-3 text-sm">
                {QUIZ_QUESTIONS.map((question, index) => {
                  const isAnswered = responses[question.id];
                  const isActive = !showResults && currentIndex === index;
                  return (
                    <button
                      key={question.id}
                      type="button"
                      onClick={() => handleNavigate(index)}
                      className={`flex h-12 items-center justify-center rounded-2xl border transition
                        ${
                          isActive
                            ? "border-sky-400 bg-sky-400/10 text-white"
                            : isAnswered
                            ? "border-white/20 bg-white/[0.06] text-white/80 hover:border-white/40"
                            : "border-white/10 bg-transparent text-white/50 hover:border-white/30 hover:text-white/70"
                        }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/40 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                MBTI spectrums
              </p>
              <div className="mt-6 space-y-6">
                {dichotomyMeta.map((dichotomy) => {
                  const { left, right } = dichotomy;
                  const percentages = percentageFor(
                    left.code as keyof typeof tallies,
                    right.code as keyof typeof tallies,
                  );
                  const activeLetter = personalityType?.includes(left.code)
                    ? left.code
                    : personalityType?.includes(right.code)
                      ? right.code
                      : undefined;

                  return (
                    <div
                      key={dichotomy.id}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                    >
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/40">
                        <span>{dichotomy.label}</span>
                        <span>
                          {scores[left.code as keyof typeof tallies] +
                            scores[right.code as keyof typeof tallies]}
                          /3
                        </span>
                      </div>
                      <div className="mt-4 grid gap-3">
                        <div>
                          <div className="flex items-center justify-between text-sm text-white/70">
                            <span>
                              {left.code} · {left.title}
                            </span>
                            <span>{percentages.left}%</span>
                          </div>
                          <div className="mt-2 h-2 rounded-full bg-white/10">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                activeLetter === left.code
                                  ? "bg-sky-400"
                                  : "bg-white/40"
                              }`}
                              style={{ width: `${percentages.left}%` }}
                            />
                          </div>
                          <p className="mt-2 text-xs text-white/50">
                            {left.description}
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm text-white/70">
                            <span>
                              {right.code} · {right.title}
                            </span>
                            <span>{percentages.right}%</span>
                          </div>
                          <div className="mt-2 h-2 rounded-full bg-white/10">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                activeLetter === right.code
                                  ? "bg-fuchsia-400"
                                  : "bg-white/40"
                              }`}
                              style={{ width: `${percentages.right}%` }}
                            />
                          </div>
                          <p className="mt-2 text-xs text-white/50">
                            {right.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-sky-500/20 via-violet-500/20 to-fuchsia-500/20 p-6 shadow-2xl shadow-black/40 backdrop-blur">
              <h3 className="text-lg font-semibold text-white">
                Make it a team ritual
              </h3>
              <p className="mt-3 text-sm text-white/70">
                Facilitate a workshop or add this quiz to onboarding. Download
                a PDF-ready session guide that includes debrief prompts,
                collaboration agreements, and follow-up exercises.
              </p>
              <a
                href="mailto:hello@persona.studio?subject=MBTI%20Session%20Toolkit"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:brightness-110"
              >
                Request the toolkit →
              </a>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
