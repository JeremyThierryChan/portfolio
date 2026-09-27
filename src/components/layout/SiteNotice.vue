<script setup>
/**
 * SiteNotice — a slim strip announcing that the site is still being built.
 *
 * WHY IT CYCLES EVERY LANGUAGE RATHER THAN THE VISITOR'S: the ticker carries the
 * message in all six shipped locales at once. That is the point of the component here.
 * A strip in the visitor's own language is decoration; a strip that shows a Chinese
 * client and a French client — on arrival, before they click anything — that the person
 * they are reading writes in their language is evidence.
 *
 * The strings come from the locale packs via `getLocaleMessage`, not from the content
 * layer, because this is interface copy rather than content, and all six packs already
 * ship together in `main.js`. That also means the strip cannot fall out of step with the
 * rest of the interface.
 *
 * ACCESSIBILITY — three separate concerns, handled separately:
 *   1. The animated track is `aria-hidden`, so a screen reader is not made to sit
 *      through six repetitions of the same sentence.
 *   2. The same sentence is exposed exactly once, in the visitor's own locale, through
 *      a visually-hidden paragraph.
 *   3. Under `prefers-reduced-motion` the animation is switched off here rather than
 *      left to the global duration override, and the strip lays itself out as a static
 *      wrapped line so no language is clipped out of reach.
 *
 * The strip is chrome, like the nav and the footer, so it sets its own typography from
 * tokens instead of relying on `.page-shell`.
 *
 * It renders as the last row INSIDE the nav header (see SiteNav.vue). That header is
 * sticky, so the strip stays put with the nav instead of scrolling away.
 */
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { LOCALE_META, FALLBACK_LOCALE_CODE } from '@/content/index.js';

const { t, getLocaleMessage } = useI18n();

/** The accessible copy: one sentence, in the language the visitor chose. */
const activeMessage = computed(() => t('notice.building'));

/**
 * One entry per shipped locale, in `LOCALE_META` order, so the sequence is stable across
 * renders. A pack missing the key falls back to English rather than leaving a gap in the
 * middle of the loop.
 */
const messages = computed(() =>
  LOCALE_META.map(({ code, native }) => {
    const own = getLocaleMessage(code)?.notice?.building;
    const fallback = getLocaleMessage(FALLBACK_LOCALE_CODE)?.notice?.building;
    const text = typeof own === 'string' && own ? own : fallback;
    return { code, native, text };
  }).filter((entry) => typeof entry.text === 'string' && entry.text),
);

/**
 * Duplicated so the keyframes can translate by exactly -50% and land on an identical
 * frame. The per-item padding below — rather than a flex `gap` — is what makes that
 * exact: with a gap, the track would contain `2n - 1` gaps and half the track would not
 * be one whole period, so the loop would jump by one gap on every cycle.
 */
const track = computed(() => [...messages.value, ...messages.value]);
</script>

<template>
  <aside class="site-notice" :aria-label="t('notice.label')">
    <p class="visually-hidden">{{ activeMessage }}</p>

    <div class="site-notice__viewport">
      <div class="site-notice__track" aria-hidden="true">
        <span v-for="(item, i) in track" :key="`${item.code}-${i}`" class="site-notice__item">
          <span class="site-notice__dot"></span>
          <span class="site-notice__lang">{{ item.native }}</span>
          <span class="site-notice__text">{{ item.text }}</span>
        </span>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.site-notice {
  /*
   * One cycle of the ticker. Named here so the speed has a single place to change: it
   * cannot come from the `--dur-*` scale, which is authored for transitions. At twelve
   * items this works out at roughly 65px per second, which is a readable marquee pace.
   */
  --notice-loop: 48s;

  position: relative;
  overflow: hidden;

  background-color: var(--bg-sunken);
  color: var(--fg-muted);
  /* A hairline ABOVE it, not below: this strip is the last row inside the nav header,
     which draws its own bottom border, so a bottom border here would double it. */
  border-block-start: var(--border-width) solid var(--line);

  font-family: var(--font-mono);
  font-size: var(--step--1);
  letter-spacing: var(--tracking);
}

.site-notice__viewport {
  overflow: hidden;
}

.site-notice__track {
  display: flex;
  align-items: center;
  inline-size: max-content;
  padding-block: var(--space-2xs);
  white-space: nowrap;
  animation: site-notice-scroll var(--notice-loop) linear infinite;
}

/* Deliberately NOT paused on hover or focus: Jeremy's call. The strip is ambient
   information rather than a control, and a notice that stops when the pointer crosses it
   reads as interactive when it is not. */

.site-notice__item {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2xs);
  /* Trailing space, not a flex gap — see the note on `track` in the script. */
  padding-inline-end: var(--space-xl);
}

.site-notice__dot {
  flex: 0 0 auto;
  inline-size: var(--space-2xs);
  block-size: var(--space-2xs);
  /* Style B sets every radius to 0, which turns this into a terminal-style square. */
  border-radius: var(--radius-full);
  background-color: var(--warn);
}

.site-notice__lang {
  color: var(--accent);
  font-weight: var(--weight-strong);
}

@keyframes site-notice-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

/*
 * Under reduced motion the loop is replaced by a static, wrapped block: every language
 * stays available, none of it scrolls away, and nothing depends on an animation having
 * run to be legible.
 */
@media (prefers-reduced-motion: reduce) {
  .site-notice__track {
    animation: none;
    flex-wrap: wrap;
    inline-size: 100%;
    white-space: normal;
    gap: var(--space-2xs) var(--space-lg);
  }

  .site-notice__item {
    padding-inline-end: 0;
  }
}

/* The printed CV is a document; a status strip is not part of it. */
@media print {
  .site-notice {
    display: none;
  }
}
</style>
