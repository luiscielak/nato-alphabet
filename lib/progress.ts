const KEY = "nato-progress";

export type Progress = {
  seen: Record<string, number>;
  misses: Record<string, number>;
  lastSession: { score: number; total: number; date: string } | null;
  bestScore: number;
};

const EMPTY: Progress = {
  seen: {},
  misses: {},
  lastSession: null,
  bestScore: 0,
};

export function loadProgress(): Progress {
  if (typeof window === "undefined") return { ...EMPTY };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY };
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return {
      seen: parsed.seen ?? {},
      misses: parsed.misses ?? {},
      lastSession: parsed.lastSession ?? null,
      bestScore: parsed.bestScore ?? 0,
    };
  } catch {
    return { ...EMPTY };
  }
}

export function saveProgress(p: Progress): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* storage full or unavailable — ignore */
  }
}

/** Record one answer against a character. */
export function recordAnswer(
  p: Progress,
  char: string,
  correct: boolean,
): Progress {
  const seen = { ...p.seen, [char]: (p.seen[char] ?? 0) + 1 };
  const misses = { ...p.misses };
  if (correct) {
    // Decay a past miss on a correct answer so mastered letters drop out.
    if (misses[char]) misses[char] = Math.max(0, misses[char] - 1);
  } else {
    misses[char] = (misses[char] ?? 0) + 1;
  }
  return { ...p, seen, misses };
}

export function recordSession(
  p: Progress,
  score: number,
  total: number,
): Progress {
  return {
    ...p,
    lastSession: { score, total, date: new Date().toISOString() },
    bestScore: Math.max(p.bestScore, score),
  };
}
