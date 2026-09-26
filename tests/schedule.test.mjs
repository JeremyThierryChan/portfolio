/**
 * Boundary tests for the time-of-day styling schedule.
 *
 *   node --test tests/
 *
 * The schedule decides what a visitor sees, so the edges are the whole point:
 * 12:00:00 sharp must already be the afternoon style, and the evening slot has to
 * wrap past midnight without leaving a gap or overlapping its neighbours.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  STYLES,
  STYLE_IDS,
  SCHEDULE,
  DEFAULT_STYLE,
  MINUTES_PER_DAY,
  wrapMinutes,
  minutesOf,
  slotContains,
  slotForMinutes,
  styleForMinutes,
  styleForDate,
  formatMinutes,
  nextChangeAfter,
  msUntilNextChange,
  scheduleSummary,
} from '../src/theme/schedule.js';

/** A fixed local date so these tests never depend on when they are run. */
const at = (h, m = 0, s = 0) => new Date(2026, 0, 15, h, m, s);
const hhmm = (d) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

/* ── the spec, stated as a table ───────────────────────────────────────── */

test('the three windows map to the styles the brief asked for', () => {
  const expected = [
    ['00:00', 'b'], ['03:00', 'b'], ['06:59', 'b'],
    ['07:00', 'a'], ['09:30', 'a'], ['11:59', 'a'],
    ['12:00', 'c'], ['15:00', 'c'], ['17:59', 'c'],
    ['18:00', 'b'], ['21:00', 'b'], ['23:59', 'b'],
  ];
  for (const [time, style] of expected) {
    const [h, m] = time.split(':').map(Number);
    assert.equal(styleForDate(at(h, m)), style, `${time} should be style ${style}`);
  }
});

test('boundaries are half-open, so a new window owns its own start minute', () => {
  assert.equal(styleForDate(at(6, 59, 59)), 'b', '06:59:59 is still night');
  assert.equal(styleForDate(at(7, 0, 0)), 'a', '07:00:00 is already morning');
  assert.equal(styleForDate(at(11, 59, 59)), 'a', '11:59:59 is still morning');
  assert.equal(styleForDate(at(12, 0, 0)), 'c', '12:00:00 is already afternoon');
  assert.equal(styleForDate(at(17, 59, 59)), 'c', '17:59:59 is still afternoon');
  assert.equal(styleForDate(at(18, 0, 0)), 'b', '18:00:00 is already evening');
  assert.equal(styleForDate(at(23, 59, 59)), 'b');
  assert.equal(styleForDate(at(0, 0, 0)), 'b');
});

/* ── coverage: no gaps, no overlaps ────────────────────────────────────── */

test('every minute of the day lands in exactly one slot', () => {
  for (let m = 0; m < MINUTES_PER_DAY; m++) {
    const matches = SCHEDULE.filter((slot) => slotContains(slot, m));
    assert.equal(matches.length, 1,
      `minute ${m} (${formatMinutes(m)}) matched ${matches.length} slots, expected exactly 1`);
  }
});

test('every minute resolves to a known style', () => {
  for (let m = 0; m < MINUTES_PER_DAY; m++) {
    assert.ok(STYLE_IDS.includes(styleForMinutes(m)), `minute ${m} produced an unknown style`);
  }
});

test('the schedule describes 24 hours with no gap and no overlap', () => {
  const total = SCHEDULE.reduce((sum, s) => {
    const span = s.start < s.end ? s.end - s.start : MINUTES_PER_DAY - s.start + s.end;
    return sum + span;
  }, 0);
  assert.equal(total, MINUTES_PER_DAY, 'slot spans must add up to exactly 1440 minutes');
});

test('each style is reachable, and the default is one of them', () => {
  const seen = new Set();
  for (let m = 0; m < MINUTES_PER_DAY; m++) seen.add(styleForMinutes(m));
  assert.deepEqual([...seen].sort(), ['a', 'b', 'c'], 'all three styles are used');
  assert.ok(STYLE_IDS.includes(DEFAULT_STYLE));
});

/* ── wrap handling ─────────────────────────────────────────────────────── */

test('wrapMinutes normalises negatives and overflow', () => {
  assert.equal(wrapMinutes(0), 0);
  assert.equal(wrapMinutes(1439), 1439);
  assert.equal(wrapMinutes(1440), 0);
  assert.equal(wrapMinutes(-1), 1439);
  assert.equal(wrapMinutes(-60), 1380);
  assert.equal(wrapMinutes(1500), 60);
});

