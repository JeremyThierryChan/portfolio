/**
 * useTimeTheme — the reactive half of the theming runtime.
 *
 * State lives at MODULE scope, not inside the composable, so every component that
 * calls `useTimeTheme()` shares one clock, one timer and one source of truth.
 * Calling it from five components does not create five intervals.
 *
 * Responsibilities:
 *   - keep `now` fresh precisely at schedule boundaries (not by polling every second)
 *   - resolve the two axes and write them onto <html>
 *   - own the visitor's overrides and persist them
 *   - announce a clock-driven swap, so a changing site reads as intentional
 *
 * Pure policy lives in `theme.js` / `schedule.js`; this file only does effects.
 */

import { ref, computed, readonly, watch, onScopeDispose } from 'vue';

import { STYLES, STYLE_IDS, msUntilNextChange, formatMinutes, minutesOf } from './schedule.js';
import {
  STYLE_AUTO,
  MODE_FOLLOWS_STYLE,
  MODE_OPTIONS,
  RESPECT_SYSTEM_MODE,
  systemMode,
  resolveStyle,
  resolveMode,
  applyTheme,
  readStyleOverride,
  readModeOverride,
  writeStyleOverride,
  writeModeOverride,
  hasSeenExplainer,
  markExplainerSeen,
} from './theme.js';

const isBrowser = typeof window !== 'undefined';

/* ── module-level singleton state ──────────────────────────────────────── */

const now = ref(isBrowser ? new Date() : new Date(0));
const styleOverride = ref(isBrowser ? readStyleOverride() : STYLE_AUTO);
const modeOverride = ref(isBrowser ? readModeOverride() : MODE_FOLLOWS_STYLE);

/** Set when the CLOCK changed the style (not when the visitor did). */
const autoSwitchedTo = ref(null);
/** First-visit explainer visibility. */
const explainerOpen = ref(false);

let boundaryTimer = null;
let safetyTimer = null;
let mediaQuery = null;
let mounted = false;

/* ── resolution ────────────────────────────────────────────────────────── */

const style = computed(() => resolveStyle(now.value, styleOverride.value));
const mode = computed(() => resolveMode(style.value, modeOverride.value));
const styleIsAuto = computed(() => styleOverride.value === STYLE_AUTO);
const modeIsAuto = computed(() => modeOverride.value === MODE_FOLLOWS_STYLE);
const styleMeta = computed(() => STYLES[style.value]);

/** Minutes until the clock next changes the style. */
const minutesUntilChange = computed(() => {
  const next = nextChangeAt.value;
  if (!next) return 0;
  return Math.round((next.getTime() - now.value.getTime()) / 60000);
});

const nextChangeAt = computed(() => {
  // Referencing now.value keeps this reactive as the clock ticks.
  void now.value;
  const ms = msUntilNextChange(new Date());
  return new Date(Date.now() + ms);
});

const nextStyleMeta = computed(() => {
  const next = nextChangeAt.value;
  if (!next) return null;
  return STYLES[resolveStyle(next, STYLE_AUTO)];
});

/* ── timers ───────────────────────────────────────────────────────────── */

function tick() {
  now.value = new Date();
}

/** Sleep until the exact boundary, then re-arm. */
function armBoundary() {
  if (!isBrowser) return;
  if (boundaryTimer) clearTimeout(boundaryTimer);
  // +250ms so we land just past the boundary rather than a hair before it.
  boundaryTimer = setTimeout(() => {
    tick();
    armBoundary();
  }, msUntilNextChange(new Date()) + 250);
}

function start() {
  if (!isBrowser || mounted) return;
  mounted = true;

  tick();
  armBoundary();

  // Safety net: laptop sleep and background-tab throttling can delay timeouts,
  // and a wrong-looking site is worse than a cheap 30s check.
  safetyTimer = setInterval(() => {
    tick();
    armBoundary();
  }, 30_000);

  // Returning to a backgrounded tab should re-evaluate immediately.
  document.addEventListener('visibilitychange', onVisibility);

  if (RESPECT_SYSTEM_MODE) {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', tick);
  }
}

function stop() {
  if (boundaryTimer) clearTimeout(boundaryTimer);
  if (safetyTimer) clearInterval(safetyTimer);
  boundaryTimer = safetyTimer = null;
  if (isBrowser) document.removeEventListener('visibilitychange', onVisibility);
  if (mediaQuery) mediaQuery.removeEventListener('change', tick);
  mediaQuery = null;
  mounted = false;
}

function onVisibility() {
  if (document.visibilityState === 'visible') {
    tick();
    armBoundary();
  }
}

/* ── effects ──────────────────────────────────────────────────────────── */

if (isBrowser) {
  // The one place the document is written.
  watch([style, mode], ([s, m]) => {
    applyTheme(document.documentElement, s, m);
  }, { immediate: true });

  // A clock-driven style change is the surprising case: surface it.
  watch(style, (to, from) => {
    if (from === undefined || to === from) return;
    if (styleOverride.value !== STYLE_AUTO) return;   // visitor pinned it; stay quiet

    if (!hasSeenExplainer()) {
      explainerOpen.value = true;
    } else {
      autoSwitchedTo.value = to;
    }
  });
}

/* ── public surface ───────────────────────────────────────────────────── */

export function useTimeTheme() {
  // Any component that uses the theme keeps the clock alive.
  start();
  onScopeDispose(() => {
    // Don't tear down shared state on a single component's unmount — only stop
    // when nothing is left. `stop()` is exposed for tests.
    void stop;
  });

  return {
    /* current axes */
    style,
    mode,
    styleMeta,
    now: readonly(now),

    /* auto vs pinned */
    styleIsAuto,
    modeIsAuto,
    styleOverride: readonly(styleOverride),
    modeOverride: readonly(modeOverride),

    /* what's coming */
    nextChangeAt,
    nextStyleMeta,
    minutesUntilChange,
    nextChangeLabel: computed(() =>
      nextStyleMeta.value ? formatMinutes(minutesOf(nextChangeAt.value)) : null),

    /* clock-driven swap announcements */
    autoSwitchedTo: readonly(autoSwitchedTo),
    acknowledgeSwitch: () => { autoSwitchedTo.value = null; },

    /* first-visit explainer */
    explainerOpen,
    openExplainer: () => { explainerOpen.value = true; },
    dismissExplainer: () => {
      explainerOpen.value = false;
      markExplainerSeen();
    },

    /* visitor actions */
    setStyle(value) {
      if (value !== STYLE_AUTO && !STYLE_IDS.includes(value)) return;
      styleOverride.value = value;
      writeStyleOverride(value);
      autoSwitchedTo.value = null;
    },
    setMode(value) {
      if (!MODE_OPTIONS.includes(value)) return;
      modeOverride.value = value;
      writeModeOverride(value);
    },
    /** Pin whatever is showing right now, then stop following the clock. */
    pinCurrentStyle() {
      styleOverride.value = style.value;
      writeStyleOverride(style.value);
      autoSwitchedTo.value = null;
    },
    /** Clear every override and hand control back to the clock and the style. */
    resetToAuto() {
      styleOverride.value = STYLE_AUTO;
      modeOverride.value = MODE_FOLLOWS_STYLE;
      writeStyleOverride(STYLE_AUTO);
      writeModeOverride(MODE_FOLLOWS_STYLE);
    },

    /* internals, for tests and tooling */
    _tick: tick,
    _start: start,
    _stop: stop,
    systemMode,
  };
}

export { STYLE_AUTO, MODE_FOLLOWS_STYLE, MODE_OPTIONS, STYLES, STYLE_IDS, systemMode };
