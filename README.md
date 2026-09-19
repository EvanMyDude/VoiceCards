# VoiceCards

100 Voice & Wellbeing flashcards, built with React, Vite, and Tailwind CSS.

Live app: https://evanmydude.github.io/VoiceCards/

## Development

Use Node 22 (22.12 or newer). With nvm, run `nvm use`.

```sh
npm install
npm run dev
```

## Validation and production preview

```sh
npm run validate:deck
npm test
npm run build
npm run preview
```

Open the preview at http://localhost:4173/VoiceCards/. The build produces `dist/` and automatically runs deck validation first. Do not commit `dist/` or `node_modules/`.

The complete built-in deck lives in `src/cards.js`. It must contain exactly 100 cards with unique integer IDs 1–100, nonblank front/back strings, and unique front/back pairs. Preserve the full deck; never replace card ranges with placeholder comments. Run validation and build before every push. The integrity tests include the regression where only cards 1 and 100 remain.

## Controls

- Click the card or press Space to flip.
- Right Arrow / Correct sends a card to the end and increments Correct.
- Left Arrow / Again reinserts it after three intervening cards and increments Again.
- S shuffles; R resets the session.
- Type Mode accepts a typed answer; Enter or Check reveals the answer for self-assessment. Global shortcuts are ignored while typing.
- The queue peek shows the next five card IDs. Orange marks the latest Again card until it becomes current. Shuffle and Reset clear the highlight; switching Type Mode resets the session.

## Deployment

Pushes to `main` run `.github/workflows/deploy.yml`: `npm ci`, deck validation, integrity tests, build, artifact upload, and GitHub Pages deployment. The workflow can also be run manually from Actions.

In repository Settings → Pages, the source must be **GitHub Actions**. Vite's base is `/VoiceCards/` for this project site. Deployment uses the official GitHub Pages Actions and the workflow's built-in token; no extra deployment secret is required.
