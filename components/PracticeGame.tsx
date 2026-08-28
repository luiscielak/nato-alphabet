"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DECOYS, NATO_LETTERS, type NatoEntry } from "../lib/nato";
import {
  loadProgress,
  recordAnswer,
  recordSession,
  saveProgress,
  type Progress,
} from "../lib/progress";

const SESSION_LENGTH = 10;
const CHOICES = 4;

type Choice = { label: string; correct: boolean };
type Prompt = { entry: NatoEntry; choices: Choice[] };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Weighted pick: letters with more recorded misses are likelier to appear.
 * If `pool` is given, only those letters are drawn (used for "practice misses").
 */
function pickLetters(
  progress: Progress,
  count: number,
  pool?: NatoEntry[],
): NatoEntry[] {
  const source = pool && pool.length > 0 ? pool : NATO_LETTERS;
  const result: NatoEntry[] = [];
  let lastChar = "";
  for (let n = 0; n < count; n++) {
    const weighted = source.map((e) => ({
      entry: e,
      // base weight 1, +2 per recorded miss, so weak letters surface sooner
      weight: (1 + 2 * (progress.misses[e.char] ?? 0)) *
        (e.char === lastChar ? 0.15 : 1),
    }));
    const total = weighted.reduce((s, w) => s + w.weight, 0);
    let r = Math.random() * total;
    let chosen = weighted[0].entry;
    for (const w of weighted) {
      r -= w.weight;
      if (r <= 0) {
        chosen = w.entry;
        break;
      }
    }
    result.push(chosen);
    lastChar = chosen.char;
  }
  return result;
}

function buildPrompt(entry: NatoEntry): Prompt {
  // Decoys share the prompt's initial, so first-letter matching won't help —
  // you have to know the actual NATO word.
  const decoys = shuffle(DECOYS[entry.char] ?? []).slice(0, CHOICES - 1);
  const choices: Choice[] = shuffle([
    { label: entry.word, correct: true },
    ...decoys.map((label) => ({ label, correct: false })),
  ]);
  return { entry, choices };
}

