# Design tokens — the contract for every component

Two orthogonal axes live on `<html>`:

| attribute | values | meaning |
|---|---|---|
| `data-style` | `a` \| `b` \| `c` | which visual language (Editorial / Terminal / Magazine) |
| `data-mode` | `light` \| `dark` | which light level |

Six combinations, each fully designed. Read `src/styles/base.css` for the reset and
primitives, `src/styles/style-{a,b,c}.css` for the per-style values.

## The one rule

**Never hard-code a colour, font stack, radius, duration or page width. Use a token.**
A literal cannot respond to the axis switch, so it is a bug the moment the clock ticks.

## Tokens

### Colour — resolved per `style` × `mode`

| token | use for |
|---|---|
| `--bg` | page background |
| `--bg-raised` | cards, panels, popovers — one step forward |
| `--bg-sunken` | wells, code blocks, footers — one step back |
| `--bg-input` | form field backgrounds |
| `--bg-overlay` | modal / lightbox scrim |
| `--fg` | primary text |
| `--fg-muted` | secondary text, ledes, metadata |
| `--fg-faint` | tertiary text, disabled, placeholders |
| `--fg-inverse` | text on an accent-coloured or inverted surface |
| `--line` | default hairline: borders, dividers |
| `--line-strong` | emphasised border, input outlines |
| `--accent` | the single accent colour |
| `--accent-fg` | text/icon on top of `--accent` |
| `--accent-soft` | tinted accent background (chips, selection) |
| `--ok`, `--ok-soft` | completed / success |
| `--warn`, `--warn-soft` | in progress / caution |
| `--danger`, `--danger-soft` | error / destructive |
| `--focus` | focus ring colour (`outline-color`) |

Contrast is authored per style: do not lighten `--accent` with `opacity` to make a
tint — use `--accent-soft`, which is chosen to stay legible in both modes.

### Typography — per style, mode-independent

`--font-display`, `--font-body`, `--font-mono`
`--weight-display`, `--weight-strong`, `--weight-body`
`--step--1`, `--step-0`, `--step-1`, `--step-2`, `--step-3`, `--step-4`
`--leading`, `--leading-tight`, `--leading-loose`
`--tracking`, `--tracking-tight`, `--tracking-wide`

Headings use `--font-display`; body copy and prose use `--font-body`; numbers, enum
labels, dates and code-ish metadata use `--font-mono`.

**Style C sets `--font-body` to a serif.** Do not assume the body font is sans.

### Shape — per style, mode-independent

`--radius-sm` (chips, inputs), `--radius-md` (cards), `--radius-lg` (modals),
`--radius-full` (pills)
`--border-width` — always use it, never `1px`
`--shadow-sm`, `--shadow-md`, `--shadow-lg`

**Style B sets every radius to `0` and every shadow to `none`.** A component that
depends on rounding or blur to look right is broken in B. Depth in B comes from
borders and the corner ticks described below.

### Flavour — per style, read by variant components

| token | a | b | c |
|---|---|---|---|
| `--card-bg` | `--bg-raised` | `--bg-raised` | `--bg-raised` |
| `--card-border` | `--line` | `--line` | `--line` |
| `--card-radius` | `6px` | `0` | `6px` |
| `--card-shadow` | `none` | `none` | `--shadow-sm` |
| `--hover-lift` | `-2px` | `-3px` | `-3px` |
| `--overline-spacing` | `.14em` | `.13em` | `.16em` |
| `--grid-size`, `--grid-line`, `--tick-size` | grid off | blueprint grid | grid off |

### Space, layout, motion — global

`--space-3xs` … `--space-4xl` (4px-based scale)
`--gutter` — page gutter, already fluid
`--measure` — default container width; `--measure-read` — prose width
`--dur-instant|fast|base|slow`, `--dur-theme-swap`
`--ease-out`, `--ease-in-out`
`--z-base|sticky|overlay|modal|toast`
`--focus-width`, `--focus-offset`
`--control-height-sm|--control-height|--control-height-lg`

## Utility classes from `base.css`

`.container` (uses `--measure` + `--gutter`), `.container--read`
`.stack`, `.stack-sm`, `.stack-lg` (vertical rhythm between children)
`.cluster` (wrapping row with gap)
`.visually-hidden`, `.skip-link`
`.page-shell` — **the page wrapper. All typographic identity is scoped to it.**

## Accessibility requirements — not optional

- Interactive cards are `<button>` or `<a>`, or carry `role="button"` +
  `tabindex="0"` + `@keydown.enter`/`@keydown.space`. A bare `@click` on a `<div>`
  makes the content unreachable by keyboard, which was a real defect here.
- Every icon-only control has `aria-label`.
- Modals: `Teleport` to `body`, `role="dialog"`, `aria-modal="true"`,
  `aria-labelledby`, Esc to close, scrim click to close, body scroll lock, focus
  moved in on open and returned on close, Tab cycled inside.
- Filters expose `aria-pressed`.
- Progress meters expose `role="progressbar"` + `aria-valuenow/min/max`.
- `prefers-reduced-motion` is handled globally, but never animate *from*
  `opacity: 0` without forcing the visible state under that media query.
- Style every state from tokens: hover, `:focus-visible`, active, disabled.

## Vue conventions in this codebase

- `<script setup>` with `defineProps` / `defineEmits`.
- `<style scoped>`; use `:deep()` sparingly and only for slotted content.
- Copy comes from `t('some.key')` or `enumLabelKey('projects','status', value)`
  from `@/content` — never string-concatenate a key.
- Content comes from `useContent()` in `@/content`, never imported data modules directly.
