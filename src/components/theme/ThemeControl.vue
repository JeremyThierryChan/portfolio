<script setup>
/**
 * ThemeControl — the appearance popover for the navigation bar.
 *
 * The site has TWO ORTHOGONAL AXES (`data-style` and `data-mode` on <html>), and
 * the style axis follows the visitor's local clock. This popover is the only place
 * the visitor can take control of either axis, so it has to be explicit about
 * three things: which option is selected, whether the clock is still in charge,
 * and when the next automatic change lands.
 *
 * Why it is built the way it is:
 *
 *   - Both axes are `role="radiogroup"` with ROVING TABINDEX. Exactly one option
 *     per axis is tabbable; the arrow keys move focus *and* the selection, as
 *     native radios do; every option carries `aria-checked`. Radios are the ARIA
 *     pattern for a single choice — a set of `aria-pressed` toggle buttons can say
 *     "this one is on" but not "only one of these can be on".
 *   - Selection is never signalled by colour alone: the checked option also gains
 *     a check glyph, a heavier leading rule and a stronger label weight, and
 *     `aria-checked` carries the state for assistive technology.
 *   - The panel is a NON-MODAL `role="dialog"` popover and is NOT teleported: it
 *     is anchored to its trigger inside the nav. Layering still matters, so the
 *     panel paints at `--z-overlay` inside whatever stacking context the nav
 *     creates with `--z-sticky`.
 *   - Keyboard plumbing is delegated to the shared `useFocusTrap` composable —
 *     focus moves in on open and back to the trigger on close, Esc closes, and
 *     Tab cycles inside the panel. This component only adds grid navigation
 *     (arrows / Home / End) and click-outside dismissal.
 *
 * Copy: every string is an i18n key held in a LITERAL table (`STYLE_KEY`,
 * `MODE_KEY`, `MODE_HINT_KEY`) and never built by concatenation, so a new style id
 * in `schedule.js` shows up as a missing key instead of a raw key path in the UI.
 * The `\`theme-...-${uid}\`` template literals in this file build DOM ids only.
 */

