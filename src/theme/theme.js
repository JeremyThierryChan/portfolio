/**
 * Theme runtime — pure, framework-free half.
 *
 * The Vue composable in `useTimeTheme.js` builds on this. Keeping the policy in
 * plain functions means the same rules can also be expressed in the tiny inline
 * bootstrap in `index.html`, which must run before first paint and therefore
 * cannot import a module.
 *
 * `tests/theme-boot.test.mjs` asserts that the inline copy and this module agree
 * on the schedule boundaries and the storage keys, so the duplication cannot drift.
 */

import { STYLES, styleForDate } from './schedule.js';

/* ── storage ──────────────────────────────────────────────────────────────
   Two independent keys, because style and mode are two independent axes.
   The legacy single key ('theme' = 'light'|'dark') is migrated on read. */

export const STORAGE_STYLE = 'theme.style';
export const STORAGE_MODE = 'theme.mode';
export const LEGACY_STORAGE_MODE = 'theme';

/**
 * A second, TIME-BOXED style override: `<styleId>@<epochMs>`.
 *
 * WHY THERE ARE TWO. "Keep this look" means two different things depending on which
 * button was pressed:
 *
 *   the switch notice  — which appears *because* the page just changed under the
 *                        visitor — means "not while I am reading". That intent belongs
 *                        to the schedule window the visitor is in, and nothing longer.
 *   the appearance panel means "I prefer this". That one is meant to last.
 *
 * Both wrote the same permanent key, so a momentary request became permanent and
 * silently disabled the schedule — which is how a working schedule came to be reported
 * as broken by the person who specified it. The permanent key still wins when both are
 * set, and an entry whose moment has passed is cleared on read rather than honoured.
 */
export const STORAGE_STYLE_UNTIL = 'theme.styleUntil';

/** Style override: 'auto' follows the clock; 'a'|'b'|'c' pins one. */
export const STYLE_AUTO = 'auto';

/** Mode override: 'style' follows the style's design intent; else 'light'|'dark'. */
export const MODE_FOLLOWS_STYLE = 'style';
export const MODE_OPTIONS = [MODE_FOLLOWS_STYLE, 'light', 'dark'];

/**
 * When true, the *first* visit follows `prefers-color-scheme` instead of each
 * style's designed light level.
 *
 * Default is false on purpose: A and C are light "paper" identities and B is a
 * dark night interface, so honouring a dark OS preference would turn the morning
 * editorial page dark and fight the whole point of the schedule. The visitor can
 * always pin light or dark in one click, and that choice sticks.
 *
 * Flip this to `true` if you would rather defer to the OS.
 */
export const RESPECT_SYSTEM_MODE = false;

const isBrowser = typeof window !== 'undefined';

/* ── reading persisted choices ─────────────────────────────────────────── */

function safeGet(key) {
  if (!isBrowser) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    // localStorage throws in some privacy modes — never let that break the page.
    return null;
  }
}

