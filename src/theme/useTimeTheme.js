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

import {
  STYLES,
  STYLE_IDS,
  msUntilNextChange,
  nextChangeAfter,
  formatMinutes,
  minutesOf,
} from './schedule.js';
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
  readTemporaryStyle,
  writeStyleOverride,
  writeModeOverride,
  writeTemporaryStyle,
  clearTemporaryStyle,
  hasSeenExplainer,
  markExplainerSeen,
} from './theme.js';

const isBrowser = typeof window !== 'undefined';

/* ── module-level singleton state ──────────────────────────────────────── */

const now = ref(isBrowser ? new Date() : new Date(0));

/*
 * The time-boxed pin is persisted as `<styleId>@<epochMs>`, so its expiry has to be
 * known in memory as well: `styleOverride` is a ref, and a ref does not notice that a
 * moment has passed. Both values come from the same startup read, so they cannot end up
 * disagreeing about which pin is actually in force.
 */
const initialTemporary = isBrowser ? readTemporaryStyle() : null;
const initialOverride = isBrowser ? readStyleOverride() : STYLE_AUTO;
const styleOverride = ref(initialOverride);
/** Epoch ms at which a time-boxed pin lapses, or null when there is none. */
const temporaryExpiresAt = ref(
  initialTemporary && initialTemporary.style === initialOverride ? initialTemporary.until : null,
);
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
/** Pinned, but only until the current window ends — the switch notice's kind of pin. */
const styleIsTemporarilyPinned = computed(
  () => temporaryExpiresAt.value !== null && !styleIsAuto.value,
);

/**
 * 'HH:MM' at which that pin lapses, or null. Formatted here rather than in the
 * component, matching `nextChangeLabel`: time formatting belongs to the theme layer.
 */
const temporaryExpiresLabel = computed(() =>
  temporaryExpiresAt.value === null
    ? null
    : formatMinutes(minutesOf(new Date(temporaryExpiresAt.value))));
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
  expireTemporaryPin();
}

/**
 * Hand the style back to the clock once the window a time-boxed pin belonged to is over.
 *
 * Storage is re-read rather than assumed to be 'auto': the visitor may have pressed the
 * permanent pin in the meantime, and that choice has to survive the other one lapsing.
 */
function expireTemporaryPin() {
  const until = temporaryExpiresAt.value;
  if (until === null || Date.now() < until) return;
  temporaryExpiresAt.value = null;
  clearTemporaryStyle();
  styleOverride.value = readStyleOverride();
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
    styleIsTemporarilyPinned,
    temporaryExpiresAt: readonly(temporaryExpiresAt),
    temporaryExpiresLabel,
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
    /** Pin whatever is showing right now, permanently. This is the panel's button. */
    pinCurrentStyle() {
      styleOverride.value = style.value;
      temporaryExpiresAt.value = null;
      writeStyleOverride(style.value);
      // Drop any time-boxed pin, so a stale entry cannot outlive the choice just made.
      clearTemporaryStyle();
      autoSwitchedTo.value = null;
    },
    /**
     * "Not while I am reading": hold the current look only until the clock's next
     * boundary. This is the switch notice's button, and the reason the two pins are
     * separate — the notice appears *because* the page moved under the visitor, which
     * is a momentary complaint, not a preference.
     */
    pinCurrentStyleForWindow() {
      // `new Date()`, not `now.value`: the tick that refreshes `now` runs every 30s, so a
      // stale read taken next to a boundary could compute an expiry that has already
      // passed and expire the pin on the spot.
      const until = nextChangeAfter(new Date()).getTime();
      writeTemporaryStyle(style.value, until);
      temporaryExpiresAt.value = until;
      styleOverride.value = style.value;
      autoSwitchedTo.value = null;
    },
    /** Clear every override and hand control back to the clock and the style. */
    resetToAuto() {
      styleOverride.value = STYLE_AUTO;
      modeOverride.value = MODE_FOLLOWS_STYLE;
      temporaryExpiresAt.value = null;
      writeStyleOverride(STYLE_AUTO);
      clearTemporaryStyle();
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