import { computed, nextTick, onScopeDispose, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { useFocusTrap } from '@/composables/useFocusTrap.js';
import { scheduleSummary } from '@/theme/schedule.js';
/* `styleMeta` below IS `STYLES[style]`, so the short label comes from there. */
import { MODE_FOLLOWS_STYLE, STYLE_AUTO, useTimeTheme } from '@/theme/useTimeTheme.js';

const { t } = useI18n();

const {
  style,
  mode,
  styleMeta,
  styleIsAuto,
  modeIsAuto,
  styleOverride,
  modeOverride,
  nextChangeAt,
  nextStyleMeta,
  minutesUntilChange,
  nextChangeLabel,
  setStyle,
  setMode,
  pinCurrentStyle,
  resetToAuto,
  openExplainer,
} = useTimeTheme();

/* ── i18n keys, written out ───────────────────────────────────────────────
   Literal tables: a key is never assembled from a style id at runtime. A lookup
   that misses returns undefined and is caught below rather than rendering a key
   path in the UI. */

const STYLE_KEY = {
  a: { name: 'theme.style.a.name', blurb: 'theme.style.a.blurb', rationale: 'theme.style.a.rationale' },
  b: { name: 'theme.style.b.name', blurb: 'theme.style.b.blurb', rationale: 'theme.style.b.rationale' },
  c: { name: 'theme.style.c.name', blurb: 'theme.style.c.blurb', rationale: 'theme.style.c.rationale' },
};

const MODE_KEY = {
  style: 'theme.modeFollowsStyle',
  light: 'theme.light',
  dark: 'theme.dark',
};

const MODE_HINT_KEY = {
  style: 'theme.modeFollowsStyleHint',
};

/** Radiogroup values, in the order they are presented. */
const STYLE_VALUES = [STYLE_AUTO, 'a', 'c', 'b'];
const MODE_VALUES = [MODE_FOLLOWS_STYLE, 'light', 'dark'];

/** The style whose slot in the timetable is showing right now. */
const STYLE_FALLBACK_KEY = STYLE_KEY.b;

function styleNameKey(id) {
  return STYLE_KEY[id]?.name ?? STYLE_FALLBACK_KEY.name;
}

/* ── DOM ids (not i18n keys) ──────────────────────────────────────────────── */

let instanceCount = 0;
const uid = ++instanceCount;

const panelId = `theme-control-panel-${uid}`;
const titleId = `theme-control-title-${uid}`;
const styleAxisLabelId = `theme-control-style-axis-${uid}`;
const modeAxisLabelId = `theme-control-mode-axis-${uid}`;

function optionNoteId(axis, value) {
  return `theme-control-note-${axis}-${value}-${uid}`;
}

/* ── panel state ──────────────────────────────────────────────────────────── */

const open = ref(false);
const rootRef = ref(null);
const triggerRef = ref(null);
const panelRef = ref(null);

/* ── the two axes, as render-ready rows ─────────────────────────────────── */

const styleChoices = computed(() =>
  STYLE_VALUES.map((value) => {
    if (value === STYLE_AUTO) {
      return {
        value,
        label: t('theme.styleAuto'),
        note: t('theme.styleAutoHint'),
      };
    }
    return {
      value,
      label: t(STYLE_KEY[value].name),
      note: t(STYLE_KEY[value].blurb),
    };
  }),
);

const modeChoices = computed(() =>
  MODE_VALUES.map((value) => {
    const hintKey = MODE_HINT_KEY[value];
    return {
      value,
      label: t(MODE_KEY[value]),
      note: hintKey ? t(hintKey) : null,
    };
  }),
);

/** The timetable, with the locale's style names rather than `styleName`. */
const scheduleRows = computed(() =>
  scheduleSummary().map((slot) => ({
    id: slot.style,
    window: slot.window,
    label: t(STYLE_KEY[slot.style].name),
    rationale: t(STYLE_KEY[slot.style].rationale),
    isCurrent: slot.style === style.value,
  })),
);

const currentStyleName = computed(() => t(styleNameKey(style.value)));

/** Auto vs pinned is stated in words, not implied by a colour. */
const styleStateLabel = computed(() => (styleIsAuto.value ? t('theme.followsClock') : t('theme.pinned')));

/**
 * What the trigger announces, and what it shows.
 *
 * The trigger is the only part of this control a visitor meets without opening it, so
 * it is the only place that can say whether the clock is in charge. It used to say
 * neither: it showed the style letter and a sun/moon, and the auto/pinned distinction
 * lived on a chip INSIDE the collapsed panel. A pinned style permanently overrules the
 * schedule, so an invisible pin is indistinguishable from an automatic style — which is
 * how a working schedule gets reported as broken.
 */
const triggerLabel = computed(() =>
  t(styleIsAuto.value ? 'theme.triggerAuto' : 'theme.triggerPinned'));

/**
 * "Switches to Terminal at 18:00" — only while the clock is actually in charge,
 * because while a style is pinned nothing is going to switch and the sentence
 * would be a lie. `minutesUntilChange` guards the label: a stale clock (a laptop
 * waking from sleep) can leave the remaining minutes at zero, and a time we cannot
 * vouch for is reported as unknown instead of wrong.
 */
const nextChangeText = computed(() => {
  if (!styleIsAuto.value) return null;
  const meta = nextStyleMeta.value;
  const label = nextChangeLabel.value;
  if (!meta || !label) return null;
  return t('theme.nextChange', { style: t(styleNameKey(meta.id)), time: label });
});

/** Within five minutes of the boundary the line is emphasised: the site is about
 *  to change under the visitor, which is worth noticing before it happens. */
const nextChangeImminent = computed(() => styleIsAuto.value && minutesUntilChange.value <= 5);

const nextChangeIso = computed(() => {
  const at = nextChangeAt.value;
  return at ? at.toISOString() : null;
});

/** "Back to automatic" only exists while something is actually overridden. */
const showsReset = computed(() => !styleIsAuto.value || !modeIsAuto.value);

/* ── opening, closing, focus ────────────────────────────────────────────── */

function togglePanel() {
  open.value = open.value ? false : true;
}

function closePanel() {
  open.value = false;
}

function closeToTrigger() {
  if (!open.value) return;
  closePanel();
  // The trap restores the element that had focus when the panel opened, which is
  // not always the trigger (Safari does not focus a button on a mouse click), so
  // put focus back explicitly.
  nextTick(() => triggerRef.value?.focus());
}

/**
 * Read lazily so the trap sees the panel's *rendered* state: `panelRef` is
 * assigned during the DOM flush, and a computed re-reads it after that.
 */
const initialFocus = computed(() => {
  const panel = panelRef.value;
  if (!panel) return null;
  return (
    panel.querySelector('[data-axis="style"][aria-checked="true"]') ??
    panel.querySelector('[data-axis="mode"][aria-checked="true"]') ??
    null
  );
});

useFocusTrap(open, panelRef, { onEscape: closeToTrigger, initialFocus });

function onDocumentPointerDown(event) {
  if (!rootRef.value?.contains(event.target)) closeToTrigger();
}

watch(open, (isOpen) => {
  if (isOpen) document.addEventListener('pointerdown', onDocumentPointerDown, true);
  else document.removeEventListener('pointerdown', onDocumentPointerDown, true);
});

onScopeDispose(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown, true);
});

