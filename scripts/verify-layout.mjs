#!/usr/bin/env node
/**
 * Layout contract check — width distribution and the breakpoint budget.
 *
 *   node scripts/verify-layout.mjs
 *
 * WHY THIS EXISTS. The site had thirteen distinct breakpoints, six of them crowded into
 * the 620–900px band, and eight of them doing nothing but changing a card grid's column
 * count. Several were also measuring the wrong thing: they switched on the VIEWPORT while
 * the grid lives inside `.container`, which is capped at `--measure` — so at a 1600px
 * window the grid still only had about 1048px to work with, and a "3 columns at 1080px"
 * rule fired because the window was wide rather than because there was room.
 *
 * The rules that replaced them are `repeat(auto-fit, minmax(min(X, 100%), 1fr))`, which
 * asks the container instead of the window and needs no breakpoint at all. Four properties
 * make that work, and every one of them is asserted here because each fails silently:
 *
 *   1. ONE BREAKPOINT. `max-width: 767.98px` and `min-width: 768px` are the same boundary
 *      expressed for the two directions. Any other value means a second boundary crept in.
 *   2. THE `min(X, 100%)` GUARD. With a bare `Xrem` floor, a 320px phone leaves 280px of
 *      content and the track would still demand 320px — the page would scroll sideways.
 *      The guard caps the floor at the container, so the worst case is one full column.
 *   3. PHONE = ONE COLUMN. Every grid must resolve to a single column at phone widths.
 *   4. CONSTANT ACROSS THE CLOCK. `--measure` differs per style (1160 / 1120 / 1080), so
 *      the container is 968–1048px on a wide window depending on the time of day. A grid
 *      whose minimum is chosen carelessly changes column count at 07:00, 12:00 and 18:00 —
 *      the whole page reflows when the style ticks over. The minimums are chosen to sit
 *      inside the invariant band, and that is asserted rather than trusted.
 *
 * The container model: `.container` is `width: 100%`, `max-width: var(--measure)` and
 * `padding-inline: var(--gutter)` with `box-sizing: border-box`, so its content box is
 * `min(viewport, measure) - 2 * gutter`. Every grid checked here lives in a default-width
 * page; the two `width="read"` pages (TestimonialDetail, NotFoundPage) hold no grid, and
 * this script fails if that ever stops being true.
 *
 * Exit code 0 = the contract holds. Exit code 1 = it does not.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const p = (...s) => resolve(ROOT, ...s);

let failures = 0;
let checks = 0;
const ok = (label, extra = '') => { checks++; console.log(`  \x1b[32mPASS\x1b[0m  ${label}${extra ? ` — ${extra}` : ''}`); };
const bad = (label, extra = '') => { checks++; failures++; console.log(`  \x1b[31mFAIL\x1b[0m  ${label}${extra ? ` — ${extra}` : ''}`); };
const info = (label, extra = '') => console.log(`  \x1b[90mINFO\x1b[0m  ${label}${extra ? ` — ${extra}` : ''}`);
function section(title) { console.log(`\n\x1b[1m${title}\x1b[0m`); }

const REM = 16;

/* ── read the stylesheets ─────────────────────────────────────────────────── */

/**
 * Every source file under `src/` with one of these extensions, as a path relative to ROOT.
 *
 * WHY THIS IS NOT `fs.globSync`. `globSync` arrived in Node 22, and the deploy workflow
 * pins Node 20 — so this checker could not run in CI at all, which is the reason nobody
 * noticed. A ten-line walk works on every version the project supports and costs nothing.
 */
function walk(dir, exts, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, exts, out);
    else if (exts.some((e) => entry.name.endsWith(e))) out.push(relative(ROOT, full));
  }
  return out;
}

const srcFiles = walk(p('src'), ['.vue', '.css'])
  .map((f) => ({ path: f, text: readFileSync(p(f), 'utf8') }));

/* ── 1. one breakpoint ────────────────────────────────────────────────────── */

section('One breakpoint');

const found = new Set();
for (const { text } of srcFiles) {
  for (const m of text.matchAll(/@media\s*\((min|max)-width:\s*([^)]+)\)/g)) {
    if (m[1] === 'prefers-reduced-motion') continue;
    found.add(`${m[1]}-width: ${m[2].trim()}`);
  }
}
const expected = new Set(['max-width: 767.98px', 'min-width: 768px']);
const stray = [...found].filter((b) => !expected.has(b));
if (stray.length === 0) {
  ok('every width media query uses the one boundary', [...found].join(' / '));
} else {
  bad('a second breakpoint has crept in', stray.join(', '));
}

/* ── 2. the container model ───────────────────────────────────────────────── */

section('The container model');

const measures = {};
for (const style of ['a', 'b', 'c']) {
  const text = readFileSync(p(`src/styles/style-${style}.css`), 'utf8');
  measures[style] = Number(text.match(/--measure:\s*(\d+)px/)[1]);
}

const base = readFileSync(p('src/styles/base.css'), 'utf8');
const clampMatch = base.match(/--gutter:\s*clamp\(([\d.]+)rem,\s*([\d.]+)vw,\s*([\d.]+)rem\)/);
if (!clampMatch) {
  bad('--gutter is not the expected clamp()');
} else {
  ok('--gutter is a fluid clamp', `clamp(${clampMatch[1]}rem, ${clampMatch[2]}vw, ${clampMatch[3]}rem)`);
}
const [, gMin, gVw, gMax] = clampMatch.map(Number);
const gutterAt = (vw) => Math.min(Math.max(gMin * REM, (gVw / 100) * vw), gMax * REM);
const contentAt = (vw, style) => Math.min(vw, measures[style]) - 2 * gutterAt(vw);

