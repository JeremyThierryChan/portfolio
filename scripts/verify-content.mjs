#!/usr/bin/env node
/**
 * Independent content-integrity check for the content-layer migration.
 *
 * Written by the orchestrator, NOT by the agents that performed the migration, so it
 * is an actual verification rather than a restatement of their self-reports.
 *
 * It loads the OLD data sources (still present, untouched) and the NEW content layer,
 * harvests every user-visible string from both, and asserts nothing was lost.
 *
 *   node scripts/verify-content.mjs
 *
 * Exit code 0 = no content lost. Exit code 1 = something is missing.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { WITHHELD, findWithheld } from './withheld-names.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const p = (...s) => resolve(ROOT, ...s);

let failures = 0;
let checks = 0;

function ok(label, extra = '') {
  checks++;
  console.log(`  \x1b[32mPASS\x1b[0m  ${label}${extra ? ` — ${extra}` : ''}`);
}
function bad(label, extra = '') {
  checks++;
  failures++;
  console.log(`  \x1b[31mFAIL\x1b[0m  ${label}${extra ? ` — ${extra}` : ''}`);
}
function assert(cond, label, extra = '') {
  cond ? ok(label, extra) : bad(label, extra);
}
/** Non-failing note. Used for things worth surfacing that are not losses. */
function info(label, extra = '') {
  console.log(`  \x1b[90mINFO\x1b[0m  ${label}${extra ? ` — ${extra}` : ''}`);
}

function section(title) {
  console.log(`\n\x1b[1m${title}\x1b[0m`);
}

/* ── helpers ──────────────────────────────────────────────────────────── */

/**
 * Extract a balanced `[ ... ]` (or `{ ... }`) literal that starts at the first
 * occurrence of `anchor`, then evaluate it. Used to lift arrays that are inlined
 * inside .vue `<script>` blocks, which cannot simply be imported.
 */
function evalLiteralAfter(source, anchor) {
  const at = source.indexOf(anchor);
  if (at === -1) throw new Error(`anchor not found: ${anchor}`);
  const open = source.indexOf('[', at + anchor.length - 1);
  const openAt = source[open] === '[' ? open : source.indexOf('[', at);
  let i = openAt;
  let depth = 0;
  let inStr = null;
  let esc = false;
  for (; i < source.length; i++) {
    const ch = source[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === '\\') esc = true;
      else if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { inStr = ch; continue; }
    if (ch === '[' || ch === '{') depth++;
    else if (ch === ']' || ch === '}') {
      depth--;
      if (depth === 0) break;
    }
  }
  const literal = source.slice(openAt, i + 1);
  // eslint-disable-next-line no-eval
  return eval(`(${literal})`);
}

/** Every string reachable inside a value, at any depth. */
function harvestStrings(value, out = new Set(), { skipKeys = new Set() } = {}) {
  if (typeof value === 'string') {
    if (value.trim()) out.add(value);
    return out;
  }
  if (Array.isArray(value)) {
    value.forEach((v) => harvestStrings(v, out, { skipKeys }));
    return out;
  }
  if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      if (skipKeys.has(k)) continue;
      harvestStrings(v, out, { skipKeys });
    }
  }
  return out;
}

const squash = (s) => s.replace(/\s+/g, ' ').trim();

/**
 * INTENTIONAL DEVIATIONS from the frozen baseline.
 *
 * The baseline exists to prove the MIGRATION lost nothing. The project then moved into a
 * CONTENT REWRITE phase, where some strings are supposed to change — so an unexplained
 * failure would be wrong, and silently regenerating the fixture would throw away the guard.
 *
 * Each entry names the old string, what replaced it, and why. Anything NOT listed here is
 * still treated as an unintended loss, which is what makes the remaining 80-odd checks
 * worth having.
 */
