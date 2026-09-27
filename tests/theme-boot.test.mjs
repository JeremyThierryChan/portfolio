/**
 * Tests for the pre-paint theme bootstrap in index.html.
 *
 *   node --test tests/theme-boot.test.mjs
 *
 * The bootstrap cannot import the theme modules — it has to run before the module
 * graph loads — so its constants are duplicated. This file removes the risk that
 * creates, in two ways:
 *
 *   1. BEHAVIOURAL — the real <script> text from index.html is executed against a
 *      stub DOM with a faked clock and a faked localStorage, and the resulting
 *      data-style / data-mode attributes are asserted. Not a reimplementation.
 *   2. CONSISTENCY — the duplicated constants are parsed back out and compared with
 *      schedule.js, theme.js and the token files, so drift fails the build.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { SCHEDULE, STYLES, STYLE_IDS, DEFAULT_STYLE, MINUTES_PER_DAY } from '../src/theme/schedule.js';
import {
  STORAGE_STYLE,
  STORAGE_STYLE_UNTIL,
  STORAGE_MODE,
  LEGACY_STORAGE_MODE,
  STYLE_AUTO,
} from '../src/theme/theme.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(resolve(ROOT, p), 'utf8');

const HTML = read('index.html');

/** The inline bootstrap is the only attribute-less <script> in index.html. */
const BOOT = HTML.match(/<script>([\s\S]*?)<\/script>/)[1];

/* ── harness: run the real bootstrap against stubs ─────────────────────── */

/**
 * @param {{minutes:number, stored?:Record<string,string>, throws?:boolean}} opts
 * @returns {{attrs:Record<string,string>, store:Record<string,string>, className:string}}
 */
function runBoot({ minutes, stored = {}, throws = false }) {
  const attrs = {};
  const store = { ...stored };
  const state = { className: '' };

  const documentElement = {
    setAttribute: (k, v) => { attrs[k] = v; },
    getAttribute: (k) => attrs[k] ?? null,
    set className(v) { state.className = v; },
    get className() { return state.className; },
  };

  const localStorage = {
    getItem: (k) => {
      if (throws) throw new Error('localStorage blocked');
      return k in store ? store[k] : null;
    },
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
  };

  // A Date whose zero-arg construction lands on the requested minute.
  class FakeDate extends Date {
    constructor(...args) {
      if (args.length === 0) super(2026, 0, 15, Math.floor(minutes / 60), minutes % 60, 0);
      else super(...args);
    }
  }

  // eslint-disable-next-line no-new-func
  new Function('document', 'localStorage', 'Date', 'window', BOOT)(
    { documentElement },
    localStorage,
    FakeDate,
    { matchMedia: () => ({ matches: false }) },
  );

  return { attrs, store, className: state.className };
}

/* ── 1. behavioural ────────────────────────────────────────────────────── */

test('the bootstrap sets both axis attributes on <html>', () => {
  const { attrs } = runBoot({ minutes: 9 * 60 });
  assert.equal(attrs['data-style'], 'a');
  assert.equal(attrs['data-mode'], 'light');
});

test('the bootstrap applies the same windows as the brief', () => {
  const cases = [
    [0, 'b', 'dark'], [3 * 60, 'b', 'dark'], [419, 'b', 'dark'],
    [420, 'a', 'light'], [9 * 60, 'a', 'light'], [719, 'a', 'light'],
    [720, 'c', 'light'], [15 * 60, 'c', 'light'], [1079, 'c', 'light'],
    [1080, 'b', 'dark'], [21 * 60, 'b', 'dark'], [1439, 'b', 'dark'],
  ];
  for (const [minutes, style, mode] of cases) {
    const { attrs } = runBoot({ minutes });
    assert.equal(attrs['data-style'], style, `minute ${minutes} style`);
    assert.equal(attrs['data-mode'], mode, `minute ${minutes} mode`);
  }
});

test('every minute of the day yields a valid style/mode pair', () => {
  for (let m = 0; m < MINUTES_PER_DAY; m++) {
    const { attrs } = runBoot({ minutes: m });
    assert.ok(STYLE_IDS.includes(attrs['data-style']), `minute ${m} → bad style ${attrs['data-style']}`);
    assert.ok(['light', 'dark'].includes(attrs['data-mode']), `minute ${m} → bad mode ${attrs['data-mode']}`);
  }
});