/* ── keyboard navigation inside a radiogroup ────────────────────────────── */

function focusOption(axis, value) {
  const el = panelRef.value?.querySelector(`[data-axis="${axis}"][data-value="${value}"]`);
  if (el) el.focus();
}

/**
 * Arrow keys move focus AND selection, the way native radios behave. Because the
 * selection follows the focus, the roving tabindex and `aria-checked` can never
 * point at different options.
 */
function onAxisKeydown(event, axis, values, current, apply) {
  const last = values.length - 1;
  const index = values.indexOf(current);
  const from = index === -1 ? 0 : index;
  let next = null;

  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      next = from === last ? 0 : from + 1;
      break;
    case 'ArrowLeft':
    case 'ArrowUp':
      next = from === 0 ? last : from - 1;
      break;
    case 'Home':
      next = 0;
      break;
    case 'End':
      next = last;
      break;
    default:
      return;
  }

  event.preventDefault();
  const value = values[next];
  apply(value);
  nextTick(() => focusOption(axis, value));
}

function onStyleAxisKeydown(event) {
  onAxisKeydown(event, 'style', STYLE_VALUES, styleOverride.value, setStyle);
}

function onModeAxisKeydown(event) {
  onAxisKeydown(event, 'mode', MODE_VALUES, modeOverride.value, setMode);
}

/** Hand the visitor over to the long-form explanation instead of guessing. */
function showExplainer() {
  closePanel();
  openExplainer();
}
</script>