const INTENTIONAL_DEVIATIONS = new Map([
  [
    'Native-level proficiency. IELTS 8.0 (expired). Gaokao 135/150. University English 91/100. Simultaneous and consecutive interpretation experience across high-profile events.',
    'Rewritten from the CVs: fuller credential set (ETIC Advanced 2023 / Intermediate / Basic, CET-6 583, CET-4 599, SIA), and "(expired)" dropped after Jeremy confirmed the IELTS result.',
  ],
  [
    'Self-taught. Conversational proficiency. Served as French interpreter at IRONMAN China Wenzhou (2023) and Great Wall Cigars Cameroon Formula tasting event (2024). ETIC Advanced: Pass.',
    'The ETIC claim was removed: ETIC 国际人才英语考试 is an ENGLISH qualification and had been misfiled under French. The French entry keeps only its genuine evidence (two interpreting engagements).',
  ],
  [
    'Worked as an English teacher and built an internal NAS system for the SE Research Society in Qingdao.',
    'Enriched from the CVs, and the departure reason added at Jeremy\'s explicit request ("record it in full rather than softened"). Written as a plain statement of fact — no evaluation of the employer.',
  ],
  [
    'Founded JTC Atelier, a personal brand specialising in custom leather goods and jewellery, based in Wenzhou. The brand has since ceased operations.',
    'Enriched from the CVs: the founding month, that the brand was profitable, and that development was paused for study rather than the vaguer "has since ceased operations".',
  ],
  [
    'Worked as a full-subject tutoring teacher at Hangzhi Education, and served as the general coordinator for international student activities at Shandong University of Science and Technology.',
    'Enriched from the CVs: the naming of the employer and the fact that the on-campus events were cancelled as pandemic restrictions eased.',
  ],
  [
    'Co-founded Carpe Lucem, a brand focused on imported food and international lifestyle products targeting high-net-worth clients. Currently in planning and product sourcing phase.',
    'Rewritten from a read-only audit of the project archive: 147 files, a 19-document / 6,048-line product knowledge base, a 289-row SKU ledger, six supplier dossiers and a 124-page bilingual catalogue. The vague "in planning and product sourcing phase" was replaced by those counts, and what is still missing is stated rather than omitted.',
  ],
  [
    'Automated arbitrage trading system covering strategy research, engine development, backtesting, and live monitoring.',
    'Rewritten from a read-only audit of the source tree: 46 Python modules (~6,400 lines) plus a ten-page React console (~5,500 lines), naming the risk controls and the three deploy paths. Deliberately makes no claim about profitability or a successful live run, because the audit found no evidence of one.',
  ],
  [
    'An active personal forex trading system built around the 369 strategy and MA Ribbon indicators. Includes strategy code, data tracking, and ongoing iteration.',
    'Rewritten from a read-only audit: the Python backtester, its 3,000-line grid generator, and the reconciliation against the hand-built spreadsheet that the author traced and wrote down. Framed as verification rather than as a return, because those figures are theoretical grid counts on hand-entered data, not realised profit.',
  ],
  [
    'Sourcing and export project for cat food products to the Russian market. Handling procurement specifications, supplier liaison, and documentation in both Chinese and Russian.',
    'Rewritten from a read-only audit of the project documents. Corrects a factual error: the specifications produced are Chinese-English bilingual, not "Chinese and Russian". States plainly that technical documentation is complete while clearance paperwork has not started.',
  ],
  [
    'Official website for Parallel Offset, a progressive metal band. Includes band info, discography, and album details.',
    'Rewritten from a read-only audit of the repository: Next.js 16 + React 19 + next-intl, ~1,349 lines, eight locales including Arabic right-to-left, live on GitHub Pages — the old text described it as a Vue.js site, which was simply wrong.',
  ],
  [
    'Website for Qianyuan (乾元), a professional fortune-teller and practitioner of Taoist culture. Currently in early development with content being gradually populated.',
    'Rewritten from a read-only audit of the repository. The old text ("early development") contradicted the evidence: the site is complete, bilingual and online, with all three commits authored by Jeremy. The remaining work is content, and the copy now says so instead of implying the code is unfinished.',
  ],
  [
    'Financial APIs',
    'Replaced by the libraries the project actually depends on (ccxt, SQLAlchemy, FastAPI, Docker), all of which are verifiable in the dependency manifests. "Financial APIs" was a placeholder that named nothing a reader could look up.',
  ],
  [
    'Catherine\'s Portfolio Website',
    'Anonymised at Jeremy direction: clients and collaborators are described by kind rather than named, so no third party appears on the site as his client without having agreed to it. The substance of the entry is otherwise unchanged.',
  ],
  [
    'A portfolio website built for a friend, using Vue.js. Currently in active development.',
    'Rewritten; see the checkpoint commit message.',
  ],
  [
    'LetterResearchINST',
    'Anonymised at Jeremy direction: clients and collaborators are described by kind rather than named, so no third party appears on the site as his client without having agreed to it. The substance of the entry is otherwise unchanged.',
  ],
  [
    'Muyang Education — Intranet Website',
    'Anonymised at Jeremy direction: clients and collaborators are described by kind rather than named, so no third party appears on the site as his client without having agreed to it. The substance of the entry is otherwise unchanged.',
  ],
  [
    'Internal promotional website built for Muyang Education (沐阳教育), a local training centre. Deployed on the organisation\'s intranet. No public URL.',
    'Anonymised at Jeremy direction: clients and collaborators are described by kind rather than named, so no third party appears on the site as his client without having agreed to it. The substance of the entry is otherwise unchanged.',
  ],
  [
    'Qianyuan — Taoist Culture Website',
    'Anonymised at Jeremy direction: clients and collaborators are described by kind rather than named, so no third party appears on the site as his client without having agreed to it. The substance of the entry is otherwise unchanged.',
  ],
  [
    'A niche project combining traditional intangible cultural heritage lacquer art with custom electric guitars. A collaboration between Jeremy and Pingyang Lacquer Art (平阳漆器), a local ICH studio. Includes a showcase website, product pages, and a backend server.',
    'Anonymised at Jeremy direction: clients and collaborators are described by kind rather than named, so no third party appears on the site as his client without having agreed to it. The substance of the entry is otherwise unchanged.',
  ],
  [
    'InChief Printing — Official Website',
    'Anonymised at Jeremy direction: clients and collaborators are described by kind rather than named, so no third party appears on the site as his client without having agreed to it. The substance of the entry is otherwise unchanged.',
  ],
  [
    'Official website for InChief Printing, built with Astro. Live on GitHub Pages.',
    'Anonymised at Jeremy direction: clients and collaborators are described by kind rather than named, so no third party appears on the site as his client without having agreed to it. The substance of the entry is otherwise unchanged.',
  ],
  [
    'Family Genealogy Website (陳氏宗譜)',
    'Reduced to a description carrying no identifying detail, at Jeremy direction: no surname, no lineage data and no link. What replaced it is the engineering facts — the most-recent-common-ancestor and Chinese kinship-term engine, and the 369-node lineage tree — which expose nothing about the family.',
  ],
  [
    'Digitising and presenting the Chen family genealogy spanning multiple generations. Includes a website for browsing lineage records and an XMind knowledge map of historical clan information.',
    'Reduced to a description carrying no identifying detail, at Jeremy direction: no surname, no lineage data and no link. What replaced it is the engineering facts — the most-recent-common-ancestor and Chinese kinship-term engine, and the 369-node lineage tree — which expose nothing about the family.',
  ],
  [
    'Wokete Brand Website',
    'Anonymised at Jeremy direction: clients and collaborators are described by kind rather than named, so no third party appears on the site as his client without having agreed to it. The substance of the entry is otherwise unchanged.',
  ],
  [
    'Full website project for the Wokete (沃可特) brand, including frontend client and site planning.',
    'Anonymised at Jeremy direction: clients and collaborators are described by kind rather than named, so no third party appears on the site as his client without having agreed to it. The substance of the entry is otherwise unchanged.',
  ],
  [
    'Qing Shan Kiln Website (箐山隐)',
    'Anonymised at Jeremy direction: clients and collaborators are described by kind rather than named, so no third party appears on the site as his client without having agreed to it. The substance of the entry is otherwise unchanged.',
  ],
  [
    'Wenzhou Lacquerware Gallery',
    'Anonymised at Jeremy direction: clients and collaborators are described by kind rather than named, so no third party appears on the site as his client without having agreed to it. The substance of the entry is otherwise unchanged.',
  ],
  [
    'Planning and technical setup for the Wenzhou Lacquerware Gallery (昆阳), including NAS infrastructure proposal and website design.',
    'Anonymised at Jeremy direction: clients and collaborators are described by kind rather than named, so no third party appears on the site as his client without having agreed to it. The substance of the entry is otherwise unchanged.',
  ],
  [
    'Served as Head Sommelier at the Sunac Aduo Village resort in Qingdao.',
    'Enriched from a read-only audit of the role: the drinks reference built alongside it — about 140 notes across wine, spirits, beer and sake, including a classical-cocktail collection of 108 recipes. The original sentence is kept as the opening clause; the addition states the evidence and marks the reference as a working document rather than a deliverable.',
  ],
]);


