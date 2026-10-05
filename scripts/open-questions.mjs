/**
 * List every open question in the content layer.
 *
 * WHY THIS IS A SCRIPT AND NOT A PARAGRAPH IN THE README.
 *
 * `TODO(verify)` marks a claim that needs the owner's confirmation before it can be
 * published as a fact. There are two ways to present those: copy them into the README, or
 * derive them from the markers. This project already proved which one rots — an entire
 * audit went into fixing copy that described data which had moved on: a trust lede naming
 * four authors while five cards rendered, a "three consecutive years (2014–2017)" that
 * spans four, a gallery documented as pointing at picsum URLs months after they were
 * nulled. A hand-maintained question list would be next, and it would rot silently, because
 * nothing can tell that a question has already been answered.
 *
 * So the markers stay the single source of truth and this only reads them. It never fails
 * and never writes: an open question is not a defect, and `npm run verify` must stay green
 * with a dozen of them outstanding.
 *
 * Usage:
 *   node scripts/open-questions.mjs          grouped list, with the count
 *   node scripts/open-questions.mjs --count  just the number, for other tooling
 *
 * The README quotes the count. `verify-content` asserts the two agree, so answering a
 * question and forgetting the README fails the build instead of quietly leaving a stale
 * number in the one document a returning reader trusts first.
 *
 * ATTRIBUTION. A marker has to be reported against the collection item it belongs to, and
 * guessing that from proximity is not good enough — the first version of this file
 * attributed a project's audit block to a neighbouring entry, which would send the reader
 * to the wrong record with full confidence. So attribution is structural: comments and
 * string contents are blanked out, brace depth is tracked, and an item's id is only
 * accepted at entry depth. Anything outside the array is "file level".
 */
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = resolve(ROOT, 'src/content');

/**
 * Blank the CONTENTS of comments and string literals while keeping every line and every
 * brace that sits outside them.
 *
 * Depth tracking has to run on this rather than the raw source: the audit comment blocks
 * are full of English prose, and prose about code contains quotes and braces that would
 * otherwise be counted as structure.
 */
function blankCommentsAndStrings(source) {
  let out = '';
  let state = 'code'; // code | line | block | single | double | template
  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    const next = source[i + 1];

    if (state === 'code') {
      if (ch === '/' && next === '/') { state = 'line'; out += '  '; i++; continue; }
      if (ch === '/' && next === '*') { state = 'block'; out += '  '; i++; continue; }
      if (ch === "'") { state = 'single'; out += ' '; continue; }
      if (ch === '"') { state = 'double'; out += ' '; continue; }
      if (ch === '`') { state = 'template'; out += ' '; continue; }
      out += ch;
      continue;
    }
    if (state === 'line') {
      if (ch === '\n') { state = 'code'; out += '\n'; continue; }
      out += ' ';
      continue;
    }
    if (state === 'block') {
      if (ch === '*' && next === '/') { state = 'code'; out += '  '; i++; continue; }
      out += ch === '\n' ? '\n' : ' ';
      continue;
    }
    // Inside a string: keep newlines so line numbers survive, blank everything else.
    if (ch === '\\') { out += '  '; i++; continue; }
    if ((state === 'single' && ch === "'") || (state === 'double' && ch === '"')
        || (state === 'template' && ch === '`')) { state = 'code'; out += ' '; continue; }
    out += ch === '\n' ? '\n' : ' ';
  }
  return out;
}

/**
 * For each line, the id of the collection entry containing it — or null when the line sits
 * outside the array (file header, trailing notes).
 *
 * Depth counts braces only. The enclosing array uses a bracket, so every entry object opens
 * at depth 1 and its own `id`/`slug` sits at depth 1 as well.
 */
function entryIdsByLine(cleaned, original) {
  // Newlines are preserved verbatim by the blanking pass, so line indices line up.
  const cleanedLines = cleaned.split('\n');
  const rawLines = original.split('\n');
  const owners = [];
  let depth = 0;
  let current = null;

  cleanedLines.forEach((line, index) => {
    owners[index] = depth === 0 ? null : current;

    // Read the id from the RAW line: the blanking pass erases string contents, so a quoted
    // id would compare as empty and only numeric ids would ever be picked up. That is
    // exactly how the first structural version reported every quoted-id collection as
    // "file level" while quietly getting the numeric-id one right.
    if (depth >= 1) {
      const m = (rawLines[index] ?? '').match(/\b(?:id|slug):\s*(?:'([^']+)'|"([^"]+)"|(\d+))/);
      if (m) current = m[1] ?? m[2] ?? m[3];
    }

    for (const ch of line) {
      if (ch === '{') { depth++; if (depth === 1) current = null; }
      else if (ch === '}') depth--;
    }
  });
  return owners;
}

