#!/usr/bin/env node
/**
 * i18n integrity check.
 *
 *   node scripts/verify-i18n.mjs        (or: npm run verify:i18n)
 *
 * Three classes of bug, all of which shipped in the pre-rewrite build:
 *
 *   1. A key that components use but the locale does not define — silently renders
 *      the raw key path to the visitor.
 *   2. A dynamically concatenated key (`'projects.status.' + status`) — cannot be
 *      verified statically, and produced a raw key the moment the content layer
 *      gained a value the author had not thought of.
 *   3. An enum value in the content layer with no matching label key.
 *
 * Exit code 0 = clean. Exit code 1 = class 1 or 3 failed.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join, relative, extname } from 'node:path';

import { ENUM_LABEL_NAMESPACE, distinctValues } from '../src/content/index.js';
import { content } from '../src/content/index.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const p = (...s) => resolve(ROOT, ...s);

let failures = 0;
let checks = 0;
const ok = (l, x = '') => { checks++; console.log(`  \x1b[32mPASS\x1b[0m  ${l}${x ? ` — ${x}` : ''}`); };
const bad = (l, x = '') => { checks++; failures++; console.log(`  \x1b[31mFAIL\x1b[0m  ${l}${x ? ` — ${x}` : ''}`); };
const warn = (l, x = '') => { console.log(`  \x1b[33mWARN\x1b[0m  ${l}${x ? ` — ${x}` : ''}`); };
const info = (l, x = '') => { console.log(`  \x1b[90mINFO\x1b[0m  ${l}${x ? ` — ${x}` : ''}`); };
const section = (t) => console.log(`\n\x1b[1m${t}\x1b[0m`);

/* ── flatten a locale object into dotted key paths ─────────────────────── */

function flatten(obj, prefix = '', out = new Set()) {
  for (const [k, v] of Object.entries(obj ?? {})) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) flatten(v, path, out);
    else out.add(path);
  }
  return out;
}

/* ── walk the source tree ──────────────────────────────────────────────── */

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      if (name === 'node_modules' || name === 'dist') continue;
      walk(full, acc);
    } else if (['.vue', '.js', '.mjs'].includes(extname(full))) {
      acc.push(full);
    }
  }
  return acc;
}

// Only app code. These scripts define helpers whose names end in `t` and would
// otherwise be misread as translation calls, and they use no UI strings anyway.
const SOURCES = walk(p('src'));

/* ── load locales ──────────────────────────────────────────────────────── */

const LOCALE_CODES = ['en', 'zh', 'fr', 'de', 'es', 'it'];
const LOCALES = {};
for (const code of LOCALE_CODES) {
  LOCALES[code] = flatten((await import(p('src/locales', `${code}.js`))).default);
}

const EN = LOCALES.en;

section('Locale files');
ok('reference locale loaded', `${EN.size} keys`);
for (const code of LOCALE_CODES.slice(1)) {
  const missing = [...EN].filter((k) => !LOCALES[code].has(k));
  const extra = [...LOCALES[code]].filter((k) => !EN.has(k));
  if (missing.length === 0 && extra.length === 0) {
    ok(`${code}: key set identical to en`, `${LOCALES[code].size} keys`);
  } else {
    info(`${code}: ${missing.length} key(s) fall back to English`,
      extra.length ? `+ ${extra.length} stale key(s)` : '');
  }
}

/* ── 1. keys used in source but missing from the locale ────────────────── */

section('Keys used by source code');

const used = new Map();       // key -> Set(files)
const dynamic = [];           // [file, expression]

// A bare /t\(/ also matches `mount(`, `at(`, `format(` — so require that the call
// is not preceded by an identifier character or a dot. `$` is deliberately
// ALLOWED, because Vue templates call `$t(...)`.
const T_CALL = String.raw`(?<![A-Za-z0-9_.])t\(`;

