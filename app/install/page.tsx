export default function InstallPage() {
  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="micro-label app-eyebrow">Keep it one tap away</p>
          <h1>Add to home screen</h1>
        </div>
      </header>

      <p className="prose-muted">
        Install it once and it opens full-screen, works offline, and sits next
        to your other apps — no App Store needed.
      </p>

      <div className="section-heading">
        <p className="micro-label">iPhone / iPad — Safari</p>
      </div>
      <ol className="steps">
        <li>
          Open this page in <strong>Safari</strong> (not inside another app).
        </li>
        <li>
          Tap the <strong>Share</strong> button — the square with an arrow
          pointing up.
        </li>
        <li>
          Scroll down and tap <strong>Add to Home Screen</strong>.
        </li>
        <li>
          Tap <strong>Add</strong>. Launch it from the new icon and it runs like
          an app.
        </li>
      </ol>

      <div className="section-heading">
        <p className="micro-label">Android — Chrome</p>
      </div>
      <ol className="steps">
        <li>
          Open this page in <strong>Chrome</strong>.
        </li>
        <li>
          Tap the <strong>⋮</strong> menu in the top-right corner.
        </li>
        <li>
          Tap <strong>Add to Home screen</strong> / <strong>Install app</strong>
          , then confirm.
        </li>
      </ol>

      <div className="section-heading">
        <p className="micro-label">Desktop — Chrome / Edge</p>
      </div>
      <p className="prose-muted">
        Look for the install icon in the address bar (a monitor with a down
        arrow), or open the browser menu and choose{" "}
        <strong>Install NATO Alphabet</strong>.
      </p>
    </main>
  );
}
