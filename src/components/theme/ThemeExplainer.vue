<script setup>
/**
 * ThemeExplainer — the one-time explanation of a site that restyles itself.
 *
 * "The whole site changed on its own" is indistinguishable from "the site broke",
 * so a first-time visitor is told once, in plain words, and offered a way to stop
 * it. Two messages live here:
 *
 *   - the FULL explanation, shown on a first visit (`explainerOpen`)
 *   - the BRIEF notice, shown when the clock changes the style mid-visit
 *     (`autoSwitchedTo`), which is the moment a visitor is most likely to think
 *     something went wrong
 *
 * Why it is built this way:
 *
 *   - It is NOT a modal. It never steals focus, never blocks the page and never
 *     locks scrolling: it is a `role="status"` / `aria-live="polite"` banner, so a
 *     screen reader hears it without being interrupted, and a keyboard user keeps
 *     whatever they were doing.
 *   - The live region wrapper is always mounted and only its content is toggled.
 *     A live region that appears together with its text is unreliable to announce;
 *     inserting the text into a region that already exists is not.
 *   - It sits at `--z-toast`, above every overlay the page can open, and paints as
 *     a card from the shared tokens so all three styles (and both modes) look
 *     deliberate — including style B, where radii and shadows are zero and the
 *     border does all the work.
 *   - Dismissal is remembered by the theme runtime (`theme.explainerSeen`), and the
 *     brief notice is shown at most once per style per session, so the same message
 *     can never stack up or interrupt twice.
 *
 * Copy: every string is a LITERAL i18n key from `src/locales/en.js` (`STYLE_NAME_KEY`
 * below is the only indirection, and it is a table of literals). The
 * `\`theme-...-${uid}\`` template literal builds a DOM id, never a key.
 */

import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { formatMinutes, minutesOf } from '@/theme/schedule.js';
import { hasSeenExplainer } from '@/theme/theme.js';
import { useTimeTheme } from '@/theme/useTimeTheme.js';

const { t } = useI18n();

const {
  style,
  now,
  nextChangeAt,
  nextStyleMeta,
  nextChangeLabel,
  autoSwitchedTo,
  acknowledgeSwitch,
  explainerOpen,
  openExplainer,
  dismissExplainer,
  pinCurrentStyle,
  pinCurrentStyleForWindow,
} = useTimeTheme();

/* ── i18n keys, written out ─────────────────────────────────────────────── */

const STYLE_NAME_KEY = {
  a: 'theme.style.a.name',
  b: 'theme.style.b.name',
  c: 'theme.style.c.name',
};

const FALLBACK_STYLE_NAME_KEY = STYLE_NAME_KEY.b;

function styleNameKey(id) {
  return STYLE_NAME_KEY[id] ?? FALLBACK_STYLE_NAME_KEY;
}

/* DOM id, not an i18n key. */
let instanceCount = 0;
const uid = ++instanceCount;
const titleId = `theme-explainer-title-${uid}`;

/**
 * Styles the brief notice has already announced this session. Dismissing it counts:
 * "got it" means the visitor has read that particular change, so a repeat of the
 * same message is noise, not information.
 */
const announced = new Set();

/* ── what is on screen ───────────────────────────────────────────────────── */

const switchNoticeStyle = ref(null);

watch(
  autoSwitchedTo,
  (value) => {
    if (!value || announced.has(value)) {
      switchNoticeStyle.value = null;
      return;
    }
    switchNoticeStyle.value = value;
  },
  { immediate: true },
);

/** The full explanation wins: two banners saying the same thing is worse than one. */
const notice = computed(() => {
  if (explainerOpen.value) return 'explainer';
  if (switchNoticeStyle.value) return 'switch';
  return null;
});

/* ── copy ────────────────────────────────────────────────────────────────── */

/** The visitor's local clock, in the same HH:MM the schedule is written in. */
const currentTime = computed(() => formatMinutes(minutesOf(now.value)));

const currentStyleName = computed(() => t(styleNameKey(style.value)));

const switchStyleName = computed(() => t(styleNameKey(switchNoticeStyle.value ?? style.value)));

