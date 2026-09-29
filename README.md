# Portfolio — Jeremy Thierry Chan

A six-language, time-themed static portfolio. Language × trade × technology, aimed at
inbound client work: interpreting, cross-border trade, and the websites and internal
systems that hold the two together.

Vue 3 (`<script setup>`) · Vite 5 · vue-router 4 · vue-i18n 9. No backend, no runtime
data fetching, no tracking. Ships as static files to GitHub Pages at
<https://jeremythierrychan.github.io/portfolio/>.

> This README used to be the untouched Vue CLI scaffold: it documented `npm run lint`, a
> `vue.config.js` and a [Vue CLI config reference](https://cli.vuejs.org/config/), none of
> which this project has used since it moved to Vite. If something below looks wrong,
> check the command actually exists in `package.json` before trusting it.

## Getting started

Node 20 or newer (CI pins 20; `engines` in `package.json` records it).

```bash
npm ci          # not `npm install` — the lockfile is what CI uses
npm run dev     # dev server
npm run build   # regenerates public/resume*.json, then writes dist/
npm run preview # serve the built output
```

`npm run serve` still exists as an alias for `vite`, kept only so muscle memory from the
Vue CLI era does not error out. `npm run dev` is the real name.

`npm run build` is two steps on purpose: `scripts/build-resume-json.mjs` regenerates the
six machine-readable CV files in `public/` from the content layer *before* Vite copies
`public/` into `dist/`. Building with a bare `vite build` skips that and ships a stale CV.

## Verification

Eight layers. The point of gating on these is that most of this site's real contracts are
invisible in a browser — a wrong colour pair, a missing translation, a grid floor that
overflows a 320 px phone, a component that only breaks under SSR.

```bash
npm run verify   # everything below, then the production build. This is the gate.
```

| Command | What it protects |
| --- | --- |
| `npm run test` | Clock→style scheduling, the theme bootstrap, timed style pins, audience mapping |
| `npm run verify:content` | Content-layer schema, counts, ids/slugs, cross-references, the withheld-name guard |
| `npm run verify:i18n` | Every key present in all six locales, no dead keys, no untranslated mirror fields |
| `npm run verify:contrast` | Every foreground/background pair, per style *and* per mode (not just one theme) |
| `npm run verify:cascade` | Stylesheet import order and specificity, so no style file silently wins |
| `npm run verify:layout` | The single-breakpoint contract, and that no grid floor overflows |
| `npm run verify:resume` | Regenerates the CV JSON and fails if the committed output is stale |
| `npm run smoke` | Server-renders every route via `@vue/server-renderer` and asserts on the HTML |

`.github/workflows/deploy.yml` runs `npm run verify`, not `npm run build` — `verify` ends
with the build, so it is the artifact step's producer as well as its gate. Before that
change the eight layers existed for months and never ran in CI, so every red commit
deployed.

**Known limitation:** there is no browser and no jsdom in this repo. Client-only
behaviour — focus traps, scroll effects, animation — is covered by static analysis and
the unit tests, not by rendering. Anything you can only observe by clicking is unverified
here; say so rather than implying it was tested.

## Architecture

### Theming: two independent axes

`<html>` carries `data-style` (`a`/`b`/`c`) and `data-mode` (`light`/`dark`), giving six
combinations. `src/theme/schedule.js` picks the style from the visitor's *local* clock —
07:00–12:00 → `a` (Editorial), 12:00–18:00 → `c` (Magazine), 18:00–07:00 → `b`
(Terminal) — and the mode follows the clock too. The visitor can override either axis,
permanently or until the next window boundary; `theme.styleUntil` stores
`<styleId>@<epochMs>`.

The style is applied by an inline bootstrap in `index.html` **before** first paint, so
there is no flash of the wrong theme. `src/theme/useTimeTheme.js` is a module-level
singleton, deliberately never torn down: one component unmounting must not kill the
shared clock.

`src/styles/TOKENS.md` is the contract — read it before adding a token or a breakpoint.
`src/styles/fallback.css` is imported *first* and declares the theme defaults under
`:where(:root)`; that ordering is load-bearing. Without it, cards rendered white text on
a white card in dark mode.

### Layout: exactly one breakpoint

**768 px**, expressed only as `max-width: 767.98px` and `min-width: 768px`. Media queries
cannot read custom properties, so the number is a literal everywhere and `verify:layout`
asserts those are the only two boundaries in the codebase. If you need a third, you are
changing a documented contract — update the checker deliberately.

Grids carry no breakpoints at all. They use
`repeat(auto-fit, minmax(min(<floor>, 100%), 1fr))`, and the `min(<floor>, 100%)` guard is
**mandatory**: a bare floor overflows a 320 px phone. Floors are also chosen to be
invariant across the three `--measure` values (1160/1120/1080), otherwise the page
reflows when the clock changes style.

### Content: structure at the top level, copy under `i18n`

`src/content/*.js` holds the data. Each collection is an array of entries whose
locale-neutral structure (`id`, `slug`, `date`, `tech`, …) sits beside an `i18n` block
holding every user-visible string, keyed by locale.

`pick(entry, locale)` flattens one entry into a render-ready object, falling back
per-field to `i18n.en`. Two things about it are easy to get wrong:

- It flattens **only the top level**. It recurses into `stages` (project stages carry
  their own copy) and nothing else. A nested container such as `profile.positioning` or
  `profile.contact` therefore stays a raw `{…structure, i18n}` object, and reading
  `profile.positioning.summary` off it is silently `undefined` rather than an error. Read
  a nested container through `pick(container, locale)`.
- It merges rather than replaces, so the result carries non-`i18n` top-level keys *and*
  the flattened copy.

`name` is the one sanctioned exception to "copy lives under `i18n`": proper nouns
(technology and language names, brand names) stay locale-neutral at the top level, and a
locale that genuinely translates one supplies `i18n.<locale>.name`. Nothing else may put
user-visible text at the top level.

`src/content/SCHEMA.md` is the authoring contract: per-field rules, the bilingual policy,
enum vocabularies, and the counts the checkers assert. **Read it before editing content.**
`src/content/index.js` is the barrel and the `useContent()` composable.

### i18n: six locales, bilingual policy

`src/locales/{en,zh,de,fr,es,it}.js`, `legacy: false`. `en` is the source of truth.

Content is currently **English and Chinese only**. Visitors on `de`/`fr`/`es`/`it` get
per-field English fallback for content while all UI chrome is fully translated. That is
the documented degradation and not a bug — but it means the site is not uniformly
six-language, and claiming otherwise would be false.

## Deploying

Push to `main`. The workflow installs with `npm ci`, runs `npm run verify`, and uploads
`dist/`. Nothing deploys if verification fails.

`vite.config.js` sets `base: '/portfolio/'`, so asset URLs are absolute under that prefix.
Changing the deployment path means changing `base`, `ORIGIN` in `src/App.vue` (canonical
and Open Graph URLs) and `public/sitemap.xml` — all three, or the canonical URLs will
compete with the sitemap's.

## Repository notes

- `scripts/withheld-names.mjs` guards 20 names that must never ship. Three decisions are
  recorded in its header; read them before assuming a name is safe to add or remove.
- `scripts/apply-cv-*.py` and `make-og-image.py` are one-off migration tools from the
  original CV import, not part of the build. `make-og-image.py` is macOS-only.
- `INTENTIONAL_DEVIATIONS` in `scripts/verify-content.mjs` records every deliberate
  divergence from the pre-rewrite content, with a reason. Add an entry rather than
  loosening a check.
- `TODO(verify)` marks a claim that needs the owner's confirmation before it can be
  published as fact. There are currently 17 (awards 5, projects 5, services 7). They are
  not defects, but they are open questions — do not resolve one by guessing.
- The gallery's 14 entries have `image: null` and the page draws its own placeholder. It
  previously pointed all 14 at `picsum.photos`, which meant every visitor to the gallery
  fetched fourteen stock photographs from a third party.