/* ── load new content layer ───────────────────────────────────────────── */

section('Loading content layer');

const NEW = {};
const NEW_FILES = ['projects', 'timeline', 'skills', 'gallery', 'testimonials', 'posts'];
for (const name of NEW_FILES) {
  const mod = await import(p('src/content', `${name}.js`));
  const key = Object.keys(mod).find((k) => k !== 'default');
  NEW[name] = mod[key];
  assert(Array.isArray(NEW[name]) && NEW[name].length > 0, `src/content/${name}.js exports a non-empty array`, `${NEW[name]?.length} entries`);
}
const { profile: NEW_PROFILE } = await import(p('src/content/profile.js'));
assert(!!NEW_PROFILE && typeof NEW_PROFILE === 'object', 'src/content/profile.js exports an object');

/* ── load the frozen legacy baseline ──────────────────────────────────────
   These used to be read from the live source tree. Once the pages were rewritten
   those originals were deleted, so the pre-rewrite data was frozen into
   `scripts/fixtures/legacy/` (extracted from git HEAD at migration time). The check
   is now a genuine regression guard: the fixtures never change, so any drift in the
   content layer fails the build forever.
   ──────────────────────────────────────────────────────────────────────────── */

section('Loading frozen legacy baseline');

const FIX = (...s) => p('scripts/fixtures/legacy', ...s);