/** What happens next, for the brief notice — the full one lists the whole day. */
const nextChangeText = computed(() => {
  const meta = nextStyleMeta.value;
  const label = nextChangeLabel.value;
  if (!meta || !label) return null;
  return t('theme.nextChange', { style: t(styleNameKey(meta.id)), time: label });
});

const nextChangeIso = computed(() => {
  const at = nextChangeAt.value;
  return at ? at.toISOString() : null;
});

/* ── actions ─────────────────────────────────────────────────────────────── */

/**
 * A first visit should explain itself without anyone else having to remember to
 * call `openExplainer()`. `hasSeenExplainer()` is the same flag `dismissExplainer()`
 * writes, so a visitor who has been told once is never told again.
 */
onMounted(() => {
  if (!hasSeenExplainer()) openExplainer();
});

/** The full explanation already covered the current look; re-announcing it the
 *  moment the banner closes would just repeat the message. */
function clearPendingSwitch() {
  const pending = autoSwitchedTo.value;
  if (pending) announced.add(pending);
  acknowledgeSwitch();
  switchNoticeStyle.value = null;
}

function keepFull() {
  pinCurrentStyle();
  dismissExplainer();
  clearPendingSwitch();
}

function dismissFull() {
  dismissExplainer();
  clearPendingSwitch();
}

/**
 * The switch notice's button holds the look only until the clock's next boundary.
 *
 * This button appears *because* the page just changed under the reader, so what it
 * answers is "not while I am reading" — a complaint about this moment, not a
 * preference. The full first-visit explainer and the appearance panel keep the
 * permanent pin, because those are where a visitor chooses a look on purpose.
 */
function keepBrief() {
  if (switchNoticeStyle.value) announced.add(switchNoticeStyle.value);
  pinCurrentStyleForWindow();
  acknowledgeSwitch();
  switchNoticeStyle.value = null;
}

function dismissBrief() {
  if (switchNoticeStyle.value) announced.add(switchNoticeStyle.value);
  acknowledgeSwitch();
  switchNoticeStyle.value = null;
}
</script>

<template>
  <!-- Always in the document: a live region that arrives with its text is not
       reliably announced. Empty and non-interactive when there is nothing to say. -->
  <div class="theme-explainer" :class="{ 'is-idle': !notice }" role="status" aria-live="polite">
    <Transition name="theme-explainer">
      <section v-if="notice === 'explainer'" key="explainer" class="theme-explainer__card">
        <div class="theme-explainer__head">
          <h2 :id="titleId" class="theme-explainer__title">{{ t('theme.explainer.title') }}</h2>
          <button
            type="button"
            class="theme-explainer__close"
            :aria-label="t('common.dismiss')"
            @click="dismissFull"
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

        <p class="theme-explainer__body">
          {{ t('theme.explainer.body', { time: currentTime, style: currentStyleName }) }}
        </p>
        <p class="theme-explainer__schedule">{{ t('theme.explainer.schedule') }}</p>

        <div class="theme-explainer__actions">
          <button
            type="button"
            class="theme-explainer__action theme-explainer__action--primary"
            @click="keepFull"
          >
            {{ t('theme.explainer.keepThis') }}
          </button>
          <button type="button" class="theme-explainer__action" @click="dismissFull">
            {{ t('theme.explainer.gotIt') }}
          </button>
        </div>
      </section>

      <section v-else-if="notice === 'switch'" key="switch" class="theme-explainer__card">
        <div class="theme-explainer__head">
          <h2 class="theme-explainer__title">{{ t('theme.explainer.title') }}</h2>
          <button
            type="button"
            class="theme-explainer__close"
            :aria-label="t('common.dismiss')"
            @click="dismissBrief"
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

        <p class="theme-explainer__body">{{ t('theme.currentStyle', { name: switchStyleName }) }}</p>
        <p class="theme-explainer__schedule">
          <time v-if="nextChangeText && nextChangeIso" :datetime="nextChangeIso">{{ nextChangeText }}</time>
          <span v-else>{{ t('theme.nextChangeUnknown') }}</span>
        </p>

        <div class="theme-explainer__actions">
          <button
            type="button"
            class="theme-explainer__action theme-explainer__action--primary"
            @click="keepBrief"
          >
            {{ t('theme.keepForNow') }}
          </button>
          <button type="button" class="theme-explainer__action" @click="dismissBrief">
            {{ t('theme.explainer.gotIt') }}
          </button>
        </div>
      </section>
    </Transition>
  </div>