function safeSet(key, value) {
  if (!isBrowser) return;
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

/**
 * The time-boxed override, if its window is still open.
 *
 * Returns `{ style, until }`, or null. A malformed or expired value is REMOVED rather
 * than left in storage: leaving it would mean re-parsing a dead entry on every read and
 * in the pre-paint bootstrap, and would make "why is this here" unanswerable later.
 *
 * @param {number} nowMs epoch milliseconds, injectable so the expiry is testable
 */
export function readTemporaryStyle(nowMs = Date.now()) {
  const raw = safeGet(STORAGE_STYLE_UNTIL);
  if (!raw) return null;

  const at = raw.lastIndexOf('@');
  if (at < 1) {
    safeSet(STORAGE_STYLE_UNTIL, null);
    return null;
  }

  const style = raw.slice(0, at);
  const until = Number(raw.slice(at + 1));
  if (!STYLES[style] || !Number.isFinite(until) || until <= nowMs) {
    safeSet(STORAGE_STYLE_UNTIL, null);
    return null;
  }
  return { style, until };
}

/** Hold `styleId` until `untilMs`. Anything invalid clears the key instead. */
export function writeTemporaryStyle(styleId, untilMs) {
  if (!STYLES[styleId] || !Number.isFinite(untilMs)) {
    safeSet(STORAGE_STYLE_UNTIL, null);
    return;
  }
  safeSet(STORAGE_STYLE_UNTIL, `${styleId}@${untilMs}`);
}

export function clearTemporaryStyle() {
  safeSet(STORAGE_STYLE_UNTIL, null);
}

/**
 * Valid style override, or 'auto'.
 *
 * A permanent pin outranks a time-boxed one, so pinning from the panel during a window
 * the switch notice is holding does what the visitor plainly meant.
 */
export function readStyleOverride(nowMs = Date.now()) {
  const raw = safeGet(STORAGE_STYLE);
  if (raw === STYLE_AUTO) return STYLE_AUTO;
  if (raw && STYLES[raw]) return raw;
  return readTemporaryStyle(nowMs)?.style ?? STYLE_AUTO;
}

/** Valid mode override, or 'style'. Migrates the legacy single 'theme' key. */
export function readModeOverride() {
  const raw = safeGet(STORAGE_MODE);
  if (MODE_OPTIONS.includes(raw)) return raw;

  // Migration path: the old build stored a single 'theme' = 'dark' | 'light'.
  const legacy = safeGet(LEGACY_STORAGE_MODE);
  if (legacy === 'dark' || legacy === 'light') {
    safeSet(LEGACY_STORAGE_MODE, null);
    safeSet(STORAGE_MODE, legacy);
    return legacy;
  }
  return MODE_FOLLOWS_STYLE;
}

export function writeStyleOverride(value) {
  safeSet(STORAGE_STYLE, value === STYLE_AUTO ? null : value);
}

export function writeModeOverride(value) {
  safeSet(STORAGE_MODE, value === MODE_FOLLOWS_STYLE ? null : value);
}

/* ── resolving the two axes ────────────────────────────────────────────── */

/** Does the OS express a preference? Returns 'light' | 'dark' | null. */
export function systemMode() {
  if (!isBrowser || typeof window.matchMedia !== 'function') return null;
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
  return null;
}

/**
 * Which style applies right now.
 * @param {Date} now
 * @param {string} override  'auto' | 'a' | 'b' | 'c'
 */
export function resolveStyle(now = new Date(), override = STYLE_AUTO) {
  return override === STYLE_AUTO ? styleForDate(now) : override;
}

/**
 * Which mode applies for a given style.
 * @param {string} styleId
 * @param {string} override  'style' | 'light' | 'dark'
 */
export function resolveMode(styleId, override = MODE_FOLLOWS_STYLE) {
  if (override === 'light' || override === 'dark') return override;

  const designed = STYLES[styleId]?.preferredMode ?? 'light';
  if (!RESPECT_SYSTEM_MODE) return designed;

  // Only defer to the OS when it is actually expressed.
  return systemMode() ?? designed;
}

/* ── applying to the document ──────────────────────────────────────────── */

/**
 * Write the two axis attributes onto an element (normally <html>).
 * Returns true when something actually changed, so callers can skip work.
 */
export function applyTheme(el, style, mode) {
  if (!el) return false;
  const changed = el.getAttribute('data-style') !== style || el.getAttribute('data-mode') !== mode;
  if (changed) {
    el.setAttribute('data-style', style);
    el.setAttribute('data-mode', mode);
  }
  return changed;
}

/* ── first-visit explainer ────────────────────────────────────────────────
   The site changes appearance on a schedule, which is unusual enough to be
   mistaken for a bug. We tell the visitor once, and offer to pin the current
   look. Dismissal is remembered. */

export const STORAGE_EXPLAINER_SEEN = 'theme.explainerSeen';

export function hasSeenExplainer() {
  return safeGet(STORAGE_EXPLAINER_SEEN) === '1';
}

export function markExplainerSeen() {
  safeSet(STORAGE_EXPLAINER_SEEN, '1');
}