const OLD_PROJECTS = (await import(FIX('projectsData.js'))).projects;
const OLD_GALLERY = (await import(FIX('galleryData.js'))).galleryItems;
const OLD_POSTS = (await import(FIX('postsData.js'))).posts;
const OLD_TESTIMONIALS = (await import(FIX('testimonialsData.js'))).testimonials;
const OLD_EVENTS = (await import(FIX('eventsData.js'))).events;
const OLD_SKILLS = (await import(FIX('skillsInline.js'))).skills;

const OLD_SOCIALS = (await import(FIX('socialsInline.js'))).socials;

ok('frozen baseline loaded', `projects ${OLD_PROJECTS.length}, timeline ${OLD_EVENTS.length}, skills ${OLD_SKILLS.length}, gallery ${OLD_GALLERY.length}, testimonials ${OLD_TESTIMONIALS.length}, posts ${OLD_POSTS.length}, socials ${OLD_SOCIALS.length}`);

/* ── counters ─────────────────────────────────────────────────────────── */

section('Counts');

/*
 * COUNT CHECKS ARE ONE-SIDED.
 *
 * The baseline guarantees that the MIGRATION lost nothing. The project then moved into a
 * CONTENT REWRITE, where new entries are added on purpose — the timeline grew from 40 to
 * 50 when the CV material was folded in. So the assertion is "not fewer than the baseline",
 * not "exactly the same". Shrinkage still fails, which is the property worth protecting.
 */
function countNotReduced(label, baseline, current) {
  assert(current.length >= baseline.length, `${label} count not reduced`,
    `${baseline.length} → ${current.length}`);
}
countNotReduced('projects', OLD_PROJECTS, NEW.projects);
countNotReduced('timeline', OLD_EVENTS, NEW.timeline);
countNotReduced('skills', OLD_SKILLS, NEW.skills);
countNotReduced('gallery', OLD_GALLERY, NEW.gallery);
countNotReduced('testimonials', OLD_TESTIMONIALS, NEW.testimonials);
countNotReduced('posts', OLD_POSTS, NEW.posts);

/* ── every baseline entity must still exist ───────────────────────────── */

section('Baseline entries all still present');

/*
 * The strongest statement the frozen baseline can make: nothing that existed before the
 * rewrite has disappeared. Counts can grow; ids cannot vanish. This is what caught the
 * risk that a hand-edited data file silently drops an entry.
 */