info('content column per style on a wide window',
  Object.entries(measures).map(([k, v]) => `${k}: ${v - 2 * gutterAt(1920)}px`).join('  '));

/* ── collect every auto-fit grid ──────────────────────────────────────────── */

const spaces = { '3xs': 0.125 };
for (const m of base.matchAll(/--space-([a-z0-9]+):\s*([\d.]+)rem/g)) spaces[m[1]] = Number(m[2]);

const grids = [];
for (const { path, text } of srcFiles) {
  for (const m of text.matchAll(/^([.\w-]+)\s*\{([^}]*)\}/gm)) {
    const sel = m[1];
    const rule = m[2];
    const track = rule.match(/grid-template-columns:\s*repeat\(\s*auto-fit,\s*minmax\(min\(\s*([\d.]+)rem\s*,\s*100%\s*\)\s*,\s*1fr\s*\)\s*\)/);
    const bareTrack = rule.match(/grid-template-columns:\s*repeat\(\s*auto-fit,\s*minmax\(\s*([\d.]+)rem\s*,/);
    if (!track && !bareTrack) continue;

    // The gap lives on the selector's other rule, where the display: grid is declared.
    let gap = null;
    const gapRe = new RegExp(`^${sel.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}\\s*\\{([^}]*)\\}`, 'gm');
    for (const g of text.matchAll(gapRe)) {
      const gm = g[1].match(/gap:\s*var\(--space-([a-z0-9]+)\)/);
      if (gm && spaces[gm[1]] !== undefined) { gap = spaces[gm[1]] * REM; break; }
    }
    grids.push({
      file: path.replace(/^src\//, ''),
      sel,
      min: track ? Number(track[1]) * REM : Number(bareTrack[1]) * REM,
      guarded: Boolean(track),
      gap: gap ?? 16,
    });
  }
}

/* ── 3. every track floor is guarded ──────────────────────────────────────── */

section('Every auto-fit track is guarded');

const unguarded = grids.filter((g) => !g.guarded);
if (unguarded.length === 0) {
  ok('every track floor is written min(Xrem, 100%)', `${grids.length} grids`);
} else {
  bad('an unguarded track floor would overflow a narrow phone',
    unguarded.map((g) => `${g.file} ${g.sel}`).join(', '));
}

/* ── 4. phone: one column ─────────────────────────────────────────────────── */

section('Phone is one column');

const PHONES = [320, 360, 375, 390, 414, 430];
const columnCount = (grid, vw, style) => {
  const w = contentAt(vw, style);
  // min(X, 100%): the floor never exceeds the container, which is the whole point.
  const floor = Math.min(grid.min, w);
  return Math.max(1, Math.floor((w + grid.gap) / (floor + grid.gap)));
};

const multiOnPhone = [];
for (const grid of grids) {
  for (const vw of PHONES) {
    for (const style of ['a', 'b', 'c']) {
      if (columnCount(grid, vw, style) !== 1) {
        multiOnPhone.push(`${grid.sel} @${vw}px/${style} → ${columnCount(grid, vw, style)}`);
      }
    }
  }
}
if (multiOnPhone.length === 0) {
  ok('every grid is a single column across the phone range', PHONES.join(', ') + 'px');
} else {
  bad('a grid stays multi-column on a phone', multiOnPhone.join(', '));
}

/* ── 5. desktop: identical across the clock ───────────────────────────────── */

section('Desktop columns do not change when the style ticks over');

const DESKTOPS = [768, 1024, 1280, 1440, 1920];
const unstable = [];
const table = [];
for (const grid of grids) {
  for (const vw of DESKTOPS) {
    const counts = ['a', 'b', 'c'].map((s) => columnCount(grid, vw, s));
    if (new Set(counts).size > 1) {
      unstable.push(`${grid.sel} @${vw}px → a:${counts[0]} b:${counts[1]} c:${counts[2]}`);
    }
  }
  table.push([grid.sel, ...DESKTOPS.map((vw) => columnCount(grid, vw, 'a'))]);
}
if (unstable.length === 0) {
  ok('every grid holds its column count across all three styles',
    `${grids.length} grids × ${DESKTOPS.length} widths × 3 styles`);
} else {
  bad('a grid reflows when the clock changes the style', unstable.join(', '));
}

info('columns by width (style A)');
for (const [sel, ...cols] of table) {
  console.log(`        ${sel.padEnd(20)} ${DESKTOPS.map((w, i) => `${w}:${cols[i]}`).join('  ')}`);
}

/* ── 6. the two read-width pages hold no grid ─────────────────────────────── */

section('Assumptions this script depends on');

const readPages = srcFiles
  .filter(({ text }) => /<PageShell width="read">/.test(text))
  .map(({ path }) => path.replace(/^src\//, ''));
const readWithGrid = readPages.filter((page) => {
  const text = srcFiles.find((f) => f.path === page)?.text ?? '';
  return /repeat\(\s*auto-fit/.test(text);
});
if (readWithGrid.length === 0) {
  ok('the read-width pages contain no auto-fit grid', `${readPages.length} page(s): ${readPages.join(', ')}`);
} else {
  bad('a read-width page has a grid, so the container model above is wrong for it',
    readWithGrid.join(', '));
}

/* ── report ───────────────────────────────────────────────────────────────── */

console.log(`\n\x1b[1m${failures === 0 ? '\x1b[32mALL CHECKS PASSED' : `\x1b[31m${failures} CHECK(S) FAILED`}\x1b[0m  (${checks - failures}/${checks})`);
process.exit(failures === 0 ? 0 : 1);
