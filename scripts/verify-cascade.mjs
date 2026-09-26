#!/usr/bin/env node
/**
 * Cascade verification for the design tokens.
 *
 *   node scripts/verify-cascade.mjs        (or: npm run verify:cascade)
 *
 * WHY THIS EXISTS: the fallback theme was originally written at the bottom of
 * `index.css`, which concatenates it LAST in the bundle. `:root` and `[data-style="a"]`
 * both have specificity (0,1,0), so the later rule won — and the fallback silently
 * overrode every mode-independent identity token in all three style files. The visible
 * symptom was white cards with light text in dark mode; the full damage was that the
 * fonts, type scale, radii, shadows, measures and hover distances were identical across
 * all three styles, which defeats the entire point of having three styles.
 *
 * No amount of eyeballing catches that reliably. This resolves the real cascade —
 * specificity, source order, `var()` indirection — for all six style x mode
 * combinations, and asserts that every token defined by a style actually resolves to
 * that style's declaration.
 *
 * It is a focused resolver, not a browser: it understands the selector forms this
 * project uses (`:where()`, `:root`, attribute selectors) and would need extending for
 * combinators or descendant selectors.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve as resolvePath } from 'node:path';

const ROOT = resolvePath(dirname(fileURLToPath(import.meta.url)), '..');
const p = (...s) => resolvePath(ROOT, ...s);

/*
 * Bundle order, mirroring the `@import` sequence in src/styles/index.css. Kept as data
 * so a mismatch between this list and the real import order is itself detectable.
 */
const SHEET_ORDER = ['fallback.css', 'base.css', 'style-a.css', 'style-b.css', 'style-c.css'];

const STYLES = ['a', 'b', 'c'];
const MODES = ['light', 'dark'];

let failures = 0;
let checks = 0;
const ok = (l, x = '') => { checks++; console.log(`  \x1b[32mPASS\x1b[0m  ${l}${x ? ` — ${x}` : ''}`); };
const bad = (l, x = '') => { checks++; failures++; console.log(`  \x1b[31mFAIL\x1b[0m  ${l}${x ? ` — ${x}` : ''}`); };
const section = (t) => console.log(`\n\x1b[1m${t}\x1b[0m`);

/* ── CSS parsing (custom properties only) ──────────────────────────────── */

/** Strip comments so commented-out declarations never participate. */
const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');

/**
 * Every `selector { --token: value; }` rule in a sheet.
 * @returns {{selector:string, token:string, value:string, order:number}[]}
 */
function declarations(sheetFile, orderBase) {
  const css = stripComments(readFileSync(p('src/styles', sheetFile), 'utf8'));
  const out = [];
  let order = orderBase;
  const ruleRe = /([^{}]+)\{([^{}]*)\}/g;

  for (const m of css.matchAll(ruleRe)) {
    const selectors = m[1].split(',').map((s) => s.trim()).filter(Boolean);
    const body = m[2];
    for (const decl of body.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/gi)) {
      for (const selector of selectors) {
        out.push({
          selector,
          token: decl[1].trim(),
          value: decl[2].trim(),
          order: order++,
          sheet: sheetFile,
        });
      }
    }
  }
  return out;
}

/* ── specificity ───────────────────────────────────────────────────────── */

/**
 * CSS specificity as a comparable number, with `:where()` contributing zero.
 * Handles the selector forms used here: `:where(...)`, `:root`, `.class`,
 * `[attr]`, `[attr="v"]`, and bare element names.
 */
function specificity(selector) {
  let s = selector;

  // `:where(...)` always contributes 0 — remove it entirely, contents included.
  s = s.replace(/:where\([^)]*\)/g, '');

  const ids = (s.match(/#[\w-]+/g) ?? []).length;
  const classes = (s.match(/\.[\w-]+/g) ?? []).length;
  const attrs = (s.match(/\[[^\]]+\]/g) ?? []).length;
  const pseudoClasses = (s.match(/:(?!:)[\w-]+/g) ?? []).length;
  const elements = (s.match(/(^|[\s>+~])([a-z][\w-]*)/g) ?? []).length;

  // Weighted so that any id beats any number of the others, matching real cascade order.
  return ids * 1_000_000 + (classes + attrs + pseudoClasses) * 1_000 + elements;
}

/** Does this selector apply when <html> carries exactly these attributes? */
function matches(selector, style, mode) {
  const s = selector.replace(/:where\([^)]*\)/g, ':root');

  // Any selector mentioning a style must match that style.
  const wantedStyle = s.match(/\[data-style\s*=\s*"?([abc])"?\]/)?.[1];
  if (wantedStyle && wantedStyle !== style) return false;

  const wantedMode = s.match(/\[data-mode\s*=\s*"?(light|dark)"?\]/)?.[1];
  if (wantedMode && wantedMode !== mode) return false;

  // `:root` / `html` always match; this resolver only supports attribute + root selectors.
  return true;
}

/** Resolve `var(--x)` chains against a resolved map. */
function resolve(token, resolved, seen = new Set()) {
  if (seen.has(token)) return undefined;      // circular
  seen.add(token);

  let value = resolved[token];
  if (typeof value !== 'string') return undefined;

  for (let i = 0; i < 12 && value.startsWith('var('); i++) {
    const ref = value.match(/var\((--[a-z0-9-]+)(?:\s*,\s*([^)]+))?\)/i);
    if (!ref) break;
    const next = resolved[ref[1]];
    value = next === undefined ? (ref[2]?.trim() ?? undefined) : next;
    if (value === undefined) break;
  }
  return value;
}

/* ── build the model ───────────────────────────────────────────────────── */

