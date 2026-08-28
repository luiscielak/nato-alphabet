"use client";

import { useMemo, useState } from "react";
import {
  NATO_LETTERS,
  spell,
  spokenForm,
  type NatoEntry,
} from "../lib/nato";

function Tile({ entry }: { entry: NatoEntry }) {
  return (
    <div className="tile">
      <span className="tile-char">{entry.char}</span>
      <span>
        <span className="tile-word">{entry.word}</span>
        <span className="tile-pron">{entry.pronunciation}</span>
      </span>
    </div>
  );
}

export function Reference() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const tokens = useMemo(() => spell(text), [text]);
  const spoken = useMemo(() => spokenForm(text), [text]);
  const hasInput = text.trim().length > 0;

  const onCopy = async () => {
    if (!spoken) return;
    try {
      await navigator.clipboard.writeText(spoken);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — ignore */
    }
  };

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="micro-label app-eyebrow">Phonetic reference</p>
          <h1>Spell it</h1>
        </div>
      </header>

      <section className="spell" aria-label="Spell a word or code">
        <input
          className="spell-input"
          type="text"
          inputMode="text"
          autoComplete="off"
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="done"
          placeholder="Type a name or code…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label="Text to spell phonetically"
        />

        <div className="spell-output" aria-live="polite">
          {hasInput ? (
            <div className="spell-tokens">
              {tokens.map((t, i) => {
                if (t.kind === "space") {
                  return <span key={i} className="spell-token st-space" />;
                }
                if (t.kind === "other") {
                  return (
                    <span key={i} className="spell-token st-other">
                      <span className="st-word">{t.input}</span>
                    </span>
                  );
                }
                return (
                  <span key={i} className="spell-token">
                    <span className="st-char">{t.input}</span>
                    <span className="st-word">{t.entry.word}</span>
                  </span>
                );
              })}
            </div>
          ) : (
            <p className="spell-empty">
              Type a name, confirmation code, or email. Each letter becomes its
              NATO word so it survives a bad connection and a heavy
              accent.
            </p>
          )}
        </div>

        {hasInput && (
          <div className="spell-actions">
            <span className="spell-spoken">{spoken}</span>
            <button
              type="button"
              className={`btn${copied ? " is-copied" : ""}`}
              onClick={onCopy}
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        )}
      </section>

      <div className="section-heading">
        <p className="micro-label">Full alphabet</p>
      </div>

      <section className="grid" aria-label="NATO alphabet A to Z">
        {NATO_LETTERS.map((entry) => (
          <Tile key={entry.char} entry={entry} />
        ))}
      </section>
    </main>
  );
}
