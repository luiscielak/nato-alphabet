# NATO Alphabet

![Spell, Practice, and Install screens framed on iPhone 17 Pro](social/framed/merged_framed.png)

A mobile-first PWA with two jobs:

- **Spell (home)** — the call-time reference. Type a name or code and read the NATO phonetic spelling (`LUIS → Lima Uniform India Sierra`), with a one-tap copy. Underneath, the full A–Z grid for a fast glance, plus an optional numbers row.
- **Practice** — a short game. See a letter, pick its NATO word. Missed letters come back more often until they stop tripping you up. Scores persist locally.

It works offline and installs to your phone's home screen — no App Store.

## Design system

Styled with **Konstrukt** (the Hooman Loop design system): Bauhaus / Swiss International — flat surfaces, square corners, Space Grotesk + Inter. Default theme is the `hl` palette in dark mode for call-time contrast. The generated Konstrukt CSS is vendored in [`styles/`](styles/) (`konstrukt.css`, `base.css`) and must not be hand-edited; regenerate it from `hooman-loop/apps/konstrukt` and re-copy.

## Stack

- Next.js (App Router) + TypeScript — statically rendered, no backend
- Konstrukt CSS (vendored) + a small app layer in [`styles/app.css`](styles/app.css)
- Offline via a hand-written service worker ([`public/sw.js`](public/sw.js), app-shell cache)
- Progress in `localStorage` (`nato-progress`)

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
```

Note: the service worker only registers in production builds.

```bash
npm run build && npm run start
```

## Project layout

```
app/
  layout.tsx        # Konstrukt theme, metadata, PWA wiring, bottom nav
  page.tsx          # Spell (Reference)
  practice/page.tsx # Practice game
  install/page.tsx  # Add-to-home-screen help
components/
  Reference.tsx     # spell bar + A–Z grid + digits toggle
  PracticeGame.tsx  # quiz loop + missed-letter weighting
  BottomNav.tsx     # Spell / Practice / Install
lib/
  nato.ts           # alphabet + digits + spell()/spokenForm()
  progress.ts       # localStorage read/write + weighting
public/
  manifest.webmanifest
  sw.js
  icons/
styles/
  konstrukt.css     # vendored — do not edit
  base.css          # vendored — do not edit
  app.css           # app-specific layout on Konstrukt tokens
```

## Deploy

Deploys as a static site on Vercel. Push the repo and import it, or run `vercel`.

## Updating the NATO data

Edit [`lib/nato.ts`](lib/nato.ts). Letters and digits share one map, so the spell
bar handles both automatically.