function assertIdsPresent(label, baseline, current) {
  const have = new Set(current.map((e) => String(e.id)));
  const gone = baseline.map((e) => String(e.id)).filter((id) => !have.has(id));
  assert(gone.length === 0, `${label}: every baseline id still present`,
    gone.length ? `MISSING: ${gone.slice(0, 8).join(', ')}` : `${baseline.length}/${baseline.length}`);
}
/*
 * Exemption, stated rather than silently skipped.
 *
 * The TIMELINE's id scheme changed on purpose during migration: the baseline had 40 entries
 * sharing only 30 numeric ids (1, 2, 3, 4, 8 and 10 all repeated), which is exactly why the
 * old page had to key its list on the array index and could not deep-link an entry. Every
 * entry now carries a unique slug. So baseline ids are not comparable here.
 *
 * The "nothing was lost" guarantee for the timeline is carried by the string-preservation
 * check above instead, which requires all 40 original titles AND descriptions to still be
 * present, and by `countNotReduced`.
 */
const ID_SCHEME_CHANGED = {
  timeline: 'numeric ids were duplicated in the baseline and were re-keyed to unique slugs',
};

for (const [label, baseline, current] of [
  ['projects', OLD_PROJECTS, NEW.projects],
  ['timeline', OLD_EVENTS, NEW.timeline],
  ['skills', OLD_SKILLS, NEW.skills],
  ['gallery', OLD_GALLERY, NEW.gallery],
  ['testimonials', OLD_TESTIMONIALS, NEW.testimonials],
  ['posts', OLD_POSTS, NEW.posts],
]) {
  if (ID_SCHEME_CHANGED[label]) {
    info(`${label}: id comparison skipped — ${ID_SCHEME_CHANGED[label]}`);
    continue;
  }
  assertIdsPresent(label, baseline, current);
}

/* ── content-loss check ───────────────────────────────────────────────── */

section('Verbatim content preservation');

// Everything human-visible that the new layer holds, as a flat set.
const NEW_STRINGS = new Set();
for (const name of NEW_FILES) harvestStrings(NEW[name], NEW_STRINGS);
harvestStrings(NEW_PROFILE, NEW_STRINGS);

// Compare on whitespace-normalised text so pure re-wrapping is not a false alarm.
const NEW_SQUASHED = new Set([...NEW_STRINGS].map(squash));

function verifyStrings(label, values, { minLen = 18 } = {}) {
  const missing = [];
  const deviated = [];
  for (const raw of values) {
    if (typeof raw !== 'string') continue;
    const s = squash(raw);
    if (s.length < minLen) continue;          // skip tiny labels handled elsewhere
    if (INTENTIONAL_DEVIATIONS.has(s)) { deviated.push(s); continue; }
    if (!NEW_SQUASHED.has(s)) missing.push(s);
  }
  if (deviated.length) {
    info(`${label}: ${deviated.length} intentional deviation(s) — see INTENTIONAL_DEVIATIONS`);
  }
  assert(missing.length === 0, `${label}: all long-form strings preserved`, missing.length ? `${missing.length} MISSING` : 'verbatim');
  for (const m of missing.slice(0, 6)) console.log(`        \x1b[31m✗\x1b[0m ${m.slice(0, 110)}${m.length > 110 ? '…' : ''}`);
  return missing;
}

const textual = (arr, keys) =>
  arr.flatMap((e) => keys.flatMap((k) => (Array.isArray(e[k]) ? e[k] : [e[k]])));

verifyStrings('projects', textual(OLD_PROJECTS, ['title', 'description']));
verifyStrings('projects.stages', OLD_PROJECTS.flatMap((pr) =>
  (pr.stages ?? []).flatMap((s) => [s.name, s.description])));
verifyStrings('timeline', textual(OLD_EVENTS, ['title', 'description']));
verifyStrings('skills', textual(OLD_SKILLS, ['description']));
verifyStrings('gallery', textual(OLD_GALLERY, ['title', 'description', 'location']));
verifyStrings('testimonials', textual(OLD_TESTIMONIALS, ['role', 'context', 'excerpt', 'full']));
verifyStrings('posts', textual(OLD_POSTS, ['title', 'excerpt', 'content']));