test('the night slot wraps midnight in both directions', () => {
  const night = SCHEDULE.find((s) => s.style === 'b');
  assert.ok(night.start > night.end, 'the night slot is expected to wrap');
  assert.ok(slotContains(night, 23 * 60), 'night covers 23:00');
  assert.ok(slotContains(night, 0), 'night covers 00:00');
  assert.ok(slotContains(night, 6 * 60 + 59), 'night covers 06:59');
  assert.ok(!slotContains(night, 7 * 60), 'night does not cover 07:00');
});

/* ── next change ───────────────────────────────────────────────────────── */

test('nextChangeAfter finds the upcoming boundary within the same day', () => {
  assert.equal(hhmm(nextChangeAfter(at(6, 0))), '07:00', '06:00 → morning starts at 07:00');
  assert.equal(hhmm(nextChangeAfter(at(7, 0))), '12:00', '07:00 → afternoon starts at 12:00');
  assert.equal(hhmm(nextChangeAfter(at(10, 0))), '12:00');
  assert.equal(hhmm(nextChangeAfter(at(12, 0))), '18:00');
  assert.equal(hhmm(nextChangeAfter(at(15, 0))), '18:00');
});

test('nextChangeAfter rolls over midnight from the evening', () => {
  const next = nextChangeAfter(at(20, 0));
  assert.equal(hhmm(next), '07:00');
  assert.equal(next.getDate(), 16, 'and it must be the NEXT day, not today');
});

test('nextChangeAfter respects sub-minute precision', () => {
  const next = nextChangeAfter(at(11, 59, 30));
  assert.equal(hhmm(next), '12:00');
  assert.equal(next.getSeconds(), 0);
  const remaining = next.getTime() - at(11, 59, 30).getTime();
  assert.equal(remaining, 30_000, 'exactly 30s left until noon');
});

test('the reported next change is always strictly in the future and within a day', () => {
  for (const h of [0, 3, 6, 7, 11, 12, 17, 18, 20, 23]) {
    const now = at(h, 30);
    const ms = msUntilNextChange(now);
    assert.ok(ms > 0, `${h}:30 → next change must be in the future`);
    assert.ok(ms <= MINUTES_PER_DAY * 60_000, `${h}:30 → next change must be within 24h`);
  }
});

test('applying the schedule at the next change actually switches style', () => {
  for (const h of [0, 6, 7, 11, 12, 17, 18, 20, 23]) {
    const now = at(h, 30);
    const next = nextChangeAfter(now);
    const before = styleForDate(now);
    const after = styleForDate(next);
    assert.notEqual(before, after,
      `at ${h}:30 the style was ${before}; the next boundary should have changed it, got ${after}`);
  }
});

/* ── formatting & summary ──────────────────────────────────────────────── */

test('formatMinutes pads correctly and wraps', () => {
  assert.equal(formatMinutes(0), '00:00');
  assert.equal(formatMinutes(7 * 60), '07:00');
  assert.equal(formatMinutes(12 * 60), '12:00');
  assert.equal(formatMinutes(18 * 60), '18:00');
  assert.equal(formatMinutes(1439), '23:59');
  assert.equal(formatMinutes(1440), '00:00');
});

test('minutesOf reads the local clock', () => {
  assert.equal(minutesOf(at(0, 0)), 0);
  assert.equal(minutesOf(at(1, 30)), 90);
  assert.equal(minutesOf(at(23, 59)), 1439);
});

test('scheduleSummary is render-ready for the explainer UI', () => {
  const rows = scheduleSummary();
  assert.equal(rows.length, 3);
  // Listed in day order (07:00 → 18:00 → wrap), which is A, C, B — not alphabetical.
  assert.deepEqual(rows.map((r) => r.window), ['07:00–12:00', '12:00–18:00', '18:00–07:00']);
  assert.deepEqual(rows.map((r) => r.styleName), ['Editorial', 'Magazine', 'Terminal']);
  assert.deepEqual(rows.map((r) => r.style), ['a', 'c', 'b']);
  for (const r of rows) {
    assert.ok(r.rationale && r.label, 'each row explains itself');
    assert.ok(STYLES[r.style], 'each row points at a real style');
  }
});

test('every style declares the mode it was designed around', () => {
  for (const id of STYLE_IDS) {
    const s = STYLES[id];
    assert.ok(['light', 'dark'].includes(s.preferredMode), `${id} needs a preferredMode`);
    assert.ok(s.name && s.blurb && s.short, `${id} needs name/short/blurb for the UI`);
  }
  // A and C are light-first, B is dark-first — this is what makes style and mode
  // two orthogonal axes rather than one.
  assert.equal(STYLES.a.preferredMode, 'light');
  assert.equal(STYLES.b.preferredMode, 'dark');
  assert.equal(STYLES.c.preferredMode, 'light');
});
