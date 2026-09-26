#!/usr/bin/env node
/**
 * Emit the JSON Resume exports into `public/`, so they are served as plain static files.
 *
 *   node scripts/build-resume-json.mjs        (runs as part of `npm run build`)
 *
 * Written to `public/` rather than generated in the browser because a recruiter or a
 * tool fetching `/portfolio/resume.json` should get a file, not a JavaScript app.
 *
 * Every variant is exported, and the default variant is duplicated at `resume.json` so the
 * predictable URL works. The site's `/resume` page links straight to it.
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { buildJsonResume, RESUME_VARIANTS, DEFAULT_VARIANT } from '../src/content/resume.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'public');

mkdirSync(OUT, { recursive: true });

let written = 0;

for (const variant of RESUME_VARIANTS) {
  const doc = buildJsonResume(variant.id, 'en');
  const body = `${JSON.stringify(doc, null, 2)}\n`;

  writeFileSync(resolve(OUT, `resume-${variant.id}.json`), body, 'utf8');
  written++;

  if (variant.id === DEFAULT_VARIANT) {
    writeFileSync(resolve(OUT, 'resume.json'), body, 'utf8');
    written++;
  }

  /*
   * Validate before writing. A malformed `resume.json` is worse than none: a consumer parses
   * it silently and reports nothing, so the failure surfaces only when a recruiter's tool
   * shows an empty CV. Cheap assertions here, no silent corruption.
   */
  const problems = [];
  if (!doc.$schema) problems.push('missing $schema');
  if (!doc.basics?.name) problems.push('missing basics.name');
  if (!doc.basics?.label) problems.push('missing basics.label');
  if (!Array.isArray(doc.work)) problems.push('work is not an array');
  if (JSON.stringify(doc).includes('"i18n"')) problems.push('a raw i18n block leaked into the export');
  if (problems.length) {
    console.error(`  FAIL resume-${variant.id}.json: ${problems.join('; ')}`);
    process.exitCode = 1;
    continue;
  }

  const counts = [
    `${doc.work.length} work`,
    `${doc.education.length} education`,
    `${doc.awards.length} awards`,
    `${doc.projects.length} projects`,
  ].join(', ');
  console.log(`  resume-${variant.id}.json  (${counts})`);
}

console.log(`\n${written} file(s) written to public/`);