const STATIC_PATTERNS = [
  new RegExp(`${T_CALL}\\s*'([^']+)'`, 'g'),
  new RegExp(`${T_CALL}\\s*"([^"]+)"`, 'g'),
  /labelKey:\s*'([^']+)'/g,
  /labelKey:\s*"([^"]+)"/g,
  /titleKey:\s*'([^']+)'/g,
  /ledeKey:\s*'([^']+)'/g,
  /overlineKey:\s*'([^']+)'/g,
  // `descKey` carries a real key path on every route and was not scanned, so a typo in one
  // would have shown up only as a page whose meta description was the key itself.
  /descKey:\s*'([^']+)'/g,
];
const DYNAMIC_PATTERNS = [
  new RegExp(`${T_CALL}\\s*[^)]*\\$\\{`, 'g'),
  new RegExp(`${T_CALL}\\s*(?:'[^']*'|"[^"]*")\\s*\\+`, 'g'),
  new RegExp(`${T_CALL}\\s*\`[^\`]*\\$\\{`, 'g'),
];

for (const file of SOURCES) {
  if (file.includes('/locales/')) continue;
  const text = readFileSync(file, 'utf8');
  const rel = relative(ROOT, file);

  for (const re of STATIC_PATTERNS) {
    for (const m of text.matchAll(re)) {
      if (!used.has(m[1])) used.set(m[1], new Set());
      used.get(m[1]).add(rel);
    }
  }
  for (const re of DYNAMIC_PATTERNS) {
    for (const m of text.matchAll(re)) {
      const line = text.slice(0, m.index).split('\n').length;
      dynamic.push([`${rel}:${line}`, m[0].trim().slice(0, 70)]);
    }
  }
}

const missingKeys = [...used.keys()].filter((k) => !EN.has(k)).sort();
if (missingKeys.length === 0) {
  ok('every statically referenced key exists in en', `${used.size} distinct keys`);
} else {
  bad(`${missingKeys.length} referenced key(s) missing from en`);
  for (const k of missingKeys) {
    console.log(`        \x1b[31m✗\x1b[0m ${k}   (used by ${[...used.get(k)].join(', ')})`);
  }
}

if (dynamic.length === 0) {
  ok('no dynamically concatenated i18n keys');
} else {
  warn(`${dynamic.length} dynamically built key(s) — cannot be verified statically`);
  for (const [where, expr] of dynamic.slice(0, 12)) console.log(`        ${where}  ${expr}`);
  console.log('        Prefer enumLabelKey(collection, field, value) from @/content.');
}

/* ── 2. every content enum value has a label ───────────────────────────── */

section('Content enum labels');

const ENUM_FIELDS = {
  projects: ['status'],
  timeline: ['category'],
  skills: ['category', 'usage'],
  gallery: ['category'],
  posts: ['category'],
  services: ['domain'],
  awards: ['kind'],
};

let enumChecked = 0;
let enumMissing = 0;
for (const [collection, fields] of Object.entries(ENUM_FIELDS)) {
  const list = content[collection];
  const ns = ENUM_LABEL_NAMESPACE[collection];
  for (const field of fields) {
    for (const value of distinctValues(list, field)) {
      const key = `${ns}.${field}.${value}`;
      enumChecked++;
      if (!EN.has(key)) {
        enumMissing++;
        console.log(`        \x1b[31m✗\x1b[0m ${key}   (${collection}.${field} = ${value})`);
      }
    }
  }
}
if (enumMissing === 0) {
  ok('every content enum value has a label key',
    `${enumChecked} values across ${Object.keys(ENUM_FIELDS).length} collections`);
} else {
  bad(`${enumMissing} enum value(s) without a label key`);
}

/* ── 2b. mirrored enum namespaces ──────────────────────────────────────── */

section('Mirrored enum namespaces');