/** Strip a leading comment marker so a continuation line reads as prose. */
const uncomment = (line) => line.replace(/^\s*\/+/, '').replace(/^\s*\*+\/?/, '').trim();

const isComment = (line) => /^\s*(\/\/|\/\*|\*)/.test(line);

/**
 * Every marker in the content layer, grouped by file.
 *
 * Exported rather than only printed: `verify-content` asserts that the count quoted in
 * README.md still matches reality, and it should ask this module rather than re-implement
 * the extraction — two implementations of one rule is how the two of them drift apart.
 */
export function collectOpenQuestions() {
  const files = readdirSync(CONTENT).filter((f) => f.endsWith('.js') && f !== 'index.js').sort();
  const groups = [];
  let skippedHeaderNotes = 0;

  for (const file of files) {
  const source = readFileSync(resolve(CONTENT, file), 'utf8');
  const lines = source.split('\n');
  const owners = entryIdsByLine(blankCommentsAndStrings(source), source);
  const firstExport = lines.findIndex((l) => /^export\s/.test(l));
  const found = [];

  lines.forEach((line, i) => {
    if (!line.includes('TODO(verify)')) return;

    /*
     * A marker in the file HEADER is not an open question. `services.js` opens with a note
     * explaining that its commercial numbers are marked with `TODO(verify)`; that sentence
     * contains the marker text and would otherwise be listed as a question — noise that
     * teaches the reader to skim the list.
     */
    if (firstExport >= 0 && i < firstExport) { skippedHeaderNotes++; return; }

    const openWith = uncomment(line).replace(/^[─\s-]+/, '').replace(/^TODO\(verify\):?\s*/i, '');
    const block = [openWith];
    for (let j = i + 1; j < lines.length && isComment(lines[j]); j++) {
      const text = uncomment(lines[j]);
      if (text) block.push(text);
    }
    const question = block
      .filter((t) => !/^[─-]+$/.test(t))
      .join(' ')
      .replace(/\s+/g, ' ')
      .replace(/^[─\s-]+/, '')
      .replace(/[─\s]+$/, '')
      .trim();
    if (!question) return;

    found.push({ id: owners[i], line: i + 1, question });
  });

  if (found.length) groups.push({ file, found });
}

  const total = groups.reduce((n, g) => n + g.found.length, 0);
  return { groups, total, skippedHeaderNotes };
}

// Printed only when run directly, so importing this from a checker stays silent.
const isCli = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const { groups, total, skippedHeaderNotes } = collectOpenQuestions();

  if (process.argv.includes('--count')) {
    console.log(String(total));
    process.exit(0);
  }

const DIM = '\x1b[2m';
const BOLD = '\x1b[1m';
const OFF = '\x1b[0m';

console.log(`\n${BOLD}Open questions — ${total}${OFF}`);
console.log(`${DIM}A TODO(verify) marks a claim that needs the owner's confirmation before it can be`);
console.log(`published as fact. Not defects: none of these fails a check.${OFF}`);

for (const { file, found } of groups) {
  console.log(`\n${BOLD}${file}${OFF}  ${DIM}(${found.length})${OFF}`);
  for (const { id, line, question } of found) {
    const where = id ? `[${id}]` : '[file level]';
    console.log(`\n  ${DIM}${file}:${line}${OFF}  ${DIM}${where}${OFF}`);
    const words = question.split(' ');
    let row = '    ';
    for (const word of words) {
      if (row.length + word.length > 96) { console.log(row.trimEnd()); row = '    '; }
      row += word + ' ';
    }
    if (row.trim()) console.log(row.trimEnd());
  }
}

console.log(`\n${DIM}Answer one by editing the content file: replace the marker with the confirmed fact,`);
console.log(`or leave an ANSWERED note beside it. The count above and the one in README.md are`);
console.log(`checked against each other by verify-content.${OFF}`);
if (skippedHeaderNotes) {
  console.log(`${DIM}(${skippedHeaderNotes} header note mentioning the marker was skipped — it explains the`);
  console.log(`mechanism rather than asking anything.)${OFF}`);
}
  console.log('');
}