<template>
  <div ref="rootRef" class="theme-control">
    <button
      ref="triggerRef"
      type="button"
      class="theme-control__trigger"
      :aria-expanded="open ? 'true' : 'false'"
      aria-haspopup="dialog"
      :aria-controls="open ? panelId : null"
      :aria-label="triggerLabel"
      @click="togglePanel"
    >
      <span class="theme-control__short" aria-hidden="true">{{ styleMeta.short }}</span>

      <!--
        Shown only while a style is pinned. Without it, the one state that disables the
        schedule is the one state with no visible marker.
      -->
      <svg
        v-if="!styleIsAuto"
        class="theme-control__pinned"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M8.4 10.1V7.7a3.6 3.6 0 0 1 7.2 0v2.4"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
        />
        <rect
          x="5.6"
          y="10.1"
          width="12.8"
          height="9.2"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
        />
      </svg>
      <svg
        v-if="mode === 'dark'"
        class="theme-control__glyph"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M20.2 14.6A8.6 8.6 0 0 1 9.4 3.8 8.6 8.6 0 1 0 20.2 14.6Z"
          fill="none"
          stroke="currentColor"
          stroke-width="1.7"
          stroke-linejoin="round"
        />
      </svg>
      <svg
        v-else
        class="theme-control__glyph"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="1.7" />
        <path
          d="M12 2.6v3.1M12 18.3v3.1M2.6 12h3.1M18.3 12h3.1M5.4 5.4l2.2 2.2M16.4 16.4l2.2 2.2M18.6 5.4l-2.2 2.2M7.6 16.4l-2.2 2.2"
          fill="none"
          stroke="currentColor"
          stroke-width="1.7"
          stroke-linecap="round"
        />
      </svg>
    </button>

    <div
      v-if="open"
      :id="panelId"
      ref="panelRef"
      class="theme-control__panel"
      role="dialog"
      :aria-label="t('theme.label')"
      :aria-labelledby="titleId"
    >
      <div class="theme-control__head">
        <h2 :id="titleId" class="theme-control__title">{{ t('theme.label') }}</h2>
        <button
          type="button"
          class="theme-control__close"
          :aria-label="t('common.close')"
          @click="closeToTrigger"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              d="M6 6l12 12M18 6 6 18"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </div>

      <p class="theme-control__status">
        <span class="theme-control__status-style">{{ t('theme.currentStyle', { name: currentStyleName }) }}</span>
        <span class="theme-control__chip">{{ styleStateLabel }}</span>
      </p>

      <!-- Axis one: which visual language -->
      <div class="theme-control__axis">
        <h3 :id="styleAxisLabelId" class="theme-control__axis-label">
          {{ t('theme.styleAxisLabel') }}
        </h3>
        <div
          class="theme-control__options"
          role="radiogroup"
          :aria-labelledby="styleAxisLabelId"
          @keydown="onStyleAxisKeydown"
        >
          <button
            v-for="choice in styleChoices"
            :key="choice.value"
            type="button"
            role="radio"
            class="theme-control__option"
            data-axis="style"
            :data-value="choice.value"
            :aria-checked="choice.value === styleOverride ? 'true' : 'false'"
            :aria-describedby="optionNoteId('style', choice.value)"
            :tabindex="choice.value === styleOverride ? 0 : -1"
            :class="{ 'is-checked': choice.value === styleOverride }"
            @click="setStyle(choice.value)"
          >
            <span class="theme-control__option-head">
              <span class="theme-control__option-name">{{ choice.label }}</span>
              <svg
                v-if="choice.value === styleOverride"
                class="theme-control__check"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M4.5 12.5l5 5 10-11"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span :id="optionNoteId('style', choice.value)" class="theme-control__option-note">
              {{ choice.note }}
            </span>
          </button>
        </div>
      </div>

      <!-- Axis two: light or dark, independently -->
      <div class="theme-control__axis">
        <h3 :id="modeAxisLabelId" class="theme-control__axis-label">
          {{ t('theme.modeAxisLabel') }}
        </h3>
        <div
          class="theme-control__options theme-control__options--row"
          role="radiogroup"
          :aria-labelledby="modeAxisLabelId"
          @keydown="onModeAxisKeydown"
        >
          <button
            v-for="choice in modeChoices"
            :key="choice.value"
            type="button"
            role="radio"
            class="theme-control__option theme-control__option--compact"
            data-axis="mode"
            :data-value="choice.value"
            :aria-checked="choice.value === modeOverride ? 'true' : 'false'"
            :aria-describedby="choice.note ? optionNoteId('mode', choice.value) : null"
            :tabindex="choice.value === modeOverride ? 0 : -1"
            :class="{ 'is-checked': choice.value === modeOverride }"
            @click="setMode(choice.value)"
          >
            <span class="theme-control__option-head">
              <span class="theme-control__option-name">{{ choice.label }}</span>
              <svg
                v-if="choice.value === modeOverride"
                class="theme-control__check"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M4.5 12.5l5 5 10-11"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span
              v-if="choice.note"
              :id="optionNoteId('mode', choice.value)"
              class="theme-control__option-note"
            >
              {{ choice.note }}
            </span>
          </button>
        </div>
      </div>

      <!-- What the clock does next, while it is still in charge -->
      <p v-if="styleIsAuto" class="theme-control__next" :class="{ 'is-imminent': nextChangeImminent }">
        <time v-if="nextChangeText && nextChangeIso" :datetime="nextChangeIso">{{ nextChangeText }}</time>
        <span v-else>{{ t('theme.nextChangeUnknown') }}</span>
      </p>

      <!-- The timetable, so the switch is never a surprise -->
      <section class="theme-control__schedule">
        <h3 class="theme-control__axis-label">{{ t('theme.scheduleLabel') }}</h3>
        <ul class="theme-control__slots">
          <li
            v-for="slot in scheduleRows"
            :key="slot.id"
            class="theme-control__slot"
            :class="{ 'is-current': slot.isCurrent }"
            :aria-current="slot.isCurrent ? 'true' : null"
          >
            <span class="theme-control__slot-head">
              <span class="theme-control__slot-window">{{ slot.window }}</span>
              <span class="theme-control__slot-name">{{ slot.label }}</span>
              <span v-if="slot.isCurrent" class="theme-control__slot-mark" aria-hidden="true">
                <svg viewBox="0 0 8 8" focusable="false"><circle cx="4" cy="4" r="3.2" fill="currentColor" /></svg>
              </span>
            </span>
            <span class="theme-control__slot-note">{{ slot.rationale }}</span>
          </li>
        </ul>
      </section>

      <div class="theme-control__actions">
        <button type="button" class="theme-control__action" @click="pinCurrentStyle">
          <span class="theme-control__action-label">{{ t('theme.pin') }}</span>
          <span class="theme-control__action-note">{{ t('theme.pinHint') }}</span>
        </button>
        <button
          v-if="showsReset"
          type="button"
          class="theme-control__action theme-control__action--quiet"
          @click="resetToAuto"
        >
          <span class="theme-control__action-label">{{ t('theme.reset') }}</span>
        </button>
      </div>

      <button type="button" class="theme-control__learn" @click="showExplainer">
        {{ t('common.learnMore') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Layer order: the popover paints above the nav's own items but stays inside the
   stacking context the nav creates, so a modal (--z-modal) still wins. */
.theme-control {
  position: relative;
  display: inline-flex;
  align-items: center;
}

/* ── trigger ─────────────────────────────────────────────────────────────── */

.theme-control__trigger {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2xs);
  height: var(--control-height);
  min-width: var(--control-height);
  padding-inline: var(--space-xs);
  color: var(--fg);
  background-color: var(--bg-raised);
  border: var(--border-width) solid var(--line);
  border-radius: var(--radius-sm);
  transition:
    background-color var(--dur-fast) var(--ease-out),
    border-color var(--dur-fast) var(--ease-out);
}

.theme-control__trigger:hover {
  background-color: var(--accent-soft);
  border-color: var(--line-strong);
}

.theme-control__trigger[aria-expanded='true'] {
  background-color: var(--accent-soft);
  border-color: var(--accent);
}

.theme-control__trigger:focus-visible {
  outline: var(--focus-width) solid var(--focus);
  outline-offset: var(--focus-offset);
}

.theme-control__short {
  font-family: var(--font-mono);
  font-size: var(--step--1);
  font-weight: var(--weight-strong);
  line-height: 1;
}

.theme-control__glyph {
  width: 1em;
  height: 1em;
  flex: none;
  font-size: var(--step-0);
  color: var(--fg-muted);
}

/* A pinned style is an override the visitor should be able to notice from the nav
   alone, so it gets the accent and its own glyph rather than a quieter marker. */
.theme-control__pinned {
  width: 1em;
  height: 1em;
  flex: none;
  font-size: var(--step--1);
  color: var(--accent);
}

.theme-control__trigger:hover .theme-control__glyph,
.theme-control__trigger[aria-expanded='true'] .theme-control__glyph {
  color: var(--accent);
}

/* ── panel ───────────────────────────────────────────────────────────────── */

.theme-control__panel {
  position: absolute;
  inset-block-start: calc(100% + var(--space-xs));
  inset-inline-end: 0;
  z-index: var(--z-overlay);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  width: min(24rem, calc(100vw - 2 * var(--gutter)));
  max-height: 85dvh;
  overflow-y: auto;
  padding: var(--space-md);
  color: var(--fg);
  font-family: var(--font-body);
  font-size: var(--step--1);
  line-height: var(--leading);
  text-align: start;
  background-color: var(--card-bg);
  border: var(--border-width) solid var(--card-border);
  border-radius: var(--card-radius);
  box-shadow: var(--card-shadow);
}

.theme-control__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-sm);
}