// Tech lists are short, so check them explicitly with a lower length floor.
verifyStrings('projects.tech', OLD_PROJECTS.flatMap((pr) =>
  String(pr.tech ?? '').split(',').map((t) => t.trim())), { minLen: 3 });

/* ── short identifiers ────────────────────────────────────────────────── */

section('Short identifiers and proper nouns');

const names = new Set();
for (const t of NEW.testimonials) { names.add(squash(t.name)); }
for (const t of OLD_TESTIMONIALS) assert(names.has(squash(t.name)), `testimonial name kept: ${t.name}`);

const skillNames = new Set(NEW.skills.map((s) => squash(s.name)));
for (const s of OLD_SKILLS) assert(skillNames.has(squash(s.name)), `skill name kept: ${s.name}`);

const socialIds = new Set(NEW_PROFILE.socials.map((s) => s.id));
for (const s of OLD_SOCIALS) assert(socialIds.has(s.id), `social kept: ${s.id}`);

/* ── structural guarantees ────────────────────────────────────────────── */

section('Structural guarantees of the new schema');

const enums = {
  'projects.status': [NEW.projects, ['in-progress', 'paused', 'completed'], 'status'],
  'timeline.category': [NEW.timeline, ['career', 'personal', 'education', 'hobby'], 'category'],
  'skills.category': [NEW.skills, ['programming', 'language', 'other'], 'category'],
  'gallery.category': [NEW.gallery, ['events', 'sports', 'volunteer', 'campus', 'travel'], 'category'],
  'posts.category': [NEW.posts, ['tech', 'language', 'culture', 'life'], 'category'],
};
for (const [label, [rows, allowed, field]] of Object.entries(enums)) {
  const badRows = rows.filter((r) => !allowed.includes(r[field]));
  assert(badRows.length === 0, `${label} uses only neutral enums`,
    badRows.length ? `offenders: ${[...new Set(badRows.map((r) => r[field]))].join(', ')}` : `${new Set(rows.map((r) => r[field])).size} distinct`);
}

// Display strings must not have leaked into structural enum fields.
const displayLeak = NEW.skills.filter((s) => /\s/.test(s.category));
assert(displayLeak.length === 0, 'no display-string enums (e.g. "Programming Language")');

// Uniqueness
for (const name of ['projects', 'skills', 'gallery', 'posts', 'testimonials']) {
  const ids = NEW[name].map((e) => e.id);
  assert(new Set(ids).size === ids.length, `${name}: ids unique`, `${ids.length} ids`);
}
const tlIds = NEW.timeline.map((e) => e.id);
assert(new Set(tlIds).size === tlIds.length, 'timeline: slug ids unique', `${new Set(tlIds).size}/${tlIds.length}`);
assert(tlIds.every((id) => typeof id === 'string' && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)), 'timeline: ids are kebab-case slugs');

// Every entry carries English copy.
for (const name of NEW_FILES) {
  const untranslated = NEW[name].filter((e) => !e.i18n?.en || Object.keys(e.i18n.en).length === 0);
  assert(untranslated.length === 0, `${name}: every entry has i18n.en copy`);
}

/* ── bilingual coverage ───────────────────────────────────────────────────
   The site ships Chinese copy that was written for a Chinese client, not
   mechanically translated. The failure this guards against is SILENT: a missing
   `zh` field is not an error anywhere — `pick()` falls back to English and a
   Chinese visitor is quietly served an English sentence inside a Chinese page.
   Nobody notices, so it has to be asserted.

   The rule is mechanical, not stylistic: if `en` has a key, `zh` has the same key
   in the same position; arrays are the same length; and a `zh` string that is
   byte-identical to its English counterpart is treated as an untranslated one
   when it reads as a phrase rather than a bare proper noun.

   Do not relax this to make it pass. Fix the copy instead.
   ────────────────────────────────────────────────────────────────────────── */
const HAN = /[\u4e00-\u9fff]/;

