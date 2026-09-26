#!/usr/bin/env node
/**
 * WCAG contrast check for every style x mode token set.
 *
 *   node scripts/verify-contrast.mjs        (or: npm run verify:contrast)
 *
 * The six palettes were authored by eye. Eyeballing colour is unreliable — a muted
 * grey that looks fine on a designer's monitor can sit at 3.8:1 and fail AA for body
 * text. This measures every pair the UI actually composes, so the numbers replace the
 * guesswork.
 *
 * Thresholds (WCAG 2.2):
 *   4.5:1  normal text            (AA, 1.4.3)
 *   3.0:1  large text >=24px, or >=18.66px bold (AA, 1.4.3)
 *   3.0:1  UI component boundaries and focus indicators (AA, 1.4.11)
 *
 * Exit code 1 if any AA requirement is violated.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const p = (...s) => resolve(ROOT, ...s);

const STYLES = ['a', 'b', 'c'];
const MODES = ['light', 'dark'];

/* ── colour maths ──────────────────────────────────────────────────────── */

/** Parse `#rgb`, `#rrggbb`, `rgb(...)`, `rgba(...)` into [r,g,b,a]. */
function parseColor(value) {
  const v = String(value).trim();

  const hex = v.match(/^#([0-9a-f]{3,8})$/i);
  if (hex) {
    let h = hex[1];
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    if (h.length === 4) h = h.split('').map((c) => c + c).join('');
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
    return [r, g, b, a];
  }

  const fn = v.match(/^rgba?\(([^)]+)\)$/i);
  if (fn) {
    const parts = fn[1].split(/[,\s/]+/).filter(Boolean).map(Number);
    return [parts[0], parts[1], parts[2], parts.length > 3 ? parts[3] : 1];
  }

  return null;
}

/** Composite a possibly-translucent colour over an opaque backdrop. */
function flatten([r, g, b, a], [br, bg, bb]) {
  return [r * a + br * (1 - a), g * a + bg * (1 - a), b * a + bb * (1 - a), 1];
}

function relativeLuminance([r, g, b]) {
  const ch = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}

