/**
 * Tests for the visitor-identity axis.
 *
 *   node --test tests/audience.test.mjs
 *
 * Two things are checked here:
 *
 *   1. The pure relevance rules, exhaustively — this decides what a visitor sees, so
 *      an off-by-one in the partition is a visible bug.
 *   2. INTEGRITY OF THE TAGGING. Every `audiences: [...]` value written into the
 *      content layer must name a real audience, and every audience must end up with
 *      something to show. A typo in a tag would silently make content vanish from a
 *      filtered view, which is exactly the kind of bug nobody notices until a client
 *      says "where is the supplier project?".
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  audiences,
  AUDIENCE_ALL,
  AUDIENCE_IDS,
  isAudienceId,
  audiencesOf,
  isRelevant,
  splitByAudience,
  otherCount,
} from '../src/content/audiences.js';

import { content } from '../src/content/index.js';

const REAL_AUDIENCES = audiences.map((a) => a.id);

/** Collections that carry audience tags. */
const TAGGED_COLLECTIONS = ['services', 'projects', 'timeline', 'testimonials'];

/* ── shape of the identity definitions ─────────────────────────────────── */

test('there is an "everything" option and it is the first valid selection', () => {
  assert.equal(AUDIENCE_ALL, 'all');
  assert.equal(AUDIENCE_IDS[0], AUDIENCE_ALL);
  assert.equal(AUDIENCE_IDS.length, REAL_AUDIENCES.length + 1);
});

test('every audience is complete enough to render and to drive a CV', () => {
  for (const a of audiences) {
    assert.ok(a.id && typeof a.id === 'string', 'needs an id');
    assert.match(a.id, /^[a-z][a-z0-9-]*$/, `${a.id} should be kebab-case`);
    assert.ok(Number.isInteger(a.order), `${a.id} needs a numeric order`);
    assert.ok(a.resumeVariant, `${a.id} needs a resumeVariant so /resume can reuse this table`);
    assert.ok(a.i18n?.en?.label, `${a.id} needs an English label`);
    assert.ok(a.i18n?.en?.short, `${a.id} needs a short label for the compact control`);
    assert.ok(a.i18n?.en?.need, `${a.id} needs a "what you need" line — the control asks a question`);
    assert.ok(a.i18n?.en?.accent, `${a.id} needs an accent phrase`);
  }
});

test('audience ids and orders are unique', () => {
  const ids = audiences.map((a) => a.id);
  const orders = audiences.map((a) => a.order);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(new Set(orders).size, orders.length);
});

test('isAudienceId accepts the real ids plus "all", and nothing else', () => {
  for (const id of AUDIENCE_IDS) assert.ok(isAudienceId(id), `${id} should be valid`);
  for (const bad of ['', 'everyone', 'Events', 'event', null, undefined, 0]) {
    assert.ok(!isAudienceId(bad), `${String(bad)} should be rejected`);
  }
});

/* ── the pure relevance rules ──────────────────────────────────────────── */

test('audiencesOf tolerates a missing or malformed field', () => {
  assert.deepEqual(audiencesOf({}), []);
  assert.deepEqual(audiencesOf({ audiences: undefined }), []);
  assert.deepEqual(audiencesOf({ audiences: null }), []);
  assert.deepEqual(audiencesOf({ audiences: 'events' }), [], 'a bare string is not a list');
  assert.deepEqual(audiencesOf(null), []);
  assert.deepEqual(audiencesOf({ audiences: ['trade'] }), ['trade']);
});

test('"all" makes everything relevant', () => {
  assert.ok(isRelevant({ audiences: ['events'] }, AUDIENCE_ALL));
  assert.ok(isRelevant({}, AUDIENCE_ALL));
});

test('an untagged item is relevant to every audience', () => {
  // This is the property that makes tagging additive: existing content keeps showing.
  for (const id of REAL_AUDIENCES) {
    assert.ok(isRelevant({}, id), `untagged should be relevant to ${id}`);
    assert.ok(isRelevant({ audiences: [] }, id), `empty audiences should be relevant to ${id}`);
  }
});

test('a tagged item is relevant only to the audiences it names', () => {
  const item = { audiences: ['trade', 'web'] };
  assert.ok(isRelevant(item, 'trade'));
  assert.ok(isRelevant(item, 'web'));
  assert.ok(!isRelevant(item, 'events'));
  assert.ok(!isRelevant(item, 'institutions'));
});