.theme-control__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--step-0);
  font-weight: var(--weight-display);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
}

.theme-control__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--control-height-sm);
  height: var(--control-height-sm);
  flex: none;
  color: var(--fg-muted);
  background: none;
  border: var(--border-width) solid var(--line);
  border-radius: var(--radius-sm);
  transition:
    color var(--dur-fast) var(--ease-out),
    border-color var(--dur-fast) var(--ease-out);
}

.theme-control__close svg {
  width: 1em;
  height: 1em;
}

.theme-control__close:hover {
  color: var(--fg);
  border-color: var(--line-strong);
}

.theme-control__close:focus-visible {
  outline: var(--focus-width) solid var(--focus);
  outline-offset: var(--focus-offset);
}

.theme-control__status {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-xs);
  margin: 0;
  color: var(--fg-muted);
}

.theme-control__status-style {
  font-weight: var(--weight-strong);
  color: var(--fg);
}

.theme-control__chip {
  padding: var(--space-3xs) var(--space-xs);
  font-family: var(--font-mono);
  font-size: var(--step--1);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--fg-muted);
  background-color: var(--bg-sunken);
  border: var(--border-width) solid var(--line);
  border-radius: var(--radius-full);
}

/* ── axes ────────────────────────────────────────────────────────────────── */