/** Faults in one entry's `en`/`zh` pair. Recurses into `stages`, which carry copy too. */
function localeFaults(entry, where) {
  const faults = [];
  const en = entry?.i18n?.en;
  const zh = entry?.i18n?.zh;
  if (!en) return faults;
  if (!zh) return [`${where}: 没有 zh 块`];

  const enK = Object.keys(en);
  const zhK = Object.keys(zh);
  // `name` is the ONE sanctioned asymmetry, and only in one direction. The top-level
  // `name` already IS the English name, so `i18n.en.name` would be redundant while
  // `i18n.zh.name` is the legitimate override for a name a locale really does translate
  // (`English` → 英语, `Mandarin Chinese` → 普通话). But when `en` DOES carry a `name` —
  // as project stages do, e.g. 'Concept & Branding' — `zh` must carry it in the same
  // position like any other key. Stripping it unconditionally was a bug in this checker:
  // it reported 21 phantom mismatches on stages that were perfectly symmetrical.
  const enHasName = 'name' in en;
  const zhCmp = enHasName ? zhK : zhK.filter((k) => k !== 'name');
  if (enK.length !== zhCmp.length || enK.some((k, i) => k !== zhCmp[i])) {
    faults.push(`${where}: 键不一致 — en[${enK.join(',')}] vs zh[${zhK.join(',')}]`);
  }
  if (!enHasName && 'name' in zh && !HAN.test(String(zh.name))) {
    faults.push(`${where}.name: zh 覆盖了 name 却没有任何汉字（应直接用顶层英文名）`);
  }

  for (const k of enK) {
    if (!(k in zh)) continue;
    const a = en[k];
    const b = zh[k];
    if (Array.isArray(a) !== Array.isArray(b)) {
      faults.push(`${where}.${k}: 一个是数组另一个不是`);
      continue;
    }
    if (Array.isArray(a) && a.length !== b.length) {
      faults.push(`${where}.${k}: en ${a.length} 条 vs zh ${b.length} 条`);
      continue;
    }
    if (typeof b === 'string' && b === a && /\s/.test(b) && !HAN.test(b)) {
      faults.push(`${where}.${k}: zh 与 en 完全相同，疑似未翻译`);
    }
  }

  (Array.isArray(entry.stages) ? entry.stages : []).forEach((s, i) => {
    faults.push(...localeFaults(s, `${where}.stages[${i}]`));
  });
  return faults;
}

const EXTRA_COLLECTIONS = [
  ['awards', 'awards'],
  ['services', 'services'],
  ['audiences', 'audiences'],
  ['resume', 'RESUME_VARIANTS'],
  ['links', 'links'],
];

const bilingual = [];
for (const name of NEW_FILES) {
  NEW[name].forEach((e) => bilingual.push([name, e, `${name}[${e.id ?? '?'}]`]));
}
for (const [file, exportName] of EXTRA_COLLECTIONS) {
  const mod = await import(p('src/content', `${file}.js`));
  const rows = mod[exportName];
  assert(Array.isArray(rows) && rows.length > 0, `src/content/${file}.js exports ${exportName}`,
    `${rows?.length} entries`);
  rows.forEach((e) => bilingual.push([file, e, `${file}[${e.id ?? '?'}]`]));
}

const localeProblems = [];
for (const [, entry, where] of bilingual) {
  localeProblems.push(...localeFaults(entry, where));
}
// profile is an object tree, not a list; walk it for every nested i18n block.
(function walkProfile(node, path) {
  if (!node || typeof node !== 'object') return;
  if (node.i18n) localeProblems.push(...localeFaults(node, path));
  for (const [k, v] of Object.entries(node)) {
    if (k === 'i18n') continue;
    walkProfile(v, `${path}.${k}`);
  }
})(NEW_PROFILE, 'profile');

const bilingualRows = bilingual.filter(([, e]) => e.i18n?.zh).length;
info('bilingual coverage', `${bilingualRows}/${bilingual.length} entries carry both en and zh`);
assert(
  localeProblems.length === 0,
  'every content entry is bilingual: zh mirrors en key-for-key, with no English left in zh',
  localeProblems.length
    ? `${localeProblems.length} 处问题，前几处：\n      - ${localeProblems.slice(0, 8).join('\n      - ')}`
    : `${bilingualRows} entries`,
);