</template>

<style scoped>
/* Above every overlay: this is the one message the visitor must be able to see
   even if a modal is open underneath it. */
.theme-explainer {
  position: fixed;
  inset-inline: 0;
  inset-block-end: 0;
  z-index: var(--z-toast);
  display: flex;
  justify-content: center;
  /* Only the card is interactive — the empty wrapper never blocks the page, which
     is what keeps this non-modal. */
  pointer-events: none;
  padding: var(--space-sm);
  padding-block-end: calc(var(--space-sm) + env(safe-area-inset-bottom, 0px));
}

/* Nothing to say: the wrapper keeps its place in the DOM (so the live region
   survives) but takes no space and cannot be seen. */
.theme-explainer.is-idle {
  padding: 0;
}

.theme-explainer__card {
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  width: min(42rem, 100%);
  /* A long message scrolls rather than growing over the page — this is the mobile
     "does not cover the content" rule. */
  max-height: 60dvh;
  overflow-y: auto;
  padding: var(--space-md);
  color: var(--fg);
  font-family: var(--font-body);
  font-size: var(--step--1);
  line-height: var(--leading);
  text-align: start;
  background-color: var(--card-bg);
  border: var(--border-width) solid var(--line-strong);
  border-radius: var(--card-radius);
  /* Resolves to `none` in styles A and B, where depth comes from the border. */
  box-shadow: var(--shadow-md);
}

.theme-explainer__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-sm);
}

.theme-explainer__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--step-0);
  font-weight: var(--weight-display);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
}

.theme-explainer__body {
  margin: 0;
}

.theme-explainer__schedule {
  margin: 0;
  color: var(--fg-muted);
}

.theme-explainer__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  margin-block-start: var(--space-2xs);
}

.theme-explainer__action {
  padding: var(--space-xs) var(--space-sm);
  color: var(--fg);
  font-weight: var(--weight-strong);
  background-color: var(--bg-raised);
  border: var(--border-width) solid var(--line-strong);
  border-radius: var(--radius-sm);
  transition:
    background-color var(--dur-fast) var(--ease-out),
    border-color var(--dur-fast) var(--ease-out);
}

.theme-explainer__action:hover {
  background-color: var(--accent-soft);
  border-color: var(--accent);
}

.theme-explainer__action--primary {
  color: var(--accent-fg);
  background-color: var(--accent);
  border-color: var(--accent);
}

.theme-explainer__action--primary:hover {
  color: var(--accent-fg);
  background-color: var(--accent);
  border-color: var(--line-strong);
}

.theme-explainer__action:focus-visible,
.theme-explainer__close:focus-visible {
  outline: var(--focus-width) solid var(--focus);
  outline-offset: var(--focus-offset);
}

.theme-explainer__close {
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

.theme-explainer__close svg {
  width: 1em;
  height: 1em;
}

.theme-explainer__close:hover {
  color: var(--fg);
  border-color: var(--line-strong);
}

/* ── motion ──────────────────────────────────────────────────────────────
   The transition animates *to* the visible state; the resting state is always
   fully opaque, and the media query below removes the movement outright rather
   than leaving an invisible banner behind. */

.theme-explainer-enter-active,
.theme-explainer-leave-active {
  transition:
    opacity var(--dur-base) var(--ease-out),
    transform var(--dur-base) var(--ease-out);
}

.theme-explainer-enter-from,
.theme-explainer-leave-to {
  opacity: 0;
  transform: translateY(var(--space-sm));
}

@media (prefers-reduced-motion: reduce) {
  .theme-explainer-enter-from,
  .theme-explainer-leave-to {
    opacity: 1;
    transform: none;
  }
}

@media print {
  .theme-explainer {
    display: none !important;
  }
}
</style>