test('splitByAudience partitions into two disjoint groups covering everything', () => {
  const items = [
    { id: 'a', audiences: ['events'] },
    { id: 'b' },
    { id: 'c', audiences: ['trade'] },
    { id: 'd', audiences: ['events', 'trade'] },
  ];
  const { relevant, other } = splitByAudience(items, 'events');

  assert.deepEqual(relevant.map((i) => i.id), ['a', 'b', 'd'], 'relevant keeps input order');
  assert.deepEqual(other.map((i) => i.id), ['c']);

  const total = relevant.length + other.length;
  assert.equal(total, items.length, 'nothing lost or duplicated');
  const overlap = relevant.filter((i) => other.includes(i));
  assert.equal(overlap.length, 0, 'the two groups must not intersect');
});

test('splitByAudience preserves order rather than re-sorting', () => {
  // The curated `order` on services depends on this: filtering must not shuffle.
  const items = [
    { id: 1, order: 1, audiences: ['web'] },
    { id: 2, order: 2, audiences: ['events'] },
    { id: 3, order: 3, audiences: ['web'] },
  ];
  const { relevant } = splitByAudience(items, 'web');
  assert.deepEqual(relevant.map((i) => i.order), [1, 3], 'order preserved, filtered only');
});

test('selecting "all" collapses nothing', () => {
  const items = [{ audiences: ['events'] }, {}, { audiences: ['trade'] }];
  const { relevant, other } = splitByAudience(items, AUDIENCE_ALL);
  assert.equal(relevant.length, 3);
  assert.equal(other.length, 0);
});

test('splitByAudience survives bad input', () => {
  assert.deepEqual(splitByAudience(undefined, 'events'), { relevant: [], other: [] });
  assert.deepEqual(splitByAudience(null, 'events'), { relevant: [], other: [] });
  assert.deepEqual(splitByAudience([], 'events'), { relevant: [], other: [] });
});

test('otherCount counts only real lists', () => {
  assert.equal(otherCount([1, 2, 3]), 3);
  assert.equal(otherCount([]), 0);
  assert.equal(otherCount(undefined), 0);
});

/* ── integrity of the tagging actually written into the content layer ──── */

test('every audience tag in the content layer names a real audience', () => {
  const bad = [];
  for (const name of TAGGED_COLLECTIONS) {
    for (const item of content[name] ?? []) {
      for (const tag of audiencesOf(item)) {
        if (!REAL_AUDIENCES.includes(tag)) bad.push(`${name}:${item.id} → "${tag}"`);
      }
    }
  }
  assert.deepEqual(bad, [], `unknown audience tags would hide content from every view: ${bad.join(', ')}`);
});

test('no audience filter empties a collection completely', () => {
  // If an identity ends up with zero relevant items, its view looks broken. This is a
  // tagging gap, not a code bug, so it must fail loudly.
  const problems = [];
  for (const id of REAL_AUDIENCES) {
    for (const name of TAGGED_COLLECTIONS) {
      const items = content[name] ?? [];
      if (items.length === 0) continue;
      const { relevant } = splitByAudience(items, id);
      if (relevant.length === 0) problems.push(`${id} sees no ${name}`);
    }
  }
  assert.deepEqual(problems, [], problems.join('; '));
});

test('services are tagged for at least one audience or deliberately general', () => {
  // A service tagged for nobody in particular is fine (general), but a service whose
  // tags are all unknown would be invisible; the previous test catches the typo case.
  for (const s of content.services) {
    const tags = audiencesOf(s);
    for (const tag of tags) assert.ok(REAL_AUDIENCES.includes(tag), `${s.id} → ${tag}`);
  }
});

test('the visitor-identity control would not be pointless: audiences differ', () => {
  // Each audience must produce a genuinely different services view, otherwise the
  // control adds UI without adding value.
  const signatures = REAL_AUDIENCES.map((id) => {
    const { relevant, other } = splitByAudience(content.services, id);
    return `${relevant.map((s) => s.id).join('|')}//${other.map((s) => s.id).join('|')}`;
  });
  assert.equal(new Set(signatures).size, REAL_AUDIENCES.length,
    'every audience must produce a distinct split of the services list');
});