test('the bootstrap agrees with schedule.js for every minute', () => {
  // The strongest check: the inline copy and the module must never disagree.
  for (let m = 0; m < MINUTES_PER_DAY; m++) {
    const { attrs } = runBoot({ minutes: m });
    const expected = SCHEDULE.find((s) => {
      const mm = ((m % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
      return s.start < s.end ? mm >= s.start && mm < s.end : mm >= s.start || mm < s.end;
    })?.style;
    assert.equal(attrs['data-style'], expected, `minute ${m} disagrees with schedule.js`);
  }
});

test('a stored style overrides the clock', () => {
  const { attrs } = runBoot({ minutes: 9 * 60, stored: { [STORAGE_STYLE]: 'c' } });
  assert.equal(attrs['data-style'], 'c', 'pinned style should win');
  assert.equal(attrs['data-mode'], 'light', "mode follows the pinned style's intent");
});

/*
 * The two kinds of pin, from the bootstrap's side. The bootstrap runs before first paint
 * and cannot import theme.js, so these rules exist twice; testing only the module would
 * leave the copy that actually decides the first frame unverified.
 */
const FAKE_NOW = new Date(2026, 0, 15, 9, 0, 0).getTime();

test('a time-boxed pin holds the style while its window is open', () => {
  const { attrs } = runBoot({
    minutes: 9 * 60,
    stored: { [STORAGE_STYLE_UNTIL]: `c@${FAKE_NOW + 60 * 60 * 1000}` },
  });
  assert.equal(attrs['data-style'], 'c', 'a live time-boxed pin should hold');
});

test('a lapsed time-boxed pin is ignored, and removed before first paint', () => {
  const { attrs, store } = runBoot({
    minutes: 9 * 60,
    stored: { [STORAGE_STYLE_UNTIL]: `c@${FAKE_NOW - 1000}` },
  });
  assert.equal(attrs['data-style'], 'a', 'at 09:00 the clock asks for A, not the lapsed pin');
  assert.ok(!(STORAGE_STYLE_UNTIL in store), 'the dead entry must not survive the bootstrap');
});

test('a permanent pin outranks a time-boxed one in the bootstrap too', () => {
  const { attrs } = runBoot({
    minutes: 9 * 60,
    stored: { [STORAGE_STYLE]: 'b', [STORAGE_STYLE_UNTIL]: `c@${FAKE_NOW + 60 * 60 * 1000}` },
  });
  assert.equal(attrs['data-style'], 'b', 'the permanent choice wins');
});

test('a malformed time-boxed pin is discarded by the bootstrap', () => {
  for (const junk of ['c', '@1', 'zzz@9999999999999', 'c@nope']) {
    const { attrs } = runBoot({ minutes: 9 * 60, stored: { [STORAGE_STYLE_UNTIL]: junk } });
    assert.equal(attrs['data-style'], 'a', `junk "${junk}" must fall through to the clock`);
  }
});

test('a stored mode overrides the style intent', () => {
  const { attrs } = runBoot({ minutes: 21 * 60, stored: { [STORAGE_MODE]: 'light' } });
  assert.equal(attrs['data-style'], 'b');
  assert.equal(attrs['data-mode'], 'light', 'visitor-pinned light must survive the dark native style');
});

test('the full 3x2 matrix is reachable through storage', () => {
  const seen = new Set();
  for (const style of STYLE_IDS) {
    for (const mode of ['light', 'dark']) {
      const { attrs } = runBoot({
        minutes: 9 * 60,
        stored: { [STORAGE_STYLE]: style, [STORAGE_MODE]: mode },
      });
      assert.equal(attrs['data-style'], style);
      assert.equal(attrs['data-mode'], mode);
      seen.add(`${attrs['data-style']}/${attrs['data-mode']}`);
    }
  }
  assert.equal(seen.size, 6, 'all six combinations must be reachable');
});

test('the legacy single "theme" key is migrated, then removed', () => {
  const { attrs, store } = runBoot({
    minutes: 9 * 60,
    stored: { [LEGACY_STORAGE_MODE]: 'dark' },
  });
  assert.equal(attrs['data-mode'], 'dark', 'legacy preference is honoured once');
  assert.equal(store[STORAGE_MODE], 'dark', 'and written to the new key');
  assert.ok(!(LEGACY_STORAGE_MODE in store), 'the old key is cleaned up');
});

test('garbage stored values are ignored, not trusted', () => {
  const style = runBoot({ minutes: 9 * 60, stored: { [STORAGE_STYLE]: 'zzz' } });
  assert.equal(style.attrs['data-style'], 'a', 'unknown style falls back to the clock');

  assert.equal(runBoot({ minutes: 9 * 60, stored: { [STORAGE_STYLE]: STYLE_AUTO } }).attrs['data-style'], 'a');

  const mode = runBoot({ minutes: 9 * 60, stored: { [STORAGE_MODE]: 'purple' } });
  assert.equal(mode.attrs['data-mode'], 'light', 'unknown mode falls back to style intent');

  const empty = runBoot({ minutes: 9 * 60, stored: { [STORAGE_STYLE]: '', [STORAGE_MODE]: '' } });
  assert.ok(STYLE_IDS.includes(empty.attrs['data-style']));
  assert.ok(['light', 'dark'].includes(empty.attrs['data-mode']));
});

test('a blocked localStorage still paints a readable theme', () => {
  const { attrs } = runBoot({ minutes: 9 * 60, throws: true });
  assert.equal(attrs['data-style'], 'a');
  assert.equal(attrs['data-mode'], 'light');
});

test('the bootstrap also writes plain class names for CSS-only consumers', () => {
  const { className } = runBoot({ minutes: 15 * 60 });
  assert.match(className, /theme-c/);
  assert.match(className, /mode-light/);
});

/* ── 2. consistency with the modules ───────────────────────────────────── */

test('duplicated window boundaries match SCHEDULE exactly', () => {
  const raw = BOOT.match(/var WINDOWS = (\[\[[\s\S]*?\]\]);/)[1];
  const inline = JSON.parse(raw.replace(/'/g, '"'));
  const expected = SCHEDULE.map((s) => [s.start, s.end, s.style]);
  assert.deepEqual(inline, expected, 'WINDOWS must equal SCHEDULE, in the same order');
});

test('duplicated preferred modes match STYLES', () => {
  const raw = BOOT.match(/var PREFERRED_MODE = (\{[\s\S]*?\});/)[1];
  const inline = JSON.parse(raw.replace(/(\w+):/g, '"$1":').replace(/'/g, '"'));
  for (const id of STYLE_IDS) {
    assert.equal(inline[id], STYLES[id].preferredMode, `preferred mode for ${id}`);
  }
  assert.deepEqual(Object.keys(inline).sort(), [...STYLE_IDS].sort(), 'no extra or missing styles');
});

test('duplicated style ids match STYLE_IDS', () => {
  const raw = BOOT.match(/var STYLE_IDS = (\[[^\]]*\]);/)[1];
  assert.deepEqual(JSON.parse(raw.replace(/'/g, '"')), STYLE_IDS);
});

test('duplicated storage keys match theme.js', () => {
  assert.ok(BOOT.includes(`KEY_STYLE = '${STORAGE_STYLE}'`), 'style key');
  assert.ok(BOOT.includes(`KEY_MODE = '${STORAGE_MODE}'`), 'mode key');
  assert.ok(BOOT.includes(`KEY_LEGACY = '${LEGACY_STORAGE_MODE}'`), 'legacy key');
  assert.ok(BOOT.includes(`KEY_STYLE_UNTIL = '${STORAGE_STYLE_UNTIL}'`), 'time-boxed style key');
});

test('the bootstrap default style matches DEFAULT_STYLE', () => {
  assert.ok(BOOT.includes(`style = '${DEFAULT_STYLE}'`), `bootstrap default should be ${DEFAULT_STYLE}`);
});

test('the boot fallback matches the fallback theme', () => {
  // The fallback moved out of index.css into its own file, which is imported FIRST and
  // written as `:where(:root)` so it cannot outrank a style block. If the bootstrap script
  // cannot run at all, it must land on the same values that stylesheet provides.
  const fallback = read('src/styles/fallback.css').match(/:where\(:root\)\s*\{([\s\S]*?)\n\}/)[1];
  assert.match(fallback, /--bg:\s*#fbfbfa/, 'fallback.css background must be style A light');

  assert.ok(BOOT.includes("style = 'a'"), 'boot failure falls back to style a');
  assert.ok(BOOT.includes("mode = 'light'"), 'boot failure falls back to light');

  // And the fallback must stay out of the bundle-order fight: imported first, zero specificity.
  const index = read('src/styles/index.css');
  const imports = [...index.matchAll(/@import\s+'\.\/([\w-]+\.css)'/g)].map((m) => m[1]);
  assert.equal(imports[0], 'fallback.css', 'fallback.css must be the FIRST import');
  assert.match(read('src/styles/fallback.css'), /:where\(:root\)/,
    'the fallback must have zero specificity or it can override a style block');
});

/* ── 3. the critical colours must not drift from the tokens ────────────── */

function tokenValue(cssFile, selector, property) {
  const css = read(cssFile);
  const at = css.indexOf(selector);
  assert.notEqual(at, -1, `${selector} not found in ${cssFile}`);
  const block = css.slice(at, css.indexOf('}', at));
  const m = block.match(new RegExp(`${property}:\\s*([^;]+);`));
  assert.ok(m, `${property} not found in ${selector} of ${cssFile}`);
  return m[1].trim();
}

test('the inline critical backgrounds equal the --bg tokens', () => {
  for (const style of STYLE_IDS) {
    for (const mode of ['light', 'dark']) {
      const expected = tokenValue(`src/styles/style-${style}.css`, `[data-style="${style}"][data-mode="${mode}"]`, '--bg');
      const sel = `html[data-style="${style}"][data-mode="${mode}"]`;
      const at = HTML.indexOf(sel);
      assert.notEqual(at, -1, `critical CSS missing ${sel}`);
      const block = HTML.slice(at, HTML.indexOf('}', at));
      const m = block.match(/background-color:\s*([^;]+);/);
      assert.ok(m, `no background-color in ${sel}`);
      assert.equal(m[1].trim(), expected,
        `${style}/${mode}: index.html hard-codes ${m[1].trim()} but the token is ${expected}`);
    }
  }
});