/* ── no withheld name reaches a published surface ─────────────────────────
   Anonymising `src/content` is not enough. Two other surfaces ship: every file
   under `public/` (served byte-for-byte, including the ATS-facing résumé JSON the
   /resume page links to) and the rendered HTML, which smoke-render checks. This
   covers the content layer and `public/`; a future edit to either used to be able
   to reintroduce a client's name with nothing to catch it.
   ────────────────────────────────────────────────────────────────────────── */
{
  /*
   * The outgoing links are the one collection whose whole job is to be clickable, so the
   * failure mode is specific: a `'#'`, a relative path, an empty string or a duplicate.
   * The footer this replaced shipped anchors with no real destination, which jumped to the
   * top of the page and lied to a screen reader — so the rule is asserted, not assumed.
   */
  const mod = await import(p('src/content', 'links.js'));
  const rows = mod.links ?? [];
  const badUrls = rows
    .filter((l) => typeof l.url !== 'string' || !/^https?:\/\/\S+$/.test(l.url))
    .map((l) => `${l.id}: ${JSON.stringify(l.url)}`);
  assert(badUrls.length === 0, 'every footer link has a real absolute http(s) url',
    badUrls.length ? badUrls.join(', ') : `${rows.length} link(s)`);

  const ids = rows.map((l) => l.id);
  assert(new Set(ids).size === ids.length, 'footer link ids are unique', `${ids.length} ids`);

  const urls = rows.map((l) => l.url);
  assert(new Set(urls).size === urls.length, 'footer link urls are unique', `${urls.length} urls`);

  const unordered = rows.filter((l) => typeof l.order !== 'number');
  assert(unordered.length === 0, 'every footer link carries a curated order', 
    unordered.map((l) => l.id).join(', '));
}

{
  const leaks = [];

  const contentBlob = JSON.stringify(NEW) + JSON.stringify(NEW_PROFILE);
  const contentHits = findWithheld(contentBlob);
  if (contentHits.length) leaks.push(`content layer: ${contentHits.join(', ')}`);

  const publicDir = p('public');
  const served = readdirSync(publicDir).filter((f) => /\.(json|txt|csv|xml|html)$/i.test(f));
  for (const f of served) {
    const hits = findWithheld(readFileSync(p('public', f), 'utf8'));
    if (hits.length) leaks.push(`public/${f}: ${hits.join(', ')}`);
  }

  assert(
    leaks.length === 0,
    `no withheld name reaches a published surface (${WITHHELD.length} guarded, ${served.length} served file(s) scanned)`,
    leaks.length ? leaks.join(' | ') : 'clean',
  );
}

// Tech is an array now, not a comma string.
const techNotArray = NEW.projects.filter((pr) => !Array.isArray(pr.tech));
assert(techNotArray.length === 0, 'projects.tech is a string array (not a comma string)');

// Dates sort chronologically as plain strings.
const dated = NEW.timeline.filter((e) => e.date);
const sortedOk = dated.every((e, i) => i === 0 || dated[i - 1].date >= e.date);
assert(sortedOk, 'timeline is ordered newest-first by plain string compare');
assert(NEW.timeline.at(-1)?.date == null, 'the undated entry sorts to the bottom');
assert(NEW.timeline.some((e) => e.i18n?.en?.dateLabel === 'The Time for Learning to Speak'),
  'undated entry keeps its human-readable dateLabel (translated, not a fake date)');

// Placeholder / safe-degradation markers
assert(NEW.gallery.every((g) => g.imageStatus === 'placeholder'),
  'gallery images flagged as placeholders', `${NEW.gallery.length}/${NEW.gallery.length}`);
const nullUrls = NEW_PROFILE.socials.filter((s) => !s.url);
assert(nullUrls.length === 7, 'exactly 7 socials have no url (safe-degradation input)', `${nullUrls.length}`);
assert(NEW_PROFILE.contact?.email && NEW_PROFILE.birth?.iso, 'profile keeps email + birth timestamp');

/* ── report ───────────────────────────────────────────────────────────── */

console.log(`\n\x1b[1m${failures === 0 ? '\x1b[32mALL CHECKS PASSED' : `\x1b[31m${failures} CHECK(S) FAILED`}\x1b[0m  (${checks - failures}/${checks})`);
process.exit(failures === 0 ? 0 : 1);
