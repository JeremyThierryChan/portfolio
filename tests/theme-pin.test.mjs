/**
 * The two kinds of style pin, and why they are two.
 *
 *   node --test tests/theme-pin.test.mjs
 *
 * A pin can come from two places, and they mean different things:
 *
 *   the switch notice  — appears *because* the page changed under the visitor, so it
 *                        means "not while I am reading" and must lapse at the next
 *                        schedule boundary;
 *   the appearance panel — the visitor choosing a look on purpose, which lasts.
 *
 * Both used to write the same permanent key, so a momentary request silently disabled
 * the schedule. That is how a working schedule came to be reported as broken. The
 * asymmetry is the whole point of the module, so it is asserted rather than assumed.
 *
 * `theme.js` decides `isBrowser` once, at import, by testing whether `window` exists.
 * The shim therefore has to be in place BEFORE the import, which is why the import
 * below is dynamic rather than static.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

const store = {};
globalThis.window = {
  localStorage: {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
  },
};

const {
  STORAGE_STYLE,
  STORAGE_STYLE_UNTIL,
  STYLE_AUTO,
  readStyleOverride,
  readTemporaryStyle,
  writeTemporaryStyle,
  clearTemporaryStyle,
} = await import('../src/theme/theme.js');

/** 2026-01-15 09:00, matching the window the boundary tests use. */
const NOW = new Date(2026, 0, 15, 9, 0, 0).getTime();
const HOUR = 3600 * 1000;

function reset(seed = {}) {
  for (const key of Object.keys(store)) delete store[key];
  Object.assign(store, seed);
}

test('with nothing stored, the clock is in charge', () => {
  reset();
  assert.equal(readStyleOverride(NOW), STYLE_AUTO);
  assert.equal(readTemporaryStyle(NOW), null);
});

test('a permanent pin outranks the clock indefinitely', () => {
  reset({ [STORAGE_STYLE]: 'c' });
  assert.equal(readStyleOverride(NOW), 'c');
  assert.equal(readStyleOverride(NOW + 365 * 24 * HOUR), 'c', 'a permanent pin does not age');
});

test('a time-boxed pin is honoured while its window is open', () => {
  reset();
  writeTemporaryStyle('b', NOW + HOUR);
  assert.equal(readStyleOverride(NOW), 'b');
  assert.deepEqual(readTemporaryStyle(NOW), { style: 'b', until: NOW + HOUR });
});

test('a time-boxed pin lapses, and is removed rather than left behind', () => {
  reset();
  writeTemporaryStyle('b', NOW + HOUR);
  assert.equal(readStyleOverride(NOW + HOUR + 1), STYLE_AUTO, 'past its moment it must not apply');
  assert.ok(!(STORAGE_STYLE_UNTIL in store), 'the dead entry is deleted, not re-parsed forever');
});

test('the expiry is exclusive: the pin is live up to its last millisecond', () => {
  reset();
  writeTemporaryStyle('b', NOW + HOUR);
  assert.equal(readStyleOverride(NOW + HOUR - 1), 'b');
  assert.equal(readStyleOverride(NOW + HOUR), STYLE_AUTO);
});

test('the permanent pin survives a time-boxed one lapsing', () => {
  reset();
  writeTemporaryStyle('a', NOW + HOUR);
  store[STORAGE_STYLE] = 'c';
  assert.equal(readStyleOverride(NOW), 'c', 'the permanent choice wins while both are set');
  assert.equal(readStyleOverride(NOW + 2 * HOUR), 'c', 'and still wins after the other lapses');
});

test('a malformed time-boxed pin is discarded, not trusted', () => {
  for (const junk of ['b', '@123', 'b@', 'zzz@9999999999999', 'b@notanumber']) {
    reset({ [STORAGE_STYLE_UNTIL]: junk });
    assert.equal(readStyleOverride(NOW), STYLE_AUTO, `junk "${junk}" must not pick a style`);
    assert.ok(!(STORAGE_STYLE_UNTIL in store), `junk "${junk}" must be cleared`);
  }
});

test('an empty time-boxed pin counts as absent, not as junk', () => {
  /*
   * The content-schema convention is that '' means absent rather than "the empty value"
   * (SCHEMA.md: "Use null, never ''"). So this one is not an error to report and not a
   * write to perform — it resolves to nothing. The first version of this test asserted a
   * delete here; the assertion was wrong, not the code.
   */
  reset({ [STORAGE_STYLE_UNTIL]: '' });
  assert.equal(readStyleOverride(NOW), STYLE_AUTO);
  assert.equal(readTemporaryStyle(NOW), null);
});

test('a permanent "auto" short-circuits, whatever the time-boxed key holds', () => {
  /*
   * Worth stating because it is a real property of the resolution order rather than an
   * accident: a permanent "auto" returns before the time-boxed key is read at all, so a
   * junk value sitting there is NOT cleaned up on this path. That is harmless — 'auto'
   * means the clock decides regardless, and the junk is discarded the moment anything
   * really reads it — and making that read tidy up a branch whose result is thrown away
   * would put a side effect inside a short-circuit, which is the worse trade.
   */
  reset({ [STORAGE_STYLE]: STYLE_AUTO, [STORAGE_STYLE_UNTIL]: 'b@nope' });
  assert.equal(readStyleOverride(NOW), STYLE_AUTO);

  // Once the permanent key is gone the junk is read, and discarded as usual.
  delete store[STORAGE_STYLE];
  assert.equal(readStyleOverride(NOW), STYLE_AUTO);
  assert.ok(!(STORAGE_STYLE_UNTIL in store), 'now that it was actually read, it is cleaned up');
});

test('writing an invalid pin clears the key instead of storing rubbish', () => {
  reset({ [STORAGE_STYLE_UNTIL]: 'b@1' });
  writeTemporaryStyle('zzz', NOW + HOUR);
  assert.ok(!(STORAGE_STYLE_UNTIL in store), 'an unknown style id writes nothing');

  writeTemporaryStyle('b', NaN);
  assert.ok(!(STORAGE_STYLE_UNTIL in store), 'a non-numeric expiry writes nothing');
});

test('clearing the time-boxed pin hands the style back to the clock', () => {
  reset();
  writeTemporaryStyle('b', NOW + HOUR);
  assert.equal(readStyleOverride(NOW), 'b');
  clearTemporaryStyle();
  assert.equal(readStyleOverride(NOW), STYLE_AUTO);
});

test('"auto" stored explicitly is not overridden by a time-boxed pin', () => {
  /*
   * The permanent key holds 'auto' only if something wrote it, which `writeStyleOverride`
   * does by REMOVING the key — so a literal 'auto' means a hand-edited or foreign value.
   * It must not silently lose to the other key.
   */
  reset({ [STORAGE_STYLE]: STYLE_AUTO });
  writeTemporaryStyle('c', NOW + HOUR);
  assert.equal(readStyleOverride(NOW), STYLE_AUTO, 'explicit auto is respected');
});
