import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "what's nato? — NATO Alphabet",
  description:
    "What the NATO phonetic alphabet is, and why people still use it on calls.",
};

export default function HelpPage() {
  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <span className="pill">Help</span>
          <h1>what&apos;s nato?</h1>
        </div>
      </header>

      <p className="prose-muted">
        The NATO phonetic alphabet is 26 words, one for each letter: Alfa,
        Bravo, Charlie through Zulu. Officially it&apos;s the ICAO
        radiotelephony spelling alphabet — NATO adopted it in the 1950s, and
        the nickname stuck.
      </p>
      <p className="prose-muted">
        Each word was picked so it stays distinct over a noisy radio or a bad
        phone line, even when the two people don&apos;t share a first language.
        That&apos;s why it&apos;s <em>Alfa</em> not Alpha, and{" "}
        <em>Juliett</em> with a T — spellings that hold up for non-English
        speakers.
      </p>

      <div className="section-heading">
        <p className="micro-label">Why it&apos;s used</p>
      </div>
      <p className="prose-muted">
        B, D, P, T, and V collapse into the same sound when the line drops. M
        and N blur. F and S hiss into each other. &ldquo;B as in boy&rdquo;
        only works if the other person heard &ldquo;boy.&rdquo; Bravo
        doesn&apos;t need a backup.
      </p>
      <p className="prose-muted">
        Use it for names, confirmation codes, email addresses, ticket numbers
        — anything that has to survive &ldquo;can you spell that?&rdquo;
      </p>

      <div className="example-row" aria-label="Example spelling">
        <span className="example-in">Luis</span>
        <span className="example-arrow" aria-hidden="true">
          →
        </span>
        <span className="example-out">
          Lima Uniform India Sierra
        </span>
      </div>
      <div className="example-row" aria-label="Example spelling">
        <span className="example-in">The Hooman Loop</span>
        <span className="example-arrow" aria-hidden="true">
          →
        </span>
        <span className="example-out">
          Tango Hotel Echo / Hotel Oscar Oscar Mike Alfa November /
          Lima Oscar Oscar Papa
        </span>
      </div>
      <div className="example-row" aria-label="Example spelling">
        <span className="example-in">PHL</span>
        <span className="example-arrow" aria-hidden="true">
          →
        </span>
        <span className="example-out">Papa Hotel Lima</span>
      </div>
      <div className="example-row" aria-label="Example spelling">
        <span className="example-in">MEX</span>
        <span className="example-arrow" aria-hidden="true">
          →
        </span>
        <span className="example-out">Mike Echo X-ray</span>
      </div>

      <div className="section-heading">
        <p className="micro-label">This app</p>
      </div>
      <p className="prose-muted">
        <Link href="/">Spell</Link> is the call-time reference.{" "}
        <Link href="/practice">Practice</Link> is ten quick prompts so the
        words actually stick.{" "}
        <Link href="/install">Install</Link> puts it on your home screen —
        works offline, no App Store.
      </p>
      <p className="prose-muted">
        Made by{" "}
        <a href="https://thehoomanloop.com" rel="noopener noreferrer">
          The Hooman Loop
        </a>
        .
      </p>
    </main>
  );
}