/** WCAG contrast ratio between two colours, each optionally translucent over `backdrop`. */
function contrast(fgRaw, bgRaw, backdrop = [255, 255, 255]) {
  const bg = flatten(parseColor(bgRaw), backdrop);
  const fg = flatten(parseColor(fgRaw), bg);
  const [l1, l2] = [relativeLuminance(fg), relativeLuminance(bg)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

/* ── read the tokens ───────────────────────────────────────────────────── */

/** Pull `--name: value;` pairs out of the block introduced by `selector`. */
function tokensFor(style, mode) {
  const css = readFileSync(p('src/styles', `style-${style}.css`), 'utf8');
  const selector = `[data-style="${style}"][data-mode="${mode}"]`;
  const at = css.indexOf(selector);
  if (at === -1) throw new Error(`${selector} not found in style-${style}.css`);
  const block = css.slice(at, css.indexOf('\n}', at));

  const out = {};
  for (const m of block.matchAll(/(--[a-z0-9-]+):\s*([^;]+);/g)) {
    out[m[1]] = m[2].trim();
  }
  return out;
}

/** Resolve `var(--x)` indirection one level deep, as the styles use it for flavour tokens. */
function resolveToken(tokens, name) {
  let value = tokens[name];
  const seen = new Set();
  while (typeof value === 'string' && value.startsWith('var(') && !seen.has(value)) {
    seen.add(value);
    const ref = value.match(/var\((--[a-z0-9-]+)/)?.[1];
    if (!ref) break;
    value = tokens[ref];
  }
  return value;
}

/* ── the pairs the UI actually composes ────────────────────────────────── */

/** `[label, foreground, background, minimum ratio]` */
const PAIRS = [
  ['body text',                 '--fg',        '--bg',        4.5],
  ['body text on card',         '--fg',        '--bg-raised', 4.5],
  ['body text on sunken',       '--fg',        '--bg-sunken', 4.5],
  ['secondary text',            '--fg-muted',  '--bg',        4.5],
  ['secondary text on card',    '--fg-muted',  '--bg-raised', 4.5],
  ['tertiary / meta text',      '--fg-faint',  '--bg',        4.5],
  ['accent (links, overlines)', '--accent',    '--bg',        4.5],
  ['accent on card',            '--accent',    '--bg-raised', 4.5],
  ['text on accent (buttons)',  '--accent-fg', '--accent',    4.5],
  ['text on accent-soft (chips)','--fg',       '--accent-soft', 4.5],
  ['accent on accent-soft',     '--accent',    '--accent-soft', 4.5],
  ['ok / completed',            '--ok',        '--bg',        4.5],
  ['warn / in progress',        '--warn',      '--bg',        4.5],
  ['danger',                    '--danger',    '--bg',        4.5],
  ['ok on ok-soft',             '--ok',        '--ok-soft',   4.5],
  ['warn on warn-soft',         '--warn',      '--warn-soft', 4.5],
  ['danger on danger-soft',     '--danger',    '--danger-soft', 4.5],
  ['input text',                '--fg',        '--bg-input',  4.5],
  ['placeholder',               '--fg-faint',  '--bg-input',  4.5],

  // Non-text: UI boundaries and the focus ring need 3:1.
  ['focus ring on page',        '--focus',     '--bg',        3.0],
  ['focus ring on card',        '--focus',     '--bg-raised', 3.0],

  // Informational: hairlines are decorative here (cards also differ in background),
  // so this is reported but does not fail the run.
  ['border on page (info)',     '--line',      '--bg',        1.4],
  ['strong border on page (info)','--line-strong','--bg',     1.4],
];

/* ── run ───────────────────────────────────────────────────────────────── */

let failures = 0;
let warnings = 0;
let checks = 0;

const fmt = (n) => n.toFixed(2).padStart(6);

for (const style of STYLES) {
  for (const mode of MODES) {
    const tokens = tokensFor(style, mode);
    const bgBackdrop = parseColor(tokens['--bg']).slice(0, 3);

    console.log(`\n\x1b[1mstyle ${style} / ${mode}\x1b[0m  (--bg ${tokens['--bg']})`);

    for (const [label, fgName, bgName, min] of PAIRS) {
      const fg = resolveToken(tokens, fgName);
      const bg = resolveToken(tokens, bgName);

      if (!fg || !bg || !parseColor(fg) || !parseColor(bg)) {
        console.log(`  \x1b[33mSKIP\x1b[0m  ${label.padEnd(30)} (${fgName} / ${bgName} not both resolvable)`);
        continue;
      }

      const ratio = contrast(fg, bg, bgBackdrop);
      checks++;

      const informational = label.includes('(info)');
      const aa = ratio >= min;
      const aaa = ratio >= Math.max(7, min);

      const tag = informational
        ? '\x1b[90mINFO\x1b[0m'
        : aa
          ? (aaa ? '\x1b[32mPASS\x1b[0m' : '\x1b[32mPASS\x1b[0m')
          : '\x1b[31mFAIL\x1b[0m';

      if (!informational && !aa) failures++;
      else if (!informational && !aaa && min >= 4.5) warnings++;

      const note = informational ? '' : aaa ? ' \x1b[32m(AAA)\x1b[0m' : aa ? ' \x1b[2m(AA)\x1b[0m' : ` \x1b[31mneeds ${min}:1\x1b[0m`;
      console.log(`  ${tag}  ${label.padEnd(30)} ${fmt(ratio)}:1${note}`);
    }
  }
}

console.log(`\n\x1b[1m${failures === 0 ? '\x1b[32mNO AA VIOLATIONS' : `\x1b[31m${failures} AA VIOLATION(S)`}\x1b[0m  (${checks} pairs measured; ${warnings} pass AA but not AAA)`);
process.exit(failures === 0 ? 0 : 1);