.theme-control__axis {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.theme-control__axis-label {
  margin: 0;
  font-family: var(--font-mono);
  font-size: var(--step--1);
  font-weight: var(--weight-strong);
  letter-spacing: var(--overline-spacing);
  text-transform: uppercase;
  color: var(--fg-muted);
}

.theme-control__options {
  display: grid;
  gap: var(--space-2xs);
}

.theme-control__options--row {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.theme-control__option {
  display: flex;
  flex-direction: column;
  gap: var(--space-3xs);
  width: 100%;
  padding: var(--space-xs) var(--space-sm);
  text-align: start;
  color: var(--fg);
  /* The panel is already one step forward from the page, so an unselected option
     stays flat and lets its border do the separating. */
  background-color: transparent;
  border: var(--border-width) solid var(--line);
  border-radius: var(--radius-sm);
  transition:
    background-color var(--dur-fast) var(--ease-out),
    border-color var(--dur-fast) var(--ease-out);
}

.theme-control__option--compact {
  padding: var(--space-xs);
}

.theme-control__option:hover {
  background-color: var(--bg-sunken);
  border-color: var(--line-strong);
}

/* Checked state: colour AND a heavier leading rule plus a check glyph, and the
   label goes bold. Never colour alone. */
.theme-control__option.is-checked {
  background-color: var(--accent-soft);
  border-color: var(--accent);
  border-inline-start-width: calc(var(--border-width) * 3);
}

.theme-control__option:focus-visible {
  outline: var(--focus-width) solid var(--focus);
  outline-offset: var(--focus-offset);
}

.theme-control__option-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-xs);
}