const ALL = [];
SHEET_ORDER.forEach((sheet, i) => ALL.push(...declarations(sheet, i * 100_000)));

/** Every token, and which sheets define it. */
const TOKENS = new Set(ALL.map((d) => d.token));
const definedIn = (sheet) => new Set(ALL.filter((d) => d.sheet === sheet).map((d) => d.token));

/*
 * Tokens are considered PER STYLE, not as a union. A union produced a false positive:
 * `--grid-line` is a blueprint-grid token that only style B introduces, so styles A and C
 * legitimately take it from the fallback ("no grid"). What is actually wrong is a style
 * failing to win a token THAT STYLE declares — so the check asks that question instead.
 */
const IDENTITY_BY_STYLE = {
  a: definedIn('style-a.css'),
  b: definedIn('style-b.css'),
  c: definedIn('style-c.css'),
};

/**
 * Resolve every token for one combination, recording which declaration won.
 * @returns {{ values: Record<string,string>, winners: Record<string,object> }}
 */
function resolveFor(style, mode) {
  const winners = {};
  for (const d of ALL) {
    if (!matches(d.selector, style, mode)) continue;
    const prev = winners[d.token];
    const spec = specificity(d.selector);
    if (
      !prev ||
      spec > prev.spec ||
      (spec === prev.spec && d.order > prev.order)
    ) {
      winners[d.token] = { ...d, spec };
    }
  }

  const values = {};
  for (const token of Object.keys(winners)) values[token] = winners[token].value;
  for (const token of TOKENS) values[token] = resolve(token, values);
  return { values, winners };
}

/* ── 1. the specific bug: the fallback must never beat a style ─────────── */

section('The fallback never overrides a style');

for (const style of STYLES) {
  for (const mode of MODES) {
    const { winners } = resolveFor(style, mode);
    const own = IDENTITY_BY_STYLE[style];
    const stolen = Object.entries(winners)
      .filter(([token, win]) => win.sheet === 'fallback.css' && own.has(token))
      .map(([token]) => token);

    if (stolen.length) {
      bad(`${style}/${mode}: fallback overrides styled tokens`,
        `${stolen.length} token(s): ${stolen.slice(0, 6).join(', ')}${stolen.length > 6 ? '…' : ''}`);
    } else {
      ok(`${style}/${mode}: no styled token falls back`);
    }
  }
}

/* ── 2. tokens that must differ between styles ─────────────────────────── */

section('Styles are genuinely different, not only in colour');

/*
 * Each of these is defined in the mode-INDEPENDENT identity block. If the fallback wins,
 * they all collapse to one shared value and the styles become colour variants of a single
 * design — which is what the bug did.
 */
const MUST_DIFFER = {
  '--font-body': 'the body font stack (style C is serif)',
  '--radius-md': 'the card radius (style B is 0)',
  '--measure': 'the container width',
  '--hover-lift': 'the hover displacement',
  '--card-radius': 'the card radius token',
  '--step-3': 'the large display step',
};

for (const token of Object.keys(MUST_DIFFER)) {
  const perStyle = STYLES.map((style) => resolveFor(style, 'light').values[token]);
  const distinct = new Set(perStyle.filter((v) => v !== undefined));
  if (distinct.size >= 2) {
    ok(`${token} varies by style`, perStyle.map((v, i) => `${STYLES[i]}=${String(v).slice(0, 22)}`).join('  '));
  } else {
    bad(`${token} is identical across all styles`, `all resolve to ${perStyle[0]} — ${MUST_DIFFER[token]}`);
  }
}

/* ── 3. the observable symptom: card surfaces follow the mode ──────────── */

section('Card surfaces follow the colour mode');

for (const style of STYLES) {
  for (const mode of MODES) {
    const { values } = resolveFor(style, mode);
    const cardBg = values['--card-bg'];
    const raised = values['--bg-raised'];
    const fg = values['--fg'];

    if (cardBg !== raised) {
      bad(`${style}/${mode}: --card-bg does not resolve to --bg-raised`, `${cardBg} vs ${raised}`);
      continue;
    }
    if (!cardBg || !declaresDarkSurface(cardBg, mode)) {
      bad(`${style}/${mode}: card surface looks wrong for the mode`, `--card-bg = ${cardBg}`);
      continue;
    }
    ok(`${style}/${mode}: card surface ${cardBg}, text ${fg}`);
  }
}

/** A dark mode must not use a near-white surface, and vice versa. */
function declaresDarkSurface(color, mode) {
  const hex = String(color).trim().match(/^#([0-9a-f]{6})$/i);
  if (!hex) return true;                       // non-hex: skip the luminance opinion
  const n = parseInt(hex[1], 16);
  const luma = (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
  return mode === 'dark' ? luma < 0.35 : luma > 0.55;
}

/* ── 4. the import order in index.css is what this file assumes ────────── */

section('Bundle order matches index.css');

const indexCss = readFileSync(p('src/styles/index.css'), 'utf8');
const imported = [...indexCss.matchAll(/@import\s+'\.\/([\w-]+\.css)'/g)].map((m) => m[1]);

if (imported.join(',') === SHEET_ORDER.join(',')) {
  ok('index.css imports exactly this order', imported.join(' → '));
} else {
  bad('index.css import order differs from SHEET_ORDER in this script',
    `index.css: ${imported.join(' → ')}  |  script: ${SHEET_ORDER.join(' → ')}`);
}

/* ── report ────────────────────────────────────────────────────────────── */

console.log(`\n\x1b[1m${failures === 0 ? '\x1b[32mCASCADE OK' : `\x1b[31m${failures} CASCADE PROBLEM(S)`}\x1b[0m  (${checks - failures}/${checks})`);
process.exit(failures === 0 ? 0 : 1);