/*
 * `skills.usageShort.*` mirrors `skills.usage.*` — the same three values, phrased short for
 * a chip. The lookup goes through `enumLabelKey('skills', 'usageShort', value)`, which no
 * static scan can see, so a missing entry would render a raw key path at runtime. This
 * asserts the mirror explicitly.
 */
{
  const usageValues = distinctValues(content.skills, 'usage');
  const missing = usageValues.filter((v) => !EN.has(`skills.usageShort.${v}`));
  if (missing.length === 0) {
    ok('skills.usageShort covers every skills.usage value', `${usageValues.length} values`);
  } else {
    bad('skills.usageShort is missing values', missing.join(', '));
  }
}

/* ── 3. interpolation placeholders must match across locales ───────────── */

section('Interpolation placeholders');

const placeholders = (s) => [...String(s).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',');

function readRaw(code) {
  // Re-import raw to read values, not just key names.
  return import(p('src/locales', `${code}.js`)).then((m) => m.default);
}
const RAW = {};
for (const code of LOCALE_CODES) RAW[code] = await readRaw(code);

function getPath(obj, path) {
  return path.split('.').reduce((acc, k) => (acc == null ? acc : acc[k]), obj);
}

let phMismatch = 0;
let phChecked = 0;
for (const key of EN) {
  const enVal = getPath(RAW.en, key);
  const enPh = placeholders(enVal);
  if (!enPh) continue;
  for (const code of LOCALE_CODES.slice(1)) {
    const other = getPath(RAW[code], key);
    if (typeof other !== 'string') continue;      // not translated yet; falls back
    phChecked++;
    if (placeholders(other) !== enPh) {
      phMismatch++;
      if (phMismatch <= 8) {
        console.log(`        \x1b[31m✗\x1b[0m ${code}:${key}  en has {${enPh}}, ${code} has {${placeholders(other)}}`);
      }
    }
  }
}
if (phMismatch === 0) {
  ok('translated strings keep the same placeholders as en', `${phChecked} compared`);
} else {
  bad(`${phMismatch} placeholder mismatch(es)`);
}

/* ── 4. unused keys (informational) ───────────────────────────────────── */

section('Unused keys');

const enumKeys = new Set();
for (const [collection, fields] of Object.entries(ENUM_FIELDS)) {
  const ns = ENUM_LABEL_NAMESPACE[collection];
  for (const field of fields) {
    for (const value of distinctValues(content[collection], field)) enumKeys.add(`${ns}.${field}.${value}`);
  }
}
/*
 * `skills.usageShort.*` mirrors `skills.usage.*`, is read through `enumLabelKey`, and so is
 * used without any static reference naming it. ENUM_FIELDS cannot express it — there is no
 * `usageShort` field in the content to enumerate — so it is added here. Without this the
 * report flags all three as unused, which is the opposite of the truth and is exactly why
 * an unused-key report nobody trusts is worse than none.
 */
for (const value of distinctValues(content.skills, 'usage')) enumKeys.add(`skills.usageShort.${value}`);

// Keys that only ever appear via a template literal or as a namespace root.
const dynamicUsable = [...EN].filter((k) => [...used.keys()].some((u) => u.startsWith(`${k}.`)));

const unused = [...EN].filter((k) =>
  !used.has(k) &&
  !enumKeys.has(k) &&
  !dynamicUsable.includes(k),
).sort();

if (unused.length === 0) {
  ok('no unused keys');
} else {
  info(`${unused.length} key(s) not referenced statically`);
  for (const k of unused.slice(0, 25)) console.log(`        ${k}`);
  if (unused.length > 25) console.log(`        … and ${unused.length - 25} more`);
}

/* ── report ────────────────────────────────────────────────────────────── */

console.log(`\n\x1b[1m${failures === 0 ? '\x1b[32mALL CHECKS PASSED' : `\x1b[31m${failures} CHECK(S) FAILED`}\x1b[0m  (${checks - failures}/${checks})`);
process.exit(failures === 0 ? 0 : 1);