export function PracticeGame() {
  const [progress, setProgress] = useState<Progress>(() => loadProgress());
  const [queue, setQueue] = useState<NatoEntry[]>([]);
  const [index, setIndex] = useState(0);
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [sessionMisses, setSessionMisses] = useState<string[]>([]);
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const advanceTimer = useRef<number | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  useEffect(() => {
    return () => {
      if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    };
  }, []);

  const startSession = useCallback(
    (pool?: NatoEntry[]) => {
      const letters = pickLetters(progress, SESSION_LENGTH, pool);
      setQueue(letters);
      setIndex(0);
      setPrompt(buildPrompt(letters[0]));
      setPicked(null);
      setScore(0);
      setSessionMisses([]);
      setPhase("playing");
    },
    [progress],
  );

  const answer = (choice: Choice) => {
    if (!prompt || picked) return;
    const correct = choice.correct;
    setPicked(choice.label);

    const updated = recordAnswer(progress, prompt.entry.char, correct);
    setProgress(updated);
    saveProgress(updated);

    if (correct) {
      setScore((s) => s + 1);
    } else {
      setSessionMisses((m) =>
        m.includes(prompt.entry.char) ? m : [...m, prompt.entry.char],
      );
    }

    advanceTimer.current = window.setTimeout(() => {
      const next = index + 1;
      if (next >= queue.length) {
        const finalScore = correct ? score + 1 : score;
        const done = recordSession(updated, finalScore, queue.length);
        setProgress(done);
        saveProgress(done);
        setPhase("done");
      } else {
        setIndex(next);
        setPrompt(buildPrompt(queue[next]));
        setPicked(null);
      }
    }, 700);
  };

  const missedEntries = useMemo(
    () =>
      NATO_LETTERS.filter((e) => (progress.misses[e.char] ?? 0) > 0).sort(
        (a, b) => (progress.misses[b.char] ?? 0) - (progress.misses[a.char] ?? 0),
      ),
    [progress.misses],
  );

  if (phase === "idle") {
    return (
      <main className="app-shell">
        <header className="app-header">
          <div>
            <p className="micro-label app-eyebrow">Practice</p>
            <h1>Make it stick</h1>
          </div>
        </header>

        <p className="prose-muted">
          Ten quick prompts. See a letter, pick the real NATO word — every option
          starts with that letter, so you have to actually know it. Letters you
          miss come back more often until they stop tripping you up.
        </p>

        <div className="result-actions">
          <button
            type="button"
            className="btn btn-accent btn-block"
            onClick={() => startSession()}
          >
            Start a round
          </button>
          {missedEntries.length > 0 && (
            <button
              type="button"
              className="btn btn-block"
              onClick={() => startSession(missedEntries)}
            >
              Drill {missedEntries.length} weak{" "}
              {missedEntries.length === 1 ? "letter" : "letters"}
            </button>
          )}
        </div>

        <div className="stat-row">
          <div className="stat">
            <div className="stat-num">{progress.bestScore}</div>
            <div className="stat-label">Best / {SESSION_LENGTH}</div>
          </div>
          <div className="stat">
            <div className="stat-num">
              {progress.lastSession
                ? `${progress.lastSession.score}/${progress.lastSession.total}`
                : "—"}
            </div>
            <div className="stat-label">Last round</div>
          </div>
          <div className="stat">
            <div className="stat-num">{missedEntries.length}</div>
            <div className="stat-label">Weak letters</div>
          </div>
        </div>
      </main>
    );
  }

  if (phase === "done") {
    return (
      <main className="app-shell">
        <header className="app-header">
          <div>
            <p className="micro-label app-eyebrow">Round complete</p>
            <h1>Nice work</h1>
          </div>
        </header>

        <div className="result">
          <div>
            <span className="result-score">{score}</span>
            <span className="result-total"> / {queue.length}</span>
          </div>
          {sessionMisses.length > 0 ? (
            <>
              <p className="prose-muted" style={{ marginTop: "var(--sp-4)" }}>
                Missed this round
              </p>
              <div className="result-misses">
                {sessionMisses.map((c) => (
                  <span key={c} className="miss-chip">
                    {c}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <p className="prose-muted" style={{ marginTop: "var(--sp-4)" }}>
              Clean sweep. No misses.
            </p>
          )}
        </div>

        <div className="result-actions">
          {missedEntries.length > 0 && (
            <button
              type="button"
              className="btn btn-accent btn-block"
              onClick={() => startSession(missedEntries)}
            >
              Drill {missedEntries.length} weak{" "}
              {missedEntries.length === 1 ? "letter" : "letters"}
            </button>
          )}
          <button
            type="button"
            className="btn btn-block"
            onClick={() => startSession()}
          >
            New round
          </button>
        </div>
      </main>
    );
  }

  // phase === "playing"
  return (
    <main className="app-shell">
      <div className="quiz-progress">
        <p className="micro-label">
          {index + 1} of {queue.length}
        </p>
        <span className="badge badge-review">Score {score}</span>
      </div>

      <div className="progress-track" aria-hidden="true">
        <div
          className="progress-fill"
          style={{ width: `${(index / queue.length) * 100}%` }}
        />
      </div>

      {prompt && (
        <>
          <div className="quiz-prompt">
            <p className="micro-label qp-label">Which word?</p>
            <div className="qp-char">{prompt.entry.char}</div>
          </div>

          <div className="quiz-choices" role="group" aria-label="Choices">
            {prompt.choices.map((choice) => {
              let cls = "choice";
              if (picked) {
                if (choice.correct) cls += " is-correct";
                else if (choice.label === picked) cls += " is-wrong";
              }
              return (
                <button
                  key={choice.label}
                  type="button"
                  className={cls}
                  disabled={!!picked}
                  onClick={() => answer(choice)}
                >
                  {choice.label}
                </button>
              );
            })}
          </div>

          <div
            className={`quiz-feedback${
              picked
                ? picked === prompt.entry.word
                  ? " is-correct"
                  : " is-wrong"
                : ""
            }`}
            aria-live="polite"
          >
            {picked
              ? picked === prompt.entry.word
                ? "Correct"
                : `${prompt.entry.char} is ${prompt.entry.word}`
              : "\u00A0"}
          </div>
        </>
      )}
    </main>
  );
}