.theme-control__option-name {
  font-weight: var(--weight-strong);
}

.theme-control__check {
  width: 0.9em;
  height: 0.9em;
  flex: none;
  color: var(--accent);
}

.theme-control__option-note {
  color: var(--fg-muted);
  font-size: var(--step--1);
}

/* ── next change ─────────────────────────────────────────────────────────── */

.theme-control__next {
  margin: 0;
  padding: var(--space-xs) var(--space-sm);
  color: var(--fg);
  background-color: var(--bg-sunken);
  border-inline-start: calc(var(--border-width) * 3) solid var(--accent);
  border-radius: var(--radius-sm);
}

/* Imminent: a heavier rule and a bold line, not merely a different colour. */
.theme-control__next.is-imminent {
  background-color: var(--accent-soft);
  border-inline-start-width: calc(var(--border-width) * 6);
  font-weight: var(--weight-strong);
}

/* ── timetable ───────────────────────────────────────────────────────────── */

.theme-control__schedule {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.theme-control__slots {
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs);
  margin: 0;
  padding: 0;
  list-style: none;
}

.theme-control__slot {
  display: flex;
  flex-direction: column;
  gap: var(--space-3xs);
  padding: var(--space-xs) var(--space-sm);
  border: var(--border-width) solid transparent;
  border-radius: var(--radius-sm);
}

.theme-control__slot.is-current {
  background-color: var(--bg-sunken);
  border-color: var(--line);
}

.theme-control__slot-head {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.theme-control__slot-window {
  font-family: var(--font-mono);
  font-size: var(--step--1);
  color: var(--fg-muted);
}

.theme-control__slot-name {
  font-weight: var(--weight-strong);
}

.theme-control__slot-mark {
  display: inline-flex;
  align-items: center;
  color: var(--accent);
}

.theme-control__slot-mark svg {
  width: 0.6em;
  height: 0.6em;
}

.theme-control__slot-note {
  color: var(--fg-muted);
  font-size: var(--step--1);
}

/* ── actions ─────────────────────────────────────────────────────────────── */

.theme-control__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.theme-control__action {
  display: flex;
  flex-direction: column;
  gap: var(--space-3xs);
  flex: 1 1 auto;
  padding: var(--space-xs) var(--space-sm);
  text-align: start;
  color: var(--accent-fg);
  background-color: var(--accent);
  border: var(--border-width) solid var(--accent);
  border-radius: var(--radius-sm);
  transition: background-color var(--dur-fast) var(--ease-out);
}

.theme-control__action:hover {
  background-color: var(--accent-soft);
  color: var(--fg);
}

.theme-control__action:focus-visible {
  outline: var(--focus-width) solid var(--focus);
  outline-offset: var(--focus-offset);
}

.theme-control__action--quiet,
.theme-control__action--quiet:hover {
  color: var(--fg);
  background-color: var(--bg-raised);
  border-color: var(--line-strong);
}

.theme-control__action-label {
  font-weight: var(--weight-strong);
}

.theme-control__action-note {
  font-size: var(--step--1);
}

.theme-control__action:hover .theme-control__action-note {
  color: var(--fg-muted);
}

.theme-control__learn {
  align-self: start;
  padding: 0;
  font-size: var(--step--1);
  color: var(--fg-muted);
  text-decoration: underline;
  text-underline-offset: 0.18em;
  background: none;
  border: 0;
}

.theme-control__learn:hover {
  color: var(--accent);
}

.theme-control__learn:focus-visible {
  outline: var(--focus-width) solid var(--focus);
  outline-offset: var(--focus-offset);
}
</style>
